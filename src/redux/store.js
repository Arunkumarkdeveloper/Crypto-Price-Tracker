"use client";
import { configureStore } from "@reduxjs/toolkit";
import AppReducer from "./AppSlice";
import { api } from "./api";

export const store = configureStore({
  reducer: {
    app: AppReducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(api.middleware),
});
