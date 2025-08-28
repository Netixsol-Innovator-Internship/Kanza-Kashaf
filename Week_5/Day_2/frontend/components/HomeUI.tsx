'use client';
import { useEffect, useMemo, useState, useRef } from 'react';
import {
  useCommentListQuery,
  useCreateCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
  useLikeToggleMutation,
  useUnreadCountQuery,
  useGetUserByIdQuery,
  useProfileMeQuery,
} from '../lib/api';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../lib/store';
import { initSocket, socket } from '../lib/socket';
import { logout } from '../lib/authSlice';
import { FaHeart, FaReply, FaTrash, FaEdit, FaBell, FaBold, FaItalic, FaUnderline, FaLink, FaListUl, FaListOl, FaQuoteRight, FaHeading } from 'react-icons/fa';
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

import {
  Editor,
  EditorState,
  RichUtils,
  convertToRaw,
  ContentState,
  Modifier,
} from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import htmlToDraft from 'html-to-draftjs';
import DOMPurify from 'dompurify';
import 'draft-js/dist/Draft.css';


function Avatar({ userId, name, onClick }: { userId?: string; name?: string; onClick?: () => void }) {
  const { data: user } = useGetUserByIdQuery(userId ?? '', { skip: !userId });
  const [profilePic, setProfilePic] = useState<string | undefined>(() => user?.profilePic);

  useEffect(() => {
    if (user?.profilePic !== undefined) setProfilePic(user.profilePic);
  }, [user?.profilePic]);

  useEffect(() => {
    if (!userId) return;
    const handler = (payload: any) => {
      if (!payload || payload._id !== userId) return;
      if (payload.profilePic !== undefined) {
        setProfilePic(payload.profilePic);
      }
    };
    socket?.on('profile:update', handler);
    return () => {
      socket?.off('profile:update', handler);
    };
  }, [userId]);

  const letter = (user?.displayName || user?.username || name || '?')?.charAt(0).toUpperCase() || '?';

  return (
    <button
      onClick={onClick}
      className="avatar select-none rounded-full overflow-hidden flex items-center justify-center bg-indigo-500 text-white
                 w-10 h-10 sm:w-12 sm:h-12 md:w-14 md:h-14"
      style={{ minWidth: 0 }}
    >
      {profilePic ? (
        <img src={profilePic} alt={user?.username || name || 'avatar'} className="w-full h-full object-cover" />
      ) : (
        <span className="font-semibold">{letter}</span>
      )}
    </button>
  );
}

