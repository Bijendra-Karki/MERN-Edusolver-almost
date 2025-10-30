import React, { useState, useEffect } from "react";
import axios from "axios";
import { BookOpen, CheckCircle, Award, GraduationCap } from "lucide-react";
import { isAuthenticated } from "../../components/utils/authHelper";
import { useNavigate ,} from "react-router-dom";



const authUser = isAuthenticated() || {};
const token = authUser.token;

const initialCourseProgress = {};

function EnrolledCourses({ setActiveTab }) {
  const navigate = useNavigate();
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseProgress, setCourseProgress] = useState(initialCourseProgress);

  // --- Helper: Calculate progress percentage ---
  const getProgressPercentage = (courseId) => {
    const progress = courseProgress[courseId];
    if (!progress || progress.totalLessons === 0) return 0;
    return Math.round((progress.completedLessons / progress.totalLessons) * 100);
  };

  // --- Fetch enrollments from backend ---
  const fetchEnrollments = async (authToken) => {
    if (!authToken) {
      setLoading(false);
      setError("Authentication required. Please log in.");
      return;
    }

    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      };

      const response = await axios.get("/api/enrollments/my/", config);

      // Flatten nested subject_id data
      const flattenedCourses = response.data
        .filter((enroll) => enroll.subject_id) // make sure subject exists
        .map((enroll) => ({
          enrollmentId: enroll._id,
          courseId: enroll.subject_id._id,
          title: enroll.subject_id.title,
          image: `http://localhost:8000${enroll.subject_id.image}`,
          subjectFile: `http://localhost:8000/upload/Pdf/${enroll.subject_id.subjectFile}`,
          lessons: enroll.subject_id.lessons || 0,
        }));

      // Store in state and localStorage
      setEnrolledCourses(flattenedCourses);
      localStorage.setItem("enrolledCourses", JSON.stringify(flattenedCourses));

      setLoading(false);
      setError(null);
    } catch (err) {
      console.error("Error fetching enrollments:", err);
      setError("Failed to load enrolled courses.");
      setLoading(false);
      setEnrolledCourses([]);
    }
  };

  useEffect(() => {
    fetchEnrollments(token);
  }, [token]);

  // --- Loading and error states ---
  if (loading) {
    return (
      <div className="text-center py-16 text-lg text-blue-600">
        Loading your courses...
      </div>
    );
  }

  if (error && enrolledCourses.length === 0) {
    return (
      <div className="text-center py-16 text-lg text-red-500">
        {error} <br /> Please check your network connection or try logging in again.
      </div>
    );
  }

  return (
    <div>
      {enrolledCourses.length === 0 ? (
        <div className="text-center py-16">
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-12 max-w-md mx-auto shadow-lg border border-white/20">
            <GraduationCap className="w-20 h-20 text-gray-400 mx-auto mb-6" />
            <h3 className="text-2xl font-bold text-gray-600 mb-4">
              No enrolled courses yet
            </h3>
            <p className="text-gray-500 mb-6">
              Start your learning journey by enrolling in courses
            </p>
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
          {/* Progress Overview */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              My Learning Dashboard
            </h2>
            <p className="text-gray-600">
              Track your progress and continue your learning journey
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Enrolled Courses</h3>
              </div>
              <p className="text-2xl font-bold text-blue-600">
                {enrolledCourses.length}
              </p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <h3 className="font-semibold text-gray-800">Completed Lessons</h3>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {Object.values(courseProgress).reduce(
                  (sum, progress) => sum + progress.completedLessons,
                  0
                )}
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
                {Object.entries(courseProgress).filter(
                  ([_, progress]) =>
                    progress.completedLessons === progress.totalLessons
                ).length}
              </p>
            </div>
          </div>

          {/* Courses List */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {enrolledCourses.map((course) => {
              const progress =
                courseProgress[course.courseId] || {
                  completedLessons: 0,
                  totalLessons: course.lessons || 1,
                };
              const progressPercentage = getProgressPercentage(course.courseId);
              const isCompleted =
                progress.totalLessons > 0 &&
                progress.completedLessons === progress.totalLessons;

              return (
                <div
                  key={course.enrollmentId}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300"
                >
                  <div className="flex">
                    <div className="w-32 h-32 relative flex-shrink-0">
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

                    <div className="flex-1 p-6">
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
                        <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                          <span>
                            {progress.completedLessons} / {progress.totalLessons}{" "}
                            Lessons Completed
                          </span>
                        </div>
                      </div>

                      {/* Go to Course Button */}
                      <div className="mt-4 flex gap-2">
                        <button
                          onClick={() =>
                            navigate(`/PDFViewer/${course.courseId}`, {
                            
                             
                            })
                          }
                          className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors"
                        >
                          Go to Course
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export default EnrolledCourses;
