"use client";

import React, { useState, useEffect } from "react";
import { ArrowLeft, RotateCcw, Home, Loader2 } from "lucide-react";

// --- Custom Tailwind Components to replace Shadcn/ui ---

const Card = ({ children, className = '' }) => (
  <div className={`rounded-xl border border-gray-200 bg-white shadow-lg ${className}`}>
    {children}
  </div>
);
const CardContent = ({ children, className = '' }) => (
  <div className={`p-5 ${className}`}>
    {children}
  </div>
);
const Button = ({ children, className = '', variant = 'default', size = 'default', onClick, ...props }) => {
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
            {...props}
        >
            {children}
        </button>
    );
};


// --- Mock Data and Simulated Hooks (Cleaned up: TypeScript annotations removed) ---

// Mock data that simulates what would be retrieved from sessionStorage
const MOCK_QUIZ_DATA = {
    examId: "1",
    answers: {
        "1": 0,         // Correct: Paris (index 0)
        "2": "5",       // Correct: "5"
        "3": "true",    // Incorrect: "false" is correct
        "4": 0,         // Incorrect: Jupiter (index 1)
    },
    questions: [
        { id: "1", text: "What is the capital of France?", type: "multiple-choice", marks: 1, options: ["Paris", "London", "Berlin", "Madrid"], correctAnswer: 0 },
        { id: "2", text: "Solve: 2x + 5 = 15", type: "short-answer", marks: 2, correctAnswer: "5" },
        { id: "3", text: "The Earth is flat.", type: "true-false", marks: 1, correctAnswer: "false" },
        { id: "4", text: "What is the largest planet in our solar system?", type: "multiple-choice", marks: 1, options: ["Saturn", "Jupiter", "Neptune", "Uranus"], correctAnswer: 1 },
    ],
    timeSpent: 380, // 6m 20s
};

// Mock for react-router-dom useParams
const useParamsSimulated = () => ({ id: "1" });

// Mock for react-router-dom useNavigate
const useNavigateSimulated = () => {
    // Removed type annotations (target: string | number)
    return (target) => {
        console.log(`Navigating to: ${target}`);
        // In a real app, this would perform navigation
    };
};

// Mock for sessionStorage (to simulate data fetching)
const sessionStorageSimulated = {
    getItem: (key) => {
        // Simulate finding the data for the requested quiz ID
        if (key === `quiz-1`) {
            return JSON.stringify(MOCK_QUIZ_DATA);
        }
        return null;
    }
};


// --- Placeholder Components for local imports ---

