"use client"
import { useState, useEffect } from "react"
import { useNavigate } from 'react-router-dom';
import axios from "axios"
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
import EnrolledCourses from "./EnrolledCourses";
import { getToken, isAuthenticated } from "../../components/utils/authHelper";

// Renaming the state variable to avoid conflict and clearly store the actual enrollment objects.
// 'enrolledCourseIds' will be the Set used for quick lookup (course._id).

const CoursesPage = () => {
  const [activeTab, setActiveTab] = useState("all-courses")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")
  const [sortBy, setSortBy] = useState("popular")
  const [favorites, setFavorites] = useState(new Set())
  
  // 1. New state to hold the actual array of enrollment objects fetched from the API
  const [userEnrollments, setUserEnrollments] = useState([]); 

  // 2. The original state, now explicitly for *Course IDs* for quick enrollment check
  const [enrolledCourseIds, setEnrolledCourseIds] = useState(new Set())
  
  const [courseProgress, setCourseProgress] = useState({})
  const [courses, setCourses] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [enrolling, setEnrolling] = useState(false);
  const navigate = useNavigate();

  // --- CONFLICT RESOLUTION: COMBINED ENROLLMENT FETCHING ---
  // We combine the initial load from localStorage and the API call into one logical sequence.

  // New state for enrollment fetch loading to separate it from the main course list loading
  const [enrollmentsLoading, setEnrollmentsLoading] = useState(true);

  // 1. Initial Load from LocalStorage (for course progress/favorites)
  useEffect(() => {
    const savedCourseProgress = localStorage.getItem("courseProgress")
    const savedFavorites = localStorage.getItem("favoriteCourses")

    // Note: We'll rely on the API for current enrollments, not localStorage, 
    // but keep local storage for non-critical/sync items like progress and favorites.
    if (savedCourseProgress) {
      setCourseProgress(JSON.parse(savedCourseProgress))
    }
    if (savedFavorites) {
      setFavorites(new Set(JSON.parse(savedFavorites)))
    }
  }, [])
  
  // 2. Fetch User Enrollments from API and update both related states
  useEffect(() => {
    const fetchEnrollments = async () => {
      setEnrollmentsLoading(true);
      try {
        const token = getToken();
        if (!token || !isAuthenticated()) {
          // If no token or not authenticated, stop, but don't show an error
          setUserEnrollments([]);
          setEnrolledCourseIds(new Set());
          return;
        }

        const config = {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        };
        
        // API Call: GET /api/enrollments/my
        const response = await axios.get('/api/enrollments/my', config);
        
        const enrollmentsArray = response.data || [];
        setUserEnrollments(enrollmentsArray); // Store the full enrollment objects

        // Convert the array of enrollment objects into a Set of Subject IDs for quick lookup
        const enrolledIds = new Set(enrollmentsArray.map(e => e.subject_id?._id || e.subject_id)); 
        setEnrolledCourseIds(enrolledIds);
        
      } catch (error) {
        console.error("Error fetching enrollments:", error);
      } finally {
        setEnrollmentsLoading(false);
      }
    };

    fetchEnrollments();
  }, []); // Run once on mount

  // 3. Fetch All Courses from the API (Your original logic)
 useEffect(() => {
    const fetchCourses = async () => {
      setLoading(true);

      try {
        // ✅ STEP 1: Retrieve token
        const token = getToken();
        if (!token) {
          setError("Authentication required. Please log in again.");
          navigate("/login");
          return;
        }

        // ✅ STEP 2: Prepare config with Authorization header
        const config = {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        };

        // ✅ STEP 3: Call API
        const response = await axios.get("/api/subjects/subjectsList", config);

        // ✅ STEP 4: Set data if successful
        if (response.data && Array.isArray(response.data)) {
          setCourses(response.data);
        } else {
          setCourses([]);
        }

        setError(null);
      } catch (err) {
        console.error("❌ Failed to fetch courses:", err);

        if (err.response?.status === 401) {
          setError("Unauthorized. Please log in again.");
          navigate("/login");
        } else if (err.response?.status === 403) {
          setError("Access denied. You don’t have permission to view courses.");
        } else {
          setError("Failed to load courses. Please try again later.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, [navigate]);

  // 4. Save state to localStorage whenever it changes (keeping your original saving logic)
  useEffect(() => {
    // Note: You probably want to save the Set of IDs, not the full array from the API, 
    // to match your original localStorage structure.
    localStorage.setItem("enrolledCourses", JSON.stringify([...enrolledCourseIds]))
  }, [enrolledCourseIds])

  useEffect(() => {
    localStorage.setItem("courseProgress", JSON.stringify(courseProgress))
  }, [courseProgress])

  useEffect(() => {
    localStorage.setItem("favoriteCourses", JSON.stringify([...favorites]))
  }, [favorites])

  // --- REST OF THE COMPONENT LOGIC ---

  const categories = [
    { id: "all", name: "All Courses", count: courses.length, icon: BookOpen, color: "bg-blue-500" },
    ...[...new Set(courses.map(c => c.category?.name))].filter(Boolean).map(categoryName => ({
      id: categoryName,
      name: categoryName,
      count: courses.filter(c => c.category?.name === categoryName).length,
      icon: BookOpen,
      color: "bg-gray-500"
    }))
  ]

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = selectedCategory === "all" || course.category?.name === selectedCategory
    const matchesSearch =
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.instructor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (Array.isArray(course.skills) && course.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())))
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

  // CoursesPage.jsx (Updated handelEnroll)
  const handelEnroll = async (subjectId) => {
    setEnrolling(true);
    const token = getToken();

    if (!token) {
      alert("Authentication required. Please log in.");
      setEnrolling(false);
      navigate("/login");
      return;
    }

    try {
      // 1️⃣ Fetch subject details from backend
      const { data: backendSubject } = await axios.get(
        `/api/subjects/subjectsDetails/${subjectId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!backendSubject || !backendSubject._id || !backendSubject.price) {
        throw new Error("Invalid subject details received from server.");
      }

      // 2️⃣ Prepare subject details safely
      const subjectPaymentDetails = {
        subject_id: backendSubject._id,
        price: parseFloat(backendSubject.price).toFixed(2), // ensure 2 decimals
        title: backendSubject.title,
      };

      // 3️⃣ Initiate payment on backend
      const { data: paymentInitiation } = await axios.post(
        "/api/payments/initiate",
        { subjectId: subjectPaymentDetails.subject_id, amount: subjectPaymentDetails.price },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!paymentInitiation || !paymentInitiation.formData || !paymentInitiation.signature) {
        throw new Error("Payment initiation failed. Please try again.");
      }

      // 4️⃣ Store payment form data for the eSewa page
      sessionStorage.setItem(
        "currentPaymentFormData",
        JSON.stringify({
          subject: subjectPaymentDetails,
          formData: paymentInitiation.formData,
          signature: paymentInitiation.signature,
        })
      );

      console.log("Payment initiation successful:", subjectPaymentDetails);

      // 5️⃣ Navigate to eSewa payment page
      navigate("/esewa-payment");
    } catch (error) {
      console.error("Enrollment setup failed:", error.response?.data?.message || error.message);
      alert(
        `Failed to start enrollment: ${error.response?.data?.message || error.message}`
      );
    } finally {
      setEnrolling(false);
    }
  };


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

  // Use a combined loading state
  if (loading || enrollmentsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center">
          <svg className="animate-spin h-10 w-10 text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span className="mt-4 text-gray-600">Loading courses...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return <div className="min-h-screen flex items-center justify-center text-red-500 font-medium">{error}</div>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="max-w-xxl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="flex gap-4 border-b border-gray-200">
            <button
              onClick={() => setActiveTab("all-courses")}
              className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${activeTab === "all-courses"
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
              className={`px-6 py-3 font-semibold transition-all duration-300 border-b-2 ${activeTab === "my-courses"
                ? "text-blue-600 border-blue-600"
                : "text-gray-600 border-transparent hover:text-blue-600"
                }`}
            >
              <div className="flex items-center gap-2">
                <GraduationCap className="w-5 h-5" />
                <span>My Courses</span>
                {/* Use the size of the ID set for the count */}
                <span className="bg-blue-100 text-blue-600 px-2 py-1 rounded-full text-xs">{enrolledCourseIds.size}</span>
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
                      placeholder="Search courses"
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
                    className="px-4 py-4 border border-gray-200 text-black rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white/90 backdrop-blur-sm"
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
                        className={`flex items-center gap-2 px-4 py-3 rounded-xl whitespace-nowrap transition-all duration-300 border ${selectedCategory === category.id
                          ? "bg-blue-600 text-white shadow-lg scale-105 border-blue-600"
                          : "bg-white/70 text-gray-700 hover:bg-white hover:shadow-md border-gray-200"
                          }`}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${selectedCategory === category.id ? "bg-white" : category.color
                            }`}
                        ></div>
                        <IconComponent className="w-4 h-4" />
                        <span className="font-medium">{category.name}</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${selectedCategory === category.id ? "bg-white/20 text-white" : "bg-gray-100 text-gray-600"
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
                  key={course._id}
                  className="group bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 hover:scale-[1.02]"
                >
                  {/* Course Image */}

                  <div className="relative overflow-hidden">
                    <img
                      src={`/${course.image}` || "/placeholder.svg"}
                      alt={course.title}
                      className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
                    />

                    {/* Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {/* Overlay Actions */}
                    <div className="absolute top-4 right-4 flex gap-2">

                      <button className="p-2 rounded-full bg-white/80 text-gray-600 hover:bg-white backdrop-blur-sm transition-all duration-300">
                        <Share2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Enrollment Status - Check against the ID Set */}
                    {enrolledCourseIds.has(course._id) && (
                      <div className="absolute top-4 left-4">
                        <span className="bg-green-500 text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Enrolled
                        </span>
                      </div>
                    )}

                    {/* Level Badge */}
                    {!enrolledCourseIds.has(course._id) && (
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
                        src={`../../../../backend/uploads/images/${course.instructorAvatar}` || "/placeholder.svg"}
                        alt={course.instructor}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                      <span className="text-sm text-gray-600">By {course.instructor}</span>
                    </div>

                    {/* Skills */}
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-1">
                        {Array.isArray(course.skills) && course.skills.slice(0, 3).map((skill, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-lg font-medium"
                          >
                            {skill}
                          </span>
                        ))}
                        {Array.isArray(course.skills) && course.skills.length > 3 && (
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
                      {enrolledCourseIds.has(course._id) ? (
                        <button
                          onClick={() => setActiveTab("my-courses")}
                          className="flex-1 bg-gradient-to-r from-green-600 to-emerald-600 text-white py-3 px-4 rounded-xl hover:from-green-700 hover:to-emerald-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2"
                        >
                          {/* 🟢 Change the text here from "Continue Learning" to "Enrolled" or "View Course" */}
                          <CheckCircle className="w-4 h-4" /> {/* Using CheckCircle for "Enrolled" */}
                          <span>Enrolled</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handelEnroll(course._id)}
                          className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-300 font-semibold flex items-center justify-center gap-2 group"
                          disabled={enrolling}
                        >
                          <span>{enrolling ? "Enrolling..." : "Enroll Now"}</span>
                          {enrolling ? (
                            <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                          ) : (
                            <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                          )}
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
          // Pass the fetched enrollment data to the EnrolledCourses component
          <EnrolledCourses enrolledCoursesData={userEnrollments} />
        )}
      </div>
    </div>
  )
}

export default CoursesPage