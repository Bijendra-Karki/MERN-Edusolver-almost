"use client"; // Essential directive for client-side functionality

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Logo from "../assets/Img/Logo2.png";
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
  Mail,
} from "lucide-react";
import Button from "../components/button";
import { getToken, isAuthenticated } from "../components/utils/authHelper";
import ProfileModal from "./ProfileModal";

export default function ExpertPanel() {
  const navigate = useNavigate();

  // 1. Synchronously get auth data at the top
  const authUser = isAuthenticated(); // { _id: "...", name: "..." } or null/false
  const token = getToken(); // JWT string or null/false
  const userId = authUser.user._id;

  // console.log(authUser.user._id);

 

  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState("requests");
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [suggestion, setSuggestion] = useState("");
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [showSuggestionModal, setShowSuggestionModal] = useState(false);
  const [selectedStudentForSuggestion, setSelectedStudentForSuggestion] =
    useState("");
  const [newResource, setNewResource] = useState({
    title: "",
    description: "",
    type: "article",
    file: null,
    url: "",
  });

  // Placeholder states (Ensure they are initialized as arrays)
  const [students, setStudents] = useState([]);
  const [pendingRequests, setPendingRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [resources, setResources] = useState([]);
  const [isSaving, setIsSaving] = useState(false);


  // ----------------------------------------------------------------------
  // HANDLERS
  // ----------------------------------------------------------------------



  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("token");
    alert("Logged out successfully!");
    navigate("/login");
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Navigation Tabs */}
      <div className="w-full px-2 sm:px-4 lg:px-8 py-2 sm:py-4">
        <div className="flex flex-wrap gap-1 sm:gap-2 lg:gap-4 mb-4 sm:mb-6 overflow-x-auto">
          {[
            {
              id: "requests",
              label: "Student Requests",
              icon: UserPlus,
              count: pendingRequests.length,
            },
            {
              id: "students",
              label: "My Students",
              icon: Users,
              count: students.length,
            },
            { id: "suggestions", label: "Suggestions", icon: MessageSquare },
            {
              id: "resources",
              label: "Resources",
              icon: BookOpen,
              count: resources.length,
            },
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
                    activeTab === tab.id
                      ? "bg-white/20"
                      : "bg-blue-100 text-blue-600"
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
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Pending Student Requests
                </h2>
                <span className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium self-start">
                  {pendingRequests.length} pending
                </span>
              </div>

              {pendingRequests.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <UserPlus className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">
                    No pending requests
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    New student requests will appear here
                  </p>
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
                            <p className="text-gray-600 text-xs sm:text-sm truncate">
                              {request.email}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(
                            request.urgency
                          )} whitespace-nowrap`}
                        >
                          {request.urgency} priority
                        </span>
                      </div>

                      {/* Academic Info */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 mb-4">
                        <div className="bg-blue-50 p-2 sm:p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">Semester</p>
                          <p className="font-semibold text-blue-600 text-sm sm:text-base">
                            {request.semester}
                          </p>
                        </div>
                        <div className="bg-green-50 p-2 sm:p-3 rounded-lg">
                          <p className="text-xs text-gray-600 mb-1">GPA</p>
                          <p className="font-semibold text-green-600 text-sm sm:text-base">
                            {request.gpa}
                          </p>
                        </div>
                      </div>

                      {/* Subjects */}
                      <div className="mb-4">
                        <p className="text-sm text-gray-600 mb-2">
                          Subjects of Interest:
                        </p>
                        <div className="flex flex-wrap gap-1 sm:gap-2">
                          {request.subjects.map((subject, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full"
                            >
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
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  My Students
                </h2>
                <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-sm font-medium self-start">
                  {students.length} active students
                </span>
              </div>

              {students.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">
                    No students yet
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    Accept student requests to start mentoring
                  </p>
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
                          <h3 className="text-gray-800 font-semibold text-sm sm:text-base truncate">
                            {student.name}
                          </h3>
                          <p className="text-gray-600 text-xs sm:text-sm truncate">
                            {student.email}
                          </p>
                          {student.acceptedDate && (
                            <p className="text-gray-500 text-xs">
                              Joined: {student.acceptedDate}
                            </p>
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
                          <p className="text-gray-800 text-sm mt-1">
                            {student.progress}%
                          </p>
                        </div>

                        <div>
                          <p className="text-gray-600 text-sm mb-1">Subjects</p>
                          <div className="flex flex-wrap gap-1">
                            {student.subjects.map((subject, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded"
                              >
                                {subject}
                              </span>
                            ))}
                          </div>
                        </div>

                        {student.strengths.length > 0 && (
                          <div>
                            <p className="text-gray-600 text-sm mb-1">
                              Strengths
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {student.strengths.map((strength, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded"
                                >
                                  {strength}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {student.weaknesses.length > 0 && (
                          <div>
                            <p className="text-gray-600 text-sm mb-1">
                              Areas to Improve
                            </p>
                            <div className="flex flex-wrap gap-1">
                              {student.weaknesses.map((weakness, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded"
                                >
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
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  Suggestions
                </h2>
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
                  <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">
                    No students to send suggestions
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    Accept student requests first to start sending suggestions
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {suggestions.length === 0 ? (
                    <div className="text-center py-6 sm:py-8">
                      <MessageSquare className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3" />
                      <h3 className="text-base sm:text-lg font-medium text-gray-600 mb-2">
                        No suggestions sent yet
                      </h3>
                      <p className="text-gray-500 mb-4 text-sm sm:text-base">
                        Start mentoring your students by sending helpful
                        suggestions
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
                      <div
                        key={suggestion.id}
                        className="bg-blue-50 rounded-lg p-3 sm:p-4 border border-blue-100"
                      >
                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-2 gap-2">
                          <h3 className="text-gray-800 font-semibold text-sm sm:text-base">
                            {suggestion.studentName}
                          </h3>
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
                            <span className="text-gray-500 text-xs sm:text-sm">
                              {suggestion.date}
                            </span>
                          </div>
                        </div>
                        <p className="text-gray-700 text-sm sm:text-base">
                          {suggestion.message}
                        </p>
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
              <h2 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
                Add New Resource
              </h2>

              {/* Enhanced form inputs with validation feedback */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4 mb-4">
                <div>
                  <input
                    type="text"
                    placeholder="Resource Title *"
                    value={newResource.title}
                    onChange={(e) =>
                      setNewResource({ ...newResource, title: e.target.value })
                    }
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
                  onChange={(e) =>
                    setNewResource({ ...newResource, type: e.target.value })
                  }
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
                  onChange={(e) =>
                    setNewResource({
                      ...newResource,
                      description: e.target.value,
                    })
                  }
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
                  <p className="text-xs text-gray-500">
                    {newResource.description.length}/500 characters
                  </p>
                </div>
              </div>

              {/* File Upload Section */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload File or Add URL
                </label>
                {/* File Upload */}
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 mb-3">
                  {!newResource.file ? (
                    <div className="text-center">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <p className="text-sm text-gray-600 mb-2">
                        Drag and drop a file here, or click to select
                      </p>
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
                      <p className="text-xs text-gray-500 mt-2">
                        Max file size: 50MB
                      </p>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-center gap-2">
                        {getResourceIcon(newResource.type)}
                        <div>
                          <p className="text-sm font-medium text-gray-800">
                            {newResource.file.name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {formatFileSize(newResource.file.size)}
                          </p>
                        </div>
                      </div>
                      <button
                        onClick={removeFile}
                        className="text-red-600 hover:text-red-800 p-1"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                {/* URL Input (alternative to file upload) */}
                {!newResource.file && (
                  <div>
                    <label className="block text-xs text-gray-600 mb-1">
                      Or add a URL:
                    </label>
                    <input
                      type="url"
                      placeholder="https://example.com/resource"
                      value={newResource.url}
                      onChange={(e) =>
                        setNewResource({ ...newResource, url: e.target.value })
                      }
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
                    setNewResource({
                      title: "",
                      description: "",
                      type: "article",
                      file: null,
                      url: "",
                    });
                    const fileInput = document.getElementById("file-upload");
                    if (fileInput) fileInput.value = "";
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
                <h2 className="text-lg sm:text-xl font-bold text-gray-800">
                  My Resources
                </h2>
                <span className="bg-purple-100 text-purple-600 px-3 py-1 rounded-full text-sm font-medium self-start">
                  {resources.length} resources
                </span>
              </div>

              {resources.length === 0 ? (
                <div className="text-center py-8 sm:py-12">
                  <BookOpen className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg sm:text-xl font-medium text-gray-600 mb-2">
                    No resources yet
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    Add your first resource to get started
                  </p>
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

                      <p className="text-gray-600 text-xs sm:text-sm mb-3 line-clamp-2">
                        {resource.description}
                      </p>

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
         <ProfileModal/>
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
                  setSelectedStudent(null);
                  setSuggestion("");
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
            <h3 className="text-base sm:text-lg font-bold text-gray-800 mb-4">
              Send Suggestion to Student
            </h3>
            {/* Student Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Student
              </label>
              <select
                value={selectedStudentForSuggestion}
                onChange={(e) =>
                  setSelectedStudentForSuggestion(e.target.value)
                }
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
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Your Suggestion
              </label>
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
  );
}
