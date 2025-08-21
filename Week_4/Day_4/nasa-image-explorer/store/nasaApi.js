import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const NASA_API_KEY = process.env.NEXT_PUBLIC_NASA_API_KEY

export const nasaApi = createApi({
  reducerPath: "nasaApi",
  baseQuery: fetchBaseQuery({ baseUrl: "/" }), // dummy, we'll override
  endpoints: (builder) => ({
    // APOD endpoint
    getApod: builder.query({
      query: () => ({
        url: `https://api.nasa.gov/planetary/apod?api_key=${NASA_API_KEY}`,
      }),
    }),

    // Image search endpoint
    searchImages: builder.query({
      query: (q) => ({
        url: `https://images-api.nasa.gov/search?q=${q}&media_type=image`,
      }),
    }),
  }),
})

export const { useGetApodQuery, useSearchImagesQuery } = nasaApi
