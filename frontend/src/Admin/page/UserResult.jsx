"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../components/utils/authHelper";
import { AlertCircle, ListOrdered, User, BookOpen } from "lucide-react";

export default function UserResult() {
  const [results, setResults] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = getToken();

  // --- Data Fetching ---
  useEffect(() => {
    if (!token) {
      setAlert({
        type: "error",
        message: "Authentication token missing. Please log in.",
      });
      setLoading(false);
      return;
    }

    const fetchResults = async () => {
      try {
        const res = await axios.get("/api/exam-attempts/studentResults", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setResults(res.data || []);
      } catch (err) {
        console.error("Error fetching student results:", err);
        setAlert({
          type: "error",
          message:
            err.response?.data?.message || "Failed to load exam attempts.",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [token]);

  // --- Helper for formatting date ---
  const formatDateTime = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  // --- UI Render ---
  return (
    <div className="w-full max-w-8xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="bg-white p-6 sm:p-8 rounded-xl shadow-lg border border-gray-100">
        
        {/* Header */}
        <h2 className="text-3xl font-extrabold text-gray-900 mb-6 flex items-center gap-2">
          <ListOrdered className="w-7 h-7 text-indigo-600" /> All Exam Attempts
        </h2>

        {/* Alert/Error Message */}
        {alert && (
          <div className="bg-red-50 text-red-800 p-4 rounded-lg flex items-center gap-3 text-sm font-medium mb-6 border border-red-200">
            <AlertCircle className="w-5 h-5 flex-shrink-0" /> {alert.message}
          </div>
        )}

        {/* Loading State */}
        {loading ? (
          <p className="text-center text-gray-500 py-10">
            Loading student exam attempts...
          </p>
        ) : results.length === 0 && !alert ? (
          /* Empty State */
          <div className="p-10 text-center bg-gray-50 rounded-lg border border-dashed border-gray-300">
            <p className="text-lg font-medium text-gray-500">
              No exam attempts found.
            </p>
            <p className="text-sm text-gray-400 mt-1">
              Attempt data will appear here once students complete an exam.
            </p>
          </div>
        ) : (
          /* Results Table */
          <div className="overflow-x-auto shadow-sm border border-gray-200 rounded-lg">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Student Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Subject
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Exam Set
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Score
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Percentage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Completed At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {results.map((a) => {
                  const percentage = a.percentage || 0;
                  const isPassing = percentage >= 50;

                  return (
                    <tr key={a._id} className="hover:bg-indigo-50 transition duration-150">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        {a.student?.name || "N/A"}
                        {/* Removed email column to keep the table concise, but data is available if needed */}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                        {a.examSet?.subject_id?.title || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-indigo-600 font-medium">
                        <BookOpen className="w-3 h-3 inline mr-1 text-indigo-400" />
                        {a.examSet?.setName || "N/A"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                        <span className={isPassing ? "text-green-600" : "text-red-500"}>
                          {a.obtainedMarks || 0}
                        </span> / {a.totalMarks || "N/A"}
                      </td>
                      <td
                        className={`px-6 py-4 whitespace-nowrap text-sm font-bold ${
                          isPassing ? "text-green-700" : "text-red-600"
                        }`}
                      >
                        {percentage.toFixed(2)}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {formatDateTime(a.completedAt)}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}