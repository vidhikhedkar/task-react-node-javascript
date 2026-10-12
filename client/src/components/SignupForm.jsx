import React, { useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { UserPlus, User, Mail, Lock, Phone, Calendar, MapPin, BookOpen, Loader2, AlertCircle, ShieldCheck, Eye, EyeOff, Sparkles, ChevronDown, } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8080/api";

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

export default function SignupForm({ onSignupSuccess, onLoginClick }) {
    const [formData, setFormData] = useState(initialForm);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        let sanitizedValue = value;

        if (name === "fullName") {
            sanitizedValue = value.replace(/[0-9<>{}]/g, "");
        } else if (name === "email") {
            sanitizedValue = value.replace(/[^a-zA-Z0-9._%+\-@]/g, "");
            const atIndex = sanitizedValue.indexOf("@");
            if (atIndex !== -1) {
                const beforeAt = sanitizedValue.slice(0, atIndex);
                let afterAt = sanitizedValue.slice(atIndex + 1);
                afterAt = afterAt.replace(/@/g, "");
                sanitizedValue = beforeAt + "@" + afterAt;
            }
        } else if (name === "phoneNumber") {
            sanitizedValue = value.replace(/[^0-9]/g, "");
        } else if (name === "courseEnrolled") {
            sanitizedValue = value.replace(/[<>:"\[\]]/g, "");
        } else if (name === "address") {
            sanitizedValue = value.replace(/[<>]/g, "");
        } else if (name === "password") {
            sanitizedValue = value.replace(/[<>;']/g, "");
        }

        setFormData((prev) => ({
            ...prev,
            [name]: sanitizedValue,
        }));

        setError("");
        setSuccess("");
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        const email = formData.email.trim().toLowerCase();
        const password = formData.password;

        if (password.length < 8) {
            setError("Password must be at least 8 characters long.");
            return;
        }

        const emailRegex =
            /^[a-zA-Z0-9](?:[a-zA-Z0-9._%+-]*[a-zA-Z0-9])?@[a-zA-Z0-9](?:[a-zA-Z0-9.-]*[a-zA-Z0-9])?\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            setError("Please enter a valid email address.");
            return;
        }

        setLoading(true);

        try {
            await axios.post(`${API_URL}/register`, {
                ...formData,
                fullName: formData.fullName.trim(),
                email,
                phoneNumber: formData.phoneNumber.trim(),
                address: formData.address.trim(),
                courseEnrolled: formData.courseEnrolled.trim(),
            });

            setFormData(initialForm);
            setSuccess("Account created successfully!");

            if (onSignupSuccess) {
                onSignupSuccess();
            }
        } catch (err) {
            setError(
                err.response?.data?.error ||
                "Unable to create your account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    const inputClass =
        "w-full rounded-2xl border border-white/9 bg-white/[0.035] py-3 pl-11 pr-4 text-sm text-white outline-none transition-all placeholder:text-slate-600 hover:border-white/15 focus:border-indigo-500/60 focus:bg-white/5 focus:ring-4 focus:ring-indigo-500/10";

    const fields = [
        {
            name: "fullName",
            label: "Full name",
            placeholder: "Enter your full name",
            icon: User,
            type: "text",
            autoComplete: "name",
        },
        {
            name: "email",
            label: "Email address",
            placeholder: "you@example.com",
            icon: Mail,
            type: "email",
            autoComplete: "email",
        },
        {
            name: "phoneNumber",
            label: "Phone number",
            placeholder: "Enter phone number",
            icon: Phone,
            type: "tel",
            autoComplete: "tel",
        },
        {
            name: "dateOfBirth",
            label: "Date of birth",
            icon: Calendar,
            type: "date",
        },
        {
            name: "courseEnrolled",
            label: "Course enrolled",
            placeholder: "e.g. Computer Science",
            icon: BookOpen,
            type: "text",
        },
    ];

    return (
        <div className="relative flex min-h-[calc(100vh-80px)] items-center justify-center overflow-hidden bg-[#070A13] px-4 py-8">
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
                className="relative z-10 w-full max-w-2xl"
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
                                <UserPlus className="h-8 w-8 text-white" />
                            </div>
                        </motion.div>
                    </div>

                    <div className="mt-6 text-center">
                        <div className="mb-2 flex items-center justify-center gap-2">
                            <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
                                Create your account
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
                            Enter your details to register.
                        </p>
                    </div>

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -8, height: 0 }}
                                className="mt-6 overflow-hidden"
                            >
                                <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-500/8 p-4 text-sm text-red-300">
                                    <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
                                    <span>{error}</span>
                                </div>
                            </motion.div>
                        )}

                        {success && (
                            <motion.div
                                initial={{ opacity: 0, y: -8, height: 0 }}
                                animate={{ opacity: 1, y: 0, height: "auto" }}
                                exit={{ opacity: 0, y: -8, height: 0 }}
                                className="mt-6 overflow-hidden"
                            >
                                <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/8 p-4 text-sm text-emerald-300">
                                    {success}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    <form onSubmit={handleSubmit} className="mt-7 space-y-5">
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            {fields.map((field) => {
                                const Icon = field.icon;

                                return (
                                    <div key={field.name}>
                                        <label
                                            htmlFor={field.name}
                                            className="mb-2 block text-sm font-medium text-slate-300"
                                        >
                                            {field.label}
                                        </label>

                                        <div className="group relative">
                                            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                                <Icon className="h-5 w-5 text-slate-500 transition-colors group-focus-within:text-indigo-400" />
                                            </div>

                                            <input
                                                id={field.name}
                                                name={field.name}
                                                type={field.type}
                                                value={formData[field.name]}
                                                onChange={handleChange}
                                                placeholder={field.placeholder}
                                                autoComplete={field.autoComplete}
                                                required
                                                maxLength={field.name === "phoneNumber" ? 20 : undefined}
                                                className={`${inputClass} ${field.name === "dateOfBirth" ? "scheme-dark" : ""}`}
                                            />
                                        </div>
                                    </div>
                                );
                            })}

                            <div>
                                <label
                                    htmlFor="gender"
                                    className="mb-2 block text-sm font-medium text-slate-300"
                                >
                                    Gender
                                </label>

                                <div className="group relative">
                                    <select
                                        id="gender"
                                        name="gender"
                                        value={formData.gender}
                                        onChange={handleChange}
                                        required
                                        className="h-13 w-full appearance-none rounded-2xl border border-white/9 bg-[#0D111C] px-4 pr-10 text-sm text-white outline-none transition-all hover:border-white/15 focus:border-indigo-500/60 focus:bg-white/5 focus:ring-4 focus:ring-indigo-500/10 cursor-pointer"
                                    >
                                        <option value="Male" className="bg-[#0D111C] text-white py-2">Male</option>
                                        <option value="Female" className="bg-[#0D111C] text-white py-2">Female</option>
                                        <option value="Other" className="bg-[#0D111C] text-white py-2">Other</option>
                                    </select>

                                    <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-4 text-slate-500 transition-colors group-hover:text-slate-300">
                                        <ChevronDown className="h-4.5 w-4.5" />
                                    </div>
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="address"
                                    className="mb-2 block text-sm font-medium text-slate-300"
                                >
                                    Address
                                </label>

                                <div className="group relative">
                                    <div className="pointer-events-none absolute left-0 top-3.5 flex items-start pl-4">
                                        <MapPin className="h-5 w-5 text-slate-500 transition-colors group-focus-within:text-indigo-400" />
                                    </div>

                                    <textarea
                                        id="address"
                                        name="address"
                                        value={formData.address}
                                        onChange={handleChange}
                                        placeholder="Enter your current address"
                                        rows={3}
                                        required
                                        className={`${inputClass} pt-3 resize-y`}
                                    />
                                </div>
                            </div>

                            <div className="sm:col-span-2">
                                <label
                                    htmlFor="password"
                                    className="mb-2 block text-sm font-medium text-slate-300"
                                >
                                    Password
                                </label>

                                <div className="group relative">
                                    <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-4">
                                        <Lock className="h-5 w-5 text-slate-500 transition-colors group-focus-within:text-indigo-400" />
                                    </div>

                                    <input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        placeholder="At least 8 characters"
                                        autoComplete="new-password"
                                        minLength={8}
                                        maxLength={72}
                                        required
                                        className={`${inputClass} pr-12`}
                                    />

                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute inset-y-0 right-0 flex items-center pr-4 cursor-pointer text-slate-500 transition-colors hover:text-indigo-400"
                                        aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4.5 w-4.5" />
                                        ) : (
                                            <Eye className="h-4.5 w-4.5" />
                                        )}
                                    </button>
                                </div>

                                <p className="mt-2 text-xs text-slate-500">
                                    Choose a strong password that you do not use elsewhere.
                                </p>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: loading ? 1 : 1.015 }}
                            whileTap={{ scale: loading ? 1 : 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="group relative mt-2 flex h-13 w-full items-center justify-center cursor-pointer overflow-hidden rounded-2xl bg-linear-to-r from-indigo-600 via-violet-600 to-indigo-600 bg-size-[200%_100%] text-sm font-semibold text-white shadow-xl shadow-indigo-600/20 transition-all duration-500 hover:bg-position-[100%_0] hover:shadow-indigo-500/30 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                            <span className="absolute inset-0 bg-white/10 opacity-0 transition-opacity group-hover:opacity-100" />
                            {loading ? (
                                <Loader2 className="relative h-5 w-5 animate-spin" />
                            ) : (
                                <span className="relative flex items-center gap-2">
                                    <UserPlus className="h-4 w-4" />
                                    Create account
                                </span>
                            )}
                        </motion.button>
                    </form>

                    <div className="mt-6 flex items-center justify-center gap-2 border-t border-white/10 pt-5 text-xs text-slate-400">
                        <ShieldCheck className="h-4 w-4 text-emerald-400" />
                        <span>Your password is securely hashed by the server.</span>
                    </div>

                    <p className="mt-5 text-center text-sm text-slate-400">
                        Already have an account?{" "}
                        <button
                            type="button"
                            onClick={onLoginClick}
                            className="font-semibold text-indigo-400 transition-colors hover:text-indigo-300 cursor-pointer"
                        >
                            Sign in
                        </button>
                    </p>
                </div>
            </motion.div>
        </div>
    );
}