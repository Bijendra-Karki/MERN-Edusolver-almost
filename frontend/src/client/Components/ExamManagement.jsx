"use client";

import React, { useState } from "react";
import { Plus, ArrowLeft, Target, BookOpen } from "lucide-react";

// --- Custom Tailwind Components to replace Shadcn/ui ---

const Card = ({ children, className = "" }) => (
  <div className={`rounded-xl border bg-white shadow-md ${className}`}>
    {children}
  </div>
);

const CardHeader = ({ children, className = "" }) => (
  <div className={`flex flex-col space-y-1.5 p-4 border-b ${className}`}>
    {children}
  </div>
);

const CardTitle = ({ children, className = "" }) => (
  <h3
    className={`text-lg font-semibold leading-none tracking-tight text-gray-900 ${className}`}
  >
    {children}
  </h3>
);

const CardContent = ({ children, className = "" }) => (
  <div className={`p-4 pt-3 ${className}`}>{children}</div>
);

const Button = ({
  children,
  className = "",
  variant = "default",
  size = "default",
  onClick,
  ...props
}) => {
  const baseStyle =
    "inline-flex items-center justify-center whitespace-nowrap rounded-lg text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500";
  let variantStyle = "";
  let sizeStyle = "h-10 px-4 py-2";

  if (variant === "default")
    variantStyle = "bg-indigo-600 text-white shadow hover:bg-indigo-700";
  if (variant === "outline")
    variantStyle =
      "border border-gray-300 bg-white text-gray-700 shadow-sm hover:bg-gray-50";
  if (variant === "ghost")
    variantStyle = "bg-transparent text-gray-700 hover:bg-gray-100";

  if (size === "sm") sizeStyle = "h-8 px-3 py-1.5 text-sm";
  if (size === "icon") sizeStyle = "h-9 w-9 p-0";

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

// --- Placeholder Components for local imports and hooks ---

// Mock for react-router-dom useParams
const useParamsSimulated = () => ({ id: "physics-set-2" });

// Mock for react-router-dom useNavigate
const useNavigateSimulated = () => {
  return (target) => {
    if (typeof target === "number") {
      console.log("Navigating back one step.");
    } else {
      console.log(`Navigating to: ${target}`);
    }
  };
};

// Mock for QuestionForm
const QuestionForm = ({ onSubmit, onCancel, initialData }) => (
  <Card className="shadow-lg border-indigo-200">
    <CardHeader>
      <CardTitle>
        {initialData ? "Edit Question" : "Add New Question"} (Form Placeholder)
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4">
      <p className="text-gray-600">
        Form for question text, type, marks, and answers goes here.
      </p>
      <div className="flex justify-end gap-3">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button
          onClick={() =>
            onSubmit({
              text: "New Question Placeholder",
              type: "short-answer",
              marks: 3,
              correctAnswer: "10",
            })
          }
        >
          Save Question
        </Button>
      </div>
    </CardContent>
  </Card>
);

// Mock for QuestionsList
const QuestionsList = ({ questions, onEdit, onDelete }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-xl">Question List (Placeholder)</CardTitle>
    </CardHeader>
    <CardContent>
      <p className="text-gray-600 mb-4">
        Displaying {questions.length} questions.
      </p>
      <ul className="space-y-3">
        {questions.map((q) => (
          <li
            key={q.id}
            className="flex justify-between items-center p-3 bg-gray-50 border rounded-lg"
          >
            <span className="font-medium truncate">{q.text}</span>
            <div className="flex gap-2">
              <Button size="sm" variant="outline" onClick={() => onEdit(q)}>
                Edit
              </Button>
              <Button
                size="sm"
                onClick={() => onDelete(q.id)}
                className="bg-red-500 hover:bg-red-600"
              >
                Delete
              </Button>
            </div>
          </li>
        ))}
      </ul>
    </CardContent>
  </Card>
);

// --- Main Component ---
export default function ExamManagement() {
  const { id } = useParamsSimulated(); // Use simulated hook
  const navigate = useNavigateSimulated(); // Use simulated hook

  const [showForm, setShowForm] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null);
  const [questions, setQuestions] = useState([
    {
      id: "1",
      text: "What is the capital of France?",
      type: "multiple-choice",
      marks: 1,
      options: ["Paris", "London", "Berlin", "Madrid"],
      correctAnswer: 0,
    },
    {
      id: "2",
      text: "Solve: 2x + 5 = 15",
      type: "short-answer",
      marks: 2,
      correctAnswer: "5",
    },
    {
      id: "3",
      text: "The sun is a star. (True/False)",
      type: "true-false",
      marks: 1,
      correctAnswer: "true",
    },
  ]);

  const handleAddQuestion = (newQuestion) => {
    if (editingQuestion) {
      setQuestions(
        questions.map((q) =>
          q.id === editingQuestion.id
            ? { ...newQuestion, id: editingQuestion.id }
            : q
        )
      );
      setEditingQuestion(null);
    } else {
      setQuestions([...questions, { ...newQuestion, id: Date.now().toString() }]);
    }
    setShowForm(false);
  };

  const handleEditQuestion = (question) => {
    setEditingQuestion(question);
    setShowForm(true);
  };

  const handleDeleteQuestion = (questionId) => {
    setQuestions(questions.filter((q) => q.id !== questionId));
  };

  return (
    <main className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="border-b border-gray-200 bg-white shadow-sm">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="text-gray-600 hover:text-indigo-600"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">
                Manage Questions
              </h1>
              <p className="text-sm text-gray-500">
                Exam Set ID:{" "}
                <span className="font-mono text-indigo-600">{id}</span>
              </p>
            </div>
            <Button
              onClick={() => {
                setEditingQuestion(null);
                setShowForm(!showForm);
              }}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Add Question
            </Button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Question Form */}
        {showForm && (
          <div className="mb-8">
            <QuestionForm
              onSubmit={handleAddQuestion}
              onCancel={() => {
                setShowForm(false);
                setEditingQuestion(null);
              }}
              initialData={editingQuestion}
            />
          </div>
        )}

        {/* Summary Cards */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {/* 1. Total Questions */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-0">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Questions
              </CardTitle>
              <Target className="h-5 w-5 text-indigo-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {questions.length}
              </div>
              <p className="text-xs text-gray-500">Questions in this set</p>
            </CardContent>
          </Card>

          {/* 2. Total Marks */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 border-b-0">
              <CardTitle className="text-sm font-medium text-gray-500">
                Total Marks
              </CardTitle>
              <BookOpen className="h-5 w-5 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-gray-900">
                {questions.reduce((sum, q) => sum + q.marks, 0)}
              </div>
              <p className="text-xs text-gray-500">Maximum marks for this set</p>
            </CardContent>
          </Card>
        </div>

        {/* Questions List */}
        <QuestionsList
          questions={questions}
          onEdit={handleEditQuestion}
          onDelete={handleDeleteQuestion}
        />
      </div>
    </main>
  );
}
