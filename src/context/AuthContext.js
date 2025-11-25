"use client";

import React, { createContext, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";
import toast from "react-hot-toast";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const router = useRouter();

  const [user, setUser] = useState(null);
  const [tempEmail, setTempEmail] = useState("");
  const [otpModal, setOtpModal] = useState(false);
  const [otpVerified, setOtpVerified] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [notifications, setNotifications] = useState([]);

  // SIGNUP
  const signup = async (userData) => {
    try {
      const res = await axios.post("/api/auth/signup", userData);
      toast.success(res.data.message);
      setTempEmail(userData.email);
      setOtpModal(true);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Server Error");
    }
  };

  // CHECK AUTHENTICATION
  const checkAuth = async () => {
    try {
      const res = await axios.get("/api/auth/check");
      getNotifications();
      setUser(res.data.user);
    } catch (error) {
      console.error("Authentication check failed", error);
    } finally {
      setCheckingAuth(false);
    }
  };

  // GET ALL NOTIFICATIONS
  const getNotifications = async () => {
    try {
      const res = await axios.get("/api/notifications");
      setNotifications(res.data.notifications);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Server Error");
    }
  };

  // VERIFY OTP
  const verifyOtp = async (otp) => {
    try {
      const res = await axios.post("/api/otp/verify", {
        email: tempEmail,
        otp,
      });
      toast.success(res.data.message);
      setOtpModal(false);
      setOtpVerified(true);
      if (res.data.user) {
        setUser(res.data.user);
        getNotifications();
        router.push("/auth/profile");
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Server Error");
    }
  };

  // MARK ALL NOTIFICATIONS AS READ
  const markAllAsRead = async () => {
    try {
      const res = await axios.get("/api/notifications/mark");
      getNotifications();
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Server Error");
    }
  };

  // LOGOUT
  const logout = async () => {
    try {
      const res = await axios.get("/api/auth/logout");
      toast.success(res.data.message);
      router.push("/auth/login");
      setUser(null);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Server Error");
    }
  };

  // LOGIN
  const login = async (userData) => {
    try {
      const res = await axios.post("/api/auth/login", userData);
      setUser(res.data.user);
      await getNotifications();
      toast.success(res.data.message);
      router.push("/");
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Server Error");
    }
  };

  // RESEND OTP
  const reSendOtp = async () => {
    try {
      const res = await axios.post('/api/otp/resend', { email: tempEmail });
      toast.success(res.data.message);
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Server Error");
    }
  }

  // RESET PASSWORD
  const resetPassword = async ({ email, newPassword }) => {
    try {
      const res = await axios.put('/api/auth/reset-password', { email, newPassword });
      toast.success(res.data.message);
      setOtpVerified(false);
      router.push('/auth/login');
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Server Error");
    }
  };

  // DELETE ACCOUNT
  const deleteAccount = async () => {
    try {
      const res = await axios.delete('/api/auth/deleteAccount');
      toast.success(res.data.message);
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Server Error");
    }
  };  

  return (
    <AuthContext.Provider
      value={{
        signup,
        otpModal,
        setOtpModal,
        verifyOtp,
        user,
        otpVerified,
        setOtpVerified,
        checkingAuth,
        checkAuth,
        notifications,
        markAllAsRead,
        logout,
        login,
        reSendOtp,
        resetPassword,
        deleteAccount,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
