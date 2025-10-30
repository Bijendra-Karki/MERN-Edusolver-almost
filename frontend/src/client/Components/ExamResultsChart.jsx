"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function ExamResultsChart({ results }) {
  if (!results?.length) return null;

  const data = results.map((attempt) => ({
    exam: attempt.examSet?.setName || attempt.examSet?.exam_tittle || "Set N/A",
    Total: attempt.totalMarks,
    Obtained: attempt.obtainedMarks,
    Correct: attempt.correctAnswers,
    Wrong: attempt.wrongAnswers,
  }));

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-8">
      <h2 className="text-xl font-bold mb-4 text-indigo-700">Exam Results Overview</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="exam" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Total" fill="#4F46E5" />
          <Bar dataKey="Obtained" fill="#10B981" />
          <Bar dataKey="Correct" fill="#F59E0B" />
          <Bar dataKey="Wrong" fill="#EF4444" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
