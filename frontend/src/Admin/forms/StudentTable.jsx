"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../components/utils/authHelper";

const StudentTable = () => {
  const [students, setStudents] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState("");
  const [sortDirection, setSortDirection] = useState("asc");

  const API_ENDPOINT = "/api/auth/user/list";

  // --- Data Fetching and Authentication ---
  useEffect(() => {
    const fetchStudents = async () => {
      setLoading(true);
      setError(null);
      let token = null;

      try {

        token = getToken();
      } catch (e) {
        // Handles malformed JSON in localStorage
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
        const response = await axios.get(API_ENDPOINT, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        // Use the 'users' array if it exists, otherwise use the whole response data
        const usersData = response.data?.users || response.data;

        if (Array.isArray(usersData)) {
          setStudents(usersData);
        } else {
          setStudents([]);
        }
      } catch (err) {
        console.error("Failed to fetch students:", err);
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

    fetchStudents();
  }, []);

  // --- Filtering and Sorting Logic ---
  // Filter for students (role: "student" assumed to be lowercase based on convention)
  const filteredStudents = students.filter((user) => user.role === "student");

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    if (!sortField) return 0;

    const aValue = a[sortField];
    const bValue = b[sortField];

    if (typeof aValue === "string") {
      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    }
    return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
  });

  // --- Helper Functions ---

  // Green for "Active", Red for others
  const getIsActiveBadge = (isActive) => {
    // Convert isActive to a boolean (it might be null/undefined/0/1 from data)
    const active = !!isActive;

    if (active) {
      return "bg-emerald-100 text-emerald-700 border border-emerald-200"; // Green for Active (true)
    }
    // Red for Inactive (false, null, undefined)
    return "bg-rose-100 text-rose-700 border border-rose-200";
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
            Student Details
          </h1>

        </div>

        {/* --- Loading and Error Messages --- */}
        {loading && (
          <div className="text-center p-8 text-xl text-blue-500">
            Loading students... ⏳
          </div>
        )}
        {error && (
          <div className="text-center p-8 text-xl text-red-600 font-semibold">
            Error: {error} ❌
          </div>
        )}

        {/* --- Table Content --- */}
        {!loading && !error && sortedStudents.length > 0 && (
          <div className="bg-white rounded-lg border border-slate-200 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-100 border-b border-slate-200">
                  <tr>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors"
                      onClick={() => handleSort("id")}
                    >
                      ID {getSortIcon("id")}
                    </th>
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
                      onClick={() => handleSort("age")}
                    >
                      Age {getSortIcon("age")}
                    </th>
                    <th
                      className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider text-slate-700 cursor-pointer hover:bg-slate-200 transition-colors"
                      onClick={() => handleSort("status")}
                    >
                      Status {getSortIcon("status")}
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {sortedStudents.map((student, index) => (
                    <tr
                      key={student.id || student._id || index}
                      className={`hover:bg-slate-50 transition-colors ${index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                        }`}
                    >
                      <td className="px-4 py-4 text-sm text-slate-900 font-medium">
                        {student.id || student._id || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-900 font-medium">
                        {student.name}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-600">
                        {student.email}
                      </td>
                      <td className="px-4 py-4 text-sm text-slate-900">
                        {student.age || "N/A"}
                      </td>
                      <td className="px-4 py-4 text-sm">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getIsActiveBadge(
                            student.is_active
                          )}`}
                        >
                          {student.is_active ? "Active" : "Inactive"}
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
        {!loading && !error && sortedStudents.length === 0 && (
          <div className="text-center p-8 text-xl text-slate-500">
            No students found with the role "student". 🧐
          </div>
        )}

        {/* --- Display count --- */}
        {!loading && !error && sortedStudents.length > 0 && (
          <div className="mt-4 text-sm text-slate-600">
            Showing {sortedStudents.length} students
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentTable;