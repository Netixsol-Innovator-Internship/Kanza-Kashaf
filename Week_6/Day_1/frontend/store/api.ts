import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';

export const api = createApi({
  reducerPath: 'api',
  baseQuery: fetchBaseQuery({
    baseUrl: BASE_URL,
    prepareHeaders: (headers) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        if (token) headers.set('authorization', `Bearer ${token}`);
      }
      return headers;
    },
  }),
  tagTypes: ['Products', 'NewArrivals', 'Cart', 'Orders', 'User', 'Reviews', 'Admin', 'Notifications'],
  endpoints: (builder) => ({
    // ---------- Auth ----------
    signup: builder.mutation<any, any>({
      query: (body) => ({
        url: '/auth/register',
        method: 'POST',
        body,
      }),
    }),
    login: builder.mutation<any, any>({
      query: (body) => ({
        url: '/auth/login',
        method: 'POST',
        body,
      }),
    }),
    logout: builder.mutation<any, { refreshToken: string }>({
      query: (body) => ({
        url: "/auth/logout",
        method: "POST",
        body,
      }),
      invalidatesTags: ["User", "Cart", "Orders"],
    }),

    // ---------- Users ----------
    getProfile: builder.query<any, void>({
      query: () => '/users/me',
      providesTags: ['User'],
    }),

    updateProfile: builder.mutation<any, Partial<{ name: string; address: string }>>({
      query: (body) => ({
        url: '/users/me',
        method: 'PATCH',
        body,
      }),
      invalidatesTags: ['User'],
    }),

    getUsers: builder.query<any[], void>({
      query: () => '/users',
      providesTags: ['User'],
    }),
    updateUserRole: builder.mutation<any, { id: string; role: string }>({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: 'PATCH',
        body: { role },
      }),
      invalidatesTags: ['User'],
    }),
    toggleUserBlock: builder.mutation<any, { id: string; block: boolean }>({
      query: ({ id, block }) => ({
        url: `/users/${id}/block`,
        method: 'PATCH',
        body: { block },
      }),
      invalidatesTags: ['User'],
    }),

    // ---------- Products ----------
    getProducts: builder.query<any, any>({
      query: (params = {}) => {
        const qp = new URLSearchParams();
        if (params.category) qp.set('category', params.category);
        if (params.styles && params.styles.length) qp.set('styles', params.styles.join(','));
        if (params.colors && params.colors.length) qp.set('colors', params.colors.join(','));
        if (params.sizes && params.sizes.length) qp.set('sizes', params.sizes.join(','));
        if (params.priceMin !== undefined) qp.set('priceMin', String(params.priceMin));
        if (params.priceMax !== undefined) qp.set('priceMax', String(params.priceMax));
        if (params.page) qp.set('page', String(params.page));
        if (params.limit) qp.set('limit', String(params.limit));
        if (!qp.toString()) return `/products`;
        return `/products?${qp.toString()}`;
      },
      keepUnusedDataFor: 60,
      providesTags: ['Products'],
    }),

    getNewArrivals: builder.query<any, number | void>({
      query: (limit = 15) => `/products/new-arrivals?limit=${limit}`,
    }),

    getTopSelling: builder.query<any, number | void>({
      query: (limit = 15) => `/products/top-selling?limit=${limit}`,
    }),

    getNewArrivalProducts: builder.query<any, any>({
      query: (params = {}) => {
        const qp = new URLSearchParams();
        if (params.category) qp.set('category', params.category);
        if (params.styles && params.styles.length) qp.set('styles', params.styles.join(','));
        if (params.colors && params.colors.length) qp.set('colors', params.colors.join(','));
        if (params.sizes && params.sizes.length) qp.set('sizes', params.sizes.join(','));
        if (params.priceMin !== undefined) qp.set('priceMin', String(params.priceMin));
        if (params.priceMax !== undefined) qp.set('priceMax', String(params.priceMax));
        if (params.page) qp.set('page', String(params.page));
        if (params.limit) qp.set('limit', String(params.limit));
        if (!qp.toString()) return `/products/new-arrivals`;
        return `/products/new-arrivals?${qp.toString()}`;
      },
      keepUnusedDataFor: 60,
    }),

    // ---------- Single Product ----------
    getProduct: builder.query<any, string>({
      query: (id: string) => `/products/${id}`,
      keepUnusedDataFor: 30,
      providesTags: (result, error, id) => [{ type: 'Products' as const, id }],
    }),

    createProduct: builder.mutation<any, any>({
      query: (body) => ({
        url: '/products',
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Products', 'NewArrivals', 'Admin'],
    }),

    createCampaign: builder.mutation<any, any>({
      query: (body) => ({
        url: '/products/campaigns',
        method: 'POST',
        body,
      }),
      // after creating a campaign, product prices/sale info may change in lists
      invalidatesTags: (result, error) =>
        result ? ['Products', 'NewArrivals', 'Admin'] : ['Products', 'NewArrivals', 'Admin'],
    }),

    getActiveCampaigns: builder.query<any, void>({
      query: () => `/products/campaigns/active`,
      providesTags: ['Products'],
    }),

    updateProduct: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/products/${id}`,
        method: 'PATCH',
        body,
      }),
      invalidatesTags: (result, error, arg) =>
        result
          ? [{ type: 'Products', id: arg.id }, 'NewArrivals', 'Admin']
          : ['Products', 'NewArrivals', 'Admin'],
    }),

    deleteProduct: builder.mutation<any, string>({
      query: (id: string) => ({
        url: `/products/${id}`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Products', 'NewArrivals', 'Admin'],
    }),

    uploadProductImages: builder.mutation<any, string[]>({
      query: (images: string[]) => ({
        url: '/products/upload',
        method: 'POST',
        body: { images },
      }),
    }),

    getProductReviews: builder.query<any, { id: string; page?: number; limit?: number; sort?: string }>(
      {
        query: ({ id, page = 1, limit = 6, sort = 'latest' }) =>
          `/products/${id}/reviews?page=${page}&limit=${limit}&sort=${sort}`,
        keepUnusedDataFor: 0,
      }
    ),

    addReview: builder.mutation<any, { id: string; body: any }>({
      query: ({ id, body }) => ({
        url: `/products/${id}/reviews`,
        method: 'POST',
        body,
      }),
    }),

    getTopRatedReviews: builder.query<any, { page?: number; limit?: number }>(
      {
        query: ({ page = 1, limit = 6 } = {}) =>
          `/products/reviews/top-rated?page=${page}&limit=${limit}`,
        providesTags: ['Reviews'],
      }
    ),

    addToCart: builder.mutation<any, { id: string; body: { productId: string; quantity: number; color?: string; size?: string } }>({
      query: ({ id, body }) => ({
        url: `/carts/add/${id}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Cart'],
    }),

    // ---------- Cart ----------
    getCart: builder.query<any, void>({
      query: () => '/carts/current',
      providesTags: ['Cart'],
      keepUnusedDataFor: 5,
    }),

    updateCartItem: builder.mutation<any, { productId: string; body: any }>(
      {
        query: ({ productId, body }) => ({
          url: `/carts/update/${productId}`,
          method: 'PATCH',
          body,
        }),
        invalidatesTags: ['Cart'],
      }
    ),

    removeFromCart: builder.mutation<any, { productId: string; body?: any }>(
      {
        query: ({ productId, body }) => ({
          url: `/carts/remove/${productId}`,
          method: 'DELETE',
          body: body || {},
        }),
        invalidatesTags: ['Cart'],
      }
    ),

    // ---------- Orders ----------
    getOrderHistory: builder.query<any, void>({
      query: () => '/orders/history/me',
      providesTags: ['Orders'],
    }),

    checkout: builder.mutation<any, { cartId: string; body: any }>(
      {
        query: ({ cartId, body }) => ({
          url: `/orders/checkout/${cartId}`,
          method: 'POST',
          body,
        }),
        invalidatesTags: ['Cart', 'Orders'],
      }
    ),

    getOrderById: builder.query<any, string>({
      query: (id) => `/orders/${id}`,
      providesTags: ['Orders'],
    }),

    // ---------- Admin endpoints ----------
    getAdminStats: builder.query<any, void>({
      query: () => '/orders/admin/stats',
      providesTags: ['Admin'],
      keepUnusedDataFor: 10,
    }),

    getAdminSales: builder.query<
      any,
      { range?: 'daily' | 'weekly' | 'monthly' }
    >({
      query: (params = { range: 'monthly' }) =>
        `/orders/admin/sales?range=${params.range ?? 'monthly'}`,
      providesTags: ['Admin'],
      keepUnusedDataFor: 10,
    }),

    getAdminBestSellers: builder.query<any, number>({
      query: (limit = 3) => `/orders/admin/best-sellers?limit=${limit}`,
      providesTags: ['Admin'],
      keepUnusedDataFor: 10,
    }),

    getAdminRecentOrders: builder.query<any, number>({
      query: (limit = 6) => `/orders/admin/recent?limit=${limit}`,
      providesTags: ['Admin'],
      keepUnusedDataFor: 5,
    }),

    // ---------- Misc ----------
    resetPassword: builder.mutation<any, { email: string; code: string; newPassword: string }>(
      {
        query: (body) => ({ url: "/auth/reset-password", method: "POST", body }),
      }
    ),

    updatePassword: builder.mutation<any, { oldPassword: string; newPassword: string }>(
      {
        query: (body) => ({ url: "/users/me", method: "PATCH", body }),
        invalidatesTags: ["User"],
      }
    ),

    getAllReviews: builder.query<any, void>({
      query: () => `/products/reviews/top-rated`,
      providesTags: ['Reviews'],
    }),

    getAdminOrders: builder.query<any, { page?: number; limit?: number }>( {
      query: ({ page = 1, limit = 8 }) =>
        `/orders/admin/all?page=${page}&limit=${limit}`,
      providesTags: ['Admin'],
      keepUnusedDataFor: 5,
    }),

    getAdminOrderById: builder.query<any, string>({
      query: (id) => `/orders/admin/${id}`,
      providesTags: ['Admin'],
    }),

    getMyNotifications: builder.query<any[], void>({
      query: () => '/notifications',
      providesTags: ['Notifications'],
    }),
    markNotificationRead: builder.mutation<any, string>({
      query: (id) => ({ url: `/notifications/${id}/read`, method: 'PATCH' }),
      invalidatesTags: ['Notifications'],
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useGetProfileQuery,
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useToggleUserBlockMutation,
  useUpdateProfileMutation,
  useGetProductsQuery,
  useGetNewArrivalsQuery,
  useGetTopSellingQuery,
  useGetNewArrivalProductsQuery,
  useGetProductQuery,
  useGetProductReviewsQuery,
  useAddReviewMutation,
  useAddToCartMutation,
  useGetCartQuery,
  useUpdateCartItemMutation,
  useRemoveFromCartMutation,
  useGetOrderHistoryQuery,
  useGetOrderByIdQuery,
  useCheckoutMutation,
  useGetAdminStatsQuery,
  useGetAdminSalesQuery,
  useGetAdminBestSellersQuery,
  useGetAdminRecentOrdersQuery,
  useResetPasswordMutation,
  useUpdatePasswordMutation,
  useGetAllReviewsQuery,
  useGetAdminOrdersQuery,
  useGetAdminOrderByIdQuery,
  useCreateProductMutation,
  useCreateCampaignMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useUploadProductImagesMutation,
  useGetActiveCampaignsQuery,
  useGetMyNotificationsQuery,
  useMarkNotificationReadMutation,
} = api;
