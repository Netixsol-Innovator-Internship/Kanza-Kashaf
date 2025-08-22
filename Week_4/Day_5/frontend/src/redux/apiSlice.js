import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) headers.set("authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Product", "User", "Cart"],
  endpoints: (builder) => ({
    // AUTH
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation({
      query: (data) => ({
        url: "/auth/register",
        method: "POST",
        body: data,
      }),
    }),
    getProfile: builder.query({
      query: () => "/auth/profile",
      providesTags: ["User"],
    }),

    // PRODUCT
    getProducts: builder.query({
      query: () => "/products",
      providesTags: ["Product"],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: ["Product"],
    }),
    addProduct: builder.mutation({
      query: (data) => ({
        url: "/products",
        method: "POST",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    updateProduct: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: ["Product"],
    }),
    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),

    // USERS
    getUsers: builder.query({
      query: () => "/users",
      providesTags: ["User"],
    }),
    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["User"],
    }),
    toggleBlockUser: builder.mutation({
      query: ({ id, blocked }) => ({
        url: `/users/${id}/block`,
        method: "PATCH",
        body: { blocked },
      }),
      invalidatesTags: ["User"],
    }),

    // CART
    getCart: builder.query({
      query: () => "/cart",
      providesTags: ["Cart"],
    }),
    addToCart: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: "/cart/add",
        method: "POST",
        body: { productId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCart: builder.mutation({
      query: ({ productId, quantity }) => ({
        url: "/cart/update",
        method: "PUT",
        body: { productId, quantity },
      }),
      invalidatesTags: ["Cart"],
    }),
    removeFromCart: builder.mutation({
      query: (productId) => ({
        url: `/cart/remove/${productId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    clearCart: builder.mutation({
      query: () => ({
        url: "/cart/clear",
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  // AUTH
  useLoginMutation,
  useRegisterMutation,
  useGetProfileQuery,
  // PRODUCTS
  useGetProductsQuery,
  useGetProductByIdQuery,
  useAddProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  // USERS
  useGetUsersQuery,
  useUpdateUserRoleMutation,
  useToggleBlockUserMutation,
  // CART
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = apiSlice;
