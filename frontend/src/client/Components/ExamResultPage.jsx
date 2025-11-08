"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { getToken } from "../../components/utils/authHelper";
import { CheckCircle, XCircle, Users, Clock } from "lucide-react";
import ExamResultsChart from "./ExamResultsChart"; // Assuming this component exists and accepts 'results'

// Helper function to format completion date
const formatCompletedAt = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
    }).replace(',', '');
};

export default function ExamResultsPage() {
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const token = getToken();

    const config = { headers: { Authorization: `Bearer ${token}` } };

    useEffect(() => {
        const fetchResults = async () => {
            if (!token) {
                setError("Authorization token not found.");
                setLoading(false);
                return;
            }
            try {
                setLoading(true);
                const res = await axios.get("/api/exam-attempts/studentResults", config);

                const processedData = res.data.map(attempt => ({
                    ...attempt,
                    // Ensure percentage is a number for consistent formatting
                    percentage: Number(attempt.percentage),
                }));

                setResults(processedData);
            } catch (err) {
                setError(err.response?.data?.message || "Failed to load exam results");
            } finally {
                setLoading(false);
            }
        };
        fetchResults();
    }, [token]);

    if (loading) return <div className="p-10 text-center text-indigo-600 font-medium">Loading exam results...</div>;
    if (error) return <div className="p-10 text-center text-red-500 font-semibold border-2 border-red-200 bg-red-50 rounded-lg">{error}</div>;
    if (!results.length) return <div className="p-10 text-center text-gray-500 bg-white rounded-lg shadow">No exam results found.</div>;

    return (
        <div className="min-h-screen bg-gray-50">

            {/* --- Chart and Summary Container --- */}
            <div className="mb-10 p-6 bg-white rounded-xl shadow-lg border border-indigo-100">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Performance Overview</h2>
                <div className="h-96">
                    {/* Ensure the chart component scales correctly */}
                    <ExamResultsChart results={results} />
                </div>
            </div>

            {/* --- Individual Result Cards Header --- */}
            <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Detailed Attempt History</h2>

            {/* --- Individual Result Cards --- */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {results.map((attempt) => {
                    const examTitle = attempt.examSet?.setName || attempt.examSet?.exam_tittle || "Set N/A";
                    const displayTitle = examTitle.includes('Set') ? examTitle : `Set: ${examTitle}`;
                    const percentageValue = attempt.percentage.toFixed(2);
                    const isPassed = attempt.percentage >= 50;
                    const resultColor = isPassed ? 'text-green-600' : 'text-red-600';
                    const resultBg = isPassed ? 'bg-green-50' : 'bg-red-50';
                    const borderColor = isPassed ? 'border-green-400' : 'border-red-400';

                    return (
                        <div
                            key={attempt._id}
                            className={`bg-white rounded-xl shadow-lg p-6 transition-all duration-300 hover:shadow-xl border-l-4 ${borderColor}`}
                        >
                            <div className="mb-4 pb-3 border-b border-gray-100">
                                <h2 className="font-extrabold text-2xl text-indigo-700">{displayTitle}</h2>
                                <p className="text-sm text-gray-500 mt-1">
                                    <span className="font-medium">Subject:</span> {attempt.examSet?.subject_id?.title || "N/A"}
                                </p>
                                <p className="text-sm text-gray-500">
                                    <span className="font-medium">Exam:</span> {attempt.examSet?.exam_tittle || "N/A"}
                                </p>
                            </div>

                            <div className="flex items-center text-gray-600 mb-4">
                                <Users className="w-4 h-4 mr-2 text-indigo-500" />
                                <div>
                                    <p className="font-semibold text-sm">{attempt.student?.name || "User Name N/A"}</p>
                                    <p className="text-xs text-gray-400">{attempt.student?.email || "user@test.com"}</p>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-y-3 text-sm text-gray-700 mb-4">
                                <p><span className="font-semibold">Total Marks:</span></p>
                                <p className="text-right font-medium text-gray-800">{attempt.totalMarks}</p>

                                <p><span className="font-semibold">Obtained Marks:</span></p>
                                <p className="text-right font-medium text-indigo-600">{attempt.obtainedMarks}</p>

                                <p className="flex items-center"><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Correct Answers:</p>
                                <p className="text-right font-medium text-green-600">{attempt.correctAnswers}</p>

                                <p className="flex items-center"><XCircle className="w-4 h-4 mr-2 text-red-500" /> Wrong Answers:</p>
                                <p className="text-right font-medium text-red-600">{attempt.wrongAnswers}</p>
                            </div>

                            <hr className="my-4 border-dashed border-gray-200" />

                            <div className={`p-3 rounded-lg flex justify-between items-center ${resultBg}`}>
                                <p className={`font-bold text-xl ${resultColor}`}>{percentageValue}%</p>
                                <p className="text-xs text-gray-500 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {formatCompletedAt(attempt.completedAt)}
                                </p>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}