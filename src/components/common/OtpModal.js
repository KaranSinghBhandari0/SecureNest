"use client";

import { useState, useEffect, useRef } from 'react';
import { RiLoader5Fill } from "react-icons/ri";
import { useApi } from '@/hooks/useApi';
import Button from './Button';

export default function OtpModal({ email, otpModal, setOtpModal, setOtpVerified }) {

  const { request, loading } = useApi();

  const [otp, setOtp] = useState(['', '', '', '']);
  const [resendTimer, setResendTimer] = useState(30);
  const [resendLoading, setResendLoading] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (otpModal) {
      inputRefs.current[0]?.focus();
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setResendTimer(30);
    }
  }, [otpModal]);

  useEffect(() => {
    if (resendTimer <= 0) return;
    const timer = setInterval(() => setResendTimer(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [resendTimer]);

  const handleClose = () => {
    setOtpModal(false);
    setOtp(['', '', '', '']);
  };

  const handleOtpChange = (e, index) => {
    const value = e.target.value;
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 3) inputRefs.current[index + 1]?.focus();
  };

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = e.clipboardData.getData('text/plain').trim();
    if (/^\d{4}$/.test(paste)) {
      setOtp(paste.split(''));
      inputRefs.current[3]?.focus();
    }
  };

  const handleSubmitOtp = async (e) => {
    e.preventDefault();

    const enteredOtp = otp.join('');
    
    const response = await request({
      url: "/api/otp/verify",
      method: "POST",
      body: { email, otp: enteredOtp },
      showSuccess: true,
      refresh: "/",
      redirect: "/profile",
    });

    if (response.ok) {
      if(setOtpVerified) {
        setOtpVerified(true);
      }
      setOtpModal(false);
      setOtp(['', '', '', '']);
    }
  };

  const handleResendOtp = async () => {
    setResendLoading(true);

    const response = await request({
      url: "/api/otp/resend",
      method: "POST",
      body: { email },
      showSuccess: true,
      holdLoading: true,
    });

    if (response.ok) {
      setResendTimer(30);
      setOtp(['', '', '', '']);
      inputRefs.current[0]?.focus();
    }

    setResendLoading(false);
  };

  return otpModal ? (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md relative">

        <button
          onClick={handleClose}
          className="absolute top-2 right-3 text-gray-500 hover:text-gray-700 text-lg"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold text-center mb-4">Verify OTP</h2>

        <p className="text-gray-600 text-center mb-6">
          Enter the 4-digit code sent to your email
        </p>

        <div className="flex justify-center gap-3 mb-4">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => (inputRefs.current[index] = el)}
              type="text"
              inputMode="numeric"
              maxLength="1"
              value={digit}
              onChange={(e) => handleOtpChange(e, index)}
              onKeyDown={(e) => handleKeyDown(e, index)}
              onPaste={handlePaste}
              className="w-12 h-12 border border-gray-300 rounded text-center text-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}
        </div>

        <Button
          text="Verify OTP"
          onClick={handleSubmitOtp}
          loading={loading}
          loaderText="Verifying..."
          disabled={otp.join('').length !== 4}
          className="mt-2 w-full"
        />

        <div className="mt-4 text-center text-sm text-gray-600">
          {resendTimer > 0 ? (
            <>Resend OTP in <span className="font-semibold">{resendTimer}s</span></>
          ) : (
            <button
              onClick={handleResendOtp}
              className="text-blue-500 font-medium hover:underline flex items-center gap-1 mx-auto disabled:opacity-50"
              disabled={resendLoading}
            >
              {resendLoading && <RiLoader5Fill className="animate-spin h-4 w-4" />}
              Resend OTP
            </button>
          )}
        </div>

      </div>
    </div>
  ) : null;
}
