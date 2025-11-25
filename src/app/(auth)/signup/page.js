/* eslint-disable @next/next/no-img-element */
"use client";

import Link from "next/link";
import { useState } from "react";
import { FaUser } from "react-icons/fa";
import { useApi } from "@/hooks/useApi";
import Input from "@/components/common/Input";
import Button from "@/components/common/Button";
import OtpModal from "@/components/common/OtpModal";
import PasswordInput from "@/components/common/PasswordInput";

export default function Signup() {

  const { request, loading } = useApi();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otpModal, setOtpModal] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    const response = await request({
      url: "/api/auth/signup",
      method: "POST",
      body: { username, email, password },
      showSuccess: true,
    });

    if(response?.ok) {
      setOtpModal(true);
    }
  };

  const handleGoogleSignup = () => {
    alert("Google signup clicked");
  };

  return (
    <div className="w-full min-h-[calc(100vh-56px)] flex justify-center items-center bg-gray-50">
      <form
        onSubmit={handleSignup}
        className="w-[90%] max-w-[400px] mx-auto flex flex-col rounded-xl shadow-lg p-6 bg-white"
      >
        <h2 className="text-2xl font-bold text-center mb-1">Sign Up</h2>
        <p className="text-center text-gray-600 mb-4">
          Create a new account to get started
        </p>

        {/* Username */}
        <Input
          label="Username"
          name="username"
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter your username"
          icon={<FaUser />}
          required
        />

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
          className="my-4"
        />

        {/* Password */}
        <PasswordInput
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        {/* Signup Button */}
        <Button
          type="submit"
          text="Sign Up"
          loading={loading}
          disabled={loading}
          loaderText="Creating account..."
          className="mt-4"
        />

        {/* Divider */}
        <div className="flex items-center my-4">
          <hr className="grow border-gray-300" />
          <span className="mx-2 text-gray-400 text-sm">OR</span>
          <hr className="grow border-gray-300" />
        </div>

        {/* Google Signup */}
        <button
          type="button"
          onClick={handleGoogleSignup}
          className="flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100 transition"
        >
          <img
            src="https://developers.google.com/identity/images/g-logo.png"
            alt="Google logo"
            className="w-5 h-5"
          />
          <span>Sign Up with Google</span>
        </button>

        {/* Login Link */}
        <p className="text-center text-sm text-gray-600 mt-4">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 hover:underline">
            Login
          </Link>
        </p>
      </form>

      <OtpModal email={email} otpModal={otpModal} setOtpModal={setOtpModal} />
    </div>
  );
}
