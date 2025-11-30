"use client";
import { SessionProvider } from "next-auth/react";

const ClientProvider = ({ children }) => {
  return (
    <SessionProvider>{children}</SessionProvider>
  );
};
export default ClientProvider;
