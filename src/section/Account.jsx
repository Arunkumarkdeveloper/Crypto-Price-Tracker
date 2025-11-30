"use client";
import React from "react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { toastMessage } from "@/lib/utils/toastMessage";
import { _get, _post } from "@/lib/utils/apiClient";
import Image from "next/image";
import { useRouter } from "next/navigation";

export default function Account() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [qrCode, setQrCode] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [setupMode, setSetupMode] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const [disableMode, setDisableMode] = useState(false);

  useEffect(() => {
    const checkTwoFactorStatus = async () => {
      try {
        setIsStatusLoading(true);
        const response = await _get("/api/2fa/status");
        setIsEnabled(response.data.enabled);
      } catch (error) {
        console.error("Error checking 2FA status:", error);
      } finally {
        setIsStatusLoading(false);
      }
    };

    if (session) {
      checkTwoFactorStatus();
    }
  }, [status]);

  const initiateTwoFactorSetup = async () => {
    try {
      setLoading(true);
      const response = await _post(`/api/2fa/setup`);
      setQrCode(response.data?.qrCodeDataUrl);
      setSetupMode(true);
    } catch (error) {
      toastMessage("error", error.error);
    } finally {
      setLoading(false);
    }
  };

  const verifyAndEnable = async () => {
    try {
      setLoading(true);
      await _post(`/api/2fa/enable`, { token });
      window.location.reload();
    } catch (error) {
      toastMessage("error", "Invalid Code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-12 mt-20">My Account</h1>

      <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
        <div className="mb-10">
          <label className="text-gray-600 text-sm">Name</label>
          <p>{session?.user?.name}</p>
        </div>

        <div className="mb-7">
          <label className="text-gray-600 text-sm">Email</label>
          <p>{session?.user?.email}</p>
        </div>

        <div className="my-6 border-t border-gray-200"></div>

        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-lg font-bold">Two-Factor Authentication</h2>
            <p className="text-gray-500 text-sm">
              Increase account security by enabling 2FA.
            </p>
          </div>
          {session && !isStatusLoading && (
            <>
              {isEnabled ? (
                <p className="text-green-600 font-semibold">2FA is Enabled</p>
              ) : (
                <button className="btn" onClick={initiateTwoFactorSetup}>
                  Enable 2FA
                </button>
              )}
            </>
          )}
        </div>

        {setupMode && !isEnabled && (
          <>
            {qrCode && (
              <Image
                src={qrCode}
                alt="qrCode"
                title="qrCode"
                width={200}
                height={200}
                unoptimized
              />
            )}
            <input
              name="name"
              type="token"
              placeholder="Enter Code"
              value={this}
              className="w-100 mb-15"
              onChange={(e) => setToken(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  verifyAndEnable();
                }
              }}
            />
            <button className="btn w-100" onClick={verifyAndEnable}>
              Enable
            </button>
          </>
        )}
      </div>
    </div>
  );
}
