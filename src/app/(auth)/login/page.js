/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";
import { useApi } from "@/hooks/useApi";
import { FaUser } from "react-icons/fa";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import PasswordInput from "@/components/common/PasswordInput";

export default function Login() {

  const { request, loading } = useApi();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    await request({
      url: "/api/auth/login",
      method: "POST",
      body: { email, password },
      showSuccess: true,
      redirect: "/",
      refresh: true,
    });
  };

  const handleGoogleLogin = () => {
    alert("Google login clicked");
  };

  return (
    <div className="w-full min-h-[calc(100vh-56px)] flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleLogin}
        className="w-[90%] max-w-[400px] mx-auto flex flex-col rounded-xl shadow-lg p-6 bg-white"
      >
        <h2 className="text-2xl font-bold text-center mb-1">Login</h2>
        <p className="text-center text-gray-600 mb-4">
          Welcome back! Please login to your account
        </p>

        {/* Email */}
        <Input
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Enter your email"
          icon={<FaUser />}
          required
          className="mb-4"
        />

        {/* Password */}
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Forgot Password */}
        <div className="text-right mt-1">
          <Link
            href="/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        {/* Login Button */}
        <Button
          type="submit"
          text="Login"
          loading={loading}
          loaderText="Logging in..."
          disabled={loading}
          className="mt-4"
        />

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="grow border-gray-300" />
          <span className="mx-2 text-gray-400 text-sm">OR</span>
          <hr className="grow border-gray-300" />
        </div>

        {/* Google Login */}
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            className="w-5 h-5"
          />
          <span>Login with Google</span>
        </button>

        {/* Signup Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Don’t have an account?{" "}
          <Link href="/signup" className="text-blue-600 hover:underline">
            Sign up
          </Link>
        </p>
      </form>
    </div>
  );
}
