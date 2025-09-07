"use client"
import { useState, useEffect } from "react"
import {
  BookOpen,
  Clock,
  Users,
  Star,
  Search,
  Award,
  TrendingUp,
  ChevronRight,
  Heart,
  Share2,
  Download,
  CheckCircle,
  Globe,
  GraduationCap,
  BarChart3,
  PlayCircle,
  X,
} from "lucide-react"

const CoursesPage = () => {
  const [activeTab, setActiveTab] = useState("all-courses") // all-courses or my-courses
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("popular")
  const [favorites, setFavorites] = useState(new Set())
  const [enrolledCourses, setEnrolledCourses] = useState(new Set())
  const [courseProgress, setCourseProgress] = useState({}) // Track progress for each enrolled course

  // Load enrolled courses from localStorage on component mount
  useEffect(() => {
    const savedEnrolledCourses = localStorage.getItem("enrolledCourses")
    const savedCourseProgress = localStorage.getItem("courseProgress")
    const savedFavorites = localStorage.getItem("favoriteCourses")

    if (savedEnrolledCourses) {
      setEnrolledCourses(new Set(JSON.parse(savedEnrolledCourses)))
    }
    if (savedCourseProgress) {
      setCourseProgress(JSON.parse(savedCourseProgress))
    }
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)))
    }
  }, [])

  // Save to localStorage whenever enrolled courses change
  useEffect(() => {
    localStorage.setItem("enrolledCourses", JSON.stringify([...enrolledCourses]))
  }, [enrolledCourses])

  useEffect(() => {
    localStorage.setItem("courseProgress", JSON.stringify(courseProgress))
  }, [courseProgress])

  useEffect(() => {
    localStorage.setItem("favoriteCourses", JSON.stringify([...favorites]))
  }, [favorites])

  const courses = [
    {
      id: 1,
      title: "Advanced Java Programming",
      instructor: "Dr. Smith Johnson",
      instructorAvatar: "/placeholder.svg?height=40&width=40",
      duration: "12 weeks",
      students: 245,
      rating: 4.8,
      reviews: 89,
      level: "Advanced",
      category: "programming",
      image: "/placeholder.svg?height=200&width=300",
      description: "Master advanced Java concepts including multithreading, collections, and design patterns.",
      price: "Free",
      skills: ["Java", "OOP", "Design Patterns", "Multithreading"],
      lessons: 45,
      certificates: true,
      language: "English",
      lastUpdated: "2024-01-15",
      difficulty: 85,
      estimatedHours: 60,
    },
    {
      id: 2,
      title: "Python for Data Science",
      instructor: "Prof. Sarah Wilson",
      instructorAvatar: "/placeholder.svg?height=40&width=40",
      duration: "10 weeks",
      students: 189,
      rating: 4.9,
      reviews: 156,
      level: "Intermediate",
      category: "data-science",
      image: "/placeholder.svg?height=200&width=300",
      description: "Learn Python programming with focus on data analysis and machine learning.",
      price: "Free",
      skills: ["Python", "Pandas", "NumPy", "Machine Learning"],
      lessons: 38,
      certificates: true,
      language: "English",
      lastUpdated: "2024-01-20",
      difficulty: 65,
      estimatedHours: 45,
    },
    {
      id: 3,
      title: "Web Development with React",
      instructor: "John Martinez",
      instructorAvatar: "/placeholder.svg?height=40&width=40",
      duration: "8 weeks",
      students: 312,
      rating: 4.7,
      reviews: 203,
      level: "Intermediate",
      category: "web-dev",
      image: "/placeholder.svg?height=200&width=300",
      description: "Build modern web applications using React, Redux, and modern JavaScript.",
      price: "Free",
      skills: ["React", "JavaScript", "Redux", "CSS"],
      lessons: 32,
      certificates: true,
      language: "English",
      lastUpdated: "2024-01-18",
      difficulty: 70,
      estimatedHours: 40,
    },
    {
      id: 4,
      title: "Database Management Systems",
      instructor: "Dr. Emily Chen",
      instructorAvatar: "/placeholder.svg?height=40&width=40",
      duration: "14 weeks",
      students: 156,
      rating: 4.6,
      reviews: 78,
      level: "Intermediate",
      category: "database",
      image: "/placeholder.svg?height=200&width=300",
      description: "Comprehensive course on SQL, NoSQL, and database design principles.",
      price: "Free",
      skills: ["SQL", "NoSQL", "Database Design", "MongoDB"],
      lessons: 52,
      certificates: true,
      language: "English",
      lastUpdated: "2024-01-12",
      difficulty: 75,
      estimatedHours: 70,
    },
    {
      id: 5,
      title: "Computer Networks",
      instructor: "Prof. Michael Brown",
      instructorAvatar: "/placeholder.svg?height=40&width=40",
      duration: "16 weeks",
      students: 203,
      rating: 4.5,
      reviews: 92,
      level: "Advanced",
      category: "networking",
      image: "/placeholder.svg?height=200&width=300",
      description: "Understanding network protocols, security, and network administration.",
      price: "Free",
      skills: ["TCP/IP", "Network Security", "Routing", "Protocols"],
      lessons: 58,
      certificates: true,
      language: "English",
      lastUpdated: "2024-01-10",
      difficulty: 90,
      estimatedHours: 80,
    },
    {
      id: 6,
      title: "Mobile App Development",
      instructor: "Lisa Anderson",
      instructorAvatar: "/placeholder.svg?height=40&width=40",
      duration: "12 weeks",
      students: 278,
      rating: 4.8,
      reviews: 134,
      level: "Intermediate",
      category: "mobile",
      image: "/placeholder.svg?height=200&width=300",
      description: "Create mobile applications for Android and iOS using React Native.",
      price: "Free",
      skills: ["React Native", "Mobile UI", "API Integration", "Publishing"],
      lessons: 42,
      certificates: true,
      language: "English",
      lastUpdated: "2024-01-22",
      difficulty: 68,
      estimatedHours: 55,
    },
  ]

  const categories = [
    { id: "all", name: "All Courses", count: courses.length, icon: BookOpen, color: "bg-blue-500" },
    {
      id: "programming",
      name: "Programming",
      count: courses.filter((c) => c.category === "programming").length,
      icon: BookOpen,
      color: "bg-green-500",
    },
    {
      id: "web-dev",
      name: "Web Development",
      count: courses.filter((c) => c.category === "web-dev").length,
      icon: Globe,
      color: "bg-purple-500",
    },
    {
      id: "data-science",
      name: "Data Science",
      count: courses.filter((c) => c.category === "data-science").length,
      icon: TrendingUp,
      color: "bg-orange-500",
    },
    {
      id: "database",
      name: "Database",
      count: courses.filter((c) => c.category === "database").length,
      icon: BookOpen,
      color: "bg-red-500",
    },
    {
      id: "networking",
      name: "Networking",
      count: courses.filter((c) => c.category === "networking").length,
      icon: Globe,
      color: "bg-indigo-500",
    },
    {
      id: "mobile",
      name: "Mobile Dev",
      count: courses.filter((c) => c.category === "mobile").length,
      icon: BookOpen,
      color: "bg-pink-500",
    },
  ]

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === "all" || course.category === selectedCategory
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase()))
    return matchesCategory && matchesSearch
  })

  const sortedCourses = [...filteredCourses].sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.rating - a.rating
      case "newest":
        return new Date(b.lastUpdated).getTime() - new Date(a.lastUpdated).getTime()
      case "students":
        return b.students - a.students
      default:
        return b.students - a.students
    }
  })

  // Get enrolled courses
  const myEnrolledCourses = courses.filter((course) => enrolledCourses.has(course.id))

  const toggleFavorite = (courseId) => {
    const newFavorites = new Set(favorites)
    if (newFavorites.has(courseId)) {
      newFavorites.delete(courseId)
    } else {
      newFavorites.add(courseId)
    }
    setFavorites(newFavorites)
  }

  const enrollInCourse = (courseId) => {
    const newEnrolledCourses = new Set(enrolledCourses)
    newEnrolledCourses.add(courseId)
    setEnrolledCourses(newEnrolledCourses)

    // Initialize progress for the course
    setCourseProgress((prev) => ({
      ...prev,
      [courseId]: {
        completedLessons: 0,
        totalLessons: courses.find((c) => c.id === courseId)?.lessons || 0,
        lastAccessed: new Date().toISOString(),
        enrolledDate: new Date().toISOString(),
        timeSpent: 0, // in minutes
      },
    }))

    // Show success message
    alert("Successfully enrolled in the course!")
  }

  const unenrollFromCourse = (courseId) => {
    if (window.confirm("Are you sure you want to unenroll from this course? Your progress will be lost.")) {
      const newEnrolledCourses = new Set(enrolledCourses)
      newEnrolledCourses.delete(courseId)
      setEnrolledCourses(newEnrolledCourses)

      // Remove progress data
      setCourseProgress((prev) => {
        const newProgress = { ...prev }
        delete newProgress[courseId]
        return newProgress
      })
    }
  }

  const updateCourseProgress = (courseId, completedLessons) => {
    setCourseProgress((prev) => ({
      ...prev,
      [courseId]: {
        ...prev[courseId],
        completedLessons,
        lastAccessed: new Date().toISOString(),
      },
    }))
  }

  const getLevelColor = (level) => {
    switch (level) {
      case "Beginner":
        return "bg-emerald-100 text-emerald-800 border-emerald-200"
      case "Intermediate":
        return "bg-amber-100 text-amber-800 border-amber-200"
      case "Advanced":
        return "bg-rose-100 text-rose-800 border-rose-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getDifficultyColor = (difficulty) => {
    if (difficulty <= 40) return "bg-green-500"
    if (difficulty <= 70) return "bg-yellow-500"
    return "bg-red-500"
  }

  const getProgressPercentage = (courseId) => {
    const progress = courseProgress[courseId]
    if (!progress) return 0
    return Math.round((progress.completedLessons / progress.totalLessons) * 100)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
              CSIT Courses
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-normal text-blue-100 mt-2">
                Master Technology Skills
              </span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Enhance your programming and technical skills with our comprehensive courses designed by industry experts
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-blue-100">
              <div className="flex items-center gap-2">
                <CheckCircle className="w-5 h-5" />
                <span>Free Courses</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5" />
                <span>Certificates</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span>Expert Instructors</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("all-courses")}
              className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
                activeTab === "all-courses"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-blue-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5" />
                <span>All Courses</span>
                <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">{courses.length}</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab("my-courses")}
              className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${
                activeTab === "my-courses"
                  ? "text-blue-600 border-blue-600"
                  : "text-gray-600 border-transparent hover:text-blue-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                <span>My Courses</span>
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">{enrolledCourses.size}</span>
              </div>
            </button>
          </div>
        </div>

        {/* All Courses Tab */}
        {activeTab === "all-courses" && (
          <>
            {/* Search and Filter Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 mb-8 shadow-lg border border-white/20">
              <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Search courses, instructors, or skills..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm text-gray-800 placeholder-gray-500"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="px-4 py-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
                  >
                    <option value="popular">Most Popular</option>
                    <option value="rating">Highest Rated</option>
                    <option value="newest">Newest</option>
                    <option value="students">Most Students</option>
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <div className="flex gap-3 overflow-x-auto pb-2">
                  {categories.map((category) => {
                    const IconComponent = category.icon
                    return (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all duration-300 border ${
                          selectedCategory === category.id
                            ? "bg-blue-600 text-white shadow-lg scale-105 border-blue-600"
                            : "bg-white/70 text-gray-700 hover:bg-white hover:shadow-md border-gray-200"
                        }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            selectedCategory === category.id ? "bg-white" : category.color
                          }`}
                        ></div>
                        <IconComponent className="w-4 h-4" />
                        <span className="font-medium">{category.name}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            selectedCategory === category.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {category.count}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>

            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {selectedCategory === "all" ? "All Courses" : categories.find((c) => c.id === selectedCategory)?.name}
                </h2>
                <p className="text-gray-600 mt-1">
                  {sortedCourses.length} course{sortedCourses.length !== 1 ? "s" : ""} found
                </p>
              </div>
            </div>

            {/* Courses Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
              {sortedCourses.map((course) => (
                <div
                  key={course.id}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 hover:scale-[1.02]"
                >
                  {/* Course Image */}
                  <div className="relative overflow-hidden">
                    <img
                      src={course.image || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

                    {/* Overlay Actions */}
                    <div className="absolute top-4 right-4 flex gap-2">
                      <button
                        onClick={() => toggleFavorite(course.id)}
                        className={`p-2 rounded-full backdrop-blur-sm transition-all duration-300 ${
                          favorites.has(course.id)
                            ? "bg-red-500 text-white"
                            : "bg-white/80 text-gray-600 hover:bg-white"
                        }`}
                      >
                        <Heart className={`w-4 h-4 ${favorites.has(course.id) ? "fill-current" : ""}`} />
                      </button>
                      <button className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white backdrop-blur-sm transition-all duration-300">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Enrollment Status */}
                    {enrolledCourses.has(course.id) && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Enrolled
                        </span>
                      </div>
                    )}

                    {/* Level Badge */}
                    {!enrolledCourses.has(course.id) && (
                      <div className="absolute top-4 left-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold border backdrop-blur-sm ${getLevelColor(
                            course.level,
                          )}`}
                        >
                          {course.level}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Course Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-blue-600 transition-colors duration-300">
                          {course.title}
                        </h3>
                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{course.description}</p>
                      </div>
                      <span className="text-2xl font-bold text-green-600 ml-4">{course.price}</span>
                    </div>

                    {/* Instructor */}
                    <div className="flex items-center gap-3 mb-4">
                      <img
                        src={course.instructorAvatar || "/placeholder.svg"}
                        alt={course.instructor}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm text-gray-600">By {course.instructor}</span>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {course.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {course.skills.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg font-medium">
                            +{course.skills.length - 3} more
                          </span>
                        )}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-4 mb-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-blue-500" />
                        <span>{course.duration}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <BookOpen className="w-4 h-4 text-green-500" />
                        <span>{course.lessons} lessons</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span>{course.students} students</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                        <span>
                          {course.rating} ({course.reviews})
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3">
                      {enrolledCourses.has(course.id) ? (
                        <button
                          onClick={() => setActiveTab("my-courses")}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                        >
                          <PlayCircle className="w-4 h-4" />
                          <span>Continue Learning</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => enrollInCourse(course.id)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2 group"
                        >
                          <span>Enroll Now</span>
                          <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                      )}
                      <button className="p-3 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors duration-300">
                        <Download className="w-4 h-4 text-gray-600" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Empty State */}
            {sortedCourses.length === 0 && (
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-lg border border-white/20">
                  <BookOpen className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-600 mb-4">No courses found</h3>
                  <p className="text-gray-500 mb-6">Try adjusting your search terms or explore different categories</p>
                  <button
                    onClick={() => {
                      setSearchTerm("")
                      setSelectedCategory("all")
                    }}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300 font-medium"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            )}
          </>
        )}

        {/* My Courses Tab */}
        {activeTab === "my-courses" && (
          <div>
            {myEnrolledCourses.length === 0 ? (
              <div className="text-center py-16">
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-lg border border-white/20">
                  <GraduationCap className="w-20 h-20 text-gray-400 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-gray-600 mb-4">No enrolled courses yet</h3>
                  <p className="text-gray-500 mb-6">Start your learning journey by enrolling in courses</p>
                  <button
                    onClick={() => setActiveTab("all-courses")}
                    className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors duration-300 font-medium"
                  >
                    Browse Courses
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* My Courses Header */}
                <div className="mb-8">
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">My Learning Dashboard</h2>
                  <p className="text-gray-600">Track your progress and continue your learning journey</p>
                </div>

                {/* Progress Overview */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-blue-100 rounded-lg">
                        <BookOpen className="w-5 h-5 text-blue-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800">Enrolled Courses</h3>
                    </div>
                    <p className="text-2xl font-bold text-blue-600">{enrolledCourses.size}</p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-green-100 rounded-lg">
                        <CheckCircle className="w-5 h-5 text-green-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800">Completed Lessons</h3>
                    </div>
                    <p className="text-2xl font-bold text-green-600">
                      {Object.values(courseProgress).reduce((sum, progress) => sum + progress.completedLessons, 0)}
                    </p>
                  </div>

                  <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="p-2 bg-purple-100 rounded-lg">
                        <Award className="w-5 h-5 text-purple-600" />
                      </div>
                      <h3 className="font-semibold text-gray-800">Certificates</h3>
                    </div>
                    <p className="text-2xl font-bold text-purple-600">
                      {
                        Object.entries(courseProgress).filter(
                          ([_, progress]) => progress.completedLessons === progress.totalLessons,
                        ).length
                      }
                    </p>
                  </div>
                </div>

                {/* Enrolled Courses */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {myEnrolledCourses.map((course) => {
                    const progress = courseProgress[course.id] || { completedLessons: 0, totalLessons: course.lessons }
                    const progressPercentage = getProgressPercentage(course.id)
                    const isCompleted = progress.completedLessons === progress.totalLessons

                    return (
                      <div
                        key={course.id}
                        className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300"
                      >
                        <div className="flex">
                          {/* Course Image */}
                          <div className="w-32 h-32 relative">
                            <img
                              src={course.image || "/placeholder.svg"}
                              alt={course.title}
                              className="w-full h-full object-cover"
                            />
                            {isCompleted && (
                              <div className="absolute inset-0 bg-green-500/90 flex items-center justify-center">
                                <Award className="w-8 h-8 text-white" />
                              </div>
                            )}
                          </div>

                          {/* Course Info */}
                          <div className="flex-1 p-6">
                            <div className="flex items-start justify-between mb-3">
                              <div className="flex-1">
                                <h3 className="text-lg font-bold text-gray-800 mb-1">{course.title}</h3>
                                <p className="text-sm text-gray-600">By {course.instructor}</p>
                              </div>
                              <button
                                onClick={() => unenrollFromCourse(course.id)}
                                className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-300"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>

                            {/* Progress Bar */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                <span>Progress</span>
                                <span>{progressPercentage}% Complete</span>
                              </div>
                              <div className="w-full bg-gray-200 rounded-full h-2">
                                <div
                                  className={`h-2 rounded-full transition-all duration-500 ${
                                    isCompleted ? "bg-green-500" : "bg-blue-500"
                                  }`}
                                  style={{ width: `${progressPercentage}%` }}
                                ></div>
                              </div>
                              <div className="flex items-center justify-between text-xs text-gray-500 mt-1">
                                <span>
                                  {progress.completedLessons} of {progress.totalLessons} lessons
                                </span>
                                <span>Enrolled: {new Date(progress.enrolledDate).toLocaleDateString()}</span>
                              </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex gap-3">
                              {isCompleted ? (
                                <button className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-300 font-medium flex items-center justify-center gap-2">
                                  <Award className="w-4 h-4" />
                                  <span>View Certificate</span>
                                </button>
                              ) : (
                                <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-300 font-medium flex items-center justify-center gap-2">
                                  <PlayCircle className="w-4 h-4" />
                                  <span>Continue Learning</span>
                                </button>
                              )}
                              <button className="p-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-300">
                                <BarChart3 className="w-4 h-4 text-gray-600" />
                              </button>
                            </div>

                            {/* Quick Progress Update (for demo purposes) */}
                            <div className="mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <span className="text-xs text-gray-500">Quick update:</span>
                                <button
                                  onClick={() =>
                                    updateCourseProgress(
                                      course.id,
                                      Math.min(progress.completedLessons + 1, progress.totalLessons),
                                    )
                                  }
                                  disabled={isCompleted}
                                  className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded hover:bg-blue-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  +1 Lesson
                                </button>
                                <button
                                  onClick={() =>
                                    updateCourseProgress(course.id, Math.max(progress.completedLessons - 1, 0))
                                  }
                                  disabled={progress.completedLessons === 0}
                                  className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded hover:bg-gray-200 transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                  -1 Lesson
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </>
            )}
          </div>
        )}

        {/* Stats Section */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-white">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold mb-2">{courses.length}+</div>
              <div className="text-blue-100">Courses Available</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">
                {courses.reduce((sum, course) => sum + course.students, 0).toLocaleString()}+
              </div>
              <div className="text-blue-100">Students Enrolled</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">
                {(courses.reduce((sum, course) => sum + course.rating, 0) / courses.length).toFixed(1)}
              </div>
              <div className="text-blue-100">Average Rating</div>
            </div>
            <div>
              <div className="text-3xl font-bold mb-2">100%</div>
              <div className="text-blue-100">Free Courses</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CoursesPage
