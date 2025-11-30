import { NextResponse } from "next/server";
import { verifyToken } from "@/helpers/verifyToken";
import { verify2FAToken } from "@/lib/utils/2fa";

export const POST = async (req) => {
  try {
    const { email } = await verifyToken(req);

    if (!email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { token } = await req.json();

    if (!token) {
      return NextResponse.json({ error: "Token is required" }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.twoFactorSecret) {
      return NextResponse.json(
        { error: "2FA setup not initiated" },
        { status: 400 }
      );
    }

    const isValid = verify2FAToken(token, user.twoFactorSecret);

    if (!isValid) {
      return NextResponse.json({ error: "Invalid Code" }, { status: 400 });
    }

    // Enable 2FA for the user
    user.twoFactorEnabled = true;
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: true },
    });

    return NextResponse.json({
      success: true,
      message: "Two-factor authentication enabled",
    });
  } catch (error) {
    console.error("Error verifying 2FA token:", error);
    return NextResponse.json(
      { error: "Failed to verify token" },
      { status: 500 }
    );
  }
};
