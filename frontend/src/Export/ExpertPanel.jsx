"use client"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import Logo from "../assets/Img/Logo2.png"
import {
  BookOpen,
  Clock,
  User,
  Users,
  LogOut,
  X,
  GraduationCap,
  MessageSquare,
  PlusCircle,
  UserPlus,
  Calendar,
  Star,
  Send,
  Edit3,
  Check,
  Eye,
  Save,
  MapPin,
  Globe,
  Award,
  Briefcase,
  DollarSign,
  Shield,
  Timer,
  TrendingUp,
  Upload,
  FileText,
  Video,
  ImageIcon,
  File,
} from "lucide-react"
import Button from "../components/button"

export default function ExpertPanel() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("requests")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [suggestion, setSuggestion] = useState("")
  const [isEditingProfile, setIsEditingProfile] = useState(false)
  const [editedProfile, setEditedProfile] = useState({})
  const [showSuggestionModal, setShowSuggestionModal] = useState(false)
  const [selectedStudentForSuggestion, setSelectedStudentForSuggestion] = useState("")
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    type: "article",
    file: null,
    url: "",
  })

  // State for students and requests
  const [students, setStudents] = useState([
    {
      id: 1,
      name: "Nirajan Shrestha",
      email: "nirajan@student.com",
      subjects: ["Data Structures", "Algorithms"],
      progress: 75,
      lastActive: "2 hours ago",
      strengths: ["Arrays", "Sorting Algorithms"],
      weaknesses: ["Trees", "Graph Algorithms"],
      recentScores: [85, 78, 92, 67, 89],
      acceptedDate: "2025-01-10",
    },
    {
      id: 2,
      name: "Sujata Karki",
      email: "sujata@student.com",
      subjects: ["Database Systems"],
      progress: 60,
      lastActive: "1 day ago",
      strengths: ["SQL Basics", "Normalization"],
      weaknesses: ["Indexing", "Query Optimization"],
      recentScores: [72, 65, 78, 55, 70],
      acceptedDate: "2025-01-08",
    },
  ])

  const [pendingRequests, setPendingRequests] = useState([
    {
      id: 3,
      name: "Prakash Thapa",
      email: "prakash@student.com",
      subjects: ["Computer Networks", "Operating Systems"],
      semester: "6th",
      gpa: 3.7,
      requestDate: "2025-01-15",
      message: "I need help with network protocols and system calls. Looking for guidance in advanced topics.",
      preferredSchedule: "Weekends",
      urgency: "medium",
    },
    {
      id: 4,
      name: "Anita Sharma",
      email: "anita@student.com",
      subjects: ["Machine Learning", "Data Science"],
      semester: "7th",
      gpa: 3.9,
      requestDate: "2025-01-14",
      message: "Struggling with neural networks and deep learning concepts. Need expert guidance for my final project.",
      preferredSchedule: "Evenings",
      urgency: "high",
    },
    {
      id: 5,
      name: "Rajesh Maharjan",
      email: "rajesh@student.com",
      subjects: ["Web Development", "Software Engineering"],
      semester: "5th",
      gpa: 3.5,
      requestDate: "2025-01-13",
      message: "Want to improve my full-stack development skills and learn best practices in software engineering.",
      preferredSchedule: "Flexible",
      urgency: "low",
    },
  ])

  const [suggestions, setSuggestions] = useState([
    {
      id: 1,
      studentId: 1,
      studentName: "Nirajan Shrestha",
      message: "Focus more on implementing tree data structures. Try building a binary search tree from scratch.",
      date: "2025-01-20",
      status: "sent",
    },
    {
      id: 2,
      studentId: 2,
      studentName: "Sujata Karki",
      message: "Great progress in SQL! Consider practicing complex JOIN queries and optimizing indexes.",
      date: "2025-01-18",
      status: "read",
    },
  ])

  // Resources state
  const [resources, setResources] = useState([
    {
      id: 1,
      title: "Data Structures and Algorithms Guide",
      description: "Comprehensive guide covering arrays, linked lists, trees, and sorting algorithms.",
      type: "document",
      downloads: 58,
      rating: 4.9,
      dateAdded: "2025-01-15",
      fileSize: "2.5 MB",
      fileName: "ds-algorithms-guide.pdf",
    },
    {
      id: 2,
      title: "Relational Database Design",
      description: "Video tutorial on designing efficient relational databases with practical examples.",
      type: "video",
      downloads: 41,
      rating: 4.7,
      dateAdded: "2025-01-12",
      fileSize: "45.2 MB",
      fileName: "database-design-tutorial.mp4",
    },
  ])

  useEffect(() => {
    const expertData = localStorage.getItem("expert")
    if (expertData) {
      const parsedUser = JSON.parse(expertData)
      setUser(parsedUser)
      setEditedProfile(parsedUser)
    } else {
      // Simulate comprehensive user data
      const expertProfile = {
        name: "Alex Thompson",
        title: "DevOps Engineer",
        company: "Netflix",
        email: "alex.thompson@expert.com",
        specialty: "devops",
        experience: "9+ years",
        rating: 4.6,
        reviews: 98,
        hourlyRate: "$95",
        avatar: "/placeholder.svg?height=100&width=100",
        bio: "DevOps and cloud infrastructure expert. Specialized in CI/CD, containerization, and cloud platforms.",
        skills: ["Docker", "Kubernetes", "AWS", "Jenkins", "Terraform"],
        availability: "Weekends",
        languages: ["English"],
        location: "Los Angeles, CA",
        verified: true,
        responseTime: "Within 6 hours",
        totalSessions: 167,
        successRate: "93%",
        education: "BS Software Engineering - UC Berkeley",
        certifications: ["AWS DevOps Professional", "Kubernetes Administrator"],
        role: "expert",
      }
      setUser(expertProfile)
      setEditedProfile(expertProfile)
    }
  }, [])

  const handleLogout = () => {
    // Clear all user data from localStorage
    localStorage.removeItem("expert")
    localStorage.removeItem("user")
    localStorage.removeItem("authToken") // Clear any auth tokens if they exist

    // Show success message
    alert("Logged out successfully!")

    // Navigate to login page
    navigate("/login")
  }

  const handleAcceptRequest = (request) => {
    const newStudent = {
      id: request.id,
      name: request.name,
      email: request.email,
      subjects: request.subjects,
      progress: 0,
      lastActive: "Just joined",
      strengths: [],
      weaknesses: [],
      recentScores: [],
      acceptedDate: new Date().toISOString().split("T")[0],
      semester: request.semester,
      gpa: request.gpa,
    }
    setStudents((prev) => [...prev, newStudent])
    setPendingRequests((prev) => prev.filter((req) => req.id !== request.id))
    alert(`Successfully accepted ${request.name} as your student!`)
  }

  const handleRejectRequest = (requestId) => {
    setPendingRequests((prev) => prev.filter((req) => req.id !== requestId))
    alert("Request rejected successfully!")
  }

  const handleSendSuggestion = () => {
    if (selectedStudent && suggestion.trim()) {
      console.log("Sending suggestion to:", selectedStudent.name, "Message:", suggestion)
      setSuggestion("")
      setSelectedStudent(null)
      alert("Suggestion sent successfully!")
    }
  }

  const handleSendNewSuggestion = () => {
    if (selectedStudentForSuggestion && suggestion.trim()) {
      const student = students.find((s) => s.id.toString() === selectedStudentForSuggestion)
      if (student) {
        const newSuggestion = {
          id: suggestions.length + 1,
          studentId: student.id,
          studentName: student.name,
          message: suggestion,
          date: new Date().toISOString().split("T")[0],
          status: "sent",
        }
        setSuggestions((prev) => [newSuggestion, ...prev])
        setSuggestion("")
        setSelectedStudentForSuggestion("")
        setShowSuggestionModal(false)
        alert(`Suggestion sent to ${student.name} successfully!`)
      }
    }
  }

  // Add loading state for resource addition
  const [isAddingResource, setIsAddingResource] = useState(false)

  // Enhanced Add Resource functionality
  const handleAddResource = async () => {
    // Validation
    if (!newResource.title.trim()) {
      alert("Please enter a resource title!")
      return
    }
    if (!newResource.description.trim()) {
      alert("Please enter a resource description!")
      return
    }
    if (!newResource.file && !newResource.url.trim()) {
      alert("Please either upload a file or provide a URL!")
      return
    }

    setIsAddingResource(true)
    try {
      // Simulate upload delay (in real app, this would be an API call)
      await new Promise((resolve) => setTimeout(resolve, 1000))

      const resourceToAdd = {
        id: Date.now(), // Use timestamp for unique ID
        title: newResource.title.trim(),
        description: newResource.description.trim(),
        type: newResource.type,
        downloads: 0,
        rating: 0,
        dateAdded: new Date().toISOString().split("T")[0],
        fileSize: newResource.file ? formatFileSize(newResource.file.size) : "N/A",
        fileName: newResource.file ? newResource.file.name : newResource.url ? "External Link" : "No file",
        url: newResource.url.trim(),
        isExternal: !newResource.file && newResource.url.trim() !== "",
      }

      setResources((prev) => [resourceToAdd, ...prev])

      // Reset form
      setNewResource({
        title: "",
        description: "",
        type: "article",
        file: null,
        url: "",
      })

      // Clear file input
      const fileInput = document.getElementById("file-upload")
      if (fileInput) {
        fileInput.value = ""
      }

      alert(`Resource "${resourceToAdd.title}" added successfully!`)
    } catch (error) {
      console.error("Error adding resource:", error)
      alert("Failed to add resource. Please try again.")
    } finally {
      setIsAddingResource(false)
    }
  }

  // Helper function to format file size
  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes"
    const k = 1024
    const sizes = ["Bytes", "KB", "MB", "GB"]
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Number.parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i]
  }

  // Handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0]
    if (file) {
      // Check file size (limit to 50MB)
      if (file.size > 50 * 1024 * 1024) {
        alert("File size must be less than 50MB")
        return
      }
      setNewResource((prev) => ({
        ...prev,
        file: file,
        url: "", // Clear URL if file is selected
      }))
    }
  }

  // Remove uploaded file
  const removeFile = () => {
    setNewResource((prev) => ({
      ...prev,
      file: null,
    }))
  }

  // Delete resource
  const handleDeleteResource = (resourceId) => {
    if (window.confirm("Are you sure you want to delete this resource?")) {
      setResources((prev) => prev.filter((resource) => resource.id !== resourceId))
      alert("Resource deleted successfully!")
    }
  }

  // Get icon for resource type
  const getResourceIcon = (type) => {
    switch (type) {
      case "video":
        return <Video className="w-4 h-4" />
      case "image":
        return <ImageIcon className="w-4 h-4" />
      case "document":
        return <FileText className="w-4 h-4" />
      default:
        return <File className="w-4 h-4" />
    }
  }

  const handleEditProfile = () => {
    setIsEditingProfile(true)
    setEditedProfile({ ...user })
  }

  const handleSaveProfile = () => {
    setUser(editedProfile)
    localStorage.setItem("expert", JSON.stringify(editedProfile))
    setIsEditingProfile(false)
    alert("Profile updated successfully!")
  }

  const handleCancelEdit = () => {
    setEditedProfile({ ...user })
    setIsEditingProfile(false)
  }

  const handleProfileChange = (field, value) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  const handleSkillsChange = (value) => {
    const skillsArray = value
      .split(",")
      .map((skill) => skill.trim())
      .filter((skill) => skill)
    setEditedProfile((prev) => ({
      ...prev,
      skills: skillsArray,
    }))
  }

  const handleLanguagesChange = (value) => {
    const languagesArray = value
      .split(",")
      .map((lang) => lang.trim())
      .filter((lang) => lang)
    setEditedProfile((prev) => ({
      ...prev,
      languages: languagesArray,
    }))
  }

  const handleCertificationsChange = (value) => {
    const certificationsArray = value
      .split(",")
      .map((cert) => cert.trim())
      .filter((cert) => cert)
    setEditedProfile((prev) => ({
      ...prev,
      certifications: certificationsArray,
    }))
  }

  const getUrgencyColor = (urgency) => {
    switch (urgency) {
      case "high":
        return "bg-red-100 text-red-700 border-red-200"
      case "medium":
        return "bg-yellow-100 text-yellow-700 border-yellow-200"
      case "low":
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  const openSuggestionModal = () => {
    setShowSuggestionModal(true)
    setSuggestion("")
    setSelectedStudentForSuggestion("")
  }

  const closeSuggestionModal = () => {
    setShowSuggestionModal(false)
    setSuggestion("")
    setSelectedStudentForSuggestion("")
  }

  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-gradient-to-br from-blue-700 to-blue-900 shadow-sm w-full">
        <div className="w-full px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-3 sm:py-4">
            <div className="flex items-center gap-2 sm:gap-3">
              <img
                src={Logo || "/placeholder.svg"}
                alt="EduSolver Logo"
                className="w-12 h-12 sm:w-16 sm:h-16 rounded-full object-cover"
              />
              <div className="flex flex-col items-start">
                <span className="text-lg sm:text-2xl font-bold text-white">EduSolver</span>
                <span className="text-xs sm:text-sm text-white/90 hidden sm:block">Welcome, Expert Panel</span>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4">
              <span className="text-white text-xs sm:text-sm lg:text-base hidden sm:inline">Welcome, {user.name}</span>
              <span className="text-white text-xs sm:hidden">Hi, {user.name.split(" ")[0]}</span>
              <Button
                label="Logout"
                onClick={handleLogout}
                icon={<LogOut size={14} />}
                className="text-xs px-2 py-1 bg-white/10 hover:bg-white/20 border border-white/20 text-white"
              />
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div className="w-full px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
        <div className="flex flex-wrap gap-1 sm:gap-2 lg:gap-4 mb-4 sm:mb-6 overflow-x-auto">
          {[
            { id: "requests", label: "Student Requests", icon: UserPlus, count: pendingRequests.length },
            { id: "students", label: "My Students", icon: Users, count: students.length },
            { id: "suggestions", label: "Suggestions", icon: MessageSquare },
            { id: "resources", label: "Resources", icon: BookOpen, count: resources.length },
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

        {/* Student Requests Tab */}
        {activeTab === "requests" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Pending Student Requests</h2>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium self-start">
                  {pendingRequests.length} pending
                </span>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <UserPlus className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">No pending requests</h3>
                  <p className="text-gray-500 text-sm sm:text-base">New student requests will appear here</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 xl:grid-cols-2 2xl:grid-cols-3 gap-4 sm:gap-6">
                  {pendingRequests.map((request) => (
                    <div
                      key={request.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all duration-300"
                    >
                      {/* Student Info Header */}
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                          </div>
                          <div className="min-w-0 flex-1">
                            <h3 className="text-base sm:text-lg font-semibold text-gray-800 truncate">
                              {request.name}
                            </h3>
                            <p className="text-gray-600 text-xs sm:text-sm truncate">{request.email}</p>
                          </div>
                        </div>
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(
                            request.urgency,
                          )} whitespace-nowrap`}
                        >
                          {request.urgency} priority
                        </span>
                      </div>

                      {/* Academic Info */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                        <div className="bg-blue-50 p-2 sm:p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Semester</p>
                          <p className="font-semibold text-blue-600 text-sm sm:text-base">{request.semester}</p>
                        </div>
                        <div className="bg-green-50 p-2 sm:p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">GPA</p>
                          <p className="font-semibold text-green-600 text-sm sm:text-base">{request.gpa}</p>
                        </div>
                      </div>

                      {/* Subjects */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Subjects of Interest:</p>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {request.subjects.map((subject, index) => (
                            <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                              {subject}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Message */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">Message:</p>
                        <p className="text-gray-700 text-xs sm:text-sm bg-gray-50 p-2 sm:p-3 rounded-lg line-clamp-3">
                          {request.message}
                        </p>
                      </div>

                      {/* Schedule & Date */}
                      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-4 text-xs sm:text-sm text-gray-600">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Prefers: {request.preferredSchedule}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3 sm:w-4 sm:h-4" />
                          <span>Requested: {request.requestDate}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 sm:gap-3">
                        <button
                          onClick={() => handleAcceptRequest(request)}
                          className="flex-1 bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium"
                        >
                          <Check className="w-3 h-3 sm:w-4 sm:h-4" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleRejectRequest(request.id)}
                          className="flex-1 bg-red-600 hover:bg-red-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium"
                        >
                          <X className="w-3 h-3 sm:w-4 sm:h-4" />
                          Reject
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Students Tab */}
        {activeTab === "students" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">My Students</h2>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium self-start">
                  {students.length} active students
                </span>
              </div>

              {students.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">No students yet</h3>
                  <p className="text-gray-500 text-sm sm:text-base">Accept student requests to start mentoring</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-4 sm:gap-6">
                  {students.map((student) => (
                    <div
                      key={student.id}
                      className="bg-white border border-gray-200 rounded-xl p-4 sm:p-6 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-5 h-5 sm:w-6 sm:h-6 text-blue-600" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <h3 className="text-gray-800 font-semibold text-sm sm:text-base truncate">{student.name}</h3>
                          <p className="text-gray-600 text-xs sm:text-sm truncate">{student.email}</p>
                          {student.acceptedDate && (
                            <p className="text-gray-500 text-xs">Joined: {student.acceptedDate}</p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <p className="text-gray-600 text-sm mb-1">Progress</p>
                          <div className="w-full bg-blue-100 rounded-full h-2">
                            <div
                              className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${student.progress}%` }}
                            ></div>
                          </div>
                          <p className="text-gray-800 text-sm mt-1">{student.progress}%</p>
                        </div>

                        <div>
                          <p className="text-gray-600 text-sm mb-1">Subjects</p>
                          <div className="flex flex-wrap gap-1">
                            {student.subjects.map((subject, index) => (
                              <span key={index} className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded">
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>

                        {student.strengths.length > 0 && (
                          <div>
                            <p className="text-gray-600 text-sm mb-1">Strengths</p>
                            <div className="flex flex-wrap gap-1">
                              {student.strengths.map((strength, index) => (
                                <span key={index} className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded">
                                  {strength}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {student.weaknesses.length > 0 && (
                          <div>
                            <p className="text-gray-600 text-sm mb-1">Areas to Improve</p>
                            <div className="flex flex-wrap gap-1">
                              {student.weaknesses.map((weakness, index) => (
                                <span key={index} className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded">
                                  {weakness}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        <div className="flex gap-2 mt-4">
                          <button
                            onClick={() => setSelectedStudent(student)}
                            className="flex-1 bg-blue-100 hover:bg-blue-200 text-blue-700 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm transition-all duration-300 flex items-center justify-center gap-1"
                          >
                            <MessageSquare className="w-3 h-3 sm:w-4 sm:h-4" />
                            Message
                          </button>
                          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 sm:px-3 py-2 rounded-lg text-xs sm:text-sm transition-all duration-300">
                            <Eye className="w-3 h-3 sm:w-4 sm:h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Suggestions Tab */}
        {activeTab === "suggestions" && (
          <div className="space-y-4 sm:space-y-6">
            <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-2">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">Suggestions</h2>
                {students.length > 0 && (
                  <button
                    onClick={openSuggestionModal}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-xs sm:text-sm font-medium self-start"
                  >
                    <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                    Send New Suggestion
                  </button>
                )}
              </div>

              {students.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <MessageSquare className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">No students to send suggestions</h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    Accept student requests first to start sending suggestions
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestions.length === 0 ? (
                    <div className="text-center py-6 sm:py-8">
                      <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-base sm:text-lg font-medium text-gray-600 mb-2">No suggestions sent yet</h3>
                      <p className="text-gray-500 mb-4 text-sm sm:text-base">
                        Start mentoring your students by sending helpful suggestions
                      </p>
                      <button
                        onClick={openSuggestionModal}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 sm:px-6 py-2 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 mx-auto text-sm sm:text-base"
                      >
                        <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                        Send Your First Suggestion
                      </button>
                    </div>
                  ) : (
                    suggestions.map((suggestion) => (
                      <div key={suggestion.id} className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100">
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                          <h3 className="text-gray-800 font-semibold text-sm sm:text-base">{suggestion.studentName}</h3>
                          <div className="flex items-center gap-2">
                            <span
                              className={`px-2 py-1 text-xs rounded ${
                                suggestion.status === "read"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-yellow-100 text-yellow-700"
                              }`}
                            >
                              {suggestion.status}
                            </span>
                            <span className="text-gray-500 text-xs sm:text-sm">{suggestion.date}</span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base">{suggestion.message}</p>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Resources Tab - Enhanced with functional upload */}
        {activeTab === "resources" && (
          <div className="space-y-4 sm:space-y-6">
            {/* Add New Resource - Enhanced */}
            <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">Add New Resource</h2>

              {/* Enhanced form inputs with validation feedback */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    placeholder="Resource Title *"
                    value={newResource.title}
                    onChange={(e) => setNewResource({ ...newResource, title: e.target.value })}
                    className={`px-3 sm:px-4 py-2 sm:py-3 bg-white border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 text-sm sm:text-base transition-colors ${
                      newResource.title.trim()
                        ? "border-green-300 focus:border-green-500 focus:ring-green-100"
                        : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                    }`}
                  />
                  {newResource.title.trim() && (
                    <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Title looks good!
                    </p>
                  )}
                </div>

                <select
                  value={newResource.type}
                  onChange={(e) => setNewResource({ ...newResource, type: e.target.value })}
                  className="px-3 sm:px-4 py-2 sm:py-3 bg-white border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
                >
                  <option value="article">📄 Article</option>
                  <option value="video">🎥 Video</option>
                  <option value="document">📋 Document</option>
                  <option value="image">🖼️ Image</option>
                  <option value="quiz">❓ Quiz</option>
                  <option value="link">🔗 Link</option>
                </select>
              </div>

              {/* Enhanced Description textarea */}
              <div className="mb-4">
                <textarea
                  placeholder="Resource Description * (Describe what students will learn from this resource)"
                  value={newResource.description}
                  onChange={(e) => setNewResource({ ...newResource, description: e.target.value })}
                  rows={3}
                  className={`w-full px-3 sm:px-4 py-2 sm:py-3 bg-white border rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-4 text-sm sm:text-base transition-colors ${
                    newResource.description.trim()
                      ? "border-green-300 focus:border-green-500 focus:ring-green-100"
                      : "border-gray-200 focus:border-blue-500 focus:ring-blue-100"
                  }`}
                />
                <div className="flex justify-between items-center mt-1">
                  {newResource.description.trim() && (
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Description added!
                    </p>
                  )}
                  <p className="text-xs text-gray-500">{newResource.description.length}/500 characters</p>
                </div>
              </div>

              {/* File Upload Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Upload File or Add URL</label>
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-3">
                  {!newResource.file ? (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">Drag and drop a file here, or click to select</p>
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="file-upload"
                        accept=".pdf,.doc,.docx,.ppt,.pptx,.mp4,.avi,.mov,.jpg,.jpeg,.png,.gif"
                      />
                      <label
                        htmlFor="file-upload"
                        className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-4 py-2 rounded-lg cursor-pointer transition-colors text-sm"
                      >
                        Choose File
                      </label>
                      <p className="text-xs text-gray-500 mt-2">Max file size: 50MB</p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(newResource.type)}
                        <div>
                          <p className="text-sm font-medium text-gray-800">{newResource.file.name}</p>
                          <p className="text-xs text-gray-600">{formatFileSize(newResource.file.size)}</p>
                        </div>
                      </div>
                      <button onClick={removeFile} className="text-red-600 hover:text-red-800 p-1">
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* URL Input (alternative to file upload) */}
                {!newResource.file && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">Or add a URL:</label>
                    <input
                      type="url"
                      placeholder="https://example.com/resource"
                      value={newResource.url}
                      onChange={(e) => setNewResource({ ...newResource, url: e.target.value })}
                      className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-gray-800 placeholder-gray-400 focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 text-sm"
                    />
                  </div>
                )}
              </div>

              {/* Add Button - Enhanced */}
              <div className="flex gap-3">
                <button
                  onClick={handleAddResource}
                  disabled={
                    isAddingResource ||
                    !newResource.title.trim() ||
                    !newResource.description.trim() ||
                    (!newResource.file && !newResource.url.trim())
                  }
                  className={`flex-1 px-4 sm:px-6 py-2 sm:py-3 rounded-lg transition-all duration-300 flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base font-medium ${
                    isAddingResource
                      ? "bg-blue-400 cursor-not-allowed text-white"
                      : !newResource.title.trim() ||
                          !newResource.description.trim() ||
                          (!newResource.file && !newResource.url.trim())
                        ? "bg-gray-300 cursor-not-allowed text-gray-500"
                        : "bg-green-600 hover:bg-green-700 text-white shadow-md hover:shadow-lg"
                  }`}
                >
                  {isAddingResource ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Adding Resource...
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5" />
                      Add Resource
                    </>
                  )}
                </button>

                {/* Clear Form Button */}
                <button
                  onClick={() => {
                    setNewResource({ title: "", description: "", type: "article", file: null, url: "" })
                    const fileInput = document.getElementById("file-upload")
                    if (fileInput) fileInput.value = ""
                  }}
                  disabled={isAddingResource}
                  className="px-3 sm:px-4 py-2 sm:py-3 bg-gray-200 hover:bg-gray-300 disabled:bg-gray-100 text-gray-700 rounded-lg transition-colors text-sm sm:text-base"
                >
                  Clear
                </button>
              </div>
            </div>

            {/* Existing Resources - Enhanced */}
            <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">My Resources</h2>
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium self-start">
                  {resources.length} resources
                </span>
              </div>

              {resources.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">No resources yet</h3>
                  <p className="text-gray-500 text-sm sm:text-base">Add your first resource to get started</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 sm:gap-4">
                  {resources.map((resource) => (
                    <div
                      key={resource.id}
                      className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100 hover:shadow-md transition-all duration-300"
                    >
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-2 flex-1 mr-2">
                          {getResourceIcon(resource.type)}
                          <h3 className="text-gray-800 font-semibold text-sm sm:text-base line-clamp-2">
                            {resource.title}
                          </h3>
                        </div>
                        <div className="flex items-center gap-1">
                          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded whitespace-nowrap">
                            {resource.type}
                          </span>
                          <button
                            onClick={() => handleDeleteResource(resource.id)}
                            className="text-red-600 hover:text-red-800 p-1"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      </div>

                      <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">{resource.description}</p>

                      {/* Resource Details - Enhanced */}
                      <div className="space-y-2 mb-3">
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span className="flex items-center gap-1">
                            {resource.isExternal ? (
                              <>
                                <Globe className="w-3 h-3" />
                                External Link
                              </>
                            ) : (
                              <>File: {resource.fileName}</>
                            )}
                          </span>
                          <span>{resource.fileSize}</span>
                        </div>
                        <div className="flex items-center justify-between text-xs text-gray-600">
                          <span>Added: {resource.dateAdded}</span>
                          <span>{resource.downloads} downloads</span>
                        </div>
                        {resource.isExternal && resource.url && (
                          <div className="mt-2">
                            <a
                              href={resource.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-xs underline flex items-center gap-1"
                            >
                              <Globe className="w-3 h-3" />
                              Open Link
                            </a>
                          </div>
                        )}
                      </div>

                      {/* Stats */}
                      <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2 sm:gap-4 text-xs sm:text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                            <span>{resource.rating || "No rating"}</span>
                          </div>
                        </div>
                        <button className="text-gray-600 hover:text-gray-800 p-1">
                          <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="space-y-4 sm:space-y-6">
            {!isEditingProfile ? (
              // Profile View Mode
              <div className="space-y-4 sm:space-y-6">
                {/* Profile Header */}
                <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6 gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">{user.name}</h2>
                          {user.verified && <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />}
                        </div>
                        <p className="text-base sm:text-lg text-blue-600 font-medium">{user.title}</p>
                        <p className="text-gray-600 text-sm sm:text-base">{user.company}</p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                            <span className="font-medium text-sm sm:text-base">{user.rating}</span>
                            <span className="text-gray-500 text-xs sm:text-sm">({user.reviews} reviews)</span>
                          </div>
                          <div className="flex items-center gap-1 text-green-600 font-medium text-sm sm:text-base">
                            <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                            <span>{user.hourlyRate}/hour</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <button
                      onClick={handleEditProfile}
                      className="bg-blue-100 hover:bg-blue-200 text-blue-700 px-3 sm:px-4 py-2 rounded-lg transition-all duration-300 flex items-center gap-1 sm:gap-2 text-sm sm:text-base self-start"
                    >
                      <Edit3 className="w-3 h-3 sm:w-4 sm:h-4" />
                      Edit Profile
                    </button>
                  </div>

                  {/* Bio */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">About</h3>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">{user.bio}</p>
                  </div>

                  {/* Skills */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">Skills & Expertise</h3>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {user.skills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs sm:text-sm font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Professional Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Left Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Experience & Stats */}
                    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Professional Stats</h3>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          </div>
                          <div className="text-base sm:text-lg font-bold text-blue-600">{user.experience}</div>
                          <div className="text-xs sm:text-sm text-gray-600">Experience</div>
                        </div>
                        <div className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                          </div>
                          <div className="text-base sm:text-lg font-bold text-green-600">{user.totalSessions}</div>
                          <div className="text-xs sm:text-sm text-gray-600">Total Sessions</div>
                        </div>
                        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                          </div>
                          <div className="text-base sm:text-lg font-bold text-purple-600">{user.successRate}</div>
                          <div className="text-xs sm:text-sm text-gray-600">Success Rate</div>
                        </div>
                        <div className="bg-orange-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                          </div>
                          <div className="text-base sm:text-lg font-bold text-orange-600">{user.responseTime}</div>
                          <div className="text-xs sm:text-sm text-gray-600">Response Time</div>
                        </div>
                      </div>
                    </div>

                    {/* Availability & Location */}
                    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Availability & Location</h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                          <span className="text-gray-700 text-sm sm:text-base">Available: {user.availability}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                          <span className="text-gray-700 text-sm sm:text-base">{user.location}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                          <span className="text-gray-700 text-sm sm:text-base">
                            Languages: {user.languages.join(", ")}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Education */}
                    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Education</h3>
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span className="text-gray-700 text-sm sm:text-base">{user.education}</span>
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Certifications</h3>
                      <div className="space-y-2">
                        {user.certifications.map((cert, index) => (
                          <div key={index} className="flex items-center gap-3">
                            <Award className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                            <span className="text-gray-700 text-sm sm:text-base">{cert}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Current Students Stats */}
                    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">Current Activity</h3>
                      <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="text-xl sm:text-2xl font-bold text-blue-600">{students.length}</div>
                          <div className="text-xs sm:text-sm text-gray-600">Active Students</div>
                        </div>
                        <div className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="text-xl sm:text-2xl font-bold text-green-600">{suggestions.length}</div>
                          <div className="text-xs sm:text-sm text-gray-600">Suggestions Sent</div>
                        </div>
                        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="text-xl sm:text-2xl font-bold text-purple-600">{resources.length}</div>
                          <div className="text-xs sm:text-sm text-gray-600">Resources Created</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // Profile Edit Mode
              <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 sm:mb-6 gap-3">
                  <h2 className="text-lg sm:text-xl font-bold text-gray-800">Edit Profile</h2>
                  <div className="flex gap-2 sm:gap-3">
                    <button
                      onClick={handleSaveProfile}
                      className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                    >
                      <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                      Save Changes
                    </button>
                    <button
                      onClick={handleCancelEdit}
                      className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
                    >
                      Cancel
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Basic Information</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <input
                        type="text"
                        value={editedProfile.name || ""}
                        onChange={(e) => handleProfileChange("name", e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Job Title</label>
                      <input
                        type="text"
                        value={editedProfile.title || ""}
                        onChange={(e) => handleProfileChange("title", e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Company</label>
                      <input
                        type="text"
                        value={editedProfile.company || ""}
                        onChange={(e) => handleProfileChange("company", e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={editedProfile.email || ""}
                        onChange={(e) => handleProfileChange("email", e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
                      <input
                        type="text"
                        value={editedProfile.experience || ""}
                        onChange={(e) => handleProfileChange("experience", e.target.value)}
                        placeholder="e.g., 5+ years"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Hourly Rate</label>
                      <input
                        type="text"
                        value={editedProfile.hourlyRate || ""}
                        onChange={(e) => handleProfileChange("hourlyRate", e.target.value)}
                        placeholder="e.g., $95"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
                      />
                    </div>
                  </div>

                  {/* Professional Details */}
                  <div className="space-y-4">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800">Professional Details</h3>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bio</label>
                      <textarea
                        value={editedProfile.bio || ""}
                        onChange={(e) => handleProfileChange("bio", e.target.value)}
                        rows={4}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma-separated)</label>
                      <input
                        type="text"
                        value={editedProfile.skills?.join(", ") || ""}
                        onChange={(e) => handleSkillsChange(e.target.value)}
                        placeholder="e.g., Docker, Kubernetes, AWS"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Specialty</label>
                      <select
                        value={editedProfile.specialty || ""}
                        onChange={(e) => handleProfileChange("specialty", e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
                      >
                        <option value="">Select Specialty</option>
                        <option value="devops">DevOps</option>
                        <option value="frontend">Frontend Development</option>
                        <option value="backend">Backend Development</option>
                        <option value="fullstack">Full Stack Development</option>
                        <option value="mobile">Mobile Development</option>
                        <option value="data">Data Science</option>
                        <option value="ai">AI/Machine Learning</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                      <select
                        value={editedProfile.availability || ""}
                        onChange={(e) => handleProfileChange("availability", e.target.value)}
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
                      >
                        <option value="">Select Availability</option>
                        <option value="Weekdays">Weekdays</option>
                        <option value="Weekends">Weekends</option>
                        <option value="Evenings">Evenings</option>
                        <option value="Flexible">Flexible</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                      <input
                        type="text"
                        value={editedProfile.location || ""}
                        onChange={(e) => handleProfileChange("location", e.target.value)}
                        placeholder="e.g., Los Angeles, CA"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Languages (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={editedProfile.languages?.join(", ") || ""}
                        onChange={(e) => handleLanguagesChange(e.target.value)}
                        placeholder="e.g., English, Spanish"
                        className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Education & Certifications */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mt-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
                    <input
                      type="text"
                      value={editedProfile.education || ""}
                      onChange={(e) => handleProfileChange("education", e.target.value)}
                      placeholder="e.g., BS Software Engineering - UC Berkeley"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Certifications (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={editedProfile.certifications?.join(", ") || ""}
                      onChange={(e) => handleCertificationsChange(e.target.value)}
                      placeholder="e.g., AWS DevOps Professional, Kubernetes Administrator"
                      className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Send Suggestion Modal (from Students tab) */}
      {selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 mx-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
              Send Suggestion to {selectedStudent.name}
            </h3>
            <textarea
              value={suggestion}
              onChange={(e) => setSuggestion(e.target.value)}
              placeholder="Write your suggestion here..."
              rows={4}
              className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 mb-4 text-sm sm:text-base"
            />
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleSendSuggestion}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
              >
                <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                Send
              </button>
              <button
                onClick={() => {
                  setSelectedStudent(null)
                  setSuggestion("")
                }}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Send New Suggestion Modal (from Suggestions tab) */}
      {showSuggestionModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-md w-full p-4 sm:p-6 mx-4">
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4">Send Suggestion to Student</h3>
            {/* Student Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Select Student</label>
              <select
                value={selectedStudentForSuggestion}
                onChange={(e) => setSelectedStudentForSuggestion(e.target.value)}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
              >
                <option value="">Choose a student...</option>
                {students.map((student) => (
                  <option key={student.id} value={student.id.toString()}>
                    {student.name} - {student.subjects.join(", ")}
                  </option>
                ))}
              </select>
            </div>
            {/* Suggestion Text */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">Your Suggestion</label>
              <textarea
                value={suggestion}
                onChange={(e) => setSuggestion(e.target.value)}
                placeholder="Write your helpful suggestion here..."
                rows={4}
                className="w-full px-3 sm:px-4 py-2 sm:py-3 border border-gray-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 text-sm sm:text-base"
              />
            </div>
            {/* Action Buttons */}
            <div className="flex gap-2 sm:gap-3">
              <button
                onClick={handleSendNewSuggestion}
                disabled={!selectedStudentForSuggestion || !suggestion.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-1 sm:gap-2 text-sm sm:text-base"
              >
                <Send className="w-3 h-3 sm:w-4 sm:h-4" />
                Send Suggestion
              </button>
              <button
                onClick={closeSuggestionModal}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
