"use client";
import { _post } from "@/lib/utils/apiClient";
import { handleChange } from "@/lib/utils/handleChange";
import { toastMessage } from "@/lib/utils/toastMessage";
import { emailRegex, passwordRegex } from "@/lib/utils/validation";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { signIn, signOut, useSession } from "next-auth/react";
import TwoFactorForm from "@/components/TwoFactorForm";

export default function Auth({ authType }) {
  const { data: session, status } = useSession();
  console.log(session);
  const router = useRouter();
  const dispatch = useDispatch();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const WeekPassword =
    user.password.length > 1 && !passwordRegex.test(user.password);
  const isNotMatchedPassword =
    user.password !== user.confirmPassword && user.confirmPassword?.length >= 5;
  const isEnter2FACode = session?.requiresTwoFactor;

  const validateForm = () => {
    if (authType === "register" && !user.name.trim()) {
      toastMessage("error", "Enter your name");
      return false;
    }

    if (!emailRegex.test(user.email)) {
      toastMessage("error", "Enter a valid email");
      return false;
    }

    if (!passwordRegex.test(user.password)) {
      const passwordToast =
        authType === "register"
          ? "Enter a strong password"
          : "Enter a password";
      toastMessage("error", passwordToast);
      return false;
    }

    if (authType === "register" && user.password !== user.confirmPassword) {
      toastMessage("error", "Password doesn't match");
      return false;
    }
    setIsLoading(true);
    return true;
  };

  const handleSignup = async () => {
    if (!validateForm()) return;

    try {
      const response = await _post(`/api/auth/register`, user);
      toastMessage("success", response?.data?.message);
      router.push("/login");
    } catch (error) {
      console.log("error", error);
      toastMessage("error", error?.response?.data?.message || "Signup failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignin = async () => {
    if (!validateForm()) return;

    try {
      const response = await signIn("credentials", {
        redirect: false,
        email: user.email,
        password: user.password,
      });

      if (response.ok) {
        toastMessage("success", "login success");
      } else {
        toastMessage("error", response.error);
      }
    } catch (error) {
      toastMessage("error", "Something went wrong during login.");
      console.error("Login error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAuthSubmit = () => {
    authType !== "login" ? handleSignup() : handleSignin();
  };

  useEffect(() => {
    if (session && !session?.requiresTwoFactor) {
      router.push('/')
    }
  },[status])
 
  return (
    <div className="flex justify-center">
      {!isEnter2FACode ? (
        <div className="auth-container">
          <h1 className="text-center mb-15 text-lg">
            <strong>
              {authType === "login"
                ? "Sign In to Your Account"
                : "Sign Up for Your Account"}
            </strong>
          </h1>
          {authType !== "login" && (
            <input
              name="name"
              type="text"
              placeholder="User Name"
              value={user.name}
              className="w-100 mb-15"
              onChange={(e) => handleChange(e, setUser)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAuthSubmit();
                }
              }}
            />
          )}
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={user.email}
            className="w-100 mb-15"
            onChange={(e) => handleChange(e, setUser)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAuthSubmit();
              }
            }}
          />
          <input
            name="password"
            type="password"
            placeholder="Password"
            value={user.password}
            className="w-100 mb-15"
            onChange={(e) => handleChange(e, setUser)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleAuthSubmit();
              }
            }}
          />
          {WeekPassword && authType !== "login" && (
            <small className="mb-12">
              <span>Password must contain the following:</span>
              <ul>
                <li>1 capital letter [A, B, C]</li>
                <li>1 small letter [a, b, c]</li>
                <li>1 number [1, 2, 3]</li>
                <li>1 special character [@, $, #]</li>
                <li>Minimum length 6 character</li>
              </ul>
            </small>
          )}
          {authType !== "login" && (
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={user.confirmPassword}
              className="w-100 mb-15"
              onChange={(e) => handleChange(e, setUser)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleAuthSubmit();
                }
              }}
            />
          )}
          {isNotMatchedPassword && authType !== "login" && (
            <small className="mb-12">
              <span>Password doesn't match</span>
            </small>
          )}
          {isLoading ? (
            <button className="btn btn-main w-100">Loading...</button>
          ) : (
            <button className="btn btn-main w-100" onClick={handleAuthSubmit}>
              {authType !== "login" ? "Sign up" : "Sign in"}
            </button>
          )}
          {authType === "login" ? (
            <p className="mt-10 text-center">
              Don't have an Account?{" "}
              <Link href="/register">
                <u>Sign up</u>
              </Link>
            </p>
          ) : (
            <p className="mt-10 text-center">
              Already have an account?{" "}
              <Link href="/login">
                <u>Sign in</u>
              </Link>
            </p>
          )}
        </div>
      ) : (
        <TwoFactorForm />
      )}
    </div>
  );
}
