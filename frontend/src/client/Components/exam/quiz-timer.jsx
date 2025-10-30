"use client";

import React from "react";
import { Clock, AlertCircle } from "lucide-react";

interface QuizTimerProps {
  timeLeft: number; // Time remaining in seconds
  isWarning: boolean; // Flag for low time alert
}

export default function QuizTimer({ timeLeft, isWarning }: QuizTimerProps) {
  /**
   * Converts total seconds into M:SS format.
   */
  const formatTime = (seconds: number) => {
    // Ensure seconds is non-negative
    const safeSeconds = Math.max(0, seconds);
    const mins = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;
    
    // Pad seconds with leading zero if necessary
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const warningClasses = "bg-red-100 text-red-700 border border-red-300";
  const defaultClasses = "bg-gray-100 text-gray-700 border border-gray-200";

  return (
    <div
      className={`
        flex items-center justify-center gap-2 
        px-4 py-2 rounded-xl shadow-md 
        transition-colors duration-300
        ${isWarning ? warningClasses : defaultClasses}
      `}
    >
      {/* Icon */}
      {isWarning ? (
        <AlertCircle className="h-5 w-5 animate-pulse" />
      ) : (
        <Clock className="h-5 w-5" />
      )}
      
      {/* Time Display */}
      <span className="font-mono text-lg font-bold">
        {formatTime(timeLeft)}
      </span>
    </div>
  );
}