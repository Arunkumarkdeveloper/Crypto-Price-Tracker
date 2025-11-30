// components/TwoFactorSetup.jsx
"use client";
import { useState, useEffect } from "react";
import { toastMessage } from "@/lib/utils/toastMessage";
import { useSession } from "next-auth/react";
import { _get, _post } from "@/lib/utils/apiClient";
import { useRouter } from "next/navigation";

const TwoFactorForm = () => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [qrCode, setQrCode] = useState("");
  const [token, setToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [setupMode, setSetupMode] = useState(false);
  const [isEnabled, setIsEnabled] = useState(false);
  const [isStatusLoading, setIsStatusLoading] = useState(true);
  const [disableMode, setDisableMode] = useState(false);

  const verifyAndEnable = async () => {
    try {
      setLoading(true);
      const response = await _post(`/api/auth/verify-2fa`, { token });
      router.push("/");
    } catch (error) {
      toastMessage("error", "Invalid Code");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-column justify-center">
      <div className="flex justify-center">
        <div className="auth-container">
          <h2 className="text-lg font-bold mb-4 text-center">
            Two Factor Authentication
          </h2>
          <p className="mb-10 text-center">Fill in your 2FA code to continue</p>
          <input
            name="name"
            type="token"
            placeholder="Enter Code"
            value={token}
            className="w-100 mb-15"
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                verifyAndEnable();
              }
            }}
          />
          <button className="btn w-100" onClick={verifyAndEnable}>
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
};

export default TwoFactorForm;
