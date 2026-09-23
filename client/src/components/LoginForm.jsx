import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {Mail,Lock,Eye,EyeOff,LogIn,AlertCircle,Loader2,ShieldCheck,Sparkles,} from "lucide-react";
import { encryptFrontend } from "../utils/crypto";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";


export default function LoginForm({ onLoginSuccess }) {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);


  const handleEmailChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[^a-zA-Z0-9._%+\-@]/g, "");
    const atIndex = value.indexOf("@");
    if (atIndex !== -1) {
      const beforeAt = value.slice(0, atIndex);
      let afterAt = value.slice(atIndex + 1);
      afterAt = afterAt.replace(/@/g, "");
      value = beforeAt + "@" + afterAt;
    }

    setFormData((prev) => ({
      ...prev,
      email: value,
    }));
    setError("");
  };


  const handlePasswordChange = (e) => {
    let value = e.target.value;
    value = value.replace(/[<>?\/\\{}\[\]]/g, "");
    setFormData((prev) => ({
      ...prev,
      password: value,
    }));
    setError("");
  };


  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const email = formData.email.trim().toLowerCase();
    const password = formData.password;
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    const emailRegex =
      /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    if ((email.match(/@/g) || []).length !== 1) {
      setError("Please enter a valid email address.");
      return;
    }
    setLoading(true);
    try {
      const encryptedPassword = encryptFrontend(password);
      const res = await axios.post(`${API_URL}/login`, {
        email,
        password: encryptedPassword,
      });
      setLoading(false);
      onLoginSuccess();
    } catch (err) {
      console.error(
        "Login error:",
        err.response?.data || err
      );
      setLoading(false);
      setError(
        err.response?.data?.error ||
          "Login failed. Please check your credentials."
      );
    }
  };

  return (
    <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#070A13] px-4 py-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          animate={{
            x: [0, 80, -40, 0],
            y: [0, -50, 40, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-indigo-600/20 blur-[100px]"
        />

        <motion.div
          animate={{
            x: [0, -70, 50, 0],
            y: [0, 60, -30, 0],
          }}
          transition={{
            duration: 16,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="absolute -bottom-40 -right-32 h-113 w-113 rounded-full bg-violet-600/20 blur-[110px]"
        />

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.07),transparent_45%)]" />
        <div className="absolute inset-0 opacity-[0.035]"
          style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "45px 45px",
          }}
        />
      </div>


      <motion.div
        initial={{
          opacity: 0,
          y: 30,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        transition={{
          duration: 0.6,
          ease: [0.22, 1, 0.36, 1],
        }}
        className="relative z-10 w-full max-w-110"
      >
        <div className="absolute -inset-1 rounded-[30px] bg-linear-to-r from-indigo-500/30 via-violet-500/20 to-cyan-500/30 opacity-70 blur-xl" />
        <div className="relative overflow-hidden rounded-[28px] border border-white/10 bg-[#0D111C]/90 p-8 shadow-2xl shadow-black/40 backdrop-blur-2xl sm:p-10">

          <div className="pointer-events-none absolute left-0 right-0 top-0 h-px bg-linear-to-r from-transparent via-indigo-400/70 to-transparent" />

          <div className="flex justify-center">
            <motion.div
              initial={{ scale: 0, rotate: -20 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 180,
              }}
              className="relative"
            >
              <div className="absolute inset-0 rounded-2xl bg-indigo-500/40 blur-xl" />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl border border-indigo-400/20 bg-linear-to-br from-indigo-500 to-violet-600 shadow-xl shadow-indigo-500/20">
                <ShieldCheck className="h-8 w-8 text-white" />
              </div>
            </motion.div>
          </div>

          <div className="mt-6 text-center">
            <div className="mb-2 flex items-center justify-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                Welcome Back
              </h1>

              <motion.div
                animate={{
                  rotate: [0, 10, -10, 0],
                  scale: [1, 1.08, 1],
                }}
                transition={{
                  duration: 2.5,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <Sparkles className="h-5 w-5 text-indigo-400" />
              </motion.div>
            </div>

            <p className="mx-auto max-w-xs text-sm leading-6 text-slate-400">
              Sign in to manage your student account securely.
            </p>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -8,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                  height: 0,
                }}
                className="mt-6 overflow-hidden"
              >
                <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/8 p-4 text-sm text-red-300">
                  <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* =====================================
              FORM
          ===================================== */}

          <form
            onSubmit={handleSubmit}
            className="mt-7 space-y-5"
          >
            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Email address
              </label>

              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Mail className="h-5 w-5 text-slate-500 transition-colors group-focus-within:text-indigo-400" />
                </div>

                <input
                  type="email"
                  required
                  autoComplete="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleEmailChange}
                  spellCheck="false"
                  className="h-13 w-full rounded-2xl border border-white/9 bg-white/[0.035] pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-600 hover:border-white/15 focus:border-indigo-500/60 focus:bg-white/5 focus:ring-4 focus:ring-indigo-500/10"/>
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-slate-300">
                Password
              </label>

              <div className="group relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                  <Lock className="h-5 w-5 text-slate-500 transition-colors group-focus-within:text-indigo-400" />
                </div>

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  autoComplete="current-password"
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={handlePasswordChange}
                  className="h-13 w-full rounded-2xl border border-white/9 bg-white/[0.035] pl-11 pr-12 text-sm text-white outline-none transition-all placeholder:text-slate-600 hover:border-white/15 focus:border-indigo-500/60 focus:bg-white/5 focus:ring-4 focus:ring-indigo-500/10"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((prev) => !prev)
                  }
                  className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 transition-colors hover:text-indigo-400"
                  aria-label={
                    showPassword
                      ? "Hide password"
                      : "Show password"
                  }
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </div>


            <motion.button
              whileHover={{
                scale: loading ? 1 : 1.015,
              }}
              whileTap={{
                scale: loading ? 1 : 0.98,
              }}
              type="submit"
              disabled={loading}
              className="group relative mt-2 flex h-13 w-full items-center justify-center overflow-hidden rounded-2xl bg-linear-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-size-[200%_100%] text-sm font-semibold text-white shadow-xl shadow-indigo-600/20 transition-all duration-500 hover:bg-position-[100%_0] hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
              {loading ? (
                <Loader2 className="relative h-5 w-5 animate-spin" />
              ) : (
                <span className="relative flex items-center gap-2">
                  <LogIn className="h-4 w-4" />
                  Sign In
                </span>
              )}
            </motion.button>
          </form>

         
        </div>
      </motion.div>
    </div>
  );
}