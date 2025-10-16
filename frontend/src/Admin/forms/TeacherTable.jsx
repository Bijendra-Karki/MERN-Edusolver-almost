"use client";

import { useEffect, useState } from "react";
import axios from "axios";

import { getToken } from "../../components/utils/authHelper";

const TeacherTable = () => {
  const [teachers, setTeachers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");


  // --- Data Fetching and Authentication ---
  useEffect(() => {
    const fetchTeachers = async () => {
      setLoading(true);
      setError(null);
      let token = null;

      try {

        token = getToken();
      } catch (e) {
        setError("Token data is corrupted. Please log in.");
        setLoading(false);
        return;
      }

      if (!token) {
        setError("Authentication token not found. Please log in.");
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get("api/auth/user/list", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const usersData = response.data?.users || response.data;

        if (Array.isArray(usersData)) {
          // 🛑 CHANGE: Set to teachers state
          setTeachers(usersData);
        } else {
          setTeachers([]);
        }
      } catch (err) {
        console.error("Failed to fetch teachers:", err);
        const status = err.response?.status;

        if (status === 401 || status === 403) {
          setError("Access Denied: You are not authorized.");
        } else {
          setError("Failed to load users due to a network or server issue.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeachers();
  }, []);

  // --- Filtering and Sorting Logic ---
  // 🛑 CHANGE: Filter for the 'expert' role
  const filteredTeachers = teachers.filter((user) => user.role === "expert");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedTeachers = [...filteredTeachers].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    // Handles numeric or boolean fields (like 'is_active')
    return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
  });

  // --- Helper Functions ---

  // Determine badge color based on is_active boolean
  const getIsActiveBadge = (isActive) => {
    const active = !!isActive;

    if (active) {
      return "bg-emerald-100 text-emerald-700 border border-emerald-200"; // Green for Active
    }
    return "bg-rose-100 text-rose-700 border border-rose-200"; // Red for Inactive
  };

  const getSortIcon = (field) => {
    if (sortField !== field) return "↕️";
    return sortDirection === "asc" ? "↑" : "↓";
  };

  // --- Render ---
  return (
    <div className="bg-slate-50 rounded-lg shadow-sm border border-slate-200 p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Teacher/Expert Details
          </h1>

        </div>

        {/* --- Loading and Error Messages --- */}
        {loading && (
          <div className="text-center p-8 text-xl text-blue-500">
            Loading teachers... ⏳
          </div>
        )}
        {error && (
          <div className="text-center p-8 text-xl text-red-600 font-semibold">
            Error: {error} ❌
          </div>
        )}

        {/* --- Table Content --- */}
        {!loading && !error && sortedTeachers.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors"
                      onClick={() => handleSort("name")}
                    >
                      Name {getSortIcon("name")}
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors"
                      onClick={() => handleSort("email")}
                    >
                      Email {getSortIcon("email")}
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors"
                      onClick={() => handleSort("specialization")}
                    >
                      Specialization {getSortIcon("specialization")}
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors"
                      onClick={() => handleSort("experience")}
                    >
                      Experience {getSortIcon("experience")}
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors"
                      onClick={() => handleSort("qualification")}
                    >
                      Qualification {getSortIcon("qualification")}
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors"
                      onClick={() => handleSort("is_active")}
                    >
                      Online Status {getSortIcon("is_active")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sortedTeachers.map((teacher, index) => (
                    <tr
                      key={teacher.id || teacher._id || index}
                      className={`hover:bg-slate-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                        }`}
                    >
                      <td className="px-4 py-4 text-sm text-slate-900 font-medium">
                        {teacher.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {teacher.email}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-900">
                        {teacher.specialization || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-900">
                        {teacher.experience || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-900">
                        {teacher.qualification || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIsActiveBadge(
                            teacher.is_active
                          )}`}
                        >
                          {teacher.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* --- No Data Message --- */}
        {!loading && !error && filteredTeachers.length === 0 && (
          <div className="text-center p-8 text-xl text-slate-500">
            No teachers/experts found . 🧐
          </div>
        )}

        {/* --- Display count --- */}
        {!loading && !error && filteredTeachers.length > 0 && (
          <div className="mt-4 text-sm text-slate-600">
            Showing {filteredTeachers.length} teachers
          </div>
        )}
      </div>
    </div>
  );
};

export default TeacherTable;