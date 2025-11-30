import { generateTwoFactorSecret, generateQRCode } from "@/lib/utils/2fa";
import { verifyToken } from "@/helpers/verifyToken";
import { verify2FAToken } from "@/lib/utils/2fa";
import { prisma } from "@/lib/config/prisma";

const setup2FA = async (req) => {
  try {
    const { email } = await verifyToken(req);

    if (!email) {
      return { status: 401, body: { error: "Unauthorized" } };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { status: 404, body: { error: "User not found" } };
    }

    const { secret, otpAuthUrl } = generateTwoFactorSecret(user.email);
    const qrCodeDataUrl = await generateQRCode(otpAuthUrl);

    user.twoFactorSecret = secret;

    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorSecret: secret },
    });

    return {
      status: 200,
      body: {
        success: true,
        qrCodeDataUrl,
      },
    };
  } catch (error) {
    console.error("Error setting up 2FA:", error);
    return { status: 500, body: { error: "Failed to set up 2FA" } };
  }
};

const status2FA = async (req) => {
  try {
    const { email } = await verifyToken(req);

    if (!email) {
      return { status: 401, body: { message: "Unauthorized" } };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.twoFactorSecret) {
      return { status: 400, body: { message: "2FA setup not initiated" } };
    }

    return {
      status: 200,
      body: {
        enabled: user.twoFactorEnabled,
        message: "Two-factor authentication enabled",
      },
    };
  } catch (error) {
    console.error("Error verifying 2FA token:", error);
    return { status: 500, body: { message: "Failed to verify token" } };
  }
};

const enable2FA = async (req) => {
  try {
    const { email } = await verifyToken(req);

    if (!email) {
      return { status: 401, body: { error: "Unauthorized" } };
    }

    const { token } = await req.json();

    if (!token) {
      return { status: 400, body: { error: "Token is required" } };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.twoFactorSecret) {
      return { status: 400, body: { error: "2FA setup not initiated" } };
    }

    const isValid = verify2FAToken(token, user.twoFactorSecret);

    if (!isValid) {
      return { status: 400, body: { error: "Invalid Code" } };
    }

    // Enable 2FA for the user
    user.twoFactorEnabled = true;
    await prisma.user.update({
      where: { id: user.id },
      data: { twoFactorEnabled: true },
    });

    return {
      status: 200,
      body: {
        success: true,
        message: "Two-factor authentication enabled",
      },
    };
  } catch (error) {
    console.error("Error verifying 2FA token:", error);
    return { status: 500, body: { error: "Failed to verify token" } };
  }
};

const verify2FA = async (req) => {
  try {
    const { email } = await verifyToken(req);

    if (!email) {
      return { status: 401, body: { error: "Unauthorized" } };
    }

    const { token } = await req.json();

    if (!token) {
      return { status: 400, body: { error: "Token is required" } };
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user || !user.twoFactorSecret) {
      return {
        status: 404,
        body: { error: "User not found or 2FA not set up" },
      };
    }

    const isValid = verify2FAToken(token, user.twoFactorSecret);

    if (!isValid) {
      return { status: 400, body: { error: "Invalid Code" } };
    }

    return {
      status: 200,
      body: {
        success: true,
        message: "Two-factor authentication verified",
      },
    };
  } catch (error) {
    console.error("Error verifying 2FA:", error);
    return { status: 500, body: { error: "Failed to verify 2FA" } };
  }
};

export { setup2FA, status2FA, enable2FA, verify2FA };
