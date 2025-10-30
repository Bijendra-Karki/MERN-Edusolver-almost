"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, Clock, AlertCircle } from "lucide-react";

// --- Custom Tailwind Components to replace Shadcn/ui ---

const Card = ({ children, className = '' }) => (
  <div className={`rounded-xl border border-gray-200 bg-white shadow-lg ${className}`}>
    {children}
  </div>
);
const CardHeader = ({ children, className = '' }) => (
  <div className={`flex flex-col space-y-1.5 p-5 border-b border-gray-100 ${className}`}>
    {children}
  </div>
);
const CardTitle = ({ children, className = '' }) => (
  <h3 className={`text-xl font-bold leading-snug tracking-tight text-gray-800 ${className}`}>
    {children}
  </h3>
);
const CardContent = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>
    {children}
  </div>
);
const Button = ({ children, className = '', variant = 'default', size = 'default', onClick, disabled, ...props }) => {
    const baseStyle = 'inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:pointer-events-none';
    let variantStyle = '';
    let sizeStyle = 'h-10 px-4 py-2';

    if (variant === 'default') variantStyle = 'bg-indigo-600 text-white shadow hover:bg-indigo-700';
    if (variant === 'outline') variantStyle = 'border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50';
    if (variant === 'ghost') variantStyle = 'bg-transparent text-gray-600 hover:bg-gray-100';

    if (size === 'sm') sizeStyle = 'h-8 px-3 py-1.5 text-sm';
    if (size === 'icon') sizeStyle = 'h-9 w-9 p-0';

    return (
        <button
            className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
            onClick={onClick}
            disabled={disabled}
            {...props}
        >
            {children}
        </button>
    );
};
const Progress = ({ value, className = '' }) => (
  <div 
    className={`w-full h-2 rounded-full bg-gray-200 overflow-hidden ${className}`}
    role="progressbar"
    aria-valuenow={value}
    aria-valuemin="0"
    aria-valuemax="100"
  >
    <div 
      style={{ width: `${value}%` }}
      className={`h-full transition-all duration-500 ease-out ${value < 20 ? 'bg-red-500' : 'bg-indigo-600'}`}
    />
  </div>
);


// --- Mock Components/Hooks ---

// Mock for react-router-dom useParams
const useParamsSimulated = () => ({ id: "1" });

// CORRECTED LINE 74: Removed ': string | number'
const useNavigateSimulated = () => {
    return (target) => {
        console.log(`Navigating to: ${target}`);
    };
};

