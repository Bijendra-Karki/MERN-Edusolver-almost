"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import {
  BookOpen,
  Trophy,
  Clock,
  User,
  Users,
  Home,
  Code,
  FileText,
  CheckSquare,
  Folder,
  Settings,
  GraduationCap,
  Award,
  Target,
  Activity,
  ChevronRight,
  Brain,
  Zap,
  CheckCircle,
  MessageSquare,
  Play,
  AlertCircle,
} from "lucide-react"
import ExpertsList from "./ExpertsList"
import Feed from "../components/feed/Feed"
import Navbar from "../components/ToperFooter/Navbar"
import ContactPage from "../components/Contact/ContactPage"
import { BreadCrumb } from "../components/ToperFooter/BreadCrumb"
import { About } from "../components/about/About"
import { WhatWeDone } from "../components/about/WhatWeDone"
import { OurMission } from "../components/about/OurMission"
import { TeamSection } from "../components/about/TeamSection"
import { CTASection } from "../components/about/CTASection"
import Footer from "../components/ToperFooter/Footer"
import ServiceSection from "../components/service/ServiceSection"
import ServiceHowWeWork from "../components/service/ServiceHowWeWork"
import PricingSection from "../components/service/PricingSection"

export default function ClientPanel() {
  const [testHistory, setTestHistory] = useState([
    {
      id: 1,
      courseName: "Data Structures",
      date: "2024-01-10",
      score: 8,
      total: 10,
      percentage: 80,
      grade: "A",
      timeSpent: 25,
      passed: true,
    },
    {
      id: 2,
      courseName: "Computer Networks",
      date: "2024-01-05",
      score: 6,
      total: 10,
      percentage: 60,
      grade: "B",
      timeSpent: 30,
      passed: true,
    },
  ])

  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("home")
  const [currentTest, setCurrentTest] = useState(null)
  const [testQuestions, setTestQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswers, setSelectedAnswers] = useState({})
  const [testStartTime, setTestStartTime] = useState(null)
  const [showTestResults, setShowTestResults] = useState(false)
  const [testResults, setTestResults] = useState(null)

  // Navigation links for the client panel
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/service", label: "Services" },
    { path: "/contact", label: "Contact" },
  ]

  const [studentData, setStudentData] = useState({
    enrolledCourses: [
      {
        id: 1,
        name: "Data Structures",
        instructor: "Dr. Smith",
        progress: 75,
        color: "blue",
        totalLessons: 20,
        completedLessons: 15,
        nextLesson: "Binary Trees",
        difficulty: "Intermediate",
        estimatedTime: "2 hours",
        lastAccessed: "2 days ago",
      },
      {
        id: 2,
        name: "Computer Networks",
        instructor: "Prof. Johnson",
        progress: 45,
        color: "green",
        totalLessons: 18,
        completedLessons: 8,
        nextLesson: "TCP/IP Protocol",
        difficulty: "Advanced",
        estimatedTime: "3 hours",
        lastAccessed: "1 week ago",
      },
      {
        id: 3,
        name: "Web Development",
        instructor: "Dr. Brown",
        progress: 90,
        color: "purple",
        totalLessons: 25,
        completedLessons: 22,
        nextLesson: "React Hooks",
        difficulty: "Beginner",
        estimatedTime: "1.5 hours",
        lastAccessed: "Yesterday",
      },
      {
        id: 4,
        name: "Database Systems",
        instructor: "Prof. Davis",
        progress: 30,
        color: "orange",
        totalLessons: 22,
        completedLessons: 7,
        nextLesson: "SQL Joins",
        difficulty: "Intermediate",
        estimatedTime: "2.5 hours",
        lastAccessed: "3 days ago",
      },
      {
        id: 5,
        name: "Software Engineering",
        instructor: "Dr. Wilson",
        progress: 60,
        color: "indigo",
        totalLessons: 24,
        completedLessons: 14,
        nextLesson: "Design Patterns",
        difficulty: "Advanced",
        estimatedTime: "2 hours",
        lastAccessed: "5 days ago",
      },
    ],
    assignments: [
      {
        id: 1,
        title: "Binary Search Tree Implementation",
        course: "Data Structures",
        dueDate: "2025-01-25",
        status: "pending",
        priority: "high",
      },
      {
        id: 2,
        title: "Network Protocol Analysis",
        course: "Computer Networks",
        dueDate: "2025-01-28",
        status: "in-progress",
        priority: "medium",
      },
      {
        id: 3,
        title: "React Component Design",
        course: "Web Development",
        dueDate: "2025-01-22",
        status: "completed",
        priority: "low",
      },
      {
        id: 4,
        title: "Database Design Project",
        course: "Database Systems",
        dueDate: "2025-02-01",
        status: "pending",
        priority: "medium",
      },
      {
        id: 5,
        title: "Software Architecture Document",
        course: "Software Engineering",
        dueDate: "2025-01-30",
        status: "in-progress",
        priority: "high",
      },
    ],
    recentMessages: [
      {
        id: 1,
        from: "Dr. Smith",
        message: "Great progress on your tree algorithms! Focus more on balancing techniques.",
        timestamp: "2 hours ago",
        course: "Data Structures",
      },
      {
        id: 2,
        from: "Prof. Johnson",
        message: "Your network analysis was excellent. Try implementing the routing algorithms next.",
        timestamp: "1 day ago",
        course: "Computer Networks",
      },
      {
        id: 3,
        from: "Dr. Brown",
        message: "Your React components are well-structured. Consider adding more interactive features.",
        timestamp: "3 days ago",
        course: "Web Development",
      },
    ],
  })

  // Sample test questions for different courses
  const sampleQuestions = {
    "Data Structures": [
      {
        id: 1,
        question: "What is the time complexity of searching in a balanced binary search tree?",
        options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "Which data structure uses LIFO (Last In First Out) principle?",
        options: ["Queue", "Stack", "Array", "Linked List"],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "What is the worst-case time complexity of Quick Sort?",
        options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "In a hash table, what happens when two keys hash to the same index?",
        options: ["Error occurs", "Collision occurs", "Data is lost", "Nothing happens"],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "Which traversal method visits the root node first?",
        options: ["Inorder", "Preorder", "Postorder", "Level order"],
        correctAnswer: 1,
      },
    ],
    "Computer Networks": [
      {
        id: 1,
        question: "Which layer of the OSI model handles routing?",
        options: ["Physical", "Data Link", "Network", "Transport"],
        correctAnswer: 2,
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
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "Which protocol is used for email transmission?",
        options: ["HTTP", "FTP", "SMTP", "DNS"],
        correctAnswer: 2,
      },
      {
        id: 4,
        question: "What is the default port number for HTTP?",
        options: ["21", "25", "80", "443"],
        correctAnswer: 2,
      },
      {
        id: 5,
        question: "Which device operates at the Network layer?",
        options: ["Hub", "Switch", "Router", "Repeater"],
        correctAnswer: 2,
      },
    ],
    "Web Development": [
      {
        id: 1,
        question: "Which HTML tag is used for the largest heading?",
        options: ["<h6>", "<h1>", "<header>", "<head>"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "What does CSS stand for?",
        options: ["Computer Style Sheets", "Cascading Style Sheets", "Creative Style Sheets", "Colorful Style Sheets"],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "Which JavaScript method is used to add an element to the end of an array?",
        options: ["push()", "pop()", "shift()", "unshift()"],
        correctAnswer: 0,
      },
      {
        id: 4,
        question: "What is the correct way to create a function in JavaScript?",
        options: [
          "function = myFunction() {}",
          "function myFunction() {}",
          "create myFunction() {}",
          "def myFunction() {}",
        ],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "Which CSS property is used to change the text color?",
        options: ["text-color", "font-color", "color", "text-style"],
        correctAnswer: 2,
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
        correctAnswer: 0,
      },
      {
        id: 2,
        question: "Which SQL command is used to retrieve data from a database?",
        options: ["GET", "SELECT", "RETRIEVE", "FETCH"],
        correctAnswer: 1,
      },
      {
        id: 3,
        question: "What is a primary key?",
        options: [
          "A key that opens the database",
          "A unique identifier for a record",
          "The first key in a table",
          "A password for the database",
        ],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "Which normal form eliminates partial dependencies?",
        options: ["1NF", "2NF", "3NF", "BCNF"],
        correctAnswer: 1,
      },
      {
        id: 5,
        question: "What is a foreign key?",
        options: [
          "A key from another country",
          "A key that references another table",
          "An encrypted key",
          "A backup key",
        ],
        correctAnswer: 1,
      },
    ],
    "Software Engineering": [
      {
        id: 1,
        question: "Which software development model follows a linear sequential approach?",
        options: ["Agile", "Waterfall", "Spiral", "RAD"],
        correctAnswer: 1,
      },
      {
        id: 2,
        question: "What does UML stand for?",
        options: [
          "Unified Modeling Language",
          "Universal Modeling Language",
          "Unique Modeling Language",
          "Updated Modeling Language",
        ],
        correctAnswer: 0,
      },
      {
        id: 3,
        question: "Which testing technique examines the internal structure of the software?",
        options: ["Black box testing", "White box testing", "Gray box testing", "Unit testing"],
        correctAnswer: 1,
      },
      {
        id: 4,
        question: "What is the main purpose of version control systems?",
        options: [
          "To control software versions",
          "To track changes in code",
          "To manage team collaboration",
          "All of the above",
        ],
        correctAnswer: 3,
      },
      {
        id: 5,
        question: "Which design pattern ensures only one instance of a class exists?",
        options: ["Factory", "Observer", "Singleton", "Strategy"],
        correctAnswer: 2,
      },
    ],
  }

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    } else {
      navigate("/login")
    }
  }, [navigate])

  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    } else {
      setActiveTab("home")
    }
  }, [searchParams])

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
    const newSearchParams = new URLSearchParams(searchParams)
    if (newTab === "home") {
      newSearchParams.delete("tab")
    } else {
      newSearchParams.set("tab", newTab)
    }
    setSearchParams(newSearchParams)
  }

  const handleTestClick = (course) => {
    const questions = sampleQuestions[course.name] || []
    if (questions.length > 0) {
      setCurrentTest(course)
      setTestQuestions(questions)
      setCurrentQuestionIndex(0)
      setSelectedAnswers({})
      setTestStartTime(new Date())
      setShowTestResults(false)
      setActiveTab("test-taking")
    }
  }

  const handleAnswerSelect = (questionId, answerIndex) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [questionId]: answerIndex,
    }))
  }

  const handleNextQuestion = () => {
    if (currentQuestionIndex < testQuestions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
    }
  }

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1)
    }
  }

  const handleSubmitTest = () => {
    const endTime = new Date()
    const timeSpent = Math.round((endTime - testStartTime) / (1000 * 60)) // in minutes

    let correctAnswers = 0
    testQuestions.forEach((question) => {
      if (selectedAnswers[question.id] === question.correctAnswer) {
        correctAnswers++
      }
    })

    const percentage = Math.round((correctAnswers / testQuestions.length) * 100)
    const passed = percentage >= 60
    const grade =
      percentage >= 90 ? "A+" : percentage >= 80 ? "A" : percentage >= 70 ? "B+" : percentage >= 60 ? "B" : "F"

    const newTestResult = {
      id: testHistory.length + 1,
      courseName: currentTest.name,
      date: new Date().toISOString().split("T")[0],
      score: correctAnswers,
      total: testQuestions.length,
      percentage,
      grade,
      timeSpent,
      passed,
    }

    setTestResults(newTestResult)
    setTestHistory((prev) => [...prev, newTestResult])
    setShowTestResults(true)
  }

  const handleBackToDashboard = () => {
    setCurrentTest(null)
    setTestQuestions([])
    setCurrentQuestionIndex(0)
    setSelectedAnswers({})
    setTestStartTime(null)
    setShowTestResults(false)
    setTestResults(null)
    setActiveTab("tests")
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700 border-green-200"
      case "in-progress":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "pending":
        return "bg-red-100 text-red-700 border-red-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high":
        return "bg-red-500"
      case "medium":
        return "bg-yellow-500"
      case "low":
        return "bg-green-500"
      default:
        return "bg-gray-500"
    }
  }

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "Beginner":
        return "bg-green-100 text-green-700"
      case "Intermediate":
        return "bg-yellow-100 text-yellow-700"
      case "Advanced":
        return "bg-red-100 text-red-700"
      default:
        return "bg-gray-100 text-gray-700"
    }
  }

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  // Render test taking interface
  if (activeTab === "test-taking" && currentTest && !showTestResults) {
    const currentQuestion = testQuestions[currentQuestionIndex]
    const progress = ((currentQuestionIndex + 1) / testQuestions.length) * 100

    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-4xl mx-auto">
          {/* Test Header */}
          <div className="bg-white rounded-xl p-6 shadow-sm mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-800">{currentTest.name} - Assessment Test</h1>
                <p className="text-gray-600">
                  Question {currentQuestionIndex + 1} of {testQuestions.length}
                </p>
              </div>
              <button
                onClick={handleBackToDashboard}
                className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-lg transition-colors"
              >
                Exit Test
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-xl p-8 shadow-sm mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">{currentQuestion.question}</h2>

            <div className="space-y-4">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(currentQuestion.id, index)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 ${
                    selectedAnswers[currentQuestion.id] === index
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-200 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                        selectedAnswers[currentQuestion.id] === index
                          ? "border-blue-500 bg-blue-500"
                          : "border-gray-300"
                      }`}
                    >
                      {selectedAnswers[currentQuestion.id] === index && <CheckCircle className="w-4 h-4 text-white" />}
                    </div>
                    <span className="text-gray-800">{option}</span>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Navigation Buttons */}
          <div className="flex justify-between">
            <button
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
              className="bg-gray-500 hover:bg-gray-600 disabled:bg-gray-300 text-white px-6 py-3 rounded-lg transition-colors disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex gap-4">
              {currentQuestionIndex === testQuestions.length - 1 ? (
                <button
                  onClick={handleSubmitTest}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
                >
                  Submit Test
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Render test results
  if (showTestResults && testResults) {
    return (
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4">
        <div className="max-w-2xl mx-auto">
          <div className="bg-white rounded-xl p-8 shadow-sm text-center">
            <div
              className={`w-20 h-20 mx-auto mb-6 rounded-full flex items-center justify-center ${
                testResults.passed ? "bg-green-100" : "bg-red-100"
              }`}
            >
              {testResults.passed ? (
                <Trophy className="w-10 h-10 text-green-600" />
              ) : (
                <AlertCircle className="w-10 h-10 text-red-600" />
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-800 mb-2">
              {testResults.passed ? "Congratulations!" : "Keep Trying!"}
            </h1>

            <p className="text-gray-600 mb-8">
              You have {testResults.passed ? "passed" : "failed"} the {currentTest.name} assessment test
            </p>

            <div className="grid grid-cols-2 gap-6 mb-8">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{testResults.percentage}%</div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{testResults.grade}</div>
                <div className="text-sm text-gray-600">Grade</div>
              </div>
              <div className="bg-yellow-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-yellow-600">
                  {testResults.score}/{testResults.total}
                </div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div className="bg-purple-50 p-4 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{testResults.timeSpent} min</div>
                <div className="text-sm text-gray-600">Time Taken</div>
              </div>
            </div>

            <button
              onClick={handleBackToDashboard}
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg transition-colors font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  // Render different content based on active tab using switch case
  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <div className="min-h-screen bg-blue-100">
            <BreadCrumb content="About Us" icon1={Home} icon2={ChevronRight} />
            <About />
            <WhatWeDone />
            <OurMission />
            <TeamSection />
            <CTASection />
            <Footer />
          </div>
        )
      case "services":
        return (
          <>
            <BreadCrumb content="Service" icon1={Home} icon2={ChevronRight} />
            <ServiceSection />
            <ServiceHowWeWork />
            <PricingSection
              plans={[
                {
                  title: "Starter",
                  price: "$1",
                  period: "/month",
                  features: ["Feature 1", "Feature 2", "Feature 2"],
                  variant: "blue",
                },
                {
                  title: "Pro",
                  price: "$12",
                  period: "/yearly",
                  features: ["All Starter features", "Feature 3", "Feature 4", "Feature 5"],
                  variant: "dark",
                  isPopular: true,
                },
                {
                  title: "Pro",
                  price: "$4",
                  period: "/quarter month",
                  features: ["All Starter features", "Feature 3", "Feature 4"],
                  variant: "blue",
                },
              ]}
            />
            <Footer />
          </>
        )
      case "contact":
        return <ContactPage />
      case "home":
      default:
        return renderDashboardContent()
    }
  }

  const renderDashboardContent = () => (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Tabs */}
      <div className="w-full px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
        <div className="flex flex-wrap gap-1 sm:gap-2 lg:gap-4 mb-4 sm:mb-6 overflow-x-auto">
          {[
            { id: "home", label: "Dashboard", icon: Home },
            { id: "feed", label: "Activity Feed", icon: Activity },
            { id: "courses", label: "My Courses", icon: BookOpen, count: studentData.enrolledCourses.length },
            { id: "tests", label: "Tests & Quiz", icon: Brain, count: testHistory.length },
            { id: "messages", label: "Messages", icon: MessageSquare, count: studentData.recentMessages.length },
            { id: "experts", label: "Find Experts", icon: Users },
            { id: "profile", label: "Profile", icon: User },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`px-2 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base whitespace-nowrap ${
                activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-blue-50 border border-blue-100"
              }`}
            >
              <tab.icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
              <span className="hidden sm:inline">{tab.label}</span>
              <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
              {tab.count !== undefined && (
                <span
                  className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${
                    activeTab === tab.id ? "bg-white/20" : "bg-blue-100 text-blue-600"
                  }`}
                >
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </div>

        {/* Tab Content using switch case */}
        {(() => {
          switch (activeTab) {
            case "home":
              return (
                <div className="space-y-4 sm:space-y-6">
                  {/* Welcome Message for Mobile */}
                  <div className="sm:hidden mb-4 text-center">
                    <p className="text-gray-700 font-medium">Welcome, {user.name}!</p>
                  </div>

                  {/* Progress Cards */}
                  <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3 sm:mb-5">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-50 rounded-full flex items-center justify-center">
                          <BookOpen className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs sm:text-sm">Courses Enrolled</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-800">5</p>
                        </div>
                      </div>
                      <div className="w-full bg-blue-100 rounded-full h-3 sm:h-4">
                        <div className="bg-blue-600 h-3 sm:h-4 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
                      <div className="flex items-center gap-3 mb-3 sm:mb-5">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-yellow-50 rounded-full flex items-center justify-center">
                          <Trophy className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs sm:text-sm">Achievements</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-800">12</p>
                        </div>
                      </div>
                      <div className="w-full bg-yellow-100 rounded-full h-3 sm:h-4">
                        <div className="bg-yellow-500 h-3 sm:h-4 rounded-full" style={{ width: "80%" }}></div>
                      </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300 sm:col-span-2 lg:col-span-1">
                      <div className="flex items-center gap-3 mb-3 sm:mb-5">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-green-50 rounded-full flex items-center justify-center">
                          <Clock className="w-5 h-5 sm:w-6 sm:h-6 text-green-600" />
                        </div>
                        <div>
                          <p className="text-gray-600 text-xs sm:text-sm">Study Hours</p>
                          <p className="text-xl sm:text-2xl font-bold text-gray-800">24</p>
                        </div>
                      </div>
                      <div className="w-full bg-green-100 rounded-full h-3 sm:h-4">
                        <div className="bg-green-500 h-3 sm:h-4 rounded-full" style={{ width: "45%" }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Recent Courses */}
                  <div className="w-full bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-4 sm:p-6 shadow-sm">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Recent Courses</h2>
                    <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                      <div className="bg-blue-50 rounded-lg p-4 hover:bg-blue-100 transition-all duration-300 border border-blue-100">
                        <h3 className="text-gray-800 font-semibold mb-2 text-sm sm:text-base">Data Structures</h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-3">Progress: 75%</p>
                        <div className="w-full bg-blue-200 rounded-full h-3 sm:h-4">
                          <div className="bg-blue-600 h-3 sm:h-4 rounded-full" style={{ width: "75%" }}></div>
                        </div>
                      </div>

                      <div className="bg-green-50 rounded-lg p-4 hover:bg-green-100 transition-all duration-300 border border-green-100">
                        <h3 className="text-gray-800 font-semibold mb-2 text-sm sm:text-base">Database Systems</h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-3">Progress: 45%</p>
                        <div className="w-full bg-green-200 rounded-full h-3 sm:h-4">
                          <div className="bg-green-500 h-3 sm:h-4 rounded-full" style={{ width: "45%" }}></div>
                        </div>
                      </div>

                      <div className="bg-yellow-50 rounded-lg p-4 hover:bg-yellow-100 transition-all duration-300 border border-yellow-100 md:col-span-2 xl:col-span-1">
                        <h3 className="text-gray-800 font-semibold mb-2 text-sm sm:text-base">Computer Networks</h3>
                        <p className="text-gray-600 text-xs sm:text-sm mb-3">Progress: 90%</p>
                        <div className="w-full bg-yellow-200 rounded-full h-3 sm:h-4">
                          <div className="bg-yellow-500 h-3 sm:h-4 rounded-full" style={{ width: "90%" }}></div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions & Profile */}
                  <div className="w-full grid grid-cols-1 xl:grid-cols-2 gap-6">
                    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-4 sm:p-6 shadow-sm">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Quick Actions</h2>
                      <div className="w-full grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-1 gap-3">
                        <button
                          onClick={() => navigate("/courses")}
                          className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 text-gray-800 border border-blue-100 text-sm sm:text-base flex items-center gap-3"
                        >
                          <BookOpen className="w-5 h-5 text-blue-600" />
                          <div>
                            <div className="font-medium">Browse Programming Courses</div>
                            <div className="text-xs text-gray-500">Java, Python, C++, Web Development</div>
                          </div>
                        </button>

                        <button
                          onClick={() => navigate("/practice")}
                          className="w-full text-left p-3 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-300 text-gray-800 border border-green-100 text-sm sm:text-base flex items-center gap-3"
                        >
                          <Code className="w-5 h-5 text-green-600" />
                          <div>
                            <div className="font-medium">Code Practice Arena</div>
                            <div className="text-xs text-gray-500">Solve coding problems & challenges</div>
                          </div>
                        </button>

                        <button
                          onClick={() => navigate("/materials")}
                          className="w-full text-left p-3 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all duration-300 text-gray-800 border border-purple-100 text-sm sm:text-base flex items-center gap-3"
                        >
                          <FileText className="w-5 h-5 text-purple-600" />
                          <div>
                            <div className="font-medium">Study Materials</div>
                            <div className="text-xs text-gray-500">Notes, PDFs, Reference books</div>
                          </div>
                        </button>

                        <button
                          onClick={() => setActiveTab("assignments")}
                          className="w-full text-left p-3 bg-orange-50 hover:bg-orange-100 rounded-lg transition-all duration-300 text-gray-800 border border-orange-100 text-sm sm:text-base flex items-center gap-3"
                        >
                          <CheckSquare className="w-5 h-5 text-orange-600" />
                          <div>
                            <div className="font-medium">Assignment Tracker</div>
                            <div className="text-xs text-gray-500">Track deadlines & submissions</div>
                          </div>
                        </button>

                        <button
                          onClick={() => navigate("/projects")}
                          className="w-full text-left p-3 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all duration-300 text-gray-800 border border-indigo-100 text-sm sm:text-base flex items-center gap-3"
                        >
                          <Folder className="w-5 h-5 text-indigo-600" />
                          <div>
                            <div className="font-medium">Project Showcase</div>
                            <div className="text-xs text-gray-500">Share & explore student projects</div>
                          </div>
                        </button>

                        <button
                          onClick={() => navigate("/study-groups")}
                          className="w-full text-left p-3 bg-teal-50 hover:bg-teal-100 rounded-lg transition-all duration-300 text-gray-800 border border-teal-100 text-sm sm:text-base flex items-center gap-3"
                        >
                          <Users className="w-5 h-5 text-teal-600" />
                          <div>
                            <div className="font-medium">Join Study Groups</div>
                            <div className="text-xs text-gray-500">Collaborate with classmates</div>
                          </div>
                        </button>
                      </div>
                    </div>

                    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-4 sm:p-6 shadow-sm">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Student Profile</h2>
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 sm:w-16 sm:h-16 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-gray-800 font-semibold text-sm sm:text-base truncate">{user.name}</p>
                          <p className="text-gray-600 text-xs sm:text-sm truncate">{user.email}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-blue-600 text-xs sm:text-sm capitalize bg-blue-100 px-2 py-1 rounded">
                              {user.role}
                            </span>
                            <span className="text-green-600 text-xs bg-green-100 px-2 py-1 rounded">CSIT Student</span>
                          </div>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-blue-50 p-3 rounded-lg text-center">
                          <div className="text-lg font-bold text-blue-600">3.7</div>
                          <div className="text-xs text-gray-600">Current GPA</div>
                        </div>
                        <div className="bg-green-50 p-3 rounded-lg text-center">
                          <div className="text-lg font-bold text-green-600">6th</div>
                          <div className="text-xs text-gray-600">Semester</div>
                        </div>
                      </div>

                      <div className="w-full space-y-3">
                        <button
                          onClick={() => setActiveTab("profile")}
                          className="w-full p-3 sm:p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 text-gray-800 border border-blue-100 text-sm sm:text-base flex items-center gap-3"
                        >
                          <Settings className="w-4 h-4 text-blue-600" />
                          Edit Profile & Academic Info
                        </button>

                        <button
                          onClick={() => navigate("/academic-record")}
                          className="w-full p-3 sm:p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-all duration-300 text-gray-800 border border-green-100 text-sm sm:text-base flex items-center gap-3"
                        >
                          <GraduationCap className="w-4 h-4 text-green-600" />
                          Academic Record & Transcripts
                        </button>

                        <button
                          onClick={() => navigate("/achievements")}
                          className="w-full p-3 sm:p-4 bg-yellow-50 hover:bg-yellow-100 rounded-lg transition-all duration-300 text-gray-800 border border-yellow-100 text-sm sm:text-base flex items-center gap-3"
                        >
                          <Award className="w-4 h-4 text-yellow-600" />
                          Achievements & Certifications
                        </button>

                        <button
                          onClick={() => navigate("/career-guidance")}
                          className="w-full p-3 sm:p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-all duration-300 text-gray-800 border border-purple-100 text-sm sm:text-base flex items-center gap-3"
                        >
                          <Target className="w-4 h-4 text-purple-600" />
                          Career Guidance & Internships
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )

            case "feed":
              return (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Activity Feed</h2>
                    <Feed />
                  </div>
                </div>
              )

            case "courses":
              return (
                <div className="space-y-6">
                  <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-6 shadow-sm">
                    <div className="flex items-center justify-between mb-6">
                      <h2 className="text-xl font-bold text-gray-800">My Courses</h2>
                      <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium">
                        {studentData.enrolledCourses.length} enrolled
                      </span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {studentData.enrolledCourses.map((course) => (
                        <div
                          key={course.id}
                          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex-1">
                              <h3 className="text-lg font-bold text-gray-800 mb-1">{course.name}</h3>
                              <p className="text-sm text-gray-600 mb-2">Instructor: {course.instructor}</p>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(course.difficulty)}`}
                              >
                                {course.difficulty}
                              </span>
                            </div>
                          </div>

                          <div className="mb-4">
                            <div className="flex justify-between text-sm text-gray-600 mb-2">
                              <span>Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <div className="w-full bg-blue-200 rounded-full h-3">
                              <div
                                className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                                style={{ width: `${course.progress}%` }}
                              ></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-1">
                              <span>
                                {course.completedLessons}/{course.totalLessons} lessons
                              </span>
                              <span>Last: {course.lastAccessed}</span>
                            </div>
                          </div>

                          <div className="mb-4 p-3 bg-white rounded-lg">
                            <p className="text-sm text-gray-600 mb-1">Next Lesson:</p>
                            <p className="font-semibold text-gray-800">{course.nextLesson}</p>
                            <p className="text-xs text-gray-500">Est. time: {course.estimatedTime}</p>
                          </div>

                          <div className="flex gap-2">
                            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center justify-center gap-2">
                              <Play className="w-4 h-4" />
                              Continue
                            </button>
                            <button
                              onClick={() => handleTestClick(course)}
                              className="bg-orange-600 hover:bg-orange-700 text-white px-4 py-2 rounded-lg transition-colors text-sm font-medium flex items-center gap-1"
                            >
                              <Brain className="w-4 h-4" />
                              Test
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )

            case "tests":
              return (
                <div className="space-y-6">
                  {/* Available Tests */}
                  <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Available Tests</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                      {studentData.enrolledCourses.map((course) => (
                        <div
                          key={course.id}
                          className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex items-center gap-3 mb-4">
                            <div className="p-3 bg-blue-100 rounded-lg">
                              <Brain className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                              <h3 className="font-bold text-gray-800">{course.name}</h3>
                              <p className="text-sm text-gray-600">Assessment Test</p>
                            </div>
                          </div>

                          <div className="space-y-2 mb-4 text-sm text-gray-600">
                            <div className="flex items-center gap-2">
                              <Clock className="w-4 h-4" />
                              <span>30 minutes</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <Target className="w-4 h-4" />
                              <span>5 questions</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle className="w-4 h-4" />
                              <span>60% to pass</span>
                            </div>
                          </div>

                          <button
                            onClick={() => handleTestClick(course)}
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-medium flex items-center justify-center gap-2"
                          >
                            <Zap className="w-4 h-4" />
                            Start Test
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Test History */}
                  <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Test History</h2>
                    {testHistory.length === 0 ? (
                      <div className="text-center py-8">
                        <Brain className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-gray-600 mb-2">No tests taken yet</h3>
                        <p className="text-gray-500">Start taking tests to track your progress</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {testHistory.map((test) => (
                          <div key={test.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <div className="flex items-center justify-between mb-2">
                              <div className="flex items-center gap-3">
                                <div className={`p-2 rounded-lg ${test.passed ? "bg-green-100" : "bg-red-100"}`}>
                                  {test.passed ? (
                                    <Trophy className="w-5 h-5 text-green-600" />
                                  ) : (
                                    <AlertCircle className="w-5 h-5 text-red-600" />
                                  )}
                                </div>
                                <div>
                                  <h3 className="font-semibold text-gray-800">{test.courseName}</h3>
                                  <p className="text-sm text-gray-600">{new Date(test.date).toLocaleDateString()}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <div className={`text-lg font-bold ${test.passed ? "text-green-600" : "text-red-600"}`}>
                                  {test.percentage}%
                                </div>
                                <div className="text-sm text-gray-600">Grade: {test.grade}</div>
                              </div>
                            </div>
                            <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                              <div>
                                Score: {test.score}/{test.total}
                              </div>
                              <div>Time: {test.timeSpent} min</div>
                              <div className={`font-medium ${test.passed ? "text-green-600" : "text-red-600"}`}>
                                {test.passed ? "PASSED" : "FAILED"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )

            case "assignments":
              return (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                      <h2 className="text-lg sm:text-xl font-bold text-gray-800">Assignments</h2>
                      <span className="bg-orange-100 text-orange-600 px-3 py-1 rounded-full text-sm font-medium self-start">
                        3 pending
                      </span>
                    </div>
                    <div className="space-y-4">
                      {studentData.assignments.map((assignment, index) => (
                        <div
                          key={index}
                          className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all duration-300"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3 gap-2">
                            <h3 className="text-gray-800 font-semibold text-sm sm:text-base">{assignment.title}</h3>
                            <div className="flex items-center gap-2">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${
                                  assignment.priority === "high"
                                    ? "bg-red-100 text-red-700"
                                    : assignment.priority === "medium"
                                      ? "bg-yellow-100 text-yellow-700"
                                      : "bg-green-100 text-green-700"
                                }`}
                              >
                                {assignment.priority} priority
                              </span>
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(assignment.status)}`}
                              >
                                {assignment.status}
                              </span>
                            </div>
                          </div>
                          <p className="text-gray-600 text-xs sm:text-sm mb-2">Course: {assignment.course}</p>
                          <p className="text-gray-600 text-xs sm:text-sm mb-4">Due: {assignment.dueDate}</p>
                          <div className="flex gap-2">
                            <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm">
                              View Details
                            </button>
                            {assignment.status !== "completed" && (
                              <button className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors text-xs sm:text-sm">
                                Submit
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )

            case "messages":
              return (
                <div className="space-y-6">
                  <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-6 shadow-sm">
                    <h2 className="text-xl font-bold text-gray-800 mb-6">Recent Messages</h2>
                    <div className="space-y-4">
                      {studentData.recentMessages.map((message) => (
                        <div key={message.id} className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex items-center gap-3">
                              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                <User className="w-5 h-5 text-blue-600" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-gray-800">{message.from}</h3>
                                <p className="text-sm text-gray-600">{message.course}</p>
                              </div>
                            </div>
                            <span className="text-xs text-gray-500">{message.timestamp}</span>
                          </div>
                          <p className="text-gray-700 ml-13">{message.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )

            case "profile":
              return (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-6">Student Profile</h2>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Personal Information */}
                      <div className="space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Personal Information</h3>
                        <div className="flex items-center gap-4 mb-6">
                          <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-800 font-semibold text-lg">{user.name}</p>
                            <p className="text-gray-600 text-sm">{user.email}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-blue-600 text-sm capitalize bg-blue-100 px-2 py-1 rounded">
                                {user.role}
                              </span>
                              <span className="text-green-600 text-sm bg-green-100 px-2 py-1 rounded">
                                CSIT Student
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                            <input
                              type="text"
                              value={user.name}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              readOnly
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                            <input
                              type="email"
                              value={user.email}
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              readOnly
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                            <input
                              type="text"
                              value="CSIT-2021-001"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>

                      {/* Academic Information */}
                      <div className="space-y-4">
                        <h3 className="text-base sm:text-lg font-semibold text-gray-800">Academic Information</h3>
                        <div className="grid grid-cols-2 gap-4 mb-6">
                          <div className="bg-blue-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-blue-600">3.7</div>
                            <div className="text-sm text-gray-600">Current GPA</div>
                          </div>
                          <div className="bg-green-50 p-4 rounded-lg text-center">
                            <div className="text-2xl font-bold text-green-600">6th</div>
                            <div className="text-sm text-gray-600">Semester</div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                            <input
                              type="text"
                              value="Bachelor in Computer Science and Information Technology"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              readOnly
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                            <input
                              type="text"
                              value="2021"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              readOnly
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Graduation</label>
                            <input
                              type="text"
                              value="2025"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                              readOnly
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-6 border-t border-gray-200">
                      <button className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg transition-colors flex items-center gap-2">
                        <Settings className="w-4 h-4" />
                        Edit Profile
                      </button>
                    </div>
                  </div>
                </div>
              )

            case "experts":
              return (
                <div className="space-y-4 sm:space-y-6">
                  <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                    <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Find Expert Mentors</h2>
                    <ExpertsList />
                  </div>
                </div>
              )

            default:
              return (
                <div className="text-center py-8">
                  <p className="text-gray-500">Tab content not found</p>
                </div>
              )
          }
        })()}
      </div>
    </div>
  )

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header with Navbar */}
      <Navbar
        links={navLinks}
        user={user}
        panelType="client"
        onLogout={handleLogout}
        activeTab={activeTab}
        onTabChange={handleTabChange}
      />

      {/* Main Content */}
      {renderContent()}
    </div>
  )
}