function CommentEditor({
  initialHtml,
  onChangeHtml,
  placeholder,
}: {
  initialHtml?: string;
  onChangeHtml: (html: string) => void;
  placeholder?: string;
}) {
  const [editorState, setEditorState] = useState(() => EditorState.createEmpty());
  const editorRef = useRef<any>(null);

  const moveCaretToEnd = (state: EditorState) => {
    const content = state.getCurrentContent();
    const lastBlock = content.getBlockMap().last();
    const lastKey = lastBlock.getKey();
    const lastLength = lastBlock.getLength();
    const newSelection = state.getSelection().merge({
      anchorKey: lastKey,
      anchorOffset: lastLength,
      focusKey: lastKey,
      focusOffset: lastLength,
      isBackward: false,
    });
    return EditorState.forceSelection(state, newSelection as any);
  };

  useEffect(() => {
    if (initialHtml !== undefined) {
      try {
        if (!initialHtml) {
          const empty = EditorState.createEmpty();
          setEditorState(empty);
          onChangeHtml('');
          return;
        }
        const contentBlock = htmlToDraft(initialHtml);
        const contentState = ContentState.createFromBlockArray(
          contentBlock.contentBlocks,
          contentBlock.entityMap
        );
        let loaded = EditorState.createWithContent(contentState);
        loaded = moveCaretToEnd(loaded);
        setEditorState(loaded);
      } catch {
        setEditorState(EditorState.createEmpty());
      }
    }
  }, [initialHtml]);

  const pushHtml = (st: EditorState) => {
    try {
      const raw = convertToRaw(st.getCurrentContent());
      const html = draftToHtml(raw);
      onChangeHtml(html);
    } catch {
      onChangeHtml('');
    }
  };

  const handleChange = (st: EditorState) => {
    setEditorState(st);
    pushHtml(st);
  };

  const toggleInline = (inline: string) => handleChange(RichUtils.toggleInlineStyle(editorState, inline));
  const toggleBlock = (block: string) => handleChange(RichUtils.toggleBlockType(editorState, block));

  const addLink = () => {
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      if (typeof window !== "undefined") alert('Select text to add a link');
      return;
    }
    const url = typeof window !== "undefined" ? window.prompt('Enter URL (include https://)') : null;
    if (!url) return;
    const content = editorState.getCurrentContent();
    const contentWithEntity = content.createEntity('LINK', 'MUTABLE', { url });
    const entityKey = contentWithEntity.getLastCreatedEntityKey();
    let newState = EditorState.set(editorState, { currentContent: contentWithEntity });
    newState = RichUtils.toggleLink(newState, newState.getSelection(), entityKey);
    handleChange(newState);
  };

  const removeLink = () => {
    const selection = editorState.getSelection();
    if (selection.isCollapsed()) {
      alert('Select linked text to remove the link');
      return;
    }
    const newContent = Modifier.applyEntity(editorState.getCurrentContent(), selection, null);
    const newState = EditorState.push(editorState, newContent, 'apply-entity');
    handleChange(newState);
  };

  const onKeyDown = (e: React.KeyboardEvent) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      toggleInline('BOLD');
    }
    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      toggleInline('ITALIC');
    }
  };

  const focusEditor = () => {
    editorRef.current?.focus();
  };

  const currentInline = editorState.getCurrentInlineStyle();
  const selectionState = editorState.getSelection();
  const blockType = editorState.getCurrentContent().getBlockForKey(selectionState.getStartKey())?.getType();

  return (
    <div>
      <div className="flex gap-2 mb-2 flex-wrap">
        <button type="button" title="Bold (Ctrl/Cmd+B)" onClick={() => toggleInline('BOLD')} className={`px-2 py-1 border rounded text-sm sm:text-base ${currentInline.has('BOLD') ? 'bg-gray-200' : ''}`}><FaBold/></button>
        <button type="button" title="Italic (Ctrl/Cmd+I)" onClick={() => toggleInline('ITALIC')} className={`px-2 py-1 border rounded text-sm sm:text-base ${currentInline.has('ITALIC') ? 'bg-gray-200' : ''}`}><FaItalic/></button>
        <button type="button" title="Underline" onClick={() => toggleInline('UNDERLINE')} className={`px-2 py-1 border rounded text-sm sm:text-base ${currentInline.has('UNDERLINE') ? 'bg-gray-200' : ''}`}><FaUnderline/></button>

        <button type="button" title="Heading" onClick={() => toggleBlock('header-one')} className={`px-2 py-1 border rounded text-sm sm:text-base ${blockType === 'header-one' ? 'bg-gray-200' : ''}`}><FaHeading/></button>
        <button type="button" title="Bullet list" onClick={() => toggleBlock('unordered-list-item')} className={`px-2 py-1 border rounded text-sm sm:text-base ${blockType === 'unordered-list-item' ? 'bg-gray-200' : ''}`}><FaListUl/></button>
        <button type="button" title="Numbered list" onClick={() => toggleBlock('ordered-list-item')} className={`px-2 py-1 border rounded text-sm sm:text-base ${blockType === 'ordered-list-item' ? 'bg-gray-200' : ''}`}><FaListOl/></button>
        <button type="button" title="Blockquote" onClick={() => toggleBlock('blockquote')} className={`px-2 py-1 border rounded text-sm sm:text-base ${blockType === 'blockquote' ? 'bg-gray-200' : ''}`}><FaQuoteRight/></button>

        <button type="button" title="Add link" onClick={addLink} className="px-2 py-1 border rounded text-sm sm:text-base"><FaLink/></button>
        <button type="button" title="Remove link" onClick={removeLink} className="px-2 py-1 border rounded text-sm sm:text-base">unlink</button>
      </div>

      <div
        onKeyDown={onKeyDown}
        className="border rounded p-2 min-h-[64px] sm:min-h-[80px] w-full"
        onClick={focusEditor}
        dir="ltr"
        style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'isolate-override' }}
      >
        <div style={{ direction: 'ltr', textAlign: 'left', unicodeBidi: 'isolate-override' }}>
          <Editor
            editorState={editorState}
            onChange={handleChange}
            placeholder={placeholder || 'Write something...'}
            ref={editorRef}
          />
        </div>
      </div>
    </div>
  );
}

