import { authenticator } from "otplib";
import QRCode from "qrcode";

export const generateTwoFactorSecret = (email) => {
  const secret = authenticator.generateSecret();
  const serviceName = "Crypto Price Tracker";
  const otpAuthUrl = authenticator.keyuri(email, serviceName, secret);

  return { secret, otpAuthUrl };
};

export const generateQRCode = async (otpAuthUrl) => {
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(otpAuthUrl);
    return qrCodeDataUrl;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
};

export const verify2FAToken = (token, secret) => {
  try {
    return authenticator.verify({ token, secret });
  } catch (error) {
    console.error("Error verifying token:", error);
    return false;
  }
};
