import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const apiSlice = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: "http://localhost:3000/api",
    prepareHeaders: (headers, { getState }) => {
      const token = getState().auth?.token;
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return headers;
    },
  }),
  tagTypes: ["Product", "Products", "User", "Users", "Cart"],
  endpoints: (builder) => ({
    // AUTH
    login: builder.mutation({
      query: (credentials) => ({
        url: "/auth/login",
        method: "POST",
        body: credentials,
      }),
      transformResponse: (response) => response.data,
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

    // PRODUCTS
    getProducts: builder.query({
      query: () => "/products",
      providesTags: (result) =>
        result?.data?.products?.length
          ? [
              ...result.data.products.map(({ _id }) => ({
                type: "Product",
                id: _id,
              })),
              { type: "Products", id: "LIST" },
            ]
          : [{ type: "Products", id: "LIST" }],
    }),
    getProductById: builder.query({
      query: (id) => `/products/${id}`,
      providesTags: (result, error, id) => [{ type: "Product", id }],
    }),

    addProduct: builder.mutation({
      query: (product) => ({
        url: "/products",
        method: "POST",
        body: product,
        headers: {
          "Content-Type": "application/json",
        },
      }),
      invalidatesTags: [{ type: "Products", id: "LIST" }],
    }),

    updateProduct: builder.mutation({
      query: ({ id, updatedData }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: updatedData,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Product", id },
        { type: "Products", id: "LIST" },
      ],
    }),

    deleteProduct: builder.mutation({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Product", id },
        { type: "Products", id: "LIST" },
      ],
    }),

    // USERS (Admin)
    getUsers: builder.query({
      query: () => "/users",
      transformResponse: (response) => response.data,
      providesTags: ["Users"],
    }),

    // USERS (SuperAdmin - all users except self)
    getSuperAdminUsers: builder.query({
      query: () => "/users/super",
      transformResponse: (response) => response.data,
      providesTags: ["Users"],
    }),

    updateUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: ["Users"],
    }),

    toggleUserBlock: builder.mutation({
      query: ({ id, block }) => ({
        url: `/users/${id}/block`,
        method: "PATCH",
        body: { block },
      }),
      invalidatesTags: ["Users"],
    }),

    // USERS (SuperAdmin - only admins)
    getSuperAdminAdmins: builder.query({
      query: () => "/users/super/admins",
      transformResponse: (response) => response.data,
      providesTags: ["Users"],
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
  useGetSuperAdminUsersQuery,
  useUpdateUserRoleMutation,
  useToggleUserBlockMutation,
  useGetSuperAdminAdminsQuery,
  // CART
  useGetCartQuery,
  useAddToCartMutation,
  useUpdateCartMutation,
  useRemoveFromCartMutation,
  useClearCartMutation,
} = apiSlice;
