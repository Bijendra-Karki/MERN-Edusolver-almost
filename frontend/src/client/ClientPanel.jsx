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
import { isAuthenticated } from "../components/utils/authHelper"
import EnrolledCourses from "./Components/EnrolledCourses"
import ExamDashboard from "./Components/ExamDashbord"

export default function ClientPanel() {
 

  const navigate = useNavigate()
  const [courses, setCourses] = useState([])
  const [searchParams, setSearchParams] = useSearchParams()
  const [user, setUser] = useState(null)
  const [activeTab, setActiveTab] = useState("home")
  const [enrolledCourses, setEnrolledCourses] = useState(new Set());
  const [studentData, setStudentData] = useState({

    assignments: [
      {
        id: 1,
        title: "Binary Search Tree Implementation",
        course: "Data Structures",
        dueDate: "2025-01-25",
        status: "pending",
        priority: "high",
      }
    ],
    recentMessages: [
      {
        id: 1,
        from: "Dr. Smith",
        message: "Great progress on your tree algorithms! Focus more on balancing techniques.",
        timestamp: "2 hours ago",
        course: "Data Structures",
      },
     
    ],
  })



  useEffect(() => {
    const userData = isAuthenticated().user;
    if (userData) {
      const parsedUser = userData;
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



  if (!user) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        {/* Navigation Tabs */}
        <div className="w-full px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
          <div className="flex flex-wrap gap-1 sm:gap-2 lg:gap-4 mb-4 sm:mb-6 overflow-x-auto">
            {[
              { id: "home", label: "Dashboard", icon: Home },
              { id: "feed", label: "Activity Feed", icon: Activity },
              { id: "courses", label: "My Courses", icon: BookOpen },
              { id: "tests", label: "Tests & Quiz", icon: Brain },
              { id: "messages", label: "Messages", icon: MessageSquare, count: studentData.recentMessages.length },
              { id: "experts", label: "Find Experts", icon: Users },
              { id: "profile", label: "Profile", icon: User },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-2 sm:px-4 lg:px-6 py-2 sm:py-3 rounded-lg font-semibold transition-all duration-300 flex items-center gap-1 sm:gap-2 text-xs sm:text-sm lg:text-base whitespace-nowrap ${activeTab === tab.id
                  ? "bg-blue-600 text-white shadow-md"
                  : "bg-white text-gray-600 hover:bg-blue-50 border border-blue-100"
                  }`}
              >
                <tab.icon className="w-3 h-3 sm:w-4 sm:h-4 lg:w-5 lg:h-5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.split(" ")[0]}</span>
                {tab.count !== undefined && (
                  <span
                    className={`px-1 sm:px-2 py-0.5 sm:py-1 rounded-full text-xs ${activeTab === tab.id ? "bg-white/20" : "bg-blue-100 text-blue-600"
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
                    {/* //last waa ho ni */}
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
                // Filter enrolled courses from your main courses array
                const myEnrolledCourses = courses.filter((course) => enrolledCourses.has(course.id));

                return (
                  <EnrolledCourses courses={myEnrolledCourses} />
                )


              case "tests":
                return (
                  <div className="space-y-6">
                    <ExamDashboard />
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
                                  className={`px-2 py-1 rounded-full text-xs font-medium ${assignment.priority === "high"
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
                              <p className="text-black font-semibold text-lg">{user.name}</p>
                              <p className="text-black text-sm">{user.email}</p>
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
                                className="w-full px-3 py-2 border border-gray-200 text-black rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                              <input
                                type="email"
                                value={user.email}
                                className="w-full px-3 py-2 border border-gray-200 text-black text-black rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Student ID</label>
                              <input
                                type="text"
                                value={user._id}
                                className="w-full px-3 py-2 border border-gray-200 text-black rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                readOnly
                              />
                            </div>
                          </div>
                        </div>

                        {/* Basic Information */}
                        <div className="space-y-4">
                          <h3 className="text-base sm:text-lg font-semibold text-gray-800">Basic Information</h3>
                          <div className="grid grid-cols-2 gap-4 mb-6">
                            <div className="bg-blue-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-blue-600">3.7</div>
                              <div className="text-sm text-gray-600">Current GPA</div>
                            </div>
                            <div className="bg-green-50 p-4 rounded-lg text-center">
                              <div className="text-2xl font-bold text-green-600">{` ${user.semester}`}</div>
                              <div className="text-sm text-gray-600">Semester</div>
                            </div>
                          </div>

                          <div className="space-y-3">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Program</label>
                              <input
                                type="text"
                                value="Bachelor in Computer Science and Information Technology"
                                className="w-full px-3 py-2 border border-gray-200 text-black rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
                                readOnly
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Batch</label>
                              <input
                                type="text"
                                value="2021"
                                className="w-full px-3 py-2 border border-gray-200 text-black rounded-lg focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
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
    </div>
  )
}
