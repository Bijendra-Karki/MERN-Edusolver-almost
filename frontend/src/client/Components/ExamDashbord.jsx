"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
// Added icons for statistics and visual flair
import { BookOpen, Clock, Target, ChevronDown, ChevronUp, Layers, Zap, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getToken } from "../../components/utils/authHelper";
import ExamResultsPage from "./ExamResultPage"; // Assuming this is correct

// --- Helper Components for Theming ---

const StatCard = ({ title, value, icon: Icon, color }) => (
  <div className="bg-white p-5 rounded-xl shadow-md border-b-4" style={{ borderColor: color }}>
    <div className="flex justify-between items-center">
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <Icon className={`w-5 h-5`} style={{ color }} />
    </div>
    <p className="text-3xl font-bold text-gray-900 mt-1">{value}</p>
  </div>
);

// --- Main Dashboard Component ---

export default function ExamDashboard() {
  const [examList, setExamList] = useState([]);
  const [expandedExam, setExpandedExam] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = getToken();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  };

  useEffect(() => {
    const fetchExams = async () => {
      if (!token) {
        setError("Authorization token is missing. Please log in.");
        setLoading(false);
        return;
      }
      try {
        // 1. Fetch Enrolled Subjects
        const enrollRes = await axios.get("/api/enrollments/my", config);
        const enrolledSubjectIds = enrollRes.data.map((en) => en.subject_id?._id).filter(id => id);

        // 2. Fetch All Exams
        const examRes = await axios.get("/api/exams/examList", config);

        // 3. Filter Exams by Enrollment
        const filteredExams = examRes.data.filter((exam) =>
          enrolledSubjectIds.includes(exam.subject_id?._id)
        );

        setExamList(filteredExams);

        // Initialize all exams as expanded
        setExpandedExam(filteredExams.reduce((acc, e) => ({ ...acc, [e._id]: true }), {}));
      } catch (err) {
        console.error("Error fetching dashboard data:", err);
        setError(err.response?.data?.message || "Failed to load dashboard data. Server error.");
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, [token]);

  const toggleExam = (id) => setExpandedExam((prev) => ({ ...prev, [id]: !prev[id] }));

  // --- Statistics Calculation (Including NEW Total Duration and Total Marks) ---
  const totalEnrolledExams = examList.length;
  const totalExamSets = examList.reduce((sum, exam) => sum + (exam.set_ids?.length || 0), 0);



  const totalQuestions = examList.reduce((sum, exam) =>
    sum + (exam.set_ids?.reduce((setSum, set) => setSum + (set.questionCount || 0), 0) || 0)
    , 0);
  const firstExam = examList[0];
  const firstSet = firstExam?.set_ids?.[0];
  const totalMarks = firstSet?.totalMarks || 0;
  const totalDuration = firstSet?.duration || 0;


  // --- Loading/Error/Empty States ---
  if (loading) return <div className="p-10 text-center text-indigo-600 font-medium">Loading your exam dashboard...</div>;
  if (error) return <div className="p-10 text-center text-red-600 font-semibold border-2 border-red-200 bg-red-50 rounded-lg">{error}</div>;

  // --- Main Render ---
  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <h1 className="text-3xl font-extrabold mb-8 text-indigo-800 border-b-2 border-indigo-200 pb-2">
        Student Exam Dashboard
      </h1>

      {/* --- Summary Statistics (Now 5-column grid on medium screens) --- */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6 mb-10">
        <StatCard
          title="Total Enrolled Exams"
          value={totalEnrolledExams}
          icon={BookOpen}
          color="#4F46E5" // Indigo
        />
        <StatCard
          title="Total Exam Sets"
          value={totalExamSets}
          icon={Layers}
          color="#10B981" // Green
        />
        <StatCard
          title="Total Questions"
          value={totalQuestions.toLocaleString()}
          icon={Target}
          color="#EF4444" // Red
        />

        {/* NEW: Total Duration */}
        <StatCard
          title="Total Duration"
          value={`${totalDuration} min`}
          icon={Clock}
          color="#F59E0B" // Amber
        />

        {/* NEW: Total Marks */}
        <StatCard
          title="Total Marks"
          value={totalMarks.toLocaleString()}
          icon={DollarSign} // Using DollarSign to symbolize points/marks
          color="#8B5CF6" // Violet
        />
      </div>

      {/* --- Exam List / Accordion --- */}
      {totalEnrolledExams === 0 ? (
        <div className="p-10 text-center text-gray-500 bg-white rounded-lg shadow-md">
          You are not currently enrolled in any exams.
        </div>
      ) : (
        <div className="space-y-5">
          <h2 className="text-2xl font-bold text-gray-800 border-b pb-2">Available Exams</h2>
          {examList.map((exam) => {
            const isExpanded = expandedExam[exam._id] ?? true;
            return (
              <div key={exam._id} className="border-2 border-gray-100 rounded-xl shadow-lg bg-white transition-all duration-300 hover:shadow-xl">
                {/* Accordion Header */}
                <div
                  className="p-5 flex justify-between items-center cursor-pointer hover:bg-indigo-50/20 rounded-t-xl transition-colors"
                  onClick={() => toggleExam(exam._id)}
                >
                  <div className="flex items-center">
                    <Zap className="w-5 h-5 mr-3 text-indigo-600" />
                    <div>
                      <h2 className="font-extrabold text-xl text-gray-900">
                        {exam.subject_id?.title || "N/A Subject"}
                      </h2>
                      <p className="text-sm text-indigo-600 font-semibold mt-0.5">{exam.title || "Exam Title N/A"}</p>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-600">
                    <span className="text-sm font-medium mr-4 hidden sm:inline">Sets: {exam.set_ids?.length || 0}</span>
                    {isExpanded ? <ChevronUp className="w-5 h-5 text-indigo-600" /> : <ChevronDown className="w-5 h-5 text-indigo-600" />}
                  </div>
                </div>

                {/* Accordion Content: Exam Sets */}
                {isExpanded && (
                  <div className="p-5 pt-3 border-t border-gray-200 bg-gray-50 rounded-b-xl">
                    <p className="text-sm font-semibold mb-3 text-gray-600">Select an Exam Set to Begin:</p>
                    <div className="space-y-3">
                      {exam.set_ids.map((s) => (
                        <div
                          key={s._id}
                          className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
                        >
                          <div>
                            <p className="font-semibold text-gray-800">Set {s.setName || 'N/A'}: {s.description}</p>
                            <p className="text-xs text-gray-500 mt-1">
                              <span className="font-bold">Marks:</span> {s.totalMarks} |
                              <span className="font-bold ml-2">Duration:</span> {s.duration} min |
                              <span className="font-bold ml-2">Questions:</span> {s.questionCount}
                            </p>
                          </div>
                          <button
                            className="mt-3 sm:mt-0 bg-indigo-600 text-white px-4 py-2 rounded-lg font-medium text-sm hover:bg-indigo-700 transition-colors shadow-md"
                            onClick={() => navigate(`/exam/${s._id}`)}
                          >
                            Start Exam
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* --- Results Section (Kept separate as per original structure) --- */}
      <h1 className="text-3xl font-extrabold mb-6 mt-12 text-indigo-800 border-b-2 border-indigo-200 pb-2">
        My Exam History & Results
      </h1>
      <ExamResultsPage />
    </div>
  );
}