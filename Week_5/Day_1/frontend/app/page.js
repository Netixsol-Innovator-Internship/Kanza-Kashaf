'use client'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useGetCommentsQuery, useCreateCommentMutation, useUpdateCommentMutation, useDeleteCommentMutation } from '../lib/api'
import { socket, connectSocket, logoutSocket } from '../lib/socket'
import toast from 'react-hot-toast'

const POST_ID = 'demo-post'

export default function Home() {
  // --- auth detection (stable hook order) ---
  const [authStateReady, setAuthStateReady] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState(null)

  useEffect(() => {
    // initialize auth state from localStorage
    function readAuth() {
      try {
        const user = JSON.parse(localStorage.getItem('user') || 'null')
        const token = localStorage.getItem('token')
        setCurrentUser(user)
        setIsAuthenticated(!!(user && token))
      } catch {
        setCurrentUser(null)
        setIsAuthenticated(false)
      } finally {
        setAuthStateReady(true)
      }
    }
    readAuth()

    // Listen for auth changes in other tabs
    function onStorage(e) {
      if (e.key === 'user' || e.key === 'token') readAuth()
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  // Connect socket when user becomes authenticated
  useEffect(() => {
    if (isAuthenticated) {
      connectSocket()
    } else {
      // ensure socket is disconnected for anonymous visitors
      logoutSocket()
    }
  }, [isAuthenticated])

  // --- RTK Query: instantiate hook but skip fetching until authenticated ---
  const { data: comments = [], refetch } = useGetCommentsQuery(
    { postId: POST_ID },
    { skip: !isAuthenticated } // won't fetch until user is authenticated
  )

  // Mutations (these can run only when logged in; the UI will prevent unauthenticated submit)
  const [createComment] = useCreateCommentMutation()
  const [updateComment] = useUpdateCommentMutation()
  const [deleteComment] = useDeleteCommentMutation()

  // UI & scroll state (unchanged)
  const [text, setText] = useState('')
  const [unread, setUnread] = useState(0)
  const listRef = useRef(null)
  const [isAtBottom, setIsAtBottom] = useState(true)
  const pendingNew = useRef(0)
  const [jumpCount, setJumpCount] = useState(0)

  // coalesce refs (reuse your existing coalescing logic)
  const toastIdRef = useRef(null)
  const coalesceCountRef = useRef(0)
  const coalesceUsersRef = useRef([])
  const coalesceTimerRef = useRef(null)

  // Helper: scroll
  function scrollToBottom() {
    if (!listRef.current) return
    listRef.current.scrollTop = listRef.current.scrollHeight
    pendingNew.current = 0
    setJumpCount(0)
    setUnread(0)
    document.title = 'Realtime Comments'
  }

  // local-comment-created listener (only used to auto-scroll when actor confirmed)
  useEffect(() => {
    function onLocalCreated(e) {
      const { postId } = e.detail || {}
      if (postId !== POST_ID) return
      if (isAtBottom) setTimeout(() => scrollToBottom(), 50)
    }
    window.addEventListener('local-comment-created', onLocalCreated)
    return () => window.removeEventListener('local-comment-created', onLocalCreated)
  }, [isAtBottom])

  // Socket listeners: only add when authenticated
  useEffect(() => {
    if (!isAuthenticated) return

    function showOrUpdateCoalescedToast() {
      const total = coalesceCountRef.current
      const usersArr = coalesceUsersRef.current
      if (total <= 0) return
      // Primary-most-recent logic (same as you wanted)
      const counts = {}
      usersArr.forEach(u => counts[u] = (counts[u] || 0) + 1)
      const primaryUser = usersArr[usersArr.length - 1] || 'someone'
      const primaryCount = counts[primaryUser] || 0
      const othersCount = total - primaryCount
      const primaryPart = primaryCount === 1 ? `1 new comment from ${primaryUser}` : `${primaryCount} new comments from ${primaryUser}`
      const othersPart = othersCount > 0 ? (othersCount === 1 ? ` + 1 other` : ` + ${othersCount} others`) : ''
      const message = primaryPart + othersPart
      const content = () => (<div className="px-4 py-2 bg-white rounded-xl shadow">{message}</div>)
      const fixedId = `coalesce-new-comments-${POST_ID}`
      toast.custom(content, { id: fixedId })
      toastIdRef.current = fixedId
    }

    function scheduleCoalesceReset() {
      if (coalesceTimerRef.current) clearTimeout(coalesceTimerRef.current)
      coalesceTimerRef.current = setTimeout(() => {
        try { if (toastIdRef.current) toast.dismiss(toastIdRef.current) } catch {}
        coalesceCountRef.current = 0
        coalesceUsersRef.current = []
        toastIdRef.current = null
        coalesceTimerRef.current = null
      }, 2500)
    }

    // New comment handler (only runs while authenticated)
    function onNew(c) {
      if (c.postId !== POST_ID) return

      // accumulate coalesce state
      coalesceCountRef.current += 1
      coalesceUsersRef.current.push(c.userName || 'someone')

      setUnread((n) => {
        if (!isAtBottom || document.hidden) return n + 1
        return n
      })
      pendingNew.current += 1
      setJumpCount(pendingNew.current)

      showOrUpdateCoalescedToast()
      scheduleCoalesceReset()

      if (isAtBottom) setTimeout(() => scrollToBottom(), 50)
      const total = unread + pendingNew.current
      document.title = total > 0 ? `(${total}) New comments` : 'Realtime Comments'
    }

    function onUpdate(c) { toast('Comment updated') }
    function onDelete({ id }) { toast('Comment deleted') }

    socket.on('comment:new', onNew)
    socket.on('comment:update', onUpdate)
    socket.on('comment:delete', onDelete)

    return () => {
      socket.off('comment:new', onNew)
      socket.off('comment:update', onUpdate)
      socket.off('comment:delete', onDelete)
      if (coalesceTimerRef.current) {
        clearTimeout(coalesceTimerRef.current)
        coalesceTimerRef.current = null
      }
    }
  }, [isAuthenticated, isAtBottom, unread])

  // Scroll position tracking
  function onScroll() {
    if (!listRef.current) return
    const el = listRef.current
    const atBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 10
    setIsAtBottom(atBottom)
    if (atBottom) {
      setUnread(0)
      pendingNew.current = 0
      setJumpCount(0)
      document.title = 'Realtime Comments'
    }
  }

  // Submit handler
  async function handleSubmit(e) {
    e.preventDefault()
    if (!text.trim()) return
    if (!isAuthenticated) {
      return toast.error('Please login first')
    }
    try {
      await createComment({ postId: POST_ID, text }).unwrap()
      setText('')
      setTimeout(() => scrollToBottom(), 50)
    } catch (e) {
      console.error(e)
      toast.error('Failed to post')
    }
  }

  // ----- RENDER -----
  // Wait until we know auth state, then render either auth prompt or comments UI
  if (!authStateReady) {
    return <main className="max-w-2xl mx-auto p-4">Loading…</main>
  }

  if (!isAuthenticated) {
    // Show auth panel only — no comments, no toasts, no socket activity
    return (
      <main className="max-w-2xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">Comments</h1>
        <div className="p-6 bg-white rounded-xl border">
          <p className="mb-4">Please log in to view and post comments.</p>
          <AuthPanel /> {/* your AuthPanel component */}
        </div>
      </main>
    )
  }

  // Authenticated view — show comments UI
  return (
    <main className="max-w-2xl mx-auto p-4">
      <AuthPanel /> {/* shows logout button now */}
      <h1 className="text-2xl font-bold mb-4">Comments</h1>

      <div className="relative border rounded-2xl bg-white">
        <div ref={listRef} onScroll={onScroll} className="h-96 overflow-y-auto p-4 space-y-3">
          <CommentList comments={comments} onEdit={updateComment} onDelete={deleteComment} />
        </div>

        {jumpCount > 0 && !isAtBottom && (
          <button className="absolute left-1/2 -translate-x-1/2 bottom-4 bg-blue-600 text-white px-4 py-1 rounded-full shadow" onClick={scrollToBottom}>
            Jump to new comments ({jumpCount})
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Write a comment..." className="flex-1 border rounded-xl px-3 py-2" />
        <button className="px-4 py-2 rounded-xl bg-black text-white">Send</button>
      </form>
    </main>
  )
} 

function AuthPanel() {
  // Always declare hooks at the top — same order every render
  const [user, setUser] = useState(null)
  const [mode, setMode] = useState('login')

  useEffect(() => {
    // initialize
    try { setUser(JSON.parse(localStorage.getItem('user') || 'null')) } catch { setUser(null) }

    // respond to storage events (other tabs logging in/out)
    function onStorage(e) {
      if (e.key === 'user' || e.key === 'token') {
        try { setUser(JSON.parse(localStorage.getItem('user') || 'null')) } catch { setUser(null) }
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  async function handleLogout() {
    try {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      try { logoutSocket() } catch (e) {}
    } catch (e) {
      console.error('Logout failed', e)
    }
    window.location.reload()
  }

  // Render: if logged in, show logout view; otherwise show auth forms
  if (user) {
    return (
      <div className="mb-4 flex items-center gap-4">
        <div className="text-sm text-gray-700">Signed in as <b>{user.username}</b></div>
        <button className="px-3 py-1 rounded bg-red-600 text-white" onClick={handleLogout}>Logout</button>
      </div>
    )
  }

  // Not logged in — show login/register UI
  return (
    <div className="mb-4 flex items-center gap-4">
      <button className="underline" onClick={() => setMode(mode === 'login' ? 'register' : 'login')}>
        Switch to {mode === 'login' ? 'Register' : 'Login'}
      </button>
      {mode === 'login' ? <LoginForm /> : <RegisterForm />}
    </div>
  )
}


function LoginForm() {
  const [identifier, setIdentifier] = useState('')
  const [password, setPassword] = useState('')
  const login = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE
    const r = await fetch(base + '/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    })
    if (!r.ok) return alert('Login failed')
    const data = await r.json()
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    window.location.reload()
  }
  return (
    <div className="flex gap-2">
      <input className="border rounded px-2 py-1" placeholder="email or username" value={identifier} onChange={e => setIdentifier(e.target.value)} />
      <input className="border rounded px-2 py-1" type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="px-3 py-1 rounded bg-green-600 text-white" onClick={login}>Login</button>
    </div>
  )
}

function RegisterForm() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const register = async () => {
    const base = process.env.NEXT_PUBLIC_API_BASE
    const r = await fetch(base + '/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    })
    if (!r.ok) return alert('Register failed')
    const data = await r.json()
    localStorage.setItem('token', data.token)
    localStorage.setItem('user', JSON.stringify(data.user))
    window.location.reload()
  }
  return (
    <div className="flex gap-2">
      <input className="border rounded px-2 py-1" placeholder="username" value={username} onChange={e => setUsername(e.target.value)} />
      <input className="border rounded px-2 py-1" placeholder="email" value={email} onChange={e => setEmail(e.target.value)} />
      <input className="border rounded px-2 py-1" type="password" placeholder="password" value={password} onChange={e => setPassword(e.target.value)} />
      <button className="px-3 py-1 rounded bg-blue-600 text-white" onClick={register}>Register</button>
    </div>
  )
}

function CommentList({ comments, onEdit, onDelete }) {
  const [editingId, setEditingId] = useState(null)
  const [editText, setEditText] = useState('')
  const user = typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('user') || 'null') : null
  const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null

  async function saveEdit(id) {
    try {
      await onEdit({ id, text: editText }).unwrap()
      setEditingId(null)
    } catch {
      alert('Update failed')
    }
  }

  async function remove(id) {
    try {
      await onDelete({ id }).unwrap()
    } catch { alert('Delete failed') }
  }

  return (
    <div className="space-y-3">
      {comments.map((c) => (
        <div key={c._id || c.id} className="border rounded-xl p-3">
          <div className="text-sm text-gray-600">{c.userName} • {new Date(c.createdAt).toLocaleString()}</div>
          {editingId === (c._id || c.id) ? (
            <div className="mt-1 flex gap-2">
              <input className="border rounded px-2 py-1 flex-1" value={editText} onChange={e => setEditText(e.target.value)} />
              <button className="px-2 py-1 bg-black text-white rounded" onClick={() => saveEdit(c._id || c.id)}>Save</button>
              <button className="px-2 py-1 bg-gray-200 rounded" onClick={() => setEditingId(null)}>Cancel</button>
            </div>
          ) : (
            <div className="mt-1">{c.text}</div>
          )}
          {user && user.id === (c.userId || c.userId?._id) && editingId !== (c._id || c.id) && (
            <div className="mt-2 flex gap-2">
              <button className="text-blue-600 underline" onClick={() => { setEditingId(c._id || c.id); setEditText(c.text) }}>Edit</button>
              <button className="text-red-600 underline" onClick={() => remove(c._id || c.id)}>Delete</button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
