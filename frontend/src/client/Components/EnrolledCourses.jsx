import React, { useState, useEffect } from 'react';
import axios from 'axios'; // Make sure you have axios installed: npm install axios
// Import your necessary icons (assuming you are using a library like lucide-react)
import { BookOpen, CheckCircle, Award, GraduationCap, X } from 'lucide-react';
import { isAuthenticated } from "../../components/utils/authHelper"
const authUser = isAuthenticated()

// --- Configuration/Helper Functions (MOCK data and functions added for completeness) ---
// NOTE: You'll replace these with actual context/state management in a real app
const MOCK_TOKEN = 'YOUR_STUDENT_AUTH_TOKEN_HERE'; // Replace with actual token retrieval
const MOCK_USER_ID = '68c66705dd52a8778f0b5277'; // Replace with actual user ID
const getProgressPercentage = (courseId) =>
    Math.round(Math.random() * 100); // MOCK function

const MOCK_COURSES = [
    { _id: 'sub1', title: 'Calculus I', instructor: 'Dr. Smith', lessons: 10, image: '/placeholder.svg' },
    { _id: 'sub2', title: 'Web Development Basics', instructor: 'Ms. Alice', lessons: 15, image: '/placeholder.svg' }
];
// MOCK state variables needed for rendering
const initialCourseProgress = {
    'sub1': { completedLessons: 5, totalLessons: 10 },
    'sub2': { completedLessons: 15, totalLessons: 15 },
};
// ---------------------------------------------------------------------------------------


