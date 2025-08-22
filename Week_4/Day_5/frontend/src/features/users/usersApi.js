
import { apiSlice } from "../api/apiSlice";

export const usersApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getUsers: builder.query({
      query: () => `/users`,
      providesTags: (result) =>
        result
          ? [
              ...result.data.map((u) => ({ type: "Users", id: u._id })),
              { type: "Users", id: "LIST" },
            ]
          : [{ type: "Users", id: "LIST" }],
    }),
    changeUserRole: builder.mutation({
      query: ({ id, role }) => ({
        url: `/users/${id}/role`,
        method: "PATCH",
        body: { role },
      }),
      invalidatesTags: (_r, _e, arg) => [{ type: "Users", id: arg.id }],
    }),
    toggleBlockUser: builder.mutation({
      query: (id) => ({
        url: `/users/${id}/block`,
        method: "PATCH",
      }),
      invalidatesTags: (_r, _e, id) => [{ type: "Users", id }],
    }),
  }),
  overrideExisting: false,
});

export const { useGetUsersQuery, useChangeUserRoleMutation, useToggleBlockUserMutation } = usersApi;
