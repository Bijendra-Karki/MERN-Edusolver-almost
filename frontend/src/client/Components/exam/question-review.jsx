"use client";

import React from "react";
import { CheckCircle2, XCircle } from "lucide-react";

// --- Custom Tailwind Components to replace Shadcn/ui ---

const Card = ({ children, className = '' }) => (
  <div className={`rounded-xl border bg-white shadow-sm transition-colors duration-300 ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ children }) => (
  <div className="flex flex-col space-y-1.5 p-4 border-b">
    {children}
  </div>
);
const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-base font-bold leading-snug tracking-tight text-gray-900 ${className}`}>
    {children}
  </h3>
);
const CardContent = ({ children, className = '' }) => (
  <div className={`p-4 pt-0 ${className}`}>
    {children}
  </div>
);
// Simplified Badge for the 'outline' variant used here
const Badge = ({ children, className = '' }) => (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-white text-gray-600 border-gray-300 ${className}`}>
        {children}
    </span>
);


interface QuestionReviewProps {
  questionNumber: number;
  question: any; // Simplified type for demonstration
  userAnswer: any;
}

export default function QuestionReview({ questionNumber, question, userAnswer }: QuestionReviewProps) {
  let isCorrect = false;

  // 1. Determine Correctness Logic
  if (question.type === "multiple-choice") {
    // userAnswer is expected to be the index of the selected option (number)
    isCorrect = userAnswer === question.correctAnswer;
  } else if (question.type === "short-answer") {
    // userAnswer is expected to be a string
    isCorrect = userAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
  } else if (question.type === "true-false") {
    // userAnswer is expected to be a string ("true" or "false")
    isCorrect = userAnswer === question.correctAnswer;
  }

  // Helper function to map question type to a readable label
  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      "multiple-choice": "Multiple Choice",
      "short-answer": "Short Answer",
      "true-false": "True/False",
    };
    return labels[type] || type;
  };

  // Conditional base styles for the Card
  const cardBaseClasses = isCorrect
    ? "border-green-300 bg-green-50"
    : "border-red-300 bg-red-50";

  // Helper to convert index to label (A, B, C...)
  const getOptionLabel = (index: number) => String.fromCharCode(65 + index);
  
  return (
    <Card className={cardBaseClasses}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1 pr-4">
            {/* Question Metadata */}
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-sm font-medium text-gray-500">
                Question **{questionNumber}**
              </span>
              <Badge>{getTypeLabel(question.type)}</Badge>
              <Badge>{question.marks} marks</Badge>
            </div>
            
            {/* Question Text */}
            <CardTitle className="text-gray-900">{question.text}</CardTitle>
          </div>
          
          {/* Status Icon */}
          {isCorrect ? (
            <CheckCircle2 className="h-6 w-6 text-green-600 flex-shrink-0" />
          ) : (
            <XCircle className="h-6 w-6 text-red-600 flex-shrink-0" />
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        
        {/* --- MULTIPLE CHOICE REVIEW --- */}
        {question.type === "multiple-choice" && (
          <div className="space-y-2">
            <p className="text-sm font-medium text-gray-700">Options Review:</p>
            <div className="space-y-1">
              {question.options.map((option: string, index: number) => {
                const isUserAnswer = userAnswer === index;
                const isCorrectAnswer = index === question.correctAnswer;
                
                let textColor = "text-gray-800";
                let bgColor = "bg-white"; // Default background
                let indicator = "";

                if (isCorrectAnswer) {
                    bgColor = "bg-green-100 border-green-400";
                    textColor = "text-green-800";
                    indicator = " (Correct Answer)";
                }
                if (isUserAnswer && !isCorrectAnswer) {
                    bgColor = "bg-red-100 border-red-400";
                    textColor = "text-red-800";
                    indicator = " (Your Incorrect Answer)";
                } else if (isUserAnswer && isCorrectAnswer) {
                    indicator = " (Your Answer)";
                }

                return (
                  <div 
                    key={index} 
                    className={`p-3 rounded-lg text-sm border ${bgColor} ${textColor} font-medium`}
                  >
                    <span className="font-bold mr-2">{getOptionLabel(index)}.</span>
                    {option}
                    <span className="ml-2 font-semibold text-xs">{indicator}</span>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* --- SHORT ANSWER REVIEW --- */}
        {(question.type === "short-answer" || question.type === "true-false") && (
          <div className="grid md:grid-cols-2 gap-4">
            {/* Your Answer */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Your Answer:</p>
              <p className={`p-3 rounded-lg text-sm font-semibold ${isCorrect ? "bg-green-100 text-green-800 border border-green-300" : "bg-red-100 text-red-800 border border-red-300"}`}>
                {userAnswer || "Not answered"}
              </p>
            </div>
            
            {/* Correct Answer */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-1">Correct Answer:</p>
              <p className="p-3 rounded-lg text-sm font-semibold bg-green-100 text-green-800 border border-green-300">
                {question.type === "true-false"
                 ? (question.correctAnswer === "true" ? "True" : "False")
                 : question.correctAnswer}
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}