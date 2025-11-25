"use client";

import { useState } from 'react';
import { Mail } from 'lucide-react';
import { useApi } from "@/hooks/useApi";
import Input from '@/components/common/Input';
import Button from '@/components/common/Button';
import OtpModal from '@/components/common/OtpModal';
import PasswordInput from "@/components/common/PasswordInput";

export default function ForgetPasswordPage() {

  const { request, loading } = useApi();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otpModal, setOtpModal] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);

  const handleRequestOtp = async (e) => {
    e.preventDefault();

    const response = await request({
      url: "/api/auth/signup",
      method: "POST",
      body: { email },
      showSuccess: true,
    });

    if (response.ok) {
      setOtpModal(true);
    }
  };

  const handlePasswordReset = async (e) => {
    e.preventDefault();

    const response = await request({
      url: "/api/auth/reset-password",
      method: "PUT",
      body: { email, newPassword: password },
      showSuccess: true,
      redirect: '/login'
    });

    if (response.ok) {
      setOtpVerified(false);
      setPassword('');
    }
  };

  return (
    <div className="w-full min-h-[calc(100vh-56px)] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-xl bg-white rounded-2xl p-8 space-y-8">

        {/* STEP 1: Ask Email */}
        {!otpVerified && (
          <form onSubmit={handleRequestOtp} className="space-y-4">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800">
                Reset Your Password
              </h1>
              <p className="text-center text-gray-600 mt-2">
                Enter your email to receive an OTP.
              </p>
            </div>

            <Input
              label="Email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              icon={<Mail className="w-4 h-4 text-gray-400" />}
            />

            <Button
              text="Send OTP"
              type="submit"
              loading={loading}
              loaderText="Sending OTP..."
              className="w-full"
            />
          </form>
        )}

        {/* STEP 2: Reset Password */}
        {otpVerified && (
          <form onSubmit={handlePasswordReset} className="space-y-4 pt-4">
            <div>
              <h1 className="text-xl md:text-3xl font-bold text-center text-gray-800">
                Create New Password
              </h1>
              <p className="text-center text-gray-600 mt-2">
                OTP verified. Enter your new password.
              </p>
            </div>

            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />

            <Button
              text="Reset Password"
              type="submit"
              loading={loading}
              loaderText="Resetting..."
              className="w-full"
            />
          </form>
        )}

        {/* OTP Modal */}
        <OtpModal
          email={email}
          otpModal={otpModal}
          setOtpModal={setOtpModal}
          setOtpVerified={setOtpVerified}
        />

      </div>
    </div>
  );
}
