"use client";

import React, { useState, useMemo } from "react";
import Input from "@/components/common/Input";
import {
  FaEye,
  FaEyeSlash,
  FaLock,
  FaCopy,
  FaPaste,
  FaRedo,
} from "react-icons/fa";
import toast from "react-hot-toast";

export default function PasswordTools() {
  const [activeTab, setActiveTab] = useState("check");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // ----------- SHARED PASSWORD CHECKS -----------
  const commonChecks = useMemo(() => {
    return {
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /[0-9]/.test(password),
      symbol: /[^A-Za-z0-9]/.test(password),
      noSpaces: !/\s/.test(password),
    };
  }, [password]);

  // ----------- STRENGTH CHECKER LOGIC -----------
  const strengthChecks = useMemo(() => {
    return {
      length: password.length >= 8,
      notCommonPattern: !/(123|password|qwerty|abc|111|000)/i.test(password),
      ...commonChecks,
    };
  }, [password, commonChecks]);

  const strengthScore = Object.values(strengthChecks).filter(Boolean).length;

  const getStrength = () => {
    if (!password) return { label: "Enter Password", color: "bg-gray-300", value: 0 };
    if (strengthScore <= 3) return { label: "Weak", color: "bg-red-500", value: 33 };
    if (strengthScore <= 5) return { label: "Medium", color: "bg-yellow-500", value: 66 };
    return { label: "Strong", color: "bg-green-600", value: 100 };
  };

  const strength = getStrength();

  // ----------- GENERATE PASSWORD -----------
  const generatePassword = () => {
    const chars = {
      upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
      lower: "abcdefghijklmnopqrstuvwxyz",
      numbers: "0123456789",
      symbols: "!@#$%^&*()-_=+[]{};:,.<>?/|",
    };

    let generated = "";
    const all = chars.upper + chars.lower + chars.numbers + chars.symbols;

    for (let i = 0; i < 16; i++) {
      generated += all[Math.floor(Math.random() * all.length)];
    }

    setPassword(generated);
  };

  // ----------- PASTE PASSWORD -----------
  const pastePassword = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setPassword(text);
      }
    } catch {
      toast.error("Clipboard permissions denied.");
    }
  };

  // ----------- COPY PASSWORD -----------
  const copyPassword = async () => {
    await navigator.clipboard.writeText(password);
    toast.success("Password copied to clipboard!");
  };

  return (
    <div className="w-full min-h-[calc(100vh-56px)] bg-gray-50 py-10">

      {/* ----------- HEADER ----------- */}
      <h1 className="text-4xl text-gray-800 text-center font-bold">
        Password Tools
      </h1>
      <p className="text-center mt-2 text-gray-600 max-w-xl mx-auto px-2">
        Check password strength, generate a strong password and improve security — all in one place.
      </p>

      {/* ----------- TABS ----------- */}
      <div className="flex justify-center mt-8 mb-6">
        <button
          onClick={() => setActiveTab("check")}
          className={`px-4 py-2 rounded-l-lg border 
            ${activeTab === "check" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}
          `}
        >
          Check Strength
        </button>

        <button
          onClick={() => setActiveTab("generate")}
          className={`px-4 py-2 rounded-r-lg border 
            ${activeTab === "generate" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}
          `}
        >
          Generate Password
        </button>
      </div>

      {/* =========================================================== */}
      {/*                      CHECK PASSWORD TAB                     */}
      {/* =========================================================== */}

      {activeTab === "check" && (
        <div>
          <div className="mt-10 relative w-[90%] max-w-[500px] mx-auto">
            <Input
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              icon={<FaLock className="w-4 h-4 text-gray-400" />}
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-[30px] text-gray-500"
            >
              {showPassword ? <FaEye size={18} /> : <FaEyeSlash size={18} />}
            </button>
          </div>

          {/* ---- Strength Indicator ---- */}
          <div className="w-[90%] max-w-[500px] mx-auto mt-5">
            <div className="flex justify-between mb-1">
              <span className="text-gray-700 font-semibold">{strength.label}</span>
              <span className="text-gray-600 text-sm">{strengthScore}/7 checks passed</span>
            </div>

            <div className="w-full bg-gray-300 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${strength.value}%` }}
              ></div>
            </div>
          </div>

          {/* ---- Requirements ---- */}
          <div className="w-[90%] max-w-[500px] mx-auto mt-6 bg-white p-5 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Password Requirements
            </h3>

            <ul className="space-y-2">
              {Object.entries({
                "At least 8 characters": strengthChecks.length,
                "Uppercase letter (A-Z)": strengthChecks.uppercase,
                "Lowercase letter (a-z)": strengthChecks.lowercase,
                "Number (0-9)": strengthChecks.number,
                "Symbol (! @ # $ etc.)": strengthChecks.symbol,
                "No spaces allowed": strengthChecks.noSpaces,
                "No common patterns": strengthChecks.notCommonPattern,
              }).map(([label, passed]) => (
                <li key={label} className="flex items-center gap-2 text-sm">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      passed ? "bg-green-600" : "bg-red-500"
                    }`}
                  ></span>
                  <span className={passed ? "text-green-700" : "text-gray-700"}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* =========================================================== */}
      {/*                     GENERATE PASSWORD TAB                   */}
      {/* =========================================================== */}

      {activeTab === "generate" && (
        <div>
          <div className="mt-10 w-[90%] max-w-[500px] mx-auto relative">
            <Input
              label="Generated Password"
              name="password"
              type="text"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Your strong password will appear here"
              icon={<FaLock className="w-4 h-4 text-gray-400" />}
            />

            <div className="flex gap-3 mt-3">
              <button
                onClick={generatePassword}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                <FaRedo /> Generate
              </button>

              <button
                onClick={pastePassword}
                className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700"
              >
                <FaPaste /> Paste
              </button>

              <button
                onClick={copyPassword}
                className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
              >
                <FaCopy /> Copy
              </button>
            </div>
          </div>

          {/* Strength Indicator */}
          <div className="w-[90%] max-w-[500px] mx-auto mt-6">
            <div className="flex justify-between mb-1">
              <span className="font-semibold text-gray-700">{strength.label}</span>
              <span className="text-gray-600 text-sm">
                {Object.values(commonChecks).filter(Boolean).length}/5 checks passed
              </span>
            </div>

            <div className="w-full bg-gray-300 h-3 rounded-full overflow-hidden">
              <div
                className={`h-full transition-all duration-300 ${strength.color}`}
                style={{ width: `${strength.value}%` }}
              ></div>
            </div>
          </div>

          {/* Generator Requirements */}
          <div className="w-[90%] max-w-[500px] mx-auto mt-6 bg-white p-5 rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-3 text-gray-700">
              Recommended Requirements
            </h3>

            <ul className="space-y-2">
              {Object.entries({
                "At least 12 characters": password.length >= 12,
                "Uppercase letter (A-Z)": commonChecks.uppercase,
                "Lowercase letter (a-z)": commonChecks.lowercase,
                "Number (0-9)": commonChecks.number,
                "Symbol (! @ # $ etc.)": commonChecks.symbol,
                "No spaces allowed": commonChecks.noSpaces,
              }).map(([label, passed]) => (
                <li key={label} className="flex items-center gap-2 text-sm">
                  <span
                    className={`inline-block w-3 h-3 rounded-full ${
                      passed ? "bg-green-600" : "bg-red-500"
                    }`}
                  ></span>
                  <span className={passed ? "text-green-700" : "text-gray-700"}>
                    {label}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}

      {/* ----------- FOOTER NOTE ----------- */}
      <p className="mt-4 text-center">
        <span className="text-red-500 font-medium mr-2">
          Note:
        </span>
        Your passwords are never stored. Even if they were, we have no idea who you are!
      </p>
    </div>
  );
}
