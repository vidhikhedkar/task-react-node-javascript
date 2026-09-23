import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, LogOut, UserPlus, Users, LayoutDashboard, Loader2, Sparkles, } from "lucide-react";
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


  useEffect(() => {
    const savedLogin = localStorage.getItem(AUTH_STORAGE_KEY);
    if (savedLogin === "true") {
      setIsLoggedIn(true);
    }
    setCheckingAuth(false);
  }, []);



  const triggerRefresh = () => {
    setRefreshTrigger((prev) => prev + 1);
  };



  const handleLoginSuccess = () => {
    localStorage.setItem(AUTH_STORAGE_KEY, "true");
    setIsLoggedIn(true);
    setActiveTab("list");
    setSelectedStudent(null);
  };


  const handleEdit = (student) => {
    setSelectedStudent(student);
    setActiveTab("form");
  };


  const handleAddStudent = () => {
    setSelectedStudent(null);
    setActiveTab("form");
  };

  const handleClearSelection = () => {
    setSelectedStudent(null);
    setActiveTab("list");
  };


  const handleLogout = () => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setIsLoggedIn(false);
    setSelectedStudent(null);
    setActiveTab("list");
  };


  if (checkingAuth) {
    return (
      <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-slate-950 px-4">
        <div className="pointer-events-none absolute left-1/2 top-1/2 h-64 w-64 -translate-x-1/2 -translate-y-1/2 rounded-full bg-indigo-600/20 blur-3xl sm:h-96 sm:w-96" />
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative flex w-full max-w-xs flex-col items-center gap-5 text-center"
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
            className="relative flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-2xl shadow-indigo-600/30 sm:h-16 sm:w-16"
          >
            <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8" />
            <motion.div
              animate={{
                opacity: [0.3, 0.7, 0.3],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
              className="absolute inset-0 rounded-2xl ring-4 ring-indigo-400/20"
            />
          </motion.div>

          <div>
            <h1 className="text-base font-bold text-white sm:text-lg">
              SecureStudent
            </h1>

            <div className="mt-2 flex items-center justify-center gap-2 text-[10px] text-slate-400 sm:text-xs">
              <Loader2 className="h-3.5 w-3.5 animate-spin" />
              <span>Initializing secure workspace...</span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen min-w-0 flex-col overflow-x-hidden bg-slate-50 font-sans text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div className="absolute -left-40 -top-40 h-72 w-72 rounded-full bg-indigo-500/10 blur-3xl sm:h-96 sm:w-96" />
        <div className="absolute -right-40 top-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl sm:h-96 sm:w-96" />

        <div className="absolute bottom-0 left-1/3 h-56 w-56 rounded-full bg-blue-500/5 blur-3xl sm:h-72 sm:w-72" />
      </div>

      <header className="sticky top-0 z-50 border-b border-slate-200/70 bg-white/80 backdrop-blur-2xl dark:border-slate-800/70 dark:bg-slate-950/80">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-3 py-3.5 sm:px-5 sm:py-4 lg:px-6 xl:px-8">
          <motion.div
            initial={{
              opacity: 0,
              x: -20,
            }}
            animate={{
              opacity: 1,
              x: 0,
            }}
            className="flex min-w-0 items-center gap-2.5 sm:gap-3"
          >
            <motion.div
              whileHover={{
                scale: 1.06,
                rotate: -3,
              }}
              className="relative flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-600/25 sm:h-11 sm:w-11 sm:rounded-2xl"
            >
              <ShieldCheck className="h-5 w-5 sm:h-5.5 sm:w-5.5" />

              <span className="absolute -right-1 -top-1 flex h-3.5 w-3.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />

                <span className="relative inline-flex h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500 dark:border-slate-950" />
              </span>
            </motion.div>

            <div className="min-w-0">
              <div className="flex min-w-0 items-center gap-2">
                <h1 className="truncate text-sm font-extrabold tracking-tight sm:text-lg">
                  SecureStudent
                </h1>

                <span className="hidden shrink-0 rounded-full bg-indigo-50 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-indigo-600 sm:inline-flex dark:bg-indigo-950/60 dark:text-indigo-400">
                  Admin
                </span>
              </div>

              <p className="hidden text-[10px] font-medium text-slate-500 dark:text-slate-400 xs:block sm:block">
                Secure Student Management
              </p>
            </div>
          </motion.div>

          <AnimatePresence mode="wait">
            {isLoggedIn && (
              <motion.div
                key="logged-in"
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
                  x: 20,
                }}
                className="flex shrink-0 items-center"
              >
                <motion.button
                  whileHover={{
                    scale: 1.03,
                  }}
                  whileTap={{
                    scale: 0.96,
                  }}
                  onClick={handleLogout}
                  className="group flex h-10 cursor-pointer items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 text-xs font-bold text-slate-600 shadow-sm transition-all duration-200 hover:border-red-200 hover:bg-red-50 hover:text-red-600 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 dark:hover:border-red-900/50 dark:hover:bg-red-950/30 dark:hover:text-red-400 sm:h-auto sm:px-3.5 sm:py-2.5"
                  aria-label="Logout"
                  title="Logout"
                >
                  <LogOut className="h-4 w-4 shrink-0 transition-transform group-hover:-translate-x-0.5" />

                  <span className="hidden sm:inline">
                    Logout
                  </span>
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </header>

      <main className="mx-auto w-full max-w-7xl flex-1 px-3 py-5 sm:px-5">
        <AnimatePresence mode="wait">
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
              className="w-full"
            >
              <LoginForm
                onLoginSuccess={handleLoginSuccess}
              />
            </motion.div>
          ) : (
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
              className="min-w-0 space-y-5 sm:space-y-6"
            >

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
                className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-950 via-indigo-950 to-slate-900 p-5 text-white shadow-xl shadow-slate-900/10 sm:rounded-[1.75rem] sm:p-7 lg:rounded-4xl lg:p-8"
              >

                <div className="pointer-events-none absolute -right-20 -top-32 h-64 w-64 rounded-full bg-indigo-500/20 blur-3xl sm:h-72 sm:w-72" />
                <div className="pointer-events-none absolute -bottom-32 right-10 h-56 w-56 rounded-full bg-violet-500/15 blur-3xl sm:right-20 sm:h-64 sm:w-64" />

                <motion.div
                  animate={{
                    y: [0, -8, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="pointer-events-none absolute right-6 top-6 hidden h-16 w-16 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm md:block lg:right-8 lg:top-8 lg:h-20 lg:w-20 lg:rounded-3xl"
                />

                <div className="relative z-10 flex min-w-0 flex-col gap-6">
                  <div className="min-w-0 max-w-3xl">
                    <div className="mb-3 inline-flex max-w-full items-center gap-2 rounded-full border border-white/10 bg-white/10 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.12em] text-indigo-200 backdrop-blur-sm sm:mb-4 sm:px-3 sm:text-[10px] sm:tracking-[0.16em]">
                      <Sparkles className="h-3.5 w-3.5 shrink-0" />
                      <span className="truncate">
                        Secure Admin Workspace
                      </span>
                    </div>

                    <h2 className="text-xl font-black leading-tight tracking-tight sm:text-3xl">
                      Manage your student records{" "}
                      <span className="bg-linear-to-r from-indigo-300 via-violet-300 to-blue-300 bg-clip-text text-transparent">
                        with confidence.
                      </span>
                    </h2>

                    <p className="mt-3 max-w-2xl text-xs leading-5 text-slate-300 sm:text-sm sm:leading-6">
                      Register, update and manage student information
                      through a clean dashboard with encrypted data
                      handling.
                    </p>
                  </div>
                </div>
              </motion.section>

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
                className="flex min-w-0 flex-col gap-4 rounded-3xl border border-slate-200/80 bg-white p-3.5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:rounded-[1.75rem] sm:p-4 lg:flex-row lg:items-center lg:justify-between"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 sm:h-11 sm:w-11">
                    <LayoutDashboard className="h-5 w-5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex min-w-0 items-center gap-2">
                      <h2 className="truncate text-sm font-extrabold">
                        Student Management
                      </h2>

                      <span className="hidden shrink-0 rounded-full bg-slate-100 px-2 py-0.5 text-[9px] font-bold text-slate-500 sm:inline-flex dark:bg-slate-800 dark:text-slate-400">
                        DASHBOARD
                      </span>
                    </div>

                    <p className="mt-0.5 truncate text-[10px] text-slate-500 dark:text-slate-400 sm:text-[11px]">
                      Manage registrations and student records
                    </p>
                  </div>
                </div>

                <div className="grid w-full grid-cols-2 gap-1 rounded-2xl bg-slate-100 p-1 dark:bg-slate-950 lg:w-auto lg:min-w-65">
                  <button
                    onClick={() => {
                      setActiveTab("list");
                      setSelectedStudent(null);
                    }}
                    className={`relative flex min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-[11px] font-bold transition-all duration-200 sm:gap-2 sm:px-4 sm:text-xs ${activeTab === "list"
                      ? "bg-white text-indigo-600 shadow-md shadow-slate-200/70 dark:bg-slate-800 dark:text-indigo-400 dark:shadow-none"
                      : "text-slate-500 hover:bg-white/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                      }`}
                  >
                    <Users className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      Students
                    </span>
                  </button>

                  <button
                    onClick={handleAddStudent}
                    className={`relative flex min-w-0 cursor-pointer items-center justify-center gap-1.5 rounded-xl px-2 py-3 text-[11px] font-bold transition-all duration-200 sm:gap-2 sm:px-4 sm:text-xs ${activeTab === "form"
                      ? "bg-white text-indigo-600 shadow-md shadow-slate-200/70 dark:bg-slate-800 dark:text-indigo-400 dark:shadow-none"
                      : "text-slate-500 hover:bg-white/60 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-900 dark:hover:text-white"
                      }`}
                  >
                    <UserPlus className="h-4 w-4 shrink-0" />
                    <span className="truncate">
                      {selectedStudent
                        ? "Edit Student"
                        : "Add Student"}
                    </span>
                  </button>
                </div>
              </motion.div>

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
                    className="min-w-0 w-full"
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
                    className="min-w-0 w-full"
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

      <footer className="mx-auto w-full max-w-7xl px-3 pb-4 sm:px-5 sm:pb-5 lg:px-6 xl:px-8">
        <div className="flex flex-col items-center justify-between gap-2 border-t border-slate-200/70 pt-4 text-center sm:flex-row sm:pt-5 sm:text-left dark:border-slate-800">
          <p className="text-[10px] font-medium text-slate-400">
            SecureStudent Management System
          </p>

          <div className="flex items-center gap-2 text-[10px] font-medium text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
            <span>
              Protected workspace created <span className="font-bold text-white">by Vidhi</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}