// Mock for ResultsSummary (removed types from props)
const ResultsSummary = ({ obtainedMarks, totalMarks, percentage, correctCount, totalQuestions, timeSpent }) => {
    const isPassing = percentage >= 70;
    const colorClass = isPassing ? 'text-green-600 border-green-300' : 'text-red-600 border-red-300';
    const bgColorClass = isPassing ? 'bg-green-50' : 'bg-red-50';

    return (
        <Card className={`text-center ${bgColorClass} border-2 ${colorClass}`}>
            <CardContent className="space-y-4">
                <h2 className="text-3xl font-extrabold text-gray-900">Quiz Complete!</h2>
                <div className="text-6xl font-extrabold" style={{ color: isPassing ? '#10B981' : '#EF4444' }}>
                    {percentage}%
                </div>
                <p className="text-xl font-semibold text-gray-700">
                    You scored **{obtainedMarks} out of {totalMarks}** total marks.
                </p>
                <div className="grid grid-cols-3 gap-4 border-t pt-4 text-gray-600">
                    <div>
                        <p className="text-sm font-medium">Correct Questions</p>
                        <p className="text-xl font-bold text-blue-600">{correctCount}/{totalQuestions}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Time Taken</p>
                        <p className="text-xl font-bold">{timeSpent}</p>
                    </div>
                    <div>
                        <p className="text-sm font-medium">Unanswered</p>
                        <p className="text-xl font-bold text-gray-800">{totalQuestions - Object.keys(MOCK_QUIZ_DATA.answers).length}</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

// Mock for PerformanceChart (removed types from props)
const PerformanceChart = ({ correctCount, incorrectCount, percentage }) => (
    <Card>
        <CardContent className="text-center">
            <h3 className="text-lg font-semibold mb-4">Performance Breakdown (Chart Placeholder)</h3>
            <div className="flex justify-center items-center h-40">
                <div 
                    className="relative w-28 h-28 rounded-full flex items-center justify-center text-lg font-bold text-white shadow-xl"
                    style={{ 
                        background: `conic-gradient(#10B981 0% ${percentage}%, #EF4444 ${percentage}% 100%)` 
                    }}
                >
                    {percentage}%
                </div>
            </div>
            <div className="mt-4 flex justify-center gap-6 text-sm">
                <div className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full bg-green-500"></span> Correct: {correctCount}
                </div>
                <div className="flex items-center gap-1">
                    <span className="h-3 w-3 rounded-full bg-red-500"></span> Incorrect/Skipped: {incorrectCount}
                </div>
            </div>
        </CardContent>
    </Card>
);

// Mock for QuestionReview (removed types from props)
const QuestionReview = ({ questionNumber, question, userAnswer }) => {
    let isCorrect = false;
    
    if (question.type === "multiple-choice") {
        isCorrect = userAnswer === question.correctAnswer;
    } else if (question.type === "short-answer") {
        isCorrect = userAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
    } else if (question.type === "true-false") {
        isCorrect = userAnswer === question.correctAnswer;
    }

    const correctIndicatorClass = isCorrect ? 'bg-green-500' : 'bg-red-500';
    const correctTextClass = isCorrect ? 'text-green-700' : 'text-red-700';

    return (
        <Card className={`border-l-8 ${isCorrect ? 'border-green-500' : 'border-red-500'} shadow-md`}>
            <CardContent className="space-y-3">
                <div className="flex justify-between items-start">
                    <h4 className="text-lg font-bold text-gray-800">Q{questionNumber}: {question.text}</h4>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold text-white ${correctIndicatorClass}`}>
                        {isCorrect ? 'Correct' : 'Incorrect'}
                    </span>
                </div>
                
                <div className="border-t pt-3 space-y-2 text-sm">
                    <p className="font-medium">Your Answer: <span className="font-normal text-gray-700">{userAnswer !== undefined ? (question.type === 'multiple-choice' ? question.options[userAnswer] : userAnswer) : 'No Answer'}</span></p>
                    <p className="font-medium">Correct Answer: <span className={correctTextClass}>
                        {question.type === 'multiple-choice' ? question.options[question.correctAnswer] : question.correctAnswer}
                    </span></p>
                    <p className="text-xs text-gray-500">Marks: {isCorrect ? question.marks : 0}/{question.marks}</p>
                </div>
            </CardContent>
        </Card>
    );
};


// --- Main Component ---

export default function Results() {
    const { id } = useParamsSimulated(); // Using simulated hook
    const navigate = useNavigateSimulated(); // Using simulated hook

    // Removed <any> type from useState
    const [quizData, setQuizData] = useState(null); 
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Use simulated sessionStorage or actual sessionStorage if available
        const data = sessionStorageSimulated.getItem(`quiz-${id}`);
        if (data) {
            setQuizData(JSON.parse(data));
        }
        setLoading(false);
    }, [id]); // No type change needed for dependency array

    if (loading) {
        return (
            <main className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p className="text-gray-500 flex items-center gap-2">
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Loading results...
                </p>
            </main>
        );
    }

    if (!quizData) {
        return (
            <main className="min-h-screen bg-gray-50">
                <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                    <Card>
                        <CardContent className="py-12 text-center space-y-4">
                            <p className="text-gray-500 mb-4 text-xl font-semibold">
                                😔 No quiz data found for Exam ID: {id}.
                            </p>
                            <Button onClick={() => navigate("/")} className="gap-2">
                                <Home className="h-4 w-4" />
                                Back to Dashboard
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </main>
        );
    }

    // --- Calculation Logic ---
    const { answers, questions, timeSpent } = quizData;

    let correctCount = 0;
    // Removed type annotations from arguments
    questions.forEach((question) => {
        const userAnswer = answers[question.id];
        
        if (question.type === "multiple-choice") {
            if (userAnswer === question.correctAnswer) correctCount++;
        } else if (question.type === "short-answer") {
            if (userAnswer?.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim()) correctCount++;
        } else if (question.type === "true-false") {
            if (userAnswer === question.correctAnswer) correctCount++;
        }
    });

    // Removed type annotations from arguments
    const totalMarks = questions.reduce((sum, q) => sum + q.marks, 0); 
    const obtainedMarks = questions.reduce((sum, q) => {
        const userAnswer = answers[q.id];
        let isCorrect = false;

        if (q.type === "multiple-choice") {
            isCorrect = userAnswer === q.correctAnswer;
        } else if (q.type === "short-answer") {
            isCorrect = userAnswer?.toLowerCase().trim() === q.correctAnswer.toLowerCase().trim();
        } else if (q.type === "true-false") {
            isCorrect = userAnswer === q.correctAnswer;
        }

        return sum + (isCorrect ? q.marks : 0);
    }, 0);

    const percentage = totalMarks > 0 ? Math.round((obtainedMarks / totalMarks) * 100) : 0;
    
    // Removed type annotations from arguments
    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };
    
    const incorrectCount = questions.length - correctCount;

    return (
        <main className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="border-b border-gray-200 bg-white shadow-sm">
                <div className="mx-auto max-w-4xl px-4 py-6 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                            <ArrowLeft className="h-5 w-5" />
                        </Button>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">Quiz Results</h1>
                            <p className="text-sm text-gray-500">Exam Set ID: <span className="font-mono text-indigo-600">{id}</span></p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Content Area */}
            <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
                
                {/* 1. Summary */}
                <ResultsSummary
                    obtainedMarks={obtainedMarks}
                    totalMarks={totalMarks}
                    percentage={percentage}
                    correctCount={correctCount}
                    totalQuestions={questions.length}
                    timeSpent={formatTime(timeSpent)}
                />

                {/* 2. Chart */}
                <div className="mt-8">
                    <PerformanceChart
                        correctCount={correctCount}
                        incorrectCount={incorrectCount}
                        percentage={percentage}
                    />
                </div>

                {/* 3. Question Review */}
                <div className="mt-8">
                    <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-2">Question Review</h2>
                    <div className="space-y-6">
                        {questions.map((question, index) => (
                            <QuestionReview
                                key={question.id}
                                questionNumber={index + 1}
                                question={question}
                                userAnswer={answers[question.id]}
                            />
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-10 flex gap-4 justify-center">
                    <Button 
                        variant="outline" 
                        onClick={() => navigate("/")} 
                        className="gap-2 text-indigo-600 border-indigo-300 hover:bg-indigo-50"
                    >
                        <Home className="h-4 w-4" />
                        Back to Dashboard
                    </Button>
                    <Button onClick={() => navigate(`/quiz/${id}`)} className="gap-2">
                        <RotateCcw className="h-4 w-4" />
                        Retake Quiz
                    </Button>
                </div>
            </div>
        </main>
    );
}