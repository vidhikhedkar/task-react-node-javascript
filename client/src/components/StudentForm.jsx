import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import {
  UserPlus, UserCheck, Mail, Phone, Calendar, MapPin, BookOpen, Lock, Eye, EyeOff, Loader2, X,
  User, CheckCircle2, AlertCircle, Sparkles,
} from "lucide-react";
import { encryptFrontend } from "../utils/crypto";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";

const initialForm = {
  fullName: "",
  email: "",
  phoneNumber: "",
  dateOfBirth: "",
  gender: "Male",
  address: "",
  courseEnrolled: "",
  password: "",
};

const blockedCharacters = /[<>"'`;\\\/\[\]{}?]/;

const fieldVariants = {
  hidden: {
    opacity: 0,
    y: 12,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.3,
    },
  },
};

export default function StudentForm({
  selectedStudent,
  clearSelection,
  refreshList,
}) {
  const [formData, setFormData] = useState(initialForm);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState({
    type: "",
    text: "",
  });

  useEffect(() => {
    if (selectedStudent) {
      setFormData({
        fullName: selectedStudent.fullName || "",
        email: selectedStudent.email || "",
        phoneNumber: selectedStudent.phoneNumber || "",
        dateOfBirth: selectedStudent.dateOfBirth || "",
        gender: selectedStudent.gender || "Male",
        address: selectedStudent.address || "",
        courseEnrolled: selectedStudent.courseEnrolled || "",
        password: "",
      });

      setMessage({
        type: "",
        text: "",
      });
    } else {
      resetForm();
    }
  }, [selectedStudent]);

  const resetForm = () => {
    setFormData(initialForm);
    setMessage({
      type: "",
      text: "",
    });
    setShowPassword(false);
  };


  const handleChange = (e) => {
    const { name, value } = e.target;
    let nextValue = value;
    if (name === "fullName") {
      nextValue = value.replace(/[^a-zA-Z\s]/g, "");
    }
    if (name === "phoneNumber") {
      nextValue = value.replace(/\D/g, "").slice(0, 15);
    }
    if (name === "email") {
      nextValue = value.replace(/[<>"'`;\\\/\[\]{}?]/g, "");
    }

    if (name === "password") {
      nextValue = value.replace(/[<>"'`;\\\/\[\]{}?]/g, "");
    }

    if (name === "courseEnrolled") {
      nextValue = value.replace(/[<>"'`;\\\/\[\]{}?]/g, "");
    }

    if (name === "address") {
      nextValue = value.replace(/[<>"'`;\\\/\[\]{}?]/g, "");
    }

    setFormData((prev) => ({
      ...prev,
      [name]: nextValue,
    }));

    if (message.text) {
      setMessage({
        type: "",
        text: "",
      });
    }
  };

  const validateForm = () => {
    const name = formData.fullName.trim();
    const email = formData.email.trim().toLowerCase();
    const phone = formData.phoneNumber.trim();
    const address = formData.address.trim();
    const course = formData.courseEnrolled.trim();
    const password = formData.password;

    if (!name) {
      return "Full name is required.";
    }

    if (!/^[A-Za-z]+(?:\s+[A-Za-z]+)*$/.test(name)) {
      return "Full name should contain letters and spaces only.";
    }

    if (!email) {
      return "Email address is required.";
    }

    const emailRegex =
      /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) {
      return "Please enter a valid email address.";
    }

    if (blockedCharacters.test(email)) {
      return "Email contains invalid characters.";
    }

    if (!phone) {
      return "Phone number is required.";
    }

    if (!/^\d{10,15}$/.test(phone)) {
      return "Phone number must contain 10 to 15 digits.";
    }

    if (!formData.dateOfBirth) {
      return "Date of birth is required.";
    }

    if (!address) {
      return "Address is required.";
    }

    if (blockedCharacters.test(address)) {
      return "Address contains invalid characters.";
    }

    if (!course) {
      return "Course enrolled is required.";
    }

    if (blockedCharacters.test(course)) {
      return "Course contains invalid characters.";
    }

    if (!selectedStudent && !password) {
      return "Password is required.";
    }

    if (password && password.length < 6) {
      return "Password must be at least 6 characters.";
    }

    if (password && blockedCharacters.test(password)) {
      return "Password contains invalid characters.";
    }

    return null;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setMessage({
        type: "error",
        text: validationError,
      });
      return;
    }
    setLoading(true);
    setMessage({
      type: "",
      text: "",
    });

    try {
      const encryptedPayload = {
        fullName: encryptFrontend(formData.fullName.trim()),
        email: formData.email.trim().toLowerCase(),
        phoneNumber: encryptFrontend(
          formData.phoneNumber.trim()
        ),

        dateOfBirth: encryptFrontend(formData.dateOfBirth),
        gender: formData.gender,
        address: encryptFrontend(formData.address.trim()),
        courseEnrolled: encryptFrontend(
          formData.courseEnrolled.trim()
        ),
      };

      if (!selectedStudent || formData.password) {
        encryptedPayload.password = encryptFrontend(
          formData.password
        );
      }

      if (selectedStudent?._id) {
        await axios.put(
          `${API_URL}/student/${selectedStudent._id}`,
          encryptedPayload
        );

        setMessage({
          type: "success",
          text: "Student details updated successfully.",
        });
      } else {
        await axios.post(
          `${API_URL}/register`,
          encryptedPayload
        );

        setMessage({
          type: "success",
          text: "Student registered successfully.",
        });
      }

      if (refreshList) {
        refreshList();
      }

      setFormData(initialForm);
      setShowPassword(false);

      if (clearSelection) {
        setTimeout(() => {
          clearSelection();
        }, 700);
      }
    } catch (error) {
      console.error("Student operation error:", error);
      setMessage({
        type: "error",
        text:
          error.response?.data?.error ||
          "Something went wrong. Please try again.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    resetForm();

    if (clearSelection) {
      clearSelection();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="mx-auto w-full max-w-9xl"
    >
      <div className="relative overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1120] shadow-2xl shadow-black/30">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-32 -top-32 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute -bottom-32 -right-32 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />

          <motion.div
            animate={{
              x: [0, 25, 0],
              y: [0, -20, 0],
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-20 top-10 h-24 w-24 rounded-full border border-indigo-500/10"
          />
        </div>

        <div className="relative border-b border-slate-800/80 px-6 py-7 sm:px-8">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-4">
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                className="relative flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-600/20"
              >
                {selectedStudent ? (
                  <UserCheck className="h-7 w-7" />
                ) : (
                  <UserPlus className="h-7 w-7" />
                )}
              </motion.div>

              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-white sm:text-2xl">
                    {selectedStudent
                      ? "Edit Student"
                      : "Register Student"}
                  </h2>

                  <span className="rounded-full border border-indigo-500/20 bg-indigo-500/10 px-2.5 py-1 text-[9px] font-bold uppercase tracking-wider text-indigo-300">
                    Secure Form
                  </span>
                </div>

                <p className="mt-1 text-xs text-slate-400">
                  {selectedStudent
                    ? "Update the student's information securely."
                    : "Create a protected student record with encrypted data."}
                </p>
              </div>
            </div>

            {selectedStudent && (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={handleCancel}
                className="flex items-center justify-center gap-2 rounded-xl cursor-pointer border border-slate-700 bg-slate-900 px-4 py-2.5 text-xs font-semibold text-slate-300 transition hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-400"
              >
                <X className="h-4 w-4" />
                Cancel
              </motion.button>
            )}
          </div>
        </div>

        <AnimatePresence mode="wait">
          {message.text && (
            <motion.div
              initial={{ opacity: 0, y: -10, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -10, height: 0 }}
              className="relative px-6 pt-5 sm:px-8"
            >
              <div className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-sm ${message.type === "success"
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-300"
                  : "border-red-500/20 bg-red-500/10 text-red-300"
                }`}
              >
                {message.type === "success" ? (
                  <CheckCircle2 className="h-5 w-5 shrink-0" />
                ) : (
                  <AlertCircle className="h-5 w-5 shrink-0" />
                )}

                <span>{message.text}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <form
          onSubmit={handleSubmit}
          className="relative space-y-8 p-6 sm:p-8"
        >
          <section>
            <div className="mb-5 flex items-center gap-3">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-500/10 text-indigo-400">
                <User className="h-4 w-4" />
              </div>

              <div>
                <h3 className="text-sm font-bold text-white">
                  Personal Information
                </h3>

                <p className="text-[11px] text-slate-500">
                  Basic student information
                </p>
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="mb-2 block text-xs font-semibold text-slate-300">
                  Full Name
                </label>

                <div className="group relative">
                  <User className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-focus-within:text-indigo-400" />

                  <input
                    type="text"
                    name="fullName"
                    required
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Jane Doe"
                    autoComplete="name"
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-900 px-10 py-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </motion.div>

              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="mb-2 block text-xs font-semibold text-slate-300">
                  Email Address
                </label>

                <div className="group relative">
                  <Mail className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-focus-within:text-indigo-400" />

                  <input
                    type="email"
                    name="email"
                    required
                    disabled={!!selectedStudent}
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="jane@example.com"
                    autoComplete="email"
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-900 px-10 py-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 disabled:cursor-not-allowed disabled:bg-slate-950 disabled:text-slate-500 disabled:opacity-70"
                  />
                </div>
              </motion.div>

              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="mb-2 block text-xs font-semibold text-slate-300">
                  Phone Number
                </label>

                <div className="group relative">
                  <Phone className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-focus-within:text-indigo-400" />

                  <input
                    type="tel"
                    name="phoneNumber"
                    required
                    inputMode="numeric"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                    placeholder="9876543210"
                    autoComplete="tel"
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-900 px-10 py-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </motion.div>

              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="mb-2 block text-xs font-semibold text-slate-300">
                  Date of Birth
                </label>

                <div className="group relative">
                  <Calendar className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-focus-within:text-indigo-400" />

                  <input
                    type="date"
                    name="dateOfBirth"
                    required
                    value={formData.dateOfBirth}
                    onChange={handleChange}
                    onClick={(e) => e.currentTarget.showPicker?.()}
                    className="w-full cursor-pointer rounded-xl border border-slate-700/80 bg-slate-900 px-10 py-3.5 text-sm text-slate-100 outline-none transition hover:border-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </motion.div>
              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="mb-2 block text-xs font-semibold text-slate-300">
                  Gender
                </label>

                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="w-full appearance-none rounded-xl border border-slate-700/80 bg-slate-900 px-4 py-3.5 text-sm text-slate-100 outline-none transition hover:border-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10"
                >
                  <option value="Male" className="bg-slate-900">
                    Male
                  </option>
                  <option value="Female" className="bg-slate-900">
                    Female
                  </option>
                  <option value="Other" className="bg-slate-900">
                    Other
                  </option>
                </select>
              </motion.div>

              <motion.div
                variants={fieldVariants}
                initial="hidden"
                animate="visible"
              >
                <label className="mb-2 block text-xs font-semibold text-slate-300">
                  Course Enrolled
                </label>

                <div className="group relative">
                  <BookOpen className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-focus-within:text-indigo-400" />

                  <input
                    type="text"
                    name="courseEnrolled"
                    required
                    value={formData.courseEnrolled}
                    onChange={handleChange}
                    placeholder="Computer Science"
                    className="w-full rounded-xl border border-slate-700/80 bg-slate-900 px-10 py-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10"
                  />
                </div>
              </motion.div>
            </div>
          </section>

          <section className="border-t border-slate-800/80 pt-7">
            <div className="mb-4">
              <h3 className="text-sm font-bold text-white">
                Address
              </h3>
              <p className="mt-1 text-[11px] text-slate-500">
                Enter the student's current address
              </p>
            </div>

            <div className="group relative">
              <MapPin className="pointer-events-none absolute left-3.5 top-4 h-4 w-4 text-slate-500 transition group-focus-within:text-indigo-400" />

              <textarea
                name="address"
                required
                rows={3}
                value={formData.address}
                onChange={handleChange}
                placeholder="123 Main Street, City"
                className="w-full resize-none rounded-xl border border-slate-700/80 bg-slate-900 px-10 py-3.5 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10"
              />
            </div>
          </section>

          <section className="border-t border-slate-800/80 pt-7">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <h3 className="flex items-center gap-2 text-sm font-bold text-white">
                  <Lock className="h-4 w-4 text-indigo-400" />
                  Account Password
                </h3>

                <p className="mt-1 text-[11px] text-slate-500">
                  Used for student authentication
                </p>
              </div>

              {selectedStudent && (
                <span className="rounded-full bg-slate-800 px-3 py-1 text-[10px] text-slate-400">
                  Optional while editing
                </span>
              )}
            </div>

            <div className="group relative">
              <Lock className="pointer-events-none absolute left-3.5 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-focus-within:text-indigo-400" />

              <input
                type={showPassword ? "text" : "password"}
                name="password"
                required={!selectedStudent}
                value={formData.password}
                onChange={handleChange}
                placeholder={
                  selectedStudent
                    ? "Enter a new password to change it"
                    : "Minimum 6 characters"
                }
                autoComplete={
                  selectedStudent
                    ? "new-password"
                    : "new-password"
                }
                className="w-full rounded-xl border border-slate-700/80 bg-slate-900 px-10 py-3.5 pr-12 text-sm text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10"
              />

              <button
                type="button"
                onClick={() =>
                  setShowPassword((prev) => !prev)
                }
                className="absolute right-3.5 top-1/2 -translate-y-1/2 rounded-lg p-1 text-slate-500 transition hover:bg-slate-800 hover:text-indigo-400"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
          </section>

          <div className="border-t border-slate-800/80 pt-7">
            <motion.button
              whileHover={{
                scale: loading ? 1 : 1.01,
              }}
              whileTap={{
                scale: loading ? 1 : 0.98,
              }}
              type="submit"
              disabled={loading}
              className="relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-linear-to-r from-indigo-600 to-violet-600 py-4 text-sm font-bold text-white shadow-xl shadow-indigo-600/20 transition hover:from-indigo-500 hover:to-violet-500 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer"
            >
              <span className="absolute inset-0 bg-white/5 opacity-0 transition hover:opacity-100" />
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Processing...
                </>
              ) : selectedStudent ? (
                <>
                  <UserCheck className="h-5 w-5" />
                  Update Student
                </>
              ) : (
                <>
                  <Sparkles className="h-5 w-5" />
                  Register Student
                </>
              )}
            </motion.button>
          </div>
        </form>
      </div>
    </motion.div>
  );
}