"use client";

import React, { useState } from "react";
import { Timer, ArrowLeft, ArrowRight, Save } from "lucide-react";

// --- MOCK DATA STRUCTURE FOR DEMONSTRATION ---
const mockExamData = {
  title: "MySQL Fundamentals Practice Exam",
  totalQuestions: 10,
  durationMinutes: 60,
  questions: [
    {
      id: 1,
      text: "Which SQL keyword is used to change existing data in a table?",
      options: [
        { id: 'a', text: "ALTER" },
        { id: 'b', text: "UPDATE" },
        { id: 'c', text: "MODIFY" },
        { id: 'd', text: "CHANGE" },
      ],
      marks: 5,
    },
    // ... more questions
  ],
};

// --- CORE COMPONENT ---

/**
 * UI for a student to take an exam, displaying one question at a time.
 * @param {object} props - Component props.
 * @param {object} props.examData - Data structure containing exam details and questions.
 */
export default function StudentExamUI({ examData = mockExamData }) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = examData.questions[currentQuestionIndex];
  const isFirstQuestion = currentQuestionIndex === 0;
  const isLastQuestion = currentQuestionIndex === examData.totalQuestions - 1;

  // Handler for selecting an answer
  const handleAnswerSelect = (optionId) => {
    setStudentAnswers((prevAnswers) => ({
      ...prevAnswers,
      [currentQuestion.id]: optionId,
    }));
  };

  // Handler for navigation
  const handleNavigation = (direction) => {
    if (direction === 'next' && !isLastQuestion) {
      setCurrentQuestionIndex((prevIndex) => prevIndex + 1);
    } else if (direction === 'prev' && !isFirstQuestion) {
      setCurrentQuestionIndex((prevIndex) => prevIndex - 1);
    }
  };

  const handleSubmitExam = () => {
    setIsSubmitting(true);
    // Simulate API call delay
    setTimeout(() => {
        console.log("Exam submitted:", studentAnswers);
        alert(`Exam submitted! You answered ${Object.keys(studentAnswers).length} out of ${examData.totalQuestions} questions.`);
        setIsSubmitting(false);
    }, 1500);
  };

  // --- UI Elements (using Tailwind for Shadcn aesthetic) ---

  const Card = ({ children, className = '' }) => (
    <div className={`rounded-xl border bg-card text-card-foreground shadow-sm ${className}`}>
      {children}
    </div>
  );
  const CardHeader = ({ children, className = '' }) => (
    <div className={`flex flex-col space-y-1.5 p-6 ${className}`}>{children}</div>
  );
  const CardTitle = ({ children, className = '' }) => (
    <h3 className={`text-2xl font-semibold leading-none tracking-tight ${className}`}>{children}</h3>
  );
  const CardDescription = ({ children, className = '' }) => (
    <p className={`text-sm text-muted-foreground ${className}`}>{children}</p>
  );
  const CardContent = ({ children, className = '' }) => (
    <div className={`p-6 pt-0 ${className}`}>{children}</div>
  );
  const Button = ({ children, className = '', variant = 'default', disabled, onClick, ...props }) => {
      const baseStyle = 'inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors h-10 px-4 py-2';
      let variantStyle = '';
      if (variant === 'default') variantStyle = 'bg-primary text-primary-foreground shadow hover:bg-primary/90';
      if (variant === 'outline') variantStyle = 'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground';
      if (disabled) variantStyle = 'bg-gray-200 text-gray-500 cursor-not-allowed';

      return (
          <button
              className={`${baseStyle} ${variantStyle} ${className}`}
              disabled={disabled}
              onClick={onClick}
              {...props}
          >
              {children}
          </button>
      );
  };


  return (
    <div className="flex justify-center p-8 bg-gray-50 min-h-screen">
      <div className="w-full max-w-3xl space-y-6">
        
        {/* Header and Timer */}
        <div className="flex justify-between items-center p-4 bg-white border rounded-xl shadow-md">
            <div>
                <h1 className="text-xl font-bold text-gray-800">{examData.title}</h1>
                <p className="text-sm text-gray-500">Question {currentQuestionIndex + 1} of {examData.totalQuestions}</p>
            </div>
            <div className="flex items-center gap-2 text-lg font-semibold text-red-600">
                <Timer className="w-5 h-5" />
                <span>{examData.durationMinutes}:00</span> {/* Placeholder Timer */}
            </div>
        </div>

        {/* Question Card */}
        <Card className="border-blue-200 shadow-xl">
          <CardHeader className="bg-blue-50/50 rounded-t-xl border-b">
            <div className="flex justify-between items-start">
                <CardTitle className="text-blue-800">
                    Question {currentQuestionIndex + 1}
                </CardTitle>
                <span className="px-3 py-1 text-sm font-semibold text-blue-600 bg-blue-100 rounded-full">
                    {currentQuestion.marks} Marks
                </span>
            </div>
            <CardDescription className="text-gray-700 mt-2">
                {currentQuestion.text}
            </CardDescription>
          </CardHeader>

          {/* Answer Options */}
          <CardContent className="space-y-4 py-6">
            <h4 className="text-lg font-semibold mb-3">Select the correct option:</h4>
            <div className="space-y-3">
              {currentQuestion.options.map((option) => (
                <label 
                  key={option.id} 
                  htmlFor={`option-${option.id}`} 
                  className={`flex items-center gap-4 p-4 border rounded-lg cursor-pointer transition-all 
                              ${studentAnswers[currentQuestion.id] === option.id 
                                ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-300' 
                                : 'hover:bg-gray-50 border-gray-200'}`}
                >
                  <input
                    type="radio"
                    id={`option-${option.id}`}
                    name={`question-${currentQuestion.id}`}
                    value={option.id}
                    checked={studentAnswers[currentQuestion.id] === option.id}
                    onChange={() => handleAnswerSelect(option.id)}
                    className="h-5 w-5 text-blue-600 focus:ring-blue-500"
                    style={{ accentColor: '#3b82f6' }} // Custom color for radio button
                  />
                  <span className="text-base text-gray-900 font-medium">
                    {option.text}
                  </span>
                </label>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Navigation/Control Footer */}
        <Card className="p-4 flex justify-between items-center">
            <Button 
                variant="outline"
                onClick={() => handleNavigation('prev')}
                disabled={isFirstQuestion || isSubmitting}
            >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
            </Button>
            
            <span className="text-sm font-medium text-gray-600">
                {currentQuestionIndex + 1} / {examData.totalQuestions}
            </span>

            {isLastQuestion ? (
                <Button 
                    onClick={handleSubmitExam}
                    disabled={isSubmitting}
                    className="bg-green-600 hover:bg-green-700"
                >
                    {isSubmitting ? (
                        <span className="flex items-center gap-2">
                            <Timer className="w-4 h-4 animate-spin" /> Submitting...
                        </span>
                    ) : (
                        <span className="flex items-center gap-2">
                            <Save className="w-4 h-4" /> Submit Exam
                        </span>
                    )}
                </Button>
            ) : (
                <Button 
                    onClick={() => handleNavigation('next')}
                    disabled={isSubmitting}
                >
                    Next Question
                    <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
            )}
        </Card>
        
      </div>
    </div>
  );
}