function EnrolledCourses({ setActiveTab }) {
    const [enrolledCourses, setEnrolledCourses] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [courseProgress, setCourseProgress] = useState(initialCourseProgress); // Mock
    const myEnrolledCourses = enrolledCourses; // Alias for cleaner JSX
    let userId = authUser.user.user_id;
    const token = authUser.token;


    // Fetch Enrollments from Backend
    // NOTE: Adjust the endpoint and request as per your backend API design
    // The backend should return enrollment data with populated subject/course details


    // 💡 Backend route: router.get("/enrollList", requireSignin, getEnrollments);
    // 💡 Full URL: /api/enrollments/enrollList
    const fetchEnrollments = async (userId, subjectId, token) => {
        // NOTE: The `userId` is often not needed in the GET request if your backend
        // filters the list based on the user ID decoded from the JWT token.
        // We'll use the correct GET method and path here.

        try {
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            };

            // Use GET request and the correct endpoint from your router setup: "/api/enrollments/enrollList"
            const response = await axios.get(`api/enrollments//enrollList`, config);

            // Assuming the backend returns an array of enrollment objects, 
            // each containing the populated subject details.
            // Example response structure: [{ _id: 'enrollmentId', subject_id: { _id: 'subId', title: '...' } }, ...]

            // Extract the subject/course details for display
            const courseList = response.data.map(enrollment => ({
                ...enrollment.subject_id, // Spread subject details (title, instructor, lessons)
                enrollmentId: enrollment._id, // Keep the enrollment ID for unenrollment
                // NOTE: You must ensure your backend populates the subject_id 
                // with fields like 'title', 'instructor', and 'lessons'
                // For now, we'll use MOCK_COURSES if data is empty for rendering.
            }));

            // If the actual fetch returns data, use that. Otherwise, use mock for display.
            if (response.data.length > 0) {
                setEnrolledCourses(courseList);
            } else {
                setEnrolledCourses(MOCK_COURSES);
            }

            setLoading(false);

        } catch (err) {
            console.error("Enrollment Fetch Error:", err.response?.data || err.message);
            setError('Failed to load enrolled courses. Please try logging in again.');
            setLoading(false);
            // Fallback to mock data for layout testing if fetch fails
            setEnrolledCourses(MOCK_COURSES);
        }
    };

    // 💡 Unenroll Function (Assuming backend uses DELETE /deleteEnrollment/:id)
    const unenrollFromCourse = async (enrollmentId) => {
        if (!window.confirm("Are you sure you want to unenroll from this course?")) return;

        try {
            const config = {
                headers: { 'Authorization': `Bearer ${MOCK_TOKEN}` }
            };

            // Use DELETE request and the correct endpoint
            await axios.delete(`/api/enrollments/deleteEnrollment/${enrollmentId}`, config);

            // Update state: filter out the deleted enrollment
            setEnrolledCourses(prevCourses => prevCourses.filter(course => course.enrollmentId !== enrollmentId));
            alert('Successfully unenrolled!');
        } catch (err) {
            console.error("Unenrollment Error:", err.response?.data || err.message);
            alert('Failed to unenroll from the course.');
        }
    };


    // useEffect to run the fetch operation once on component mount
    useEffect(() => {
        // You would typically get the token and userId from a global state/context
        fetchEnrollments(MOCK_USER_ID, MOCK_TOKEN);
    }, []); // Empty dependency array means it runs once

    // --- Loading and Error States ---
    if (loading) {
        return <div className="text-center py-16 text-lg text-blue-600">Loading your courses...</div>;
    }

    if (error) {
        return <div className="text-center py-16 text-lg text-red-500">{error}</div>;
    }
    // --------------------------------

    return (
        <div>
            {myEnrolledCourses.length === 0 ? (
                // Existing No Courses UI
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
                // Existing Courses Display UI
                <>
                    {/* Progress Overview (Uses myEnrolledCourses) */}
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-2">My Learning Dashboard</h2>
                        <p className="text-gray-600">Track your progress and continue your learning journey</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                        <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/20">
                            <div className="flex items-center gap-3 mb-2">
                                <div className="p-2 bg-blue-100 rounded-lg">
                                    <BookOpen className="w-5 h-5 text-blue-600" />
                                </div>
                                <h3 className="font-semibold text-gray-800">Enrolled Courses</h3>
                            </div>
                            {/* Use myEnrolledCourses.length instead of .size */}
                            <p className="text-2xl font-bold text-blue-600">{myEnrolledCourses.length}</p>
                        </div>

                        {/* ... (rest of the progress overview) ... */}
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

                    {/* Enrolled Courses List */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {myEnrolledCourses.map((course) => {
                            // Ensure course._id is used for progress, or use a subject ID if available
                            const progress = courseProgress[course._id] || { completedLessons: 0, totalLessons: course.lessons || 10 }
                            const progressPercentage = getProgressPercentage(course._id)
                            const isCompleted = progress.completedLessons === progress.totalLessons
                            return (
                                <div
                                    key={course.enrollmentId} // Use the enrollment ID as the unique key
                                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-white/20 overflow-hidden hover:shadow-xl transition-all duration-300"
                                >
                                    <div className="flex">
                                        {/* ... (Course Image/Info UI) ... */}
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

                                        <div className="flex-1 p-6">
                                            <div className="flex items-start justify-between mb-3">
                                                <div className="flex-1">
                                                    <h3 className="text-lg font-bold text-gray-800 mb-1">{course.title}</h3>
                                                    <p className="text-sm text-gray-600">By {course.instructor}</p>
                                                </div>
                                                <button
                                                    onClick={() => unenrollFromCourse(course.enrollmentId)} // Pass enrollmentId
                                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors duration-300"
                                                >
                                                    <X className="w-4 h-4" />
                                                </button>
                                            </div>

                                            {/* ... (Progress Bar UI) ... */}
                                            <div className="mb-4">
                                                <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                                    <span>Progress</span>
                                                    <span>{progressPercentage}% Complete</span>
                                                </div>
                                                <div className="w-full bg-gray-200 rounded-full h-2">
                                                    <div
                                                        className={`h-2 rounded-full transition-all duration-500 ${isCompleted ? "bg-green-500" : "bg-blue-500"
                                                            }`}
                                                        style={{ width: `${progressPercentage}%` }}
                                                    ></div>
                                                </div>
                                                <div className="flex items-center space-x-2 text-sm text-gray-500 mt-2">
                                                    <span>{progress.completedLessons} / {progress.totalLessons} Lessons Completed</span>
                                                </div>
                                            </div>

                                            {/* Action Buttons */}
                                            <div className="mt-4 flex gap-2">
                                                <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                                                    Go to Course
                                                </button>
                                                <button onClick={() => unenrollFromCourse(course.enrollmentId)} className="text-sm px-3 py-2 border border-gray-300 rounded-xl text-gray-600 hover:bg-gray-100 transition-colors">
                                                    Unenroll
                                                </button>
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
    )
}

export default EnrolledCourses;