'use client'
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { socket } from './socket'

const baseUrl = process.env.NEXT_PUBLIC_API_BASE

const baseQuery = fetchBaseQuery({
  baseUrl,
  prepareHeaders: (headers) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token')
      if (token) headers.set('authorization', `Bearer ${token}`)
    }
    headers.set('Content-Type', 'application/json')
    return headers
  },
})

export const commentsApi = createApi({
  reducerPath: 'commentsApi',
  baseQuery,
  tagTypes: ['Comments'],
  endpoints: (builder) => ({
    getComments: builder.query({
      query: ({ postId }) => ({ url: `/comments?postId=${encodeURIComponent(postId)}` }),
      providesTags: (result) => [{ type: 'Comments', id: 'LIST' }],
      async onCacheEntryAdded(arg, { updateCachedData, cacheDataLoaded, cacheEntryRemoved }) {
        try {
          await cacheDataLoaded
          const onNew = (c) => { if (c.postId === arg.postId) updateCachedData((draft) => { draft.push(c) }) }
          const onUpd = (c) => { updateCachedData((draft) => {
            const idx = draft.findIndex(d => (d._id||d.id) === (c._id||c.id))
            if (idx !== -1) draft[idx] = c
          })}
          const onDel = (p) => { updateCachedData((draft) => {
            const idx = draft.findIndex(d => (d._id||d.id) === p.id)
            if (idx !== -1) draft.splice(idx,1)
          })}
          socket.on('comment:new', onNew)
          socket.on('comment:update', onUpd)
          socket.on('comment:delete', onDel)
          await cacheEntryRemoved
          socket.off('comment:new', onNew)
          socket.off('comment:update', onUpd)
          socket.off('comment:delete', onDel)
        } catch {}
      }
    }),
    createComment: builder.mutation({
    query: ({ postId, text, parentId = null }) => ({
      url: '/comments',
      method: 'POST',
      body: { postId, text, parentId },
    }),

    async onQueryStarted(arg, { dispatch, queryFulfilled }) {
      // optimistic temp id and temp comment
      const tempId = 'temp-' + Date.now() + '-' + Math.random().toString(36).slice(2, 8)
      let user = null
      try { user = JSON.parse(localStorage.getItem('user') || 'null') } catch {}
      const tempComment = {
        _id: tempId,
        id: tempId,
        postId: arg.postId,
        userId: user?.id ?? null,
        userName: user?.username ?? 'You',
        text: arg.text,
        parentId: arg.parentId ?? null,
        createdAt: new Date().toISOString(),
        __optimistic: true,
      }

      // apply optimistic update via dispatch + updateQueryData
      // store the patch result so we can undo if the request fails
      const patchResult = dispatch(
        commentsApi.util.updateQueryData(
          'getComments',
          { postId: arg.postId },
          (draft) => {
            draft.push(tempComment)
          }
        )
      )

      try {
        const { data } = await queryFulfilled
        // replace the temporary comment with the real server response
        dispatch(
          commentsApi.util.updateQueryData(
            'getComments',
            { postId: arg.postId },
            (draft) => {
              const idx = draft.findIndex(d => (d._id || d.id) === tempId)
              if (idx !== -1) draft[idx] = data
              else draft.push(data)
            }
          )
        )

        // notify page so it can scroll (your listener handles scrolling)
        try {
          window.dispatchEvent(new CustomEvent('local-comment-created', {
            detail: { postId: arg.postId, commentId: data._id || data.id }
          }))
        } catch (e) { /* noop */ }
      } catch (err) {
        // rollback optimistic update
        patchResult.undo()
      }
    },
  }),

    updateComment: builder.mutation({
      query: ({ id, text }) => ({ url: `/comments/${id}`, method: 'PUT', body: { text } }),
      invalidatesTags: [{ type: 'Comments', id: 'LIST' }],
    }),
    deleteComment: builder.mutation({
      query: ({ id }) => ({ url: `/comments/${id}`, method: 'DELETE' }),
      invalidatesTags: [{ type: 'Comments', id: 'LIST' }],
    }),
  })
})

export const {
  useGetCommentsQuery,
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
} = commentsApi
