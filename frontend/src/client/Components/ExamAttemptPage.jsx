"use client";

import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { getToken } from "../../components/utils/authHelper";


export default function ExamAttemptPage() {
  const { id: examSetId } = useParams();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [feedback, setFeedback] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60 * 60); // 60 minutes
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const token =getToken();
  
  const timerRef = useRef();

  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  };

  // Fetch questions
  useEffect(() => {
    if (!examSetId) return;

    const fetchQuestions = async () => {
      try {
        setLoading(true);
        const res = await axios.get(
          `/api/questions/questionList?examSet=${examSetId}`,
          config
        );
        setQuestions(res.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load questions");
      } finally {
        setLoading(false);
      }
    };
    fetchQuestions();
  }, [examSetId]);

  // Countdown timer
  useEffect(() => {
    if (submitted) return; // stop timer when submitted
    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleSubmit();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [submitted]);

  const handleAnswer = (questionId, option, correctAnswer) => {
    if (!answers[questionId]) {
      const isCorrect = option === correctAnswer;
      setAnswers((prev) => ({ ...prev, [questionId]: option }));
      setFeedback((prev) => ({
        ...prev,
        [questionId]: isCorrect ? "Correct!" : "Wrong!",
      }));

      // Auto move to next question after 1 second
      setTimeout(() => {
        if (currentIndex < questions.length - 1) {
          setCurrentIndex((i) => i + 1);
        } else {
          handleSubmit();
        }
      }, 1000);
    }
  };

  const handleSubmit = async () => {
    if (submitted) return;
    setSubmitted(true);
    clearInterval(timerRef.current);

    const payload = {
      examSetId,
      answers: questions.map((q) => ({
        questionId: q._id,
        selectedAnswer: answers[q._id] || null,
      })),
    };

    try {
      const res = await axios.post("/api/exam-attempts/submit", payload, config);
      setResult(res.data.result);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit exam");
    }
  };

  const currentQuestion = questions[currentIndex];
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;

  if (loading) return <div>Loading questions...</div>;
  if (error) return <div className="text-red-500">{error}</div>;
  if (!questions.length) return <div>No questions found for this exam.</div>;

  // ✅ Result Summary Screen
  if (submitted && result) {
    return (
      <div className="p-6 min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <div className="bg-white rounded-xl shadow-md p-6 w-full max-w-md text-center">
          <h2 className="text-2xl font-bold text-indigo-700 mb-4">
            🎉 Exam Completed!
          </h2>
          <p className="text-lg font-semibold">
            Total Questions: {result.totalQuestions}
          </p>
          <p className="text-green-600 font-semibold">
            Correct Answers: {result.correctAnswers}
          </p>
          <p className="text-red-600 font-semibold">
            Wrong Answers: {result.wrongAnswers}
          </p>
          <p className="text-indigo-700 font-bold mt-2">
            Percentage: {result.percentage.toFixed(2)}%
          </p>
          <p className="mt-2 text-gray-600">
            Marks Obtained: {result.obtainedMarks} / {result.totalMarks}
          </p>

          <button
            onClick={() => (window.location.href = "/dashboard")}
            className="mt-6 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // ✅ Main Question UI
  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Timer */}
      <div className="mb-4 text-right font-semibold text-indigo-700">
        Time Left: {minutes}:{seconds < 10 ? "0" : ""}
        {seconds} min
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 h-2 rounded mb-4">
        <div
          className="bg-indigo-600 h-2 rounded"
          style={{
            width: `${((currentIndex + 1) / questions.length) * 100}%`,
          }}
        ></div>
      </div>

      {/* Question */}
      <div className="p-4 bg-white rounded shadow mb-4">
        <p className="font-semibold mb-3">
          Question {currentIndex + 1} of {questions.length}:
        </p>
        <p className="mb-4">{currentQuestion.questionText}</p>

        {/* Options */}
        <div className="space-y-2">
          {currentQuestion.options.map((opt, i) => {
            const selected = answers[currentQuestion._id] === opt;
            const correctSelected =
              selected && opt === currentQuestion.correctAnswer;
            const wrongSelected =
              selected && opt !== currentQuestion.correctAnswer;
            const showCorrect = selected && !correctSelected;

            return (
              <button
                key={`${currentQuestion._id}-${i}`}
                onClick={() =>
                  handleAnswer(
                    currentQuestion._id,
                    opt,
                    currentQuestion.correctAnswer
                  )
                }
                disabled={!!answers[currentQuestion._id]}
                className={`w-full text-left px-4 py-2 rounded border
                  ${
                    correctSelected ? "bg-green-200 border-green-400" : ""
                  }
                  ${wrongSelected ? "bg-red-200 border-red-400" : ""}
                  ${showCorrect ? "bg-green-100 border-green-400" : ""}
                  ${!selected ? "hover:bg-gray-100" : ""}
                  ${
                    answers[currentQuestion._id]
                      ? "opacity-80 cursor-not-allowed"
                      : ""
                  }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        {/* Feedback */}
        {answers[currentQuestion._id] && (
          <div
            className={`mt-2 font-semibold ${
              feedback[currentQuestion._id] === "Correct!"
                ? "text-green-700"
                : "text-red-700"
            }`}
          >
            {feedback[currentQuestion._id]}
          </div>
        )}

        {/* Show correct answer if wrong */}
        {answers[currentQuestion._id] &&
          feedback[currentQuestion._id] === "Wrong!" && (
            <div className="mt-1 text-sm text-green-700">
              Correct Answer: {currentQuestion.correctAnswer}
            </div>
          )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <button
          onClick={() => setCurrentIndex((i) => Math.max(i - 1, 0))}
          disabled={currentIndex === 0}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300 disabled:opacity-50"
        >
          Previous
        </button>
        <button
          onClick={() =>
            setCurrentIndex((i) => Math.min(i + 1, questions.length - 1))
          }
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          Next
        </button>
      </div>

      {/* Submit */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={handleSubmit}
          disabled={submitted}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
        >
          Submit Exam
        </button>
      </div>
    </div>
  );
}
