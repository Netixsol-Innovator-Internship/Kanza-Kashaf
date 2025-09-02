// store/api.ts
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000/api/v1',
    prepareHeaders: (headers) => {
      // attach token if present
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token') || sessionStorage.getItem('token')
        if (token && token !== 'null' && token !== 'undefined') {
          headers.set('authorization', `Bearer ${token}`)
        }
      }
      return headers
    },
  }),
  tagTypes: ['Auctions', 'Auction', 'User', 'Bids'],
  endpoints: (builder) => ({
    // 🔑 Login
    login: builder.mutation<{ accessToken: string; user: any }, { email: string; password: string }>({
      query: (body) => ({
        url: 'auth/login',
        method: 'POST',
        body,
      }),
      // login returns token/user - we don't set tags here
    }),

    // 👤 Register
    register: builder.mutation<any, { fullName: string; email: string; username: string; password: string }>({
      query: (body) => ({
        url: 'auth/register',
        method: 'POST',
        body,
      }),
    }),

    // 👤 Profile
    getProfile: builder.query<any, void>({
      query: () => `users/me`,
      providesTags: [{ type: 'User', id: 'ME' }],
    }),

    // ✏️ Update profile
    updateProfile: builder.mutation<any, Record<string, any>>({
      query: (body) => ({
        url: `users/me`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: [{ type: 'User', id: 'ME' }],
    }),

    // 🔔 Notifications
    notifications: builder.query<any[], void>({
      query: () => 'notifications',
      providesTags: (result) =>
        result ? result.map((n: any) => ({ type: 'User' as const, id: 'ME' })) : [{ type: 'User', id: 'ME' }],
    }),

    // 📋 All auctions
    getAuctions: builder.query<any[], Record<string, any>>({
      query: (filters = {}) => ({
        url: 'auctions',
        params: filters,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.map((a: any) => ({ type: 'Auction' as const, id: a._id })),
              { type: 'Auctions', id: 'LIST' },
            ]
          : [{ type: 'Auctions', id: 'LIST' }],
    }),

    // 📌 Auction details
    getAuctionDetails: builder.query<any, string>({
      query: (auctionId) => `auctions/${auctionId}`,
      providesTags: (result, error, id) => [{ type: 'Auction', id }],
    }),

    // ✅ Check if user is logged in
    checkIfUserIsLoggedIn: builder.query<any, void>({
      query: () => `users/me`,
      providesTags: [{ type: 'User', id: 'ME' }],
    }),

    // 💰 Place a bid
    placeBid: builder.mutation<any, { auctionId: string; amount: number }>({
      query: ({ auctionId, amount }) => ({
        url: `bids`,
        method: 'POST',
        body: { auctionId, amount },
      }),
      // after placing a bid, refresh auction detail + auctions list
      invalidatesTags: (result, error, { auctionId }) => [
        { type: 'Auction', id: auctionId },
        { type: 'Auctions', id: 'LIST' },
      ],
    }),

    // 🚗 Create Auction
    createAuction: builder.mutation<any, Record<string, any>>({
      query: (body) => ({
        url: 'auctions',
        method: 'POST',
        body,
      }),
      invalidatesTags: [{ type: 'Auctions', id: 'LIST' }, { type: 'User', id: 'ME' }],
    }),

    // 🚗 My Auctions
    getMyAuctions: builder.query<any[], void>({
      query: () => `auctions/mine`,
      providesTags: (result) =>
        result ? result.map((a: any) => ({ type: 'Auction' as const, id: a._id })) : [],
    }),

    // 🛑 End Auction
    endAuction: builder.mutation<any, string>({
      query: (auctionId) => ({
        url: `auctions/${auctionId}/end`,
        method: 'POST',
      }),
      invalidatesTags: (result, error, auctionId) => [
        { type: 'Auction', id: auctionId },
        { type: 'Auctions', id: 'LIST' },
      ],
    }),

    getAuctionBids: builder.query<any[], string>({
      query: (auctionId) => `bids/auction/${auctionId}`,
      providesTags: (result, error, auctionId) => result ? result.map((b:any)=>({type:'Bids' as const,id: auctionId})) : [{type:'Bids', id: auctionId}],
    }),

    toggleWishlist: builder.mutation<any, string>({
      query: (auctionId) => ({
        url: `auctions/${auctionId}/toggle-wishlist`,
        method: 'POST',
      }),
      invalidatesTags: [{ type: 'User', id: 'ME' }],
    }),
  }),
})

export const {
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  useUpdateProfileMutation,
  useNotificationsQuery,
  useGetAuctionsQuery,
  useGetAuctionDetailsQuery,
  useCheckIfUserIsLoggedInQuery,
  usePlaceBidMutation,
  useCreateAuctionMutation,
  useGetMyAuctionsQuery,
  useEndAuctionMutation,
  useGetAuctionBidsQuery,
  useToggleWishlistMutation,
} = api
