"use client";

import React from "react";
import { CheckCircle2, XCircle, Clock } from "lucide-react";

// --- Custom Tailwind Components to replace Shadcn/ui ---

const Card = ({ children, className = '' }) => (
  <div className={`rounded-xl border bg-white shadow-md transition-shadow duration-300 ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-4 border-b ${className}`}>
    {children}
  </div>
);
const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-sm font-medium tracking-tight text-gray-500 ${className}`}>
    {children}
  </h3>
);
const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 pt-3 ${className}`}>
    {children}
  </div>
);


// --- Main Component ---

interface ResultsSummaryProps {
  obtainedMarks: number;
  totalMarks: number;
  percentage: number;
  correctCount: number;
  totalQuestions: number;
  timeSpent: string; // e.g., "15:30"
}

export default function ResultsSummary({
  obtainedMarks,
  totalMarks,
  percentage,
  correctCount,
  totalQuestions,
  timeSpent,
}: ResultsSummaryProps) {
  
  // Helper to determine text color based on percentage
  const getPerformanceColor = (percent: number) => {
    if (percent >= 80) return "text-green-600";
    if (percent >= 60) return "text-blue-600";
    if (percent >= 40) return "text-yellow-600";
    return "text-red-600";
  };

  // Helper to determine background color based on percentage
  const getPerformanceBg = (percent: number) => {
    if (percent >= 80) return "bg-green-50 border-green-300";
    if (percent >= 60) return "bg-blue-50 border-blue-300";
    if (percent >= 40) return "bg-yellow-50 border-yellow-300";
    return "bg-red-50 border-red-300";
  };

  const performanceColor = getPerformanceColor(percentage);
  const performanceBg = getPerformanceBg(percentage);
  const incorrectCount = totalQuestions - correctCount;

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
      
      {/* 1. Score / Percentage Card */}
      <Card className={performanceBg}>
        <CardHeader className="pb-1 border-b-0">
          <CardTitle className={`text-lg font-semibold ${performanceColor}`}>
            Overall Score
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className={`text-5xl font-extrabold mb-1 ${performanceColor}`}>
            {percentage}%
          </div>
          <p className="text-sm font-medium text-gray-600">
            {obtainedMarks} out of {totalMarks} marks
          </p>
        </CardContent>
      </Card>

      {/* 2. Correct Count Card */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Correct Answers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-green-600">
            {correctCount}
          </div>
          <p className="text-sm text-gray-500 mt-1">out of {totalQuestions} questions</p>
        </CardContent>
      </Card>

      {/* 3. Incorrect Count Card */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-red-600" />
            Incorrect Answers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-red-600">
            {incorrectCount}
          </div>
          <p className="text-sm text-gray-500 mt-1">out of {totalQuestions} questions</p>
        </CardContent>
      </Card>

      {/* 4. Time Spent Card */}
      <Card>
        <CardHeader className="pb-1">
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5 text-blue-600" />
            Time Taken
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-blue-600">
            {timeSpent}
          </div>
          <p className="text-sm text-gray-500 mt-1">Total duration used</p>
        </CardContent>
      </Card>
    </div>
  );
}