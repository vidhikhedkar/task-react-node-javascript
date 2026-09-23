
import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
import { Users, Search, Pencil, Trash2, RefreshCw, ShieldCheck, AlertTriangle, GraduationCap, Mail, Phone, Calendar, MapPin, X, Loader2, UserRound, Database, } from "lucide-react";
import { decryptFrontend } from "../utils/crypto";

const API_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8080/api";


const safeDecrypt = (value, fieldName = "") => {
  if (!value) return "";
  const stringValue = String(value);
  if (!stringValue.startsWith("U2FsdGVkX1")) {
    console.log(`${fieldName} is already plain text`);
    return stringValue;
  }
  try {
    const decrypted = decryptFrontend(stringValue);
    if (!decrypted) {
      console.error(` ${fieldName} could not be decrypted`);
      return stringValue;
    }
    return decrypted;
  } catch (error) {
    console.error(` ${fieldName} decryption error:`, error);
    return stringValue;
  }
};

export default function StudentList({ onEdit, refreshTrigger, triggerRefresh, }) {
  const [students, setStudents] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [deleteModalId, setDeleteModalId] = useState(null);
  const [error, setError] = useState("");


  const fetchStudents = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${API_URL}/students`);
      const decryptedStudents = response.data.map((student) => ({
        ...student,
        fullName: safeDecrypt(student.fullName, "fullName"),
        phoneNumber: safeDecrypt(student.phoneNumber, "phoneNumber"),
        dateOfBirth: safeDecrypt(student.dateOfBirth, "dateOfBirth"),
        address: safeDecrypt(student.address, "address"),
        courseEnrolled: safeDecrypt(student.courseEnrolled, "courseEnrolled"),
        email: student.email,
        gender: student.gender,
      }));
      setStudents(decryptedStudents);
    } catch (err) {
      console.error("Error fetching students:", err);
      setError(
        err.response?.data?.error ||
        "Unable to fetch student records."
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchStudents();
  }, [refreshTrigger]);


  const confirmDelete = async () => {
    if (!deleteModalId) return;
    setDeletingId(deleteModalId);
    try {
      await axios.delete(`${API_URL}/student/${deleteModalId}`);
      setStudents((prev) =>
        prev.filter(
          (student) =>
            student._id !== deleteModalId
        )
      );
      setDeleteModalId(null);
      if (triggerRefresh) {
        triggerRefresh();
      }
    } catch (err) {
      console.error("Delete error:", err);
      setError(
        err.response?.data?.error ||
        "Failed to delete student."
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredStudents = students.filter(
    (student) => {
      const q = searchQuery
        .trim()
        .toLowerCase();
      if (!q) return true;
      return (
        student.fullName
          ?.toLowerCase()
          .includes(q) ||
        student.email
          ?.toLowerCase()
          .includes(q) ||
        student.courseEnrolled
          ?.toLowerCase()
          .includes(q) ||
        student.phoneNumber
          ?.toLowerCase()
          .includes(q)
      );
    }
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45 }}
      className="mx-auto w-full max-w-9xl"
    >
      <div className="relative overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1120] shadow-2xl shadow-black/30">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-32 -top-32 h-80 w-80 rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute -bottom-32 -left-32 h-80 w-80 rounded-full bg-violet-600/10 blur-3xl" />

          <motion.div
            animate={{
              x: [0, 20, 0],
              y: [0, -15, 0],
            }}
            transition={{
              duration: 9,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute right-40 top-20 h-20 w-20 rounded-full border border-indigo-500/10"
          />
        </div>

        <div className="relative border-b border-slate-800/80 px-3 py-4 sm:px-5 sm:py-5 lg:px-6 lg:py-6">
          <div className="flex flex-col gap-5">
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex min-w-0 w-full items-center gap-3 sm:gap-4 xl:w-auto">
                <motion.div
                  animate={{
                    rotate: [0, 3, -3, 0],
                  }}
                  transition={{
                    duration: 5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500 to-violet-600 text-white shadow-lg shadow-indigo-600/20 sm:h-13 sm:w-13 sm:rounded-2xl lg:h-14 lg:w-14"
                >
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 lg:h-7 lg:w-7" />
                </motion.div>

                <div className="min-w-0 flex-1">
                  <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1.5">
                    <h2 className="min-w-0 truncate text-lg font-bold text-white sm:text-xl lg:text-2xl">
                      Student Directory
                    </h2>

                    <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-1 text-[8px] font-bold tracking-wide text-emerald-400 sm:px-2.5 sm:text-[9px]">
                      <ShieldCheck className="h-3 w-3 shrink-0" />
                      <span className="whitespace-nowrap">
                        2-LAYER SECURE
                      </span>
                    </span>
                  </div>

                  <div className="mt-1.5 flex min-w-0 items-center gap-1.5 text-[10px] text-slate-500 sm:text-xs">
                    <Database className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />
                    <span className="truncate">
                      {students.length} registered{" "}
                      {students.length === 1 ? "student" : "students"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex w-full min-w-0 items-center gap-2 sm:gap-3 xl:max-w-md xl:shrink-0">
                <div className="group relative min-w-0 flex-1">
                  <Search
                    className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition group-focus-within:text-indigo-400 sm:left-3.5"
                  />

                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search students..."
                    className="h-11 w-full min-w-0 rounded-xl border border-slate-700/80 bg-slate-900 pl-9 pr-9 text-xs text-slate-100 outline-none transition placeholder:text-slate-600 hover:border-slate-600 focus:border-indigo-500 focus:bg-slate-900 focus:ring-4 focus:ring-indigo-500/10 sm:h-12 sm:pl-10 sm:pr-10"
                  />

                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="absolute right-2.5 top-1/2 flex -translate-y-1/2 cursor-pointer items-center justify-center rounded-md p-1 text-slate-600 transition hover:bg-slate-800 hover:text-slate-300 sm:right-3"
                      aria-label="Clear search"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                </div>

                <motion.button
                  whileHover={{ scale: loading ? 1 : 1.04 }}
                  whileTap={{ scale: loading ? 1 : 0.96 }}
                  onClick={fetchStudents}
                  disabled={loading}
                  className="flex h-11 w-11 shrink-0 cursor-pointer items-center justify-center rounded-xl border border-slate-700/80 bg-slate-900 text-slate-400 transition hover:border-indigo-500/40 hover:bg-indigo-500/10 hover:text-indigo-400 disabled:cursor-not-allowed disabled:opacity-50 sm:h-12 sm:w-12"
                  title="Refresh students"
                  aria-label="Refresh students"
                >
                  <RefreshCw
                    className={`h-4 w-4 ${loading ? "animate-spin" : ""
                      }`}
                  />
                </motion.button>
              </div>
            </div>


            {!loading && searchQuery && (
              <motion.div
                initial={{
                  opacity: 0,
                  y: -5,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                }}
                className="flex w-full flex-wrap items-center gap-x-1.5 gap-y-1 text-[10px] text-slate-500 sm:text-[11px]"
              >
                <Search className="h-3 w-3 shrink-0 sm:h-3.5 sm:w-3.5" />

                <span>Showing</span>

                <span className="font-semibold text-indigo-400">
                  {filteredStudents.length}
                </span>

                <span>
                  matching{" "}
                  {filteredStudents.length === 1
                    ? "record"
                    : "records"}
                </span>
              </motion.div>
            )}
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{
                opacity: 0,
                height: 0,
              }}
              animate={{
                opacity: 1,
                height: "auto",
              }}
              exit={{
                opacity: 0,
                height: 0,
              }}
              className="relative px-6 pt-5 sm:px-8"
            >
              <div className="flex items-center justify-between gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3.5 text-xs text-red-300">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-4 w-4 shrink-0" />
                  {error}
                </div>

                <button
                  type="button"
                  onClick={() => setError("")}
                  className="rounded-lg p-1 transition hover:bg-red-500/10"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

      <div className="relative p-4 sm:p-6">
          <div className="overflow-hidden rounded-2xl border border-slate-800">
            <div className="overflow-x-auto">
              <table className="w-full min-w-250 text-left">
                <thead>
                  <tr className="border-b border-slate-800 bg-slate-950/70">
                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Student
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Contact
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      DOB / Gender
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Course
                    </th>

                    <th className="px-5 py-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Address
                    </th>

                    <th className="px-5 py-4 text-right text-[10px] font-bold uppercase tracking-wider text-slate-500">
                      Actions
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-slate-800/70">
                  {loading &&
                    [1, 2, 3].map((item) => (
                      <tr key={item}>
                        {[1, 2, 3, 4, 5, 6].map(
                          (col) => (
                            <td
                              key={col}
                              className="px-5 py-5"
                            >
                              <div className="h-4 animate-pulse rounded-lg bg-slate-800" />
                            </td>
                          )
                        )}
                      </tr>
                    ))}

                  {!loading &&
                    filteredStudents.length ===
                    0 && (
                      <tr>
                        <td
                          colSpan="6"
                          className="py-20 text-center"
                        >
                          <motion.div
                            initial={{
                              opacity: 0,
                              scale: 0.95,
                            }}
                            animate={{
                              opacity: 1,
                              scale: 1,
                            }}
                          >
                            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-slate-800 bg-slate-900 text-slate-600">
                              <Users className="h-7 w-7" />
                            </div>

                            <p className="mt-4 text-sm font-semibold text-slate-300">
                              No students found
                            </p>

                            <p className="mt-1 text-xs text-slate-600">
                              {searchQuery
                                ? "Try another search term."
                                : "Register a student to see records here."}
                            </p>
                          </motion.div>
                        </td>
                      </tr>
                    )}

                  {!loading &&
                    filteredStudents.map(
                      (student, index) => (
                        <motion.tr
                          key={student._id}
                          initial={{
                            opacity: 0,
                            y: 8,
                          }}
                          animate={{
                            opacity: 1,
                            y: 0,
                          }}
                          transition={{
                            delay:
                              index * 0.04,
                            duration: 0.3,
                          }}
                          className="group transition-colors hover:bg-indigo-500/[0.035]"
                        >
                          <td className="px-5 py-5">
                            <div className="flex items-center gap-3">
                              <div className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-linear-to-br from-indigo-500/20 to-violet-500/20 text-sm font-bold text-indigo-300 ring-1 ring-indigo-500/10">
                                {student.fullName
                                  ?.charAt(0)
                                  ?.toUpperCase() || (
                                    <UserRound className="h-5 w-5" />
                                  )}
                                
                              </div>

                              <div className="min-w-0">
                                <p className="truncate text-sm font-semibold text-slate-100">
                                  {student.fullName}
                                </p>

                                
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-xs text-slate-300">
                                <Mail className="h-3.5 w-3.5 shrink-0 text-indigo-400" />
                                <span className="max-w-47.5 truncate">
                                  {student.email}
                                </span>
                              </div>

                              <div className="flex items-center gap-2 text-xs text-slate-500">
                                <Phone className="h-3.5 w-3.5 shrink-0 text-slate-600" />
                                {student.phoneNumber}
                              </div>
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex items-center gap-2 text-xs text-slate-400">
                              <Calendar className="h-3.5 w-3.5 text-slate-600" />
                              {student.dateOfBirth}
                            </div>

                            <span className="mt-2 inline-flex rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-[10px] font-semibold text-slate-500">
                              {student.gender}
                            </span>
                          </td>

                          <td className="px-5 py-5">
                            <span className="inline-flex max-w-37.5 items-center gap-1.5 rounded-xl border border-indigo-500/10 bg-indigo-500/10 px-3 py-2 text-xs font-semibold text-indigo-300">
                              <GraduationCap className="h-3.5 w-3.5 shrink-0" />
                              <span className="truncate">
                                {student.courseEnrolled}
                              </span>
                            </span>
                          </td>

                          <td className="max-w-xs px-5 py-5">
                            <div className="flex items-start gap-2 text-xs leading-5 text-slate-500">
                              <MapPin className="mt-0.5 h-3.5 w-3.5 shrink-0 text-slate-600" />
                              <span className="line-clamp-2">
                                {student.address}
                              </span>
                            </div>
                          </td>

                          <td className="px-5 py-5">
                            <div className="flex justify-end gap-2">
                              <motion.button
                                whileHover={{
                                  scale: 1.05,
                                }}
                                whileTap={{
                                  scale: 0.95,
                                }}
                                type="button"
                                onClick={() =>
                                  onEdit(student)
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-indigo-400 transition hover:border-indigo-500/30 hover:bg-indigo-500/10 cursor-pointer"
                                title="Edit student"
                              >
                                <Pencil className="h-4 w-4" />
                              </motion.button>

                              <motion.button
                                whileHover={{
                                  scale: 1.05,
                                }}
                                whileTap={{
                                  scale: 0.95,
                                }}
                                type="button"
                                onClick={() =>
                                  setDeleteModalId(
                                    student._id
                                  )
                                }
                                className="flex h-9 w-9 items-center justify-center rounded-xl border border-slate-800 bg-slate-900 text-red-400 transition hover:border-red-500/30 hover:bg-red-500/10 cursor-pointer"
                                title="Delete student"
                              >
                                <Trash2 className="h-4 w-4" />
                              </motion.button>
                            </div>
                          </td>
                        </motion.tr>
                      )
                    )}
                </tbody>
              </table>
            </div>
          </div>

          {!loading &&
            filteredStudents.length > 0 && (
              <div className="mt-4 flex flex-col gap-2 text-[10px] text-slate-600 sm:flex-row sm:items-center sm:justify-between">
                <span>
                  Showing {filteredStudents.length} of{" "}
                  {students.length} students
                </span>

              </div>
            )}
        </div>
      </div>


      <AnimatePresence>
        {deleteModalId && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-md"
          >
            <motion.div
              initial={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              animate={{
                opacity: 1,
                scale: 1,
                y: 0,
              }}
              exit={{
                opacity: 0,
                scale: 0.9,
                y: 20,
              }}
              className="w-full max-w-md overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1120] shadow-2xl shadow-black/50"
            >
              <div className="relative border-b border-slate-800 px-6 py-6">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-red-500/10 blur-2xl" />

                <div className="relative flex items-center gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-red-500/10 text-red-400 ring-1 ring-red-500/10">
                    <AlertTriangle className="h-6 w-6" />
                  </div>

                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Delete Student?
                    </h3>

                    <p className="mt-1 text-xs text-slate-500">
                      This action cannot be undone.
                    </p>
                  </div>
                </div>
              </div>

              <div className="px-6 py-6">
                <div className="rounded-2xl border border-red-500/10 bg-red-500/5 p-4">
                  <p className="text-sm leading-6 text-slate-400">
                    The selected student record will
                    be permanently removed from the
                    database.
                  </p>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={() =>
                      setDeleteModalId(null)
                    }
                    disabled={!!deletingId}
                    className="flex-1 rounded-xl border border-slate-700 bg-slate-900 px-4 py-3 text-xs font-bold text-slate-300 transition hover:border-slate-600 hover:bg-slate-800 disabled:opacity-50 cursor-pointer"
                  >
                    Cancel
                  </button>

                  <motion.button
                    whileTap={{
                      scale: 0.97,
                    }}
                    type="button"
                    onClick={confirmDelete}
                    disabled={!!deletingId}
                    className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-red-400 px-4 py-3 text-xs font-bold text-white shadow-lg shadow-red-600/20 transition hover:bg-red-500 disabled:opacity-50 cursor-pointer"
                  >
                    {deletingId ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Deleting...
                      </>
                    ) : (
                      <>
                        <Trash2 className="h-4 w-4" />
                        Delete
                      </>
                    )}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}