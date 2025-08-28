import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from './store';

const baseQuery = fetchBaseQuery({
  baseUrl: process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:4000',
  prepareHeaders: (headers, { getState }) => {
    const token = (getState() as RootState).auth.token;
    if (token) headers.set('authorization', `Bearer ${token}`);
    return headers;
  }
});

export const api = createApi({
  reducerPath: 'api',
  baseQuery,
  tagTypes: ['Comments', 'Notifications', 'Profile', 'Users'],
  endpoints: (builder) => ({
    signup: builder.mutation<{accessToken:string}, {username:string,email:string,password:string}>({
      query: body => ({ url: '/auth/signup', method: 'POST', body }),
    }),
    login: builder.mutation<{accessToken:string}, {identifier:string,password:string}>({
      query: body => ({ url: '/auth/login', method: 'POST', body }),
    }),
    profileMe: builder.query<any, void>({
      query: ()=>('/users/me'),
      providesTags: ['Profile'],
    }),
    updateProfile: builder.mutation<any, { bio?: string; profilePic?: string }>({
      query: (body) => ({ url: '/users/me', method: 'PATCH', body }),
      invalidatesTags: ['Profile', 'Users'],
    }),

    getUserById: builder.query<any, string>({
      query: (id) => `/users/${id}`,
      providesTags: (result, error, id) => [{ type: 'Users', id }],
    }),

    followUser: builder.mutation<any, { userId: string }>({
      query: ({ userId }) => ({ url: `/follow/${userId}`, method: 'POST' }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'Users', id: userId }, 'Profile'],
    }),
    unfollowUser: builder.mutation<any, { userId: string }>({
      query: ({ userId }) => ({ url: `/follow/${userId}/unfollow`, method: 'POST' }),
      invalidatesTags: (result, error, { userId }) => [{ type: 'Users', id: userId }, 'Profile'],
    }),
    commentList: builder.query<any[], void>({
      query: ()=>('/comments'),
      providesTags: ['Comments']
    }),
    createComment: builder.mutation<any, {content:string,parentId?:string}>({
      query: body => ({ url: '/comments', method: 'POST', body }),
      invalidatesTags: ['Comments']
    }),
    editComment: builder.mutation<any, {id:string, content:string}>({
      query: ({id, content}) => ({ url: `/comments/${id}`, method: 'PATCH', body: { content } }),
      invalidatesTags: ['Comments']
    }),
    deleteComment: builder.mutation<any, {id:string}>({
      query: ({id}) => ({ url: `/comments/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Comments']
    }),
    likeToggle: builder.mutation<any, {id:string}>({
      query: ({id}) => ({ url: `/comments/${id}/like`, method: 'POST' }),
      invalidatesTags: ['Comments']
    }),
    notifications: builder.query<any[], void>({
      query: ()=>('/notifications'),
      providesTags: ['Notifications']
    }),
    unreadCount: builder.query<{ count:number }, void>({
      query: ()=>('/notifications/unread-count'),
      providesTags: ['Notifications']
    }),
    markRead: builder.mutation<any, {id:string}>({
      query: ({id})=>({ url: `/notifications/${id}/read`, method: 'PATCH' }),
      invalidatesTags: ['Notifications']
    }),
    deleteNotification: builder.mutation<any, {id:string}>({
      query: ({id})=>({ url: `/notifications/${id}`, method: 'DELETE' }),
      invalidatesTags: ['Notifications']
    }),
  })
});

export const {
  useSignupMutation,
  useLoginMutation,
  useProfileMeQuery,
  useUpdateProfileMutation,
  useGetUserByIdQuery,
  useFollowUserMutation,   
  useUnfollowUserMutation,
  useCommentListQuery,
  useCreateCommentMutation,
  useEditCommentMutation,
  useDeleteCommentMutation,
  useLikeToggleMutation,
  useNotificationsQuery,
  useUnreadCountQuery,
  useMarkReadMutation,
  useDeleteNotificationMutation,
} = api;
