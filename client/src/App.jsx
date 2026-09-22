import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldCheck,
  LogOut,
  UserPlus,
  Users,
  LayoutDashboard,
  Loader2,
  LockKeyhole,
  Database,
  ChevronRight,
  Sparkles,
} from "lucide-react";

import LoginForm from "./components/LoginForm";
import StudentForm from "./components/StudentForm";
import StudentList from "./components/StudentList";

const AUTH_STORAGE_KEY = "secure_student_logged_in";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);

  const [selectedStudent, setSelectedStudent] = useState(null);

  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const [activeTab, setActiveTab] = useState("list");

  // ==========================================
  // RESTORE LOGIN AFTER PAGE REFRESH
  // ==========================================

  useEffect(() => {
    const savedLogin = localStorage.getItem(AUTH_STORAGE_KEY);

    if (savedLogin === "true") {
      setIsLoggedIn(true);
    }

    setCheckingAuth(false);
  }, []);

  // ==========================================
  // REFRESH STUDENT LIST
  // ==========================================

  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  // ==========================================
  // LOGIN SUCCESS
  // ==========================================

  const handleLoginSuccess = () => {
    localStorage.setItem(AUTH_STORAGE_KEY, "true");

    setIsLoggedIn(true);
    setActiveTab("list");
    setSelectedStudent(null);
  };

  // ==========================================
  // EDIT STUDENT
  // ==========================================

  const handleEdit = (student) => {
    setSelectedStudent(student);
    setActiveTab("form");
  };

  // ==========================================
  // ADD STUDENT
  // ==========================================

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setActiveTab("form");
  };

  // ==========================================
  // CLEAR SELECTION
  // ==========================================

  const handleClearSelection = () => {
    setSelectedStudent(null);
    setActiveTab("list");
  };

  // ==========================================
  // LOGOUT
  // ==========================================

  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);

    setIsLoggedIn(false);
    setSelectedStudent(null);
    setActiveTab("list");
  };

  // ==========================================
  // LOADING SCREEN
  // ==========================================

  if (checkingAuth) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950">
        {/* Background glow */}
        <div className="absolute left-1/2 top-1/2 h-96 w-96 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-3xl" />

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex flex-col items-center gap-5"
        >
          <motion.div
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.04, 1],
            }}
            transition={{
              duration: 2.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 text-white shadow-2xl shadow-indigo-600/30"
          >
            <ShieldCheck className="h-8 w-8" />

            <motion.div
              animate={{ opacity: [0.3, 0.7, 0.3] }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 rounded-2xl ring-4 ring-indigo-400/20"
            />
          </motion.div>

          <div className="text-center">
            <h1 className="text-lg font-bold text-white">
              SecureStudent
            </h1>

            <div className="mt-2 flex items-center justify-center gap-2 text-xs text-slate-400">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              Initializing secure workspace...
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  // ==========================================
  // APP
  // ==========================================

  return (
    <div className="min-h-screen overflow-x-hidden bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">

      {/* ==========================================
          GLOBAL DECORATIVE BACKGROUND
      ========================================== */}

      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-96 w-96 rounded-full bg-indigo-500/10 blur-3xl dark:bg-indigo-500/10" />

        <div className="absolute -right-40 top-1/3 h-96 w-96 rounded-full bg-violet-500/10 blur-3xl dark:bg-violet-500/10" />

        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-blue-500/5 blur-3xl" />
      </div>

      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-2xl dark:border-slate-800/70 dark:bg-slate-950/80">

        <div className="mx-auto flex max-w-9xl items-center justify-between px-4 py-3.5 sm:px-6 lg:px-8">

          {/* BRAND */}

          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <motion.div
              whileHover={{
                scale: 1.06,
                rotate: -3,
              }}
              className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25"
            >
              <ShieldCheck className="h-5.5 w-5.5" />

              <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-950" />
              </span>
            </motion.div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-base font-extrabold tracking-tight sm:text-lg">
                  SecureStudent
                </h1>

                <span className="hidden rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-600 sm:inline-flex dark:bg-indigo-950/60 dark:text-indigo-400">
                  Admin
                </span>
              </div>

              <p className="text-[10px] font-medium text-slate-500 dark:text-slate-400">
                Secure Student Management
              </p>
            </div>
          </motion.div>

          {/* RIGHT SIDE */}

          <AnimatePresence mode="wait">
            {isLoggedIn && (
              <motion.div
                key="logged-in"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2"
              >
                {/* Security Status */}

                <div className="hidden items-center gap-2 rounded-xl border border-emerald-200/70 bg-emerald-50 px-3 py-2 text-[10px] font-bold text-emerald-700 sm:flex dark:border-emerald-900/50 dark:bg-emerald-950/30 dark:text-emerald-400">
                  <LockKeyhole className="h-3.5 w-3.5" />
                  Secure Session
                </div>

                {/* Logout */}

                <motion.button
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  onClick={handleLogout}
                  className="group flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2.5 text-xs font-bold text-slate-600 shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-900/50 dark:hover:bg-red-950/30 dark:hover:text-red-400"
                >
                  <LogOut className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />

                  <span className="hidden sm:inline">
                    Logout
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      {/* ==========================================
          MAIN
      ========================================== */}

      <main className="mx-auto max-w-9xl px-4 py-7 sm:px-6 sm:py-9 lg:px-8">

        <AnimatePresence mode="wait">

          {/* ========================================
              LOGIN
          ======================================== */}

          {!isLoggedIn ? (
            <motion.div
              key="login"
              initial={{
                opacity: 0,
                y: 25,
              }}
              animate={{
                opacity: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                y: -25,
              }}
              transition={{
                duration: 0.35,
                ease: "easeOut",
              }}
            >
              <LoginForm
                onLoginSuccess={handleLoginSuccess}
              />
            </motion.div>
          ) : (

            /* ========================================
               DASHBOARD
            ======================================== */

            <motion.div
              key="dashboard"
              initial={{
                opacity: 0,
              }}
              animate={{
                opacity: 1,
              }}
              exit={{
                opacity: 0,
              }}
              className="space-y-6"
            >

              {/* ======================================
                  WELCOME / HERO
              ====================================== */}

              <motion.section
                initial={{
                  opacity: 0,
                  y: 20,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                }}
                className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 p-6 text-white shadow-xl shadow-slate-900/10 sm:p-8"
              >

                {/* Decorative shapes */}

                <div className="pointer-events-none absolute -right-20 -top-32 h-72 w-72 rounded-full bg-indigo-500/20 blur-3xl" />

                <div className="pointer-events-none absolute -bottom-32 right-20 h-64 w-64 rounded-full bg-violet-500/15 blur-3xl" />

                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="absolute right-8 top-8 hidden h-20 w-20 rounded-3xl border border-white/10 bg-white/5 backdrop-blur-sm sm:block"
                />

                <div className="relative z-10 flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">

                  <div className="max-w-2xl">

                    <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-3 py-1.5 text-[10px] font-bold uppercase tracking-[0.16em] text-indigo-200 backdrop-blur-sm">
                      <Sparkles className="h-3.5 w-3.5" />
                      Secure Admin Workspace
                    </div>

                    <h2 className="max-w-xl text-2xl font-black tracking-tight sm:text-3xl lg:text-4xl">
                      Manage your student records
                      <span className="block bg-gradient-to-r from-indigo-300 via-violet-300 to-blue-300 bg-clip-text text-transparent">
                        with confidence.
                      </span>
                    </h2>

                    <p className="mt-3 max-w-xl text-sm leading-6 text-slate-300">
                      Register, update and manage student information
                      through a clean dashboard with encrypted
                      data handling.
                    </p>
                  </div>

                  {/* HERO SECURITY CARD */}

                  <div className="flex shrink-0 items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-md">

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-500/15 text-emerald-300">
                      <ShieldCheck className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Data Protection
                      </p>

                      <p className="mt-0.5 text-sm font-bold text-white">
                        Two-Layer Encryption
                      </p>
                    </div>

                  </div>

                </div>
              </motion.section>

              {/* ======================================
                  DASHBOARD NAVIGATION
              ====================================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                  delay: 0.1,
                }}
                className="flex flex-col gap-4 rounded-[1.75rem] border border-slate-200/80 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:flex-row sm:items-center sm:justify-between"
              >

                {/* TITLE */}

                <div className="flex items-center gap-3">

                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h2 className="text-sm font-extrabold">
                        Student Management
                      </h2>

                      <span className="hidden rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500 sm:inline-flex dark:bg-slate-800 dark:text-slate-400">
                        DASHBOARD
                      </span>
                    </div>

                    <p className="mt-0.5 text-[11px] text-slate-500 dark:text-slate-400">
                      Manage registrations and student records
                    </p>
                  </div>

                </div>

                {/* TABS */}

                <div className="grid w-full grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-slate-950 sm:flex sm:w-auto">

                  {/* STUDENTS */}

                  <button
                    onClick={() => {
                      setActiveTab("list");
                      setSelectedStudent(null);
                    }}
                    className={`relative flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition-all duration-200 sm:min-w-[125px] ${activeTab === "list"
                        ? "bg-white text-indigo-600 shadow-md shadow-slate-200/70 dark:bg-slate-800 dark:text-indigo-400 dark:shadow-none"
                        : "text-slate-500 hover:bg-white/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                      }`}
                  >
                    <Users className="h-4 w-4" />
                    Students
                  </button>

                  {/* ADD / EDIT */}

                  <button
                    onClick={handleAddStudent}
                    className={`relative flex items-center justify-center gap-2 rounded-xl px-4 py-3 text-xs font-bold transition-all duration-200 sm:min-w-[125px] ${activeTab === "form"
                        ? "bg-white text-indigo-600 shadow-md shadow-slate-200/70 dark:bg-slate-800 dark:text-indigo-400 dark:shadow-none"
                        : "text-slate-500 hover:bg-white/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                      }`}
                  >
                    <UserPlus className="h-4 w-4" />

                    {selectedStudent
                      ? "Edit Student"
                      : "Add Student"}
                  </button>

                </div>
              </motion.div>

              {/* ======================================
                  QUICK INFO CARDS
              ====================================== */}

              <motion.div
                initial={{
                  opacity: 0,
                  y: 15,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                transition={{
                  duration: 0.4,
                  delay: 0.15,
                }}
                className="grid grid-cols-1 gap-3 sm:grid-cols-3"
              >

                {/* CARD 1 */}

                <div className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

                  <div className="flex items-center justify-between">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400">
                      <Users className="h-4.5 w-4.5" />
                    </div>

                    <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 dark:text-slate-700" />

                  </div>

                  <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Records
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    Student Database
                  </p>

                </div>

                {/* CARD 2 */}

                <div className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

                  <div className="flex items-center justify-between">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-50 text-violet-600 dark:bg-violet-950/50 dark:text-violet-400">
                      <Database className="h-4.5 w-4.5" />
                    </div>

                    <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 dark:text-slate-700" />

                  </div>

                  <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Storage
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    MongoDB Database
                  </p>

                </div>

                {/* CARD 3 */}

                <div className="group rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-slate-800 dark:bg-slate-900">

                  <div className="flex items-center justify-between">

                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400">
                      <LockKeyhole className="h-4.5 w-4.5" />
                    </div>

                    <ChevronRight className="h-4 w-4 text-slate-300 transition-transform group-hover:translate-x-1 dark:text-slate-700" />

                  </div>

                  <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Security
                  </p>

                  <p className="mt-1 text-sm font-bold">
                    Encrypted Data Flow
                  </p>

                </div>

              </motion.div>

              {/* ======================================
                  CONTENT
              ====================================== */}

              <AnimatePresence mode="wait">

                {activeTab === "form" ? (
                  <motion.div
                    key="form"
                    initial={{
                      opacity: 0,
                      x: -20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: 20,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                  >
                    <StudentForm
                      selectedStudent={selectedStudent}
                      clearSelection={handleClearSelection}
                      refreshList={triggerRefresh}
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="list"
                    initial={{
                      opacity: 0,
                      x: 20,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                    }}
                    exit={{
                      opacity: 0,
                      x: -20,
                    }}
                    transition={{
                      duration: 0.3,
                      ease: "easeOut",
                    }}
                  >
                    <StudentList
                      onEdit={handleEdit}
                      refreshTrigger={refreshTrigger}
                      triggerRefresh={triggerRefresh}
                    />
                  </motion.div>
                )}

              </AnimatePresence>

            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* ==========================================
          FOOTER
      ========================================== */}

      <footer className="mx-auto max-w-9xl px-4 pb-7 sm:px-6 lg:px-8">

        <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-200/70 pt-5 text-center sm:flex-row sm:text-left dark:border-slate-800">

          <p className="text-[10px] font-medium text-slate-400">
            SecureStudent Management System
          </p>

          <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            Protected workspace
          </div>

        </div>

      </footer>
    </div>
  );
}