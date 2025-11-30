import { getToken } from "next-auth/jwt";
const secret = new TextEncoder().encode(process.env.NEXTAUTH_SECRET);

export const verifyToken = async (req) => {
  const token = await getToken({ req, secret });

  if (!token) {
    return { token: null, isAdmin: false };
  }
  const isAdmin = token?.email === process.env.NEXT_PUBLIC_ADMIN_EMAIL;
  return { ...token, isAdmin };
};
