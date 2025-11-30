import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (builder) => ({
    getCategories: builder.query({
      query: () => "category",
      // cache duration in seconds
      keepUnusedDataFor: 20,
    }),
    getMerchants: builder.query({
      query: () => "merchant",
      keepUnusedDataFor: 20,
    }),
  }),
});

export const { useGetCategoriesQuery, useGetMerchantsQuery } = api;