// Mock for QuizTimer
const QuizTimer = ({ timeLeft, isWarning }) => {
    const formatTime = (seconds) => {
        const safeSeconds = Math.max(0, seconds);
        const mins = Math.floor(safeSeconds / 60);
        const secs = safeSeconds % 60;
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
};


// Mock for QuizQuestion
const QuizQuestion = ({ question, answer, onAnswerChange }) => {
    let userValue;
    if (question.type === 'multiple-choice') {
        userValue = answer !== undefined ? answer : null;
    } else {
        userValue = answer || '';
    }

    if (question.type === "multiple-choice") {
        return (
            <div className="space-y-3">
                {question.options.map((option, index) => {
                    const isSelected = userValue === index;
                    return (
                        <div 
                            key={index} 
                            className={`flex items-center space-x-3 p-3 border rounded-lg transition-colors duration-150 cursor-pointer ${
                                isSelected ? 'bg-indigo-50 border-indigo-400 ring-1 ring-indigo-500' : 'border-gray-200 hover:bg-gray-50'
                            }`}
                            onClick={() => onAnswerChange(index)}
                        >
                            <input
                                type="radio"
                                id={`${question.id}-option-${index}`}
                                name={question.id}
                                value={index}
                                checked={isSelected}
                                onChange={() => onAnswerChange(index)}
                                className="h-5 w-5 text-indigo-600"
                                style={{ accentColor: '#4f46e5' }}
                            />
                            <label htmlFor={`${question.id}-option-${index}`} className="font-medium text-gray-800 cursor-pointer">
                                {option}
                            </label>
                        </div>
                    );
                })}
            </div>
        );
    }

    if (question.type === "short-answer" || question.type === "true-false") {
        return (
            <input
                type="text"
                placeholder={question.type === "short-answer" ? "Enter your answer..." : "Enter 'true' or 'false'"}
                value={userValue}
                onChange={(e) => onAnswerChange(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-base"
            />
        );
    }
    
    return <p className="text-red-500">Unknown Question Type</p>;
};


// --- Mock Data ---
const MOCK_QUESTIONS = [
    { id: "1", text: "What is the capital of France?", type: "multiple-choice", marks: 1, options: ["Paris", "London", "Berlin", "Madrid"], correctAnswer: 0, },
    { id: "2", text: "Solve: 2x + 5 = 15", type: "short-answer", marks: 2, correctAnswer: "5", },
    { id: "3", text: "The Earth is flat.", type: "true-false", marks: 1, correctAnswer: "false", },
    { id: "4", text: "What is the largest planet in our solar system?", type: "multiple-choice", marks: 1, options: ["Saturn", "Jupiter", "Neptune", "Uranus"], correctAnswer: 1, },
];

const MOCK_EXAM_SETS = {
    "1": { subject: "Mathematics", duration: 60, totalMarks: 45 },
    "2": { subject: "Physics", duration: 60, totalMarks: 45 },
};


// --- Main Component ---

export default function Quiz() {
    const { id } = useParamsSimulated();
    const navigate = useNavigateSimulated();

    const initialDuration = MOCK_EXAM_SETS[id || "1"]?.duration * 60 || 3600; 

    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [answers, setAnswers] = useState({});
    const [timeLeft, setTimeLeft] = useState(initialDuration);
    const [quizSubmitted, setQuizSubmitted] = useState(false);

    const examSet = MOCK_EXAM_SETS[id || "1"];
    const questions = MOCK_QUESTIONS;
    const currentQuestion = questions[currentQuestionIndex];
    const progress = ((currentQuestionIndex + 1) / questions.length) * 100;

    // Timer logic
    useEffect(() => {
        if (timeLeft <= 0 || quizSubmitted) {
            if (timeLeft <= 0) handleSubmitQuiz();
            return;
        }

        const timer = setInterval(() => {
            setTimeLeft((prev) => prev - 1);
        }, 1000);

        return () => clearInterval(timer);
    }, [timeLeft, quizSubmitted]);

    const handleAnswerChange = (answer) => {
        setAnswers({
            ...answers,
            [currentQuestion.id]: answer,
        });
    };

    const handleNext = () => {
        if (currentQuestionIndex < questions.length - 1) {
            setCurrentQuestionIndex(currentQuestionIndex + 1);
        }
    };

    const handlePrevious = () => {
        if (currentQuestionIndex > 0) {
            setCurrentQuestionIndex(currentQuestionIndex - 1);
        }
    };

    const handleSubmitQuiz = () => {
        if (quizSubmitted) return;

        setQuizSubmitted(true);

        const timeSpent = initialDuration - timeLeft;
        
        if (typeof sessionStorage !== 'undefined') {
            sessionStorage.setItem(
                `quiz-${id}`,
                JSON.stringify({
                    examId: id,
                    answers,
                    questions,
                    timeSpent,
                }),
            );
        }
        
        navigate(`/results/${id}`);
    };

    const isTimeWarning = timeLeft < 300;

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header / Navigation Bar */}
            <div className="border-b border-gray-200 bg-white sticky top-0 z-10 shadow-md">
                <div className="mx-auto max-w-4xl px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                                <ArrowLeft className="h-5 w-5" />
                            </Button>
                            <div>
                                <h1 className="text-xl font-bold text-gray-800">{examSet?.subject}</h1>
                                <p className="text-sm text-gray-500">
                                    Question {currentQuestionIndex + 1} of {questions.length}
                                </p>
                            </div>
                        </div>
                        <QuizTimer timeLeft={timeLeft} isWarning={isTimeWarning} />
                    </div>
                </div>
            </div>

            {/* Main Quiz Content */}
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                
                {/* Progress Bar */}
                <div className="mb-8">
                    <div className="flex justify-between mb-2">
                        <span className="text-sm font-medium text-gray-700">Progress</span>
                        <span className="text-sm text-gray-500">{Math.round(progress)}%</span>
                    </div>
                    <Progress value={progress} className="h-2" />
                </div>

                {/* Question Card */}
                <Card className="mb-8 shadow-xl">
                    <CardHeader>
                        <CardTitle className="text-2xl font-extrabold text-indigo-700">
                           Q{currentQuestionIndex + 1}: {currentQuestion.text}
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <QuizQuestion
                            question={currentQuestion}
                            answer={answers[currentQuestion.id]}
                            onAnswerChange={handleAnswerChange}
                        />
                    </CardContent>
                </Card>

                {/* Navigation Buttons */}
                <div className="flex gap-3 justify-between">
                    <Button
                        variant="outline"
                        onClick={handlePrevious}
                        disabled={currentQuestionIndex === 0}
                    >
                        Previous
                    </Button>

                    <div className="flex gap-3">
                        {currentQuestionIndex < questions.length - 1 ? (
                            <Button onClick={handleNext}>Next Question</Button>
                        ) : (
                            <Button 
                                onClick={handleSubmitQuiz} 
                                className="bg-green-600 hover:bg-green-700"
                                disabled={quizSubmitted}
                            >
                                Submit Quiz
                            </Button>
                        )}
                    </div>
                </div>

                {/* Question Navigation Map */}
                <Card className="mt-8">
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold">Question Navigator</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-6 gap-3 sm:grid-cols-8 md:grid-cols-10">
                            {questions.map((q, index) => {
                                const isCurrent = currentQuestionIndex === index;
                                const isAnswered = answers[q.id] !== undefined && answers[q.id] !== null && answers[q.id] !== '';

                                let buttonClasses = 'h-10 w-10 p-0 text-lg font-bold shadow-md';
                                
                                if (isCurrent) {
                                    buttonClasses += ' bg-indigo-600 text-white ring-2 ring-offset-2 ring-indigo-400';
                                } else if (isAnswered) {
                                    buttonClasses += ' bg-blue-500 text-white hover:bg-blue-600';
                                } else {
                                    buttonClasses += ' bg-gray-100 text-gray-700 hover:bg-gray-200 border border-gray-300';
                                }

                                return (
                                    <button
                                        key={q.id}
                                        className={`rounded-full transition-all duration-150 ${buttonClasses}`}
                                        onClick={() => setCurrentQuestionIndex(index)}
                                    >
                                        {index + 1}
                                    </button>
                                );
                            })}
                        </div>
                        <div className="mt-6 flex gap-4 text-sm text-gray-500">
                            <div className="flex items-center gap-1">
                                <span className="h-3 w-3 rounded-full bg-indigo-600"></span> Current
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="h-3 w-3 rounded-full bg-blue-500"></span> Answered
                            </div>
                            <div className="flex items-center gap-1">
                                <span className="h-3 w-3 rounded-full bg-gray-100 border border-gray-300"></span> Unanswered
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
    );
}