"use client"
import { useState, useEffect } from "react"
import {
  Clock,
  Brain,
  CheckCircle,
  XCircle,
  Trophy,
  AlertCircle,
  ArrowLeft,
  ArrowRight,
  RotateCcw,
  Target,
  Award,
} from "lucide-react"

export default function TestComponent({ isOpen, onClose, course, onTestComplete }) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(1800) // 30 minutes in seconds
  const [testStarted, setTestStarted] = useState(false)
  const [testCompleted, setTestCompleted] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState(null)
  const [showReview, setShowReview] = useState(false)

  // Sample questions for different courses
  const getQuestionsForCourse = (courseName) => {
    const questionSets = {
      "Data Structures": [
        {
          id: 1,
          question: "What is the time complexity of searching in a balanced binary search tree?",
          options: ["O(n)", "O(log n)", "O(n²)", "O(1)"],
          correct: 1,
          difficulty: "Medium",
          explanation: "In a balanced BST, the height is log n, so search operations take O(log n) time.",
        },
        {
          id: 2,
          question: "Which data structure uses LIFO (Last In, First Out) principle?",
          options: ["Queue", "Stack", "Array", "Linked List"],
          correct: 1,
          difficulty: "Easy",
          explanation: "Stack follows LIFO principle where the last element added is the first one to be removed.",
        },
        {
          id: 3,
          question: "What is the worst-case time complexity of Quick Sort?",
          options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
          correct: 1,
          difficulty: "Medium",
          explanation:
            "Quick Sort has O(n²) worst-case complexity when the pivot is always the smallest or largest element.",
        },
        {
          id: 4,
          question: "In a hash table, what happens when two keys hash to the same index?",
          options: ["Error occurs", "Collision occurs", "Data is lost", "Nothing happens"],
          correct: 1,
          difficulty: "Medium",
          explanation:
            "When two keys hash to the same index, it's called a collision and needs to be resolved using techniques like chaining or open addressing.",
        },
        {
          id: 5,
          question: "Which traversal of a binary tree visits nodes in ascending order for a BST?",
          options: ["Pre-order", "In-order", "Post-order", "Level-order"],
          correct: 1,
          difficulty: "Hard",
          explanation:
            "In-order traversal of a BST visits nodes in ascending order: left subtree, root, right subtree.",
        },
      ],
      "Computer Networks": [
        {
          id: 1,
          question: "Which layer of the OSI model is responsible for routing?",
          options: ["Physical Layer", "Data Link Layer", "Network Layer", "Transport Layer"],
          correct: 2,
          difficulty: "Medium",
          explanation: "The Network Layer (Layer 3) is responsible for routing packets between different networks.",
        },
        {
          id: 2,
          question: "What does TCP stand for?",
          options: [
            "Transfer Control Protocol",
            "Transmission Control Protocol",
            "Transport Control Protocol",
            "Technical Control Protocol",
          ],
          correct: 1,
          difficulty: "Easy",
          explanation: "TCP stands for Transmission Control Protocol, which provides reliable data transmission.",
        },
        {
          id: 3,
          question: "Which protocol is used for secure web browsing?",
          options: ["HTTP", "HTTPS", "FTP", "SMTP"],
          correct: 1,
          difficulty: "Easy",
          explanation: "HTTPS (HTTP Secure) uses SSL/TLS encryption to provide secure web browsing.",
        },
        {
          id: 4,
          question: "What is the maximum number of hosts in a /24 subnet?",
          options: ["254", "255", "256", "253"],
          correct: 0,
          difficulty: "Hard",
          explanation:
            "A /24 subnet has 8 host bits, giving 2^8 - 2 = 254 usable host addresses (excluding network and broadcast addresses).",
        },
        {
          id: 5,
          question: "Which device operates at the Data Link Layer?",
          options: ["Router", "Switch", "Hub", "Repeater"],
          correct: 1,
          difficulty: "Medium",
          explanation:
            "Switches operate at the Data Link Layer (Layer 2) and make forwarding decisions based on MAC addresses.",
        },
      ],
      "Web Development": [
        {
          id: 1,
          question: "Which HTML tag is used to create a hyperlink?",
          options: ["<link>", "<a>", "<href>", "<url>"],
          correct: 1,
          difficulty: "Easy",
          explanation: "The <a> (anchor) tag is used to create hyperlinks in HTML.",
        },
        {
          id: 2,
          question: "What does CSS stand for?",
          options: [
            "Computer Style Sheets",
            "Cascading Style Sheets",
            "Creative Style Sheets",
            "Colorful Style Sheets",
          ],
          correct: 1,
          difficulty: "Easy",
          explanation: "CSS stands for Cascading Style Sheets, used for styling HTML elements.",
        },
        {
          id: 3,
          question: "Which JavaScript method is used to add an element to the end of an array?",
          options: ["append()", "push()", "add()", "insert()"],
          correct: 1,
          difficulty: "Medium",
          explanation: "The push() method adds one or more elements to the end of an array and returns the new length.",
        },
        {
          id: 4,
          question: "What is the purpose of the 'alt' attribute in an img tag?",
          options: ["Alternative text", "Alignment", "Animation", "Automatic loading"],
          correct: 0,
          difficulty: "Medium",
          explanation: "The 'alt' attribute provides alternative text for images, important for accessibility and SEO.",
        },
        {
          id: 5,
          question: "Which CSS property is used to change the background color?",
          options: ["color", "bg-color", "background-color", "bgcolor"],
          correct: 2,
          difficulty: "Easy",
          explanation: "The 'background-color' property is used to set the background color of an element.",
        },
      ],
      "Database Systems": [
        {
          id: 1,
          question: "What does SQL stand for?",
          options: [
            "Structured Query Language",
            "Standard Query Language",
            "Simple Query Language",
            "System Query Language",
          ],
          correct: 0,
          difficulty: "Easy",
          explanation: "SQL stands for Structured Query Language, used for managing relational databases.",
        },
        {
          id: 2,
          question: "Which SQL command is used to retrieve data from a database?",
          options: ["GET", "SELECT", "RETRIEVE", "FETCH"],
          correct: 1,
          difficulty: "Easy",
          explanation: "The SELECT command is used to retrieve data from one or more tables in a database.",
        },
        {
          id: 3,
          question: "What is a primary key in a database?",
          options: [
            "A key that opens the database",
            "A unique identifier for records",
            "The first key created",
            "A password",
          ],
          correct: 1,
          difficulty: "Medium",
          explanation:
            "A primary key is a unique identifier for each record in a database table, ensuring no duplicates.",
        },
        {
          id: 4,
          question: "Which normal form eliminates transitive dependencies?",
          options: ["1NF", "2NF", "3NF", "BCNF"],
          correct: 2,
          difficulty: "Hard",
          explanation:
            "Third Normal Form (3NF) eliminates transitive dependencies where non-key attributes depend on other non-key attributes.",
        },
        {
          id: 5,
          question: "What type of JOIN returns all records from both tables?",
          options: ["INNER JOIN", "LEFT JOIN", "RIGHT JOIN", "FULL OUTER JOIN"],
          correct: 3,
          difficulty: "Medium",
          explanation: "FULL OUTER JOIN returns all records from both tables, with NULL values where there's no match.",
        },
      ],
      "Software Engineering": [
        {
          id: 1,
          question: "What does SDLC stand for?",
          options: [
            "Software Development Life Cycle",
            "System Development Life Cycle",
            "Software Design Life Cycle",
            "System Design Life Cycle",
          ],
          correct: 0,
          difficulty: "Easy",
          explanation:
            "SDLC stands for Software Development Life Cycle, a process for planning, creating, testing, and deploying software.",
        },
        {
          id: 2,
          question: "Which design pattern ensures a class has only one instance?",
          options: ["Factory", "Observer", "Singleton", "Strategy"],
          correct: 2,
          difficulty: "Medium",
          explanation:
            "The Singleton pattern ensures that a class has only one instance and provides global access to it.",
        },
        {
          id: 3,
          question: "What is the main purpose of version control systems?",
          options: ["Code compilation", "Track changes in code", "Code execution", "Code debugging"],
          correct: 1,
          difficulty: "Medium",
          explanation:
            "Version control systems track changes in code over time, allowing collaboration and history management.",
        },
        {
          id: 4,
          question: "Which testing approach tests individual components in isolation?",
          options: ["Integration Testing", "System Testing", "Unit Testing", "Acceptance Testing"],
          correct: 2,
          difficulty: "Medium",
          explanation:
            "Unit Testing focuses on testing individual components or modules in isolation to ensure they work correctly.",
        },
        {
          id: 5,
          question: "What does DRY principle stand for?",
          options: ["Don't Repeat Yourself", "Do Repeat Yourself", "Don't Reuse Yourself", "Do Reuse Yourself"],
          correct: 0,
          difficulty: "Hard",
          explanation: "DRY stands for Don't Repeat Yourself, a principle that aims to reduce repetition in code.",
        },
      ],
    }
    return questionSets[courseName] || questionSets["Data Structures"]
  }

  const [questions] = useState(() => getQuestionsForCourse(course?.name))

  // Timer effect
  useEffect(() => {
    let interval = null
    if (testStarted && !testCompleted && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            handleSubmitTest()
            return 0
          }
          return time - 1
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [testStarted, testCompleted, timeLeft])

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentQuestion(0)
      setAnswers({})
      setTimeLeft(1800)
      setTestStarted(false)
      setTestCompleted(false)
      setShowResults(false)
      setResults(null)
      setShowReview(false)
    }
  }, [isOpen])

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  const getTimeColor = () => {
    if (timeLeft > 600) return "text-green-600" // > 10 minutes
    if (timeLeft > 300) return "text-yellow-600" // > 5 minutes
    return "text-red-600" // <= 5 minutes
  }

  const handleStartTest = () => {
    setTestStarted(true)
  }

  const handleAnswerSelect = (questionId, answerIndex) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1)
    }
  }

  const handleQuestionJump = (questionIndex) => {
    setCurrentQuestion(questionIndex)
  }

  const calculateResults = () => {
    let correct = 0
    questions.forEach((question) => {
      if (answers[question.id] === question.correct) {
        correct++
      }
    })

    const percentage = Math.round((correct / questions.length) * 100)
    const passed = percentage >= 60

    let grade = "F"
    if (percentage >= 90) grade = "A+"
    else if (percentage >= 85) grade = "A"
    else if (percentage >= 80) grade = "A-"
    else if (percentage >= 75) grade = "B+"
    else if (percentage >= 70) grade = "B"
    else if (percentage >= 65) grade = "B-"
    else if (percentage >= 60) grade = "C"

    return {
      score: correct,
      total: questions.length,
      percentage,
      grade,
      passed,
      timeLeft,
    }
  }

  const handleSubmitTest = () => {
    const testResults = calculateResults()
    setResults(testResults)
    setTestCompleted(true)
    setShowResults(true)
  }

  const handleRetakeTest = () => {
    setCurrentQuestion(0)
    setAnswers({})
    setTimeLeft(1800)
    setTestStarted(false)
    setTestCompleted(false)
    setShowResults(false)
    setResults(null)
    setShowReview(false)
  }

  const handleFinishTest = () => {
    if (results) {
      onTestComplete(results)
    }
    onClose()
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Easy":
        return "bg-green-100 text-green-700"
      case "Medium":
        return "bg-yellow-100 text-yellow-700"
      case "Hard":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  const getAnsweredQuestions = () => {
    return Object.keys(answers).length
  }

  if (!isOpen || !course) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {!testStarted ? (
          // Test Instructions
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Brain className="w-10 h-10 text-blue-600" />
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">{course.name} Assessment</h2>
              <p className="text-gray-600">Test your knowledge and skills</p>
            </div>

            <div className="bg-blue-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Test Instructions</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700">
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-blue-600" />
                  <span>Duration: 30 minutes</span>
                </div>
                <div className="flex items-center gap-3">
                  <Target className="w-5 h-5 text-blue-600" />
                  <span>Questions: {questions.length}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle className="w-5 h-5 text-blue-600" />
                  <span>Passing Score: 60%</span>
                </div>
                <div className="flex items-center gap-3">
                  <Trophy className="w-5 h-5 text-blue-600" />
                  <span>Multiple Choice</span>
                </div>
              </div>
            </div>

            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div className="text-sm text-yellow-800">
                  <p className="font-medium mb-1">Important Notes:</p>
                  <ul className="list-disc list-inside space-y-1">
                    <li>You cannot pause the test once started</li>
                    <li>All questions must be answered</li>
                    <li>You can navigate between questions</li>
                    <li>Test will auto-submit when time expires</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleStartTest}
                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Brain className="w-5 h-5" />
                Start Test
              </button>
            </div>
          </div>
        ) : showResults ? (
          // Results Screen
          <div className="p-8">
            <div className="text-center mb-8">
              <div
                className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  results.passed ? "bg-green-100" : "bg-red-100"
                }`}
              >
                {results.passed ? (
                  <Trophy className="w-10 h-10 text-green-600" />
                ) : (
                  <XCircle className="w-10 h-10 text-red-600" />
                )}
              </div>
              <h2 className="text-3xl font-bold text-gray-800 mb-2">
                {results.passed ? "Congratulations!" : "Test Completed"}
              </h2>
              <p className={`text-lg ${results.passed ? "text-green-600" : "text-red-600"}`}>
                {results.passed ? "You passed the test!" : "You need more practice"}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-blue-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-blue-600 mb-2">{results.percentage}%</div>
                <div className="text-sm text-gray-600">Overall Score</div>
              </div>
              <div className="bg-purple-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-purple-600 mb-2">{results.grade}</div>
                <div className="text-sm text-gray-600">Grade</div>
              </div>
              <div className="bg-orange-50 rounded-xl p-6 text-center">
                <div className="text-3xl font-bold text-orange-600 mb-2">
                  {results.score}/{results.total}
                </div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
            </div>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Test Summary</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-600">Course:</span>
                  <span className="ml-2 font-medium">{course.name}</span>
                </div>
                <div>
                  <span className="text-gray-600">Time Spent:</span>
                  <span className="ml-2 font-medium">{30 - Math.floor(results.timeLeft / 60)} minutes</span>
                </div>
                <div>
                  <span className="text-gray-600">Status:</span>
                  <span className={`ml-2 font-medium ${results.passed ? "text-green-600" : "text-red-600"}`}>
                    {results.passed ? "PASSED" : "FAILED"}
                  </span>
                </div>
                <div>
                  <span className="text-gray-600">Passing Score:</span>
                  <span className="ml-2 font-medium">60%</span>
                </div>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <button
                onClick={() => setShowReview(true)}
                className="px-6 py-3 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
              >
                <Target className="w-5 h-5" />
                Review Answers
              </button>
              {!results.passed && (
                <button
                  onClick={handleRetakeTest}
                  className="px-6 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
                >
                  <RotateCcw className="w-5 h-5" />
                  Retake Test
                </button>
              )}
              <button
                onClick={handleFinishTest}
                className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
              >
                <Award className="w-5 h-5" />
                Finish
              </button>
            </div>
          </div>
        ) : showReview ? (
          // Review Screen
          <div className="flex flex-col h-full max-h-[90vh]">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Answer Review</h2>
                <button onClick={() => setShowReview(false)} className="text-gray-500 hover:text-gray-700">
                  <ArrowLeft className="w-6 h-6" />
                </button>
              </div>
            </div>
            <div className="flex-1 overflow-y-auto p-6">
              <div className="space-y-6">
                {questions.map((question, index) => {
                  const userAnswer = answers[question.id]
                  const isCorrect = userAnswer === question.correct
                  return (
                    <div key={question.id} className="bg-gray-50 rounded-xl p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                            Q{index + 1}
                          </span>
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(question.difficulty)}`}
                          >
                            {question.difficulty}
                          </span>
                        </div>
                        <div className={`p-2 rounded-full ${isCorrect ? "bg-green-100" : "bg-red-100"}`}>
                          {isCorrect ? (
                            <CheckCircle className="w-5 h-5 text-green-600" />
                          ) : (
                            <XCircle className="w-5 h-5 text-red-600" />
                          )}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-gray-800 mb-4">{question.question}</h3>
                      <div className="space-y-2 mb-4">
                        {question.options.map((option, optionIndex) => (
                          <div
                            key={optionIndex}
                            className={`p-3 rounded-lg border ${
                              optionIndex === question.correct
                                ? "bg-green-50 border-green-200 text-green-800"
                                : optionIndex === userAnswer && userAnswer !== question.correct
                                  ? "bg-red-50 border-red-200 text-red-800"
                                  : "bg-white border-gray-200"
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <span className="font-medium">{String.fromCharCode(65 + optionIndex)}.</span>
                              <span>{option}</span>
                              {optionIndex === question.correct && (
                                <CheckCircle className="w-4 h-4 text-green-600 ml-auto" />
                              )}
                              {optionIndex === userAnswer && userAnswer !== question.correct && (
                                <XCircle className="w-4 h-4 text-red-600 ml-auto" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <h4 className="font-semibold text-blue-800 mb-2">Explanation:</h4>
                        <p className="text-blue-700 text-sm">{question.explanation}</p>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        ) : (
          // Test Interface
          <div className="flex flex-col h-full max-h-[90vh]">
            {/* Header */}
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{course.name} Test</h2>
                  <p className="text-gray-600">
                    Question {currentQuestion + 1} of {questions.length}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`flex items-center gap-2 ${getTimeColor()}`}>
                    <Clock className="w-5 h-5" />
                    <span className="font-mono text-lg font-bold">{formatTime(timeLeft)}</span>
                  </div>
                  <div className="text-sm text-gray-600">
                    {getAnsweredQuestions()}/{questions.length} answered
                  </div>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>

            {/* Question Navigation */}
            <div className="p-4 border-b border-gray-200 bg-gray-50">
              <div className="flex flex-wrap gap-2">
                {questions.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuestionJump(index)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                      index === currentQuestion
                        ? "bg-blue-600 text-white"
                        : answers[questions[index].id] !== undefined
                          ? "bg-green-100 text-green-700 border border-green-200"
                          : "bg-white text-gray-600 border border-gray-200 hover:bg-gray-50"
                    }`}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            </div>

            {/* Question Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="max-w-3xl mx-auto">
                <div className="mb-6">
                  <div className="flex items-center gap-3 mb-4">
                    <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                      Question {currentQuestion + 1}
                    </span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(questions[currentQuestion].difficulty)}`}
                    >
                      {questions[currentQuestion].difficulty}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 leading-relaxed">
                    {questions[currentQuestion].question}
                  </h3>
                </div>

                <div className="space-y-3">
                  {questions[currentQuestion].options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswerSelect(questions[currentQuestion].id, index)}
                      className={`w-full text-left p-4 rounded-xl border-2 transition-all duration-200 ${
                        answers[questions[currentQuestion].id] === index
                          ? "border-blue-500 bg-blue-50 text-blue-800"
                          : "border-gray-200 bg-white hover:border-blue-300 hover:bg-blue-25"
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                            answers[questions[currentQuestion].id] === index
                              ? "border-blue-500 bg-blue-500"
                              : "border-gray-300"
                          }`}
                        >
                          {answers[questions[currentQuestion].id] === index && (
                            <CheckCircle className="w-4 h-4 text-white" />
                          )}
                        </div>
                        <div>
                          <span className="font-medium text-gray-700 mr-3">{String.fromCharCode(65 + index)}.</span>
                          <span className="text-gray-800">{option}</span>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Navigation Footer */}
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="flex items-center justify-between">
                <button
                  onClick={handlePreviousQuestion}
                  disabled={currentQuestion === 0}
                  className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <ArrowLeft className="w-4 h-4" />
                  Previous
                </button>

                <div className="flex items-center gap-4">
                  {currentQuestion === questions.length - 1 ? (
                    <button
                      onClick={handleSubmitTest}
                      className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg transition-colors flex items-center gap-2"
                    >
                      <Trophy className="w-4 h-4" />
                      Submit Test
                    </button>
                  ) : (
                    <button
                      onClick={handleNextQuestion}
                      className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Next
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