function CommentItem({ item, onReply }: any) {
  const userId = useSelector((s:RootState)=>s.auth.userId);
  const [editMode, setEditMode] = useState(false);
  const [editorHtml, setEditorHtml] = useState(item.content || '');
  const [likeToggle] = useLikeToggleMutation();
  const [editComment] = useEditCommentMutation();
  const [deleteComment] = useDeleteCommentMutation();
  const liked = item.likes?.includes(userId);
  const router = useRouter();

  const { data: author } = useGetUserByIdQuery(item.authorId ?? '', { skip: !item.authorId });

  const displayName = item.authorDisplayName || author?.displayName || author?.username || item.authorId;

  useEffect(()=>{ setEditorHtml(item.content || ''); }, [item.content]);

  const onLike = async ()=>{
    if (!userId) { alert('Login first'); return; }
    try { await likeToggle({ id: item._id }); } catch {}
  };

  const onEdit = async ()=>{
    try {
      await editComment({ id: item._id, content: editorHtml }).unwrap();
      setEditMode(false);
    } catch (e) {
      console.error(e);
      alert('Failed to save edit');
    }
  };
  const onDelete = async () => {
    if (typeof window !== "undefined" && window.confirm('Delete this comment?')) {
      try {
        await deleteComment({ id: item._id }).unwrap();
      } catch {}
    }
  };


  const safeHtml = DOMPurify.sanitize(item.content || '');

  return (
    <div className={`flex flex-col sm:flex-row gap-3 ${item.parentId ? 'ml-8 sm:ml-12' : ''}`}>
      <div className="flex-shrink-0">
        <Avatar userId={item.authorId} onClick={() => router.push(`/profile/${item.authorId}`)} />
      </div>

      <div className="flex-1 min-w-0">
        <div className="text-sm text-gray-500 flex items-center gap-2 flex-wrap">
          <button className="underline text-sm" onClick={() => router.push(`/profile/${item.authorId}`)}>
            {displayName}
          </button>
          <span className="text-xs text-gray-400">•</span>
          <span className="text-xs">{new Date(item.createdAt).toLocaleString()}</span>
        </div>

        {!editMode ? (
          <div className="mt-1 prose max-w-none break-words" dangerouslySetInnerHTML={{ __html: safeHtml }} />
        ) : (
          <div className="mt-1">
            <CommentEditor initialHtml={editorHtml} onChangeHtml={setEditorHtml} placeholder="Edit your comment..." />
            <div className="flex gap-2 mt-2 flex-wrap">
              <button className="btn" onClick={onEdit}><FaEdit/> Save</button>
              <button className="btn" onClick={() => { setEditMode(false); setEditorHtml(item.content || ''); }}>Cancel</button>
            </div>
          </div>
        )}

        <div className="flex items-center gap-4 mt-2 text-sm flex-wrap">
          <button className={`heart flex items-center gap-1 ${liked?'text-rose-600':''}`} onClick={onLike}>
            <FaHeart/> <span className="ml-1">{item.likes?.length||0}</span>
          </button>
          {!item.parentId && <button onClick={()=>onReply(item)} className="flex items-center gap-1"><FaReply/> Reply</button>}
          {userId===item.authorId && (
            <>
              <button onClick={()=>setEditMode(v=>!v)} className="flex items-center gap-1"><FaEdit/> Edit</button>
              <button onClick={onDelete} className="flex items-center gap-1"><FaTrash/> Delete</button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function HomeUI() {
  const { data, refetch } = useCommentListQuery();
  const [createComment] = useCreateCommentMutation();
  const [textHtml, setTextHtml] = useState('');
  const [replyTo, setReplyTo] = useState<any>(null);
  const token = useSelector((s:RootState)=>s.auth.token);
  const userId = useSelector((s: RootState) => s.auth.userId);
  const username = useSelector((s:RootState)=>s.auth.username);
  const dispatch = useDispatch();
  const [localData, setLocalData] = useState<any[]>([]);
  const router = useRouter();

  const { data: unread } = useUnreadCountQuery();
  const [unreadCount, setUnreadCount] = useState(0);

  const { data: meProfile } = useProfileMeQuery(undefined, { skip: !userId });

  const displayHeaderName = meProfile?.displayName || username || 'Guest';

  useEffect(()=>{
    if (data) setLocalData(data);
  }, [data]);

  useEffect(()=>{
    if (unread?.count !== undefined) {
      setUnreadCount(unread.count);
    }
  }, [unread]);

  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  const nameCache = useRef<Map<string, string>>(new Map());

  const apiBase = (process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000').replace(/\/$/, '');

  async function resolveName(id?: string) {
    if (!id) return 'Someone';
    const cached = nameCache.current.get(id);
    if (cached) return cached;
    try {
      const res = await fetch(`${apiBase}/users/${id}`, {
        headers: token ? { authorization: `Bearer ${token}` } : {},
      });
      if (!res.ok) {
        nameCache.current.set(id, id);
        return id;
      }
      const data = await res.json();
      const name = data?.displayName || data?.username || id;
      nameCache.current.set(id, name);
      return name;
    } catch (err) {
      nameCache.current.set(id, id);
      return id;
    }
  }

  const [replyName, setReplyName] = useState<string | null>(null);
  useEffect(() => {
    let mounted = true;
    if (!replyTo) {
      setReplyName(null);
      return;
    }
    if (replyTo.authorDisplayName) {
      setReplyName(replyTo.authorDisplayName);
      return;
    }
    (async () => {
      const id = replyTo.authorId;
      const name = await resolveName(id);
      if (mounted) setReplyName(name);
    })();
    return () => { mounted = false; };
  }, [replyTo]);

  useEffect(()=>{
    if (token) {
      initSocket(token);
      const handlers: any[] = [
        [
          "comment.created",
          async (payload: any) => {
            refetch();
            if (payload?.comment?.parentId) return;
            const immediateName = payload?.comment?.authorDisplayName;
            const authorId = payload?.comment?.authorId;
            const name = immediateName || (authorId ? await resolveName(authorId) : (authorId || 'Someone'));
            if (authorId && authorId !== userId) {
              toast.custom((t) => (
                <div className={`${t.visible ? "animate-enter" : "animate-leave"} bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex items-center gap-3`}>
                  <div className="avatar">{(name?.charAt?.(0) || '?').toUpperCase()}</div>
                  <div>
                    <p className="font-semibold">{name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">added a new comment 💬</p>
                  </div>
                </div>
              ));
            }
          },
        ],
        [
          "comment.replied",
          async (payload: any) => {
            if (payload?.parentAuthorId === userId && payload?.authorId !== userId) {
              const actorName = await resolveName(payload.authorId);
              toast.custom((t) => (
                <div className={`${t.visible ? "animate-enter" : "animate-leave"} bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex items-center gap-3`}>
                  <div className="avatar">{(actorName?.charAt?.(0) || '?').toUpperCase()}</div>
                  <div>
                    <p className="font-semibold">{actorName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">replied to your comment 💬</p>
                  </div>
                </div>
              ));
            }
          },
        ],
        [
          "comment.liked",
          async (payload: any) => {
            setLocalData((prev) =>
              prev.map((c) =>
                c._id === payload.commentId ? { ...c, likes: payload.likes } : c
              )
            );

            if (payload.liked && payload.commentOwnerId === userId && payload.actorId !== userId) {
              const actorName = await resolveName(payload.actorId);
              toast.custom((t) => (
                <div className={`${t.visible ? "animate-enter" : "animate-leave"} bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex items-center gap-3`}>
                  <div className="avatar">{(actorName?.charAt?.(0) || '?').toUpperCase()}</div>
                  <div>
                    <p className="font-semibold">{actorName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">liked your comment ❤️</p>
                  </div>
                </div>
              ));
            }
          },
        ],
        ["comment.edited",
          async (payload: any) => {
            if (payload?.userId === userId) {
              const actorName = await resolveName(payload.userId);
              toast.custom((t) => (
                <div className={`${t.visible ? "animate-enter" : "animate-leave"} bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex items-center gap-3`}>
                  <div className="avatar">{(actorName?.charAt?.(0) || '?').toUpperCase()}</div>
                  <div>
                    <p className="font-semibold">{actorName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">edited a comment ✏️</p>
                  </div>
                </div>
              ));
            }
            refetch();
          },
        ],
        ["comment.deleted",
          async (payload: any) => {
            setLocalData((prev) => prev.filter((c) => c._id !== payload.commentId));
            if (payload?.userId === userId) {
              const actorName = await resolveName(payload.userId);
              toast.custom((t) => (
                <div className={`${t.visible ? "animate-enter" : "animate-leave"} bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 flex items-center gap-3`}>
                  <div className="avatar">{(actorName?.charAt?.(0) || '?').toUpperCase()}</div>
                  <div>
                    <p className="font-semibold">{actorName}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">deleted a comment 🗑️</p>
                  </div>
                </div>
              ));
            }
            refetch();
          },
        ],
        [
          "notification.new",
          () => setUnreadCount((c) => c + 1),
        ],
        [
          "notification.read",
          () => setUnreadCount((c) => Math.max(0, c - 1)),
        ],
        [
          "notification.deleted",
          () => setUnreadCount((c) => Math.max(0, c - 1)),
        ],
      ];
      handlers.forEach(([ev,fn])=>socket?.on(ev, fn));
      return ()=>handlers.forEach(([ev,fn])=>socket?.off(ev, fn));
    }
  }, [token, refetch]);

  const submit = async (e:any)=>{
    e.preventDefault();
    if (!token) { if (typeof window !== "undefined") alert('Login first'); }
    await createComment({ content: textHtml, parentId: replyTo?._id }).unwrap();
    setTextHtml('');
    setReplyTo(null);
    refetch();
  };

    const tree = useMemo(() => {
    const list = localData || [];

    const parents = list.filter((c: any) => !c.parentId).slice().reverse();

    const replies = list.filter((c: any) => c.parentId);
    const map = replies.reduce((acc: any, r: any) => {
      (acc[r.parentId] = acc[r.parentId] || []).push(r);
      return acc;
    }, {});

    Object.keys(map).forEach((k) => {
      map[k].sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    });

    return parents.map((p: any) => ({ ...p, replies: map[p._id] || [] }));
  }, [localData]);

  return (
    <div className="card w-full max-w-4xl mx-auto p-4 sm:p-6 space-y-4">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Avatar userId={userId} name={username || "Guest"} onClick={() => userId ? router.push(`/profile/${userId}`) : router.push('/auth')} />
          <div className="font-semibold truncate">
            {!mounted ? "Guest" : displayHeaderName}
          </div>
        </div>
        <div className="flex gap-2 flex-wrap">
          {mounted && token ? (
            <button className="btn text-sm" onClick={() => dispatch(logout())}>
              Logout
            </button>
          ) : (
            <a className="btn text-sm" href="/auth">Login</a>
          )}
          <a className="btn relative text-sm" href="/notifications">
            <FaBell />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </a>
        </div>
      </div>

      <form className="flex flex-col gap-2" onSubmit={submit}>
        {replyTo && (
          <div className="px-3 py-2 bg-indigo-50 rounded-xl text-indigo-800 text-sm flex items-center justify-between">
            <div className="truncate">Replying to {replyName || replyTo.authorDisplayName || replyTo.authorId}</div>
            <button type="button" onClick={()=>setReplyTo(null)} className="ml-2 underline text-sm">cancel</button>
          </div>
        )}
        <CommentEditor initialHtml={textHtml} onChangeHtml={setTextHtml} placeholder="Write a comment..." />
        <div className="flex gap-2 justify-end">
          <button className="btn" type="submit">Send</button>
        </div>
      </form>

      <div className="space-y-6">
        {tree.map((p:any)=>(
          <div key={p._id} className="space-y-3">
            <CommentItem item={p} onReply={setReplyTo} />
            {p.replies.map((r:any)=>(<CommentItem key={r._id} item={r} onReply={()=>{}} />))}
          </div>
        ))}
      </div>
    </div>
  );
}
