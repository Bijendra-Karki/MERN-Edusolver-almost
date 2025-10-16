import React from 'react'
import { useState, useEffect } from "react";
import { getToken, isAuthenticated } from "../components/utils/authHelper"; // Added handleLogout import
import axios from "axios";
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
  Save,
  MapPin,
  Globe,
  Award,
  Briefcase,
  DollarSign,
  Shield,
  Timer,
  TrendingUp,
  Mail,
  BanknoteArrowUp,
} from "lucide-react";

function ProfileModal() {
  const authUser = isAuthenticated();
  const token = getToken();
  // Ensure we have user info before proceeding (should be handled by a parent route guard)
  if (!authUser || !authUser.user || !token) {
    // Basic fallback if auth is severely broken
    return <div>Authentication Required</div>;
  }
  
  const userId = authUser.user._id;

  // Define Initial State (Using Frontend Keys for consistency)
  const initialUserState = {
    _id: userId,
    name: authUser.user.name || "Profile Loading...",
    
    // Frontend State Keys used in JSX and Edit Mode
    title: "", // Mapped to/from 'specialization'
    bio: "", // Mapped to/from 'about'
    education: "", // Mapped to/from 'qualification'
    location: "", // Mapped to/from 'address'
    
    company: "",
    email: authUser.user.email || "", // Fallback to email from authUser
    availability: "",

    languages: [],
    skills: [],
    certifications: [],

    verified: false,
    rating: 0,
    reviews: 0,
    hourlyRate: 0,
    experience: "N/A",
    totalSessions: 0,
    successRate: "N/A",
    responseTime: "N/A",
  };

  // State is initialized to null to trigger the loading guard
  const [user, setUser] = useState(null); 
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editedProfile, setEditedProfile] = useState(initialUserState);
  
  // Placeholder states (Ensure they are initialized as arrays)
  const [students, setStudents] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [resources, setResources] = useState([]);
  const [isSaving, setIsSaving] = useState(false);

  // ----------------------------------------------------------------------
  // DATA FETCHING (Profile Load)
  // ----------------------------------------------------------------------

  useEffect(() => {
    const fetchExpertProfile = async () => {
      try {
        const profileResponse = await axios.get(
          `/api/auth/user/details/${userId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const rawProfileData = profileResponse.data.data || profileResponse.data;

        // 🌟 FIX & IMPROVEMENT: Map API keys (schema) to local state keys (frontend)
        const cleanProfileData = {
          ...initialUserState,
          ...rawProfileData,
          
          // MAPPING FROM SCHEMA (e.g., about) TO FRONTEND (e.g., bio)
          name: rawProfileData.name || authUser.user.name,
          title: rawProfileData.specialization || rawProfileData.title || "", // Use specialization/title for the header title
          bio: rawProfileData.about || "", 
          education: rawProfileData.qualification || "",
          location: rawProfileData.address || "", 
          
          // Ensure array fields are present and safe
          skills: rawProfileData.skills || [],
          languages: rawProfileData.languages || [],
          certifications: rawProfileData.certifications || [],
        };

        setUser(cleanProfileData);
        setEditedProfile(cleanProfileData);
      } catch (err) {
        console.error(
          "Failed to fetch user profile:",
          err.response?.data?.message || err
        );
        if (err.response?.status === 401 || err.response?.status === 403) {
          alert("Session expired or unauthorized. Please log in again.");
          // Ensure handleLogout is correctly imported or defined elsewhere
          // handleLogout(); 
        }
      }
    };

    fetchExpertProfile();
  }, [userId, token]); // Added dependencies to suppress warning and ensure refetch on change (though unlikely for user ID)

  const handleEditProfile = () => {
    setIsEditingProfile(true);
    setEditedProfile({ ...user });
  };
  
  const handleProfileChange = (field, value) => {
    setEditedProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Helper function to handle string-to-array conversion
  const cleanArrayField = (value) => {
    if (Array.isArray(value)) return value;
    
    return value 
        ?.split(",")
        .map((s) => s.trim())
        .filter((s) => s.length > 0) || []; 
  };

  const handleSkillsChange = (value) => {
    setEditedProfile((prev) => ({
      ...prev,
      skills: cleanArrayField(value),
    }));
  };

  const handleLanguagesChange = (value) => {
    setEditedProfile((prev) => ({
      ...prev,
      languages: cleanArrayField(value),
    }));
  };

  const handleCertificationsChange = (value) => {
    setEditedProfile((prev) => ({
      ...prev,
      certifications: cleanArrayField(value),
    }));
  };

  const handleSaveProfile = async () => {
    const currentToken = getToken();
    if (!currentToken) {
      alert("Authentication error. Please log in again.");
      // handleLogout();
      return;
    }

    setIsSaving(true);

    try {
      const dataToSend = {
        // Start with all editedProfile fields
        ...editedProfile,

        // 🚨 CRITICAL FIX: Map Frontend State Keys back to Backend Schema Keys
        // Frontend (editedProfile) -> Backend (dataToSend)
        specialization: editedProfile.title || editedProfile.specialty || null,
        about: editedProfile.bio || null, 
        qualification: editedProfile.education || null, 
        address: editedProfile.location || null, 

        // Ensure array fields are consistently cleaned
        skills: cleanArrayField(editedProfile.skills),
        languages: cleanArrayField(editedProfile.languages),
        certifications: cleanArrayField(editedProfile.certifications),
        
        // Remove transient frontend-only fields before sending if necessary
        // (The backend should ignore any extra fields, so this is fine)
      };

      const response = await axios.put(
        `/api/auth/userUpdate/${userId}`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${currentToken}`,
          },
        }
      );
      
      const rawUpdatedUser = response.data.data || response.data;

      // Map API response back to Frontend state keys
      const cleanUpdatedUser = {
        ...rawUpdatedUser,
        
        title: rawUpdatedUser.specialization || rawUpdatedUser.title || "", 
        bio: rawUpdatedUser.about || "", 
        education: rawUpdatedUser.qualification || "", 
        location: rawUpdatedUser.address || "", 
        
        skills: rawUpdatedUser.skills || [],
        languages: rawUpdatedUser.languages || [],
        certifications: rawUpdatedUser.certifications || [],
      };

      setUser(cleanUpdatedUser);
      setEditedProfile(cleanUpdatedUser);
      setIsEditingProfile(false);
      alert("Profile updated successfully! ✅");
    } catch (err) {
      console.error(
        "Error saving profile:",
        err.response?.data?.message || err
      );
      alert(
        "Failed to update profile: " +
          (err.response?.data?.message || "Server error.")
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditingProfile(false);
    // Reset editedProfile to the last saved user state
    setEditedProfile(user); 
  };
  
  // ----------------------------------------------------------------------
  // 🚨 CRITICAL FIX 1: RENDER GUARD
  // Prevents crash by ensuring 'user' is an object before attempting to read its properties
  // ----------------------------------------------------------------------
  if (!user) {
    return (
      <div className="flex justify-center items-center h-full p-10 text-center text-lg text-blue-600">
        Loading Expert Profile Data... ⏳
      </div>
    );
  }
  // ----------------------------------------------------------------------

  return (
     <div className="space-y-4 sm:space-y-6">
            {!isEditingProfile ? (
              // ===================================================
              // PROFILE VIEW MODE (FIXED DATA ACCESS)
              // ===================================================
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
                          <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
                            {user.name} {/* 🚨 FIX: Use user.name */}
                          </h2>
                          {user.verified && ( 
                            /* 🚨 FIX: Use user.verified */
                            <Shield className="w-4 h-4 sm:w-5 sm:h-5 text-green-500" />
                          )}
                        </div>
                        <p className="text-base sm:text-lg text-blue-600 font-medium">
                          {user.title} {/* 🚨 FIX: Use user.title (which maps to specialization) */}
                        </p>
                        <p className="text-gray-600 text-sm sm:text-base">
                          {user.company} {/* 🚨 FIX: Use user.company */}
                        </p>
                        <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mt-2">
                          <div className="flex items-center gap-1">
                            <Star className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                            <span className="font-medium text-sm sm:text-base">
                              {user.rating} {/* 🚨 FIX: Use user.rating */}
                            </span>
                            <span className="text-gray-500 text-xs sm:text-sm">
                              ({user.reviews} reviews) {/* 🚨 FIX: Use user.reviews */}
                            </span>
                          </div>
                          <div className="flex items-center gap-1 text-green-600 font-medium text-sm sm:text-base">
                            <BanknoteArrowUp className="w-3 h-3 sm:w-4 sm:h-4" />
                          
                            <span>{user.payScale}/hour</span> {/* 🚨 FIX: Use user.payScale */}
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
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                      About
                    </h3>
                    <p className="text-gray-700 leading-relaxed text-sm sm:text-base">
                      {user.bio} {/* 🚨 FIX: Use user.bio (which maps to about) */}
                    </p>
                  </div>

                  {/* Skills */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-3">
                      Skills & Expertise
                    </h3>
                    <div className="flex flex-wrap gap-1 sm:gap-2">
                      {user.skills?.map((skill, index) => ( 
                        /* 🚨 FIX: Use user.skills */
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
                    {/* Experience & Stats (Non-editable, so reuse as is) */}
                    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                        Professional Stats
                      </h3>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          </div>
                          <div className="text-base sm:text-lg font-bold text-blue-600">
                            {user.experience} {/* 🚨 FIX: Use user.experience */}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            Experience
                          </div>
                        </div>
                        <div className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                          </div>
                          <div className="text-base sm:text-lg font-bold text-green-600">
                            {user.totalSessions} {/* 🚨 FIX: Use user.totalSessions */}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            Total Sessions
                          </div>
                        </div>
                        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                          </div>
                          <div className="text-base sm:text-lg font-bold text-purple-600">
                            {user.successRate} {/* 🚨 FIX: Use user.successRate */}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            Success Rate
                          </div>
                        </div>
                        <div className="bg-orange-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                          </div>
                          <div className="text-base sm:text-lg font-bold text-orange-600">
                            {user.responseTime} {/* 🚨 FIX: Use user.responseTime */}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            Response Time
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Availability & Location */}
                    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                        Availability & Location
                      </h3>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                          <span className="text-gray-700 text-sm sm:text-base">
                            Available: {user.availability} {/* 🚨 FIX: Use user.availability */}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                          <span className="text-gray-700 text-sm sm:text-base">
                            {user.location} {/* 🚨 FIX: Use user.location (which maps to address) */}
                          </span>
                        </div>
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500" />
                          <span className="text-gray-700 text-sm sm:text-base">
                            Languages: {user.languages?.join(", ")} {/* 🚨 FIX: Use user.languages */}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Education */}
                    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                        Education
                      </h3>
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                        <span className="text-gray-700 text-sm sm:text-base">
                          {user.education} {/* 🚨 FIX: Use user.education (which maps to qualification) */}
                        </span>
                      </div>
                    </div>

                    {/* Certifications */}
                    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                        Certifications
                      </h3>
                      <div className="space-y-2">
                        {user.certifications?.map((cert, index) => (
                           <div key={index} className="flex items-center gap-3">
                             <Award className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                             <span className="text-gray-700 text-sm sm:text-base">
                               {cert}
                             </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Current Students Stats (Non-editable, so reuse as is) */}
                    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                        Current Activity
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:gap-4">
                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="text-xl sm:text-2xl font-bold text-blue-600">
                            {students.length}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            Active Students
                          </div>
                        </div>
                        <div className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="text-xl sm:text-2xl font-bold text-green-600">
                            {suggestions.length}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            Suggestions Sent
                          </div>
                        </div>
                        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="text-xl sm:text-2xl font-bold text-purple-600">
                            {resources.length}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            Resources Created
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              // ===================================
              // PROFILE EDIT MODE (The new structure)
              // ===================================
              <div className="space-y-4 sm:space-y-6">
                {/* Profile Header Card */}
                <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                  {/* Header with Save/Cancel Buttons */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between mb-4 sm:mb-6 gap-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="w-16 h-16 sm:w-20 sm:h-20 bg-blue-100 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 sm:w-10 sm:h-10 text-blue-600" />
                      </div>
                      <div className="min-w-0 flex-1 space-y-2">
                        {/* Name Input */}
                        <div className="relative">
                          <label className="sr-only" htmlFor="name-edit">
                            Full Name
                          </label>
                          <input
                            id="name-edit"
                            type="text"
                            value={editedProfile.name || ""}
                            onChange={(e) =>
                              handleProfileChange("name", e.target.value)
                            }
                            className="text-xl sm:text-2xl font-bold text-gray-800 border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full p-0"
                          />
                        </div>
                        {/* Title Select */}
                        <div className="relative">
                          <label className="sr-only" htmlFor="title-edit">
                            Job Title
                          </label>
                          <input
                            id="title-edit"
                            type="text"
                            value={editedProfile.title || ""}
                            onChange={(e) =>
                              handleProfileChange("title", e.target.value)
                            }
                            className="text-base sm:text-lg text-blue-600 font-medium border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full p-0"
                            placeholder="Job Title"
                          />
                        </div>
                        {/* Company Input & Hourly Rate/Experience/Specialty in a grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-2">
                          {/* Company */}
                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Company
                            </label>
                            <input
                              type="text"
                              value={editedProfile.company || ""}
                              onChange={(e) =>
                                handleProfileChange("company", e.target.value)
                              }
                              className="text-sm sm:text-base text-gray-600 border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full p-0"
                              placeholder="Company"
                            />
                          </div>
                          {/* Hourly Rate */}
                          <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Rate
                            </label>
                            <input
                              type="text"
                              value={editedProfile.payScale || ""}
                              onChange={(e) =>
                                handleProfileChange(
                                  "payScale",
                                  e.target.value
                                )
                              }
                              className="text-sm sm:text-base text-green-600 font-medium border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full p-0"
                              placeholder="$0"
                            />
                          </div>
                          {/* Experience */}
                          <div className="col-span-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Experience
                            </label>
                            <input
                              type="text"
                              value={editedProfile.experience || ""}
                              onChange={(e) =>
                                handleProfileChange(
                                  "experience",
                                  e.target.value
                                )
                              }
                              className="text-sm sm:text-base text-blue-600 font-medium border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full p-0"
                              placeholder="5+ years"
                            />
                          </div>
                          {/* Specialty Select */}
                          <div className="col-span-2 sm:col-span-1">
                            <label className="block text-xs font-medium text-gray-500 mb-1">
                              Specialty
                            </label>
                            {/* NOTE: If you want to use the 'title' field for the job title above,
                                  you should change this state field to 'specialty' or 'specialization' */}
                            <select
                              value={editedProfile.title || editedProfile.specialty || ""}
                              onChange={(e) =>
                                handleProfileChange("title", e.target.value)
                              }
                              className="text-sm sm:text-base text-gray-700 border-b border-gray-300 focus:border-blue-500 focus:outline-none w-full p-0 bg-transparent appearance-none"
                            >
                              <option value="DevOps">DevOps</option>
                              <option value="Frontend">Frontend</option>
                              <option value="Backend">Backend</option>
                              <option value="Full Stack">Full Stack</option>
                              <option value="Mobile">Mobile</option>
                              <option value="Data Science">Data Science</option>
                              <option value="AI/ML">AI/ML</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* Action Buttons */}
                    <div className="flex gap-2 sm:gap-3 self-start sm:self-auto">
                      <button
                        onClick={handleSaveProfile}
                        className="bg-green-600 hover:bg-green-700 text-white px-3 sm:px-4 py-2 rounded-lg transition-colors flex items-center gap-1 sm:gap-2 text-sm sm:text-base"
                        disabled={isSaving}
                      >
                        <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-700 px-3 sm:px-4 py-2 rounded-lg transition-colors text-sm sm:text-base"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>

                  {/* Bio Textarea */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-2">
                      About (Bio)
                    </h3>
                    <textarea
                      value={editedProfile.bio || ""}
                      onChange={(e) =>
                        handleProfileChange("bio", e.target.value)
                      }
                      rows={4}
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 text-sm sm:text-base text-gray-700 leading-relaxed"
                      placeholder="Write a brief bio about your expertise and experience..."
                    />
                  </div>

                  {/* Skills Input */}
                  <div className="mb-4 sm:mb-6">
                    <h3 className="text-base sm:text-lg font-semibold text-black mb-3">
                      Skills & Expertise
                    </h3>
                    <input
                      type="text"
                      value={editedProfile.skills?.join(", ") || ""}
                      onChange={(e) => handleSkillsChange(e.target.value)}
                      placeholder="Enter skills separated by commas (e.g., Docker, Kubernetes, AWS, React, Node.js, Python Developer)"
                      className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-100 text-sm sm:text-base text-gray-700 leading-relaxed"
                    />
                  </div>
                </div>

                {/* Professional Details Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                  {/* Left Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Reusing the non-editable Professional Stats card */}
                    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                        Professional Stats (View Only)
                      </h3>
                      <div className="grid grid-cols-2 gap-3 sm:gap-4 opacity-70">
                        {/* NOTE: These are non-editable, so we display them as read-only */}
                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Briefcase className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
                          </div>
                          <div className="text-base sm:text-lg font-bold text-blue-600">
                            {user.experience}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            Experience
                          </div>
                        </div>
                        {/* ... other stats remain the same as in view mode */}
                        <div className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
                          </div>
                          <div className="text-base sm:text-lg font-bold text-green-600">
                            {user.totalSessions}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            Total Sessions
                          </div>
                        </div>
                        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <TrendingUp className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
                          </div>
                          <div className="text-base sm:text-lg font-bold text-purple-600">
                            {user.successRate}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            Success Rate
                          </div>
                        </div>
                        <div className="bg-orange-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="flex items-center justify-center gap-2 mb-2">
                            <Timer className="w-4 h-4 sm:w-5 sm:h-5 text-orange-600" />
                          </div>
                          <div className="text-base sm:text-lg font-bold text-orange-600">
                            {user.responseTime}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            Response Time
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Availability & Location (now with inputs/selects) */}
                    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                        Availability & Location
                      </h3>
                      <div className="space-y-3">
                        {/* Availability Select */}
                        <div className="flex items-center gap-3">
                          <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 min-w-[1rem]" />
                          <div className="flex-1">
                            <label
                              className="sr-only"
                              htmlFor="availability-edit"
                            >
                              Availability
                            </label>
                            <select
                              id="availability-edit"
                              value={editedProfile.availability || ""}
                              onChange={(e) =>
                                handleProfileChange(
                                  "availability",
                                  e.target.value
                                )
                              }
                              className="w-full text-gray-700 text-sm sm:text-base border-b border-gray-300 focus:border-blue-500 focus:outline-none p-0 bg-transparent appearance-none"
                            >
                              <option value="">Select Availability</option>
                              <option value="Weekdays">Weekdays</option>
                              <option value="Weekends">Weekends</option>
                              <option value="Evenings">Evenings</option>
                              <option value="Flexible">Flexible</option>
                            </select>
                          </div>
                        </div>
                        {/* Location Input */}
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 min-w-[1rem]" />
                          <div className="flex-1">
                            <label className="sr-only" htmlFor="location-edit">
                              Location
                            </label>
                            <input
                              id="location-edit"
                              type="text"
                              value={editedProfile.location || ""}
                              onChange={(e) =>
                                handleProfileChange("location", e.target.value)
                              }
                              placeholder="City, State/Country"
                              className="w-full text-gray-700 text-sm sm:text-base border-b border-gray-300 focus:border-blue-500 focus:outline-none p-0"
                            />
                          </div>
                        </div>
                        {/* Languages Input */}
                        <div className="flex items-center gap-3">
                          <Globe className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 min-w-[1rem]" />
                          <div className="flex-1">
                            <label className="sr-only" htmlFor="languages-edit">
                              Languages
                            </label>
                            <input
                              id="languages-edit"
                              type="text"
                              value={editedProfile.languages?.join(", ") || ""}
                              onChange={(e) =>
                                handleLanguagesChange(e.target.value)
                              }
                              placeholder="Languages (comma-separated)"
                              className="w-full text-gray-700 text-sm sm:text-base border-b border-gray-300 focus:border-blue-500 focus:outline-none p-0"
                            />
                          </div>
                        </div>
                        {/* Email Input (Added here for contact info) */}
                        <div className="flex items-center gap-3">
                          <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-500 min-w-[1rem]" />
                          <div className="flex-1">
                            <label className="sr-only" htmlFor="email-edit">
                              Email
                            </label>
                            <input
                              id="email-edit"
                              type="email"
                              value={editedProfile.email || ""}
                              onChange={(e) =>
                                handleProfileChange("email", e.target.value)
                              }
                              placeholder="Email"
                              className="w-full text-gray-700 text-sm sm:text-base border-b border-gray-300 focus:border-blue-500 focus:outline-none p-0"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right Column */}
                  <div className="space-y-4 sm:space-y-6">
                    {/* Education Input */}
                    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                        Education
                      </h3>
                      <div className="flex items-center gap-3">
                        <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 min-w-[1rem]" />
                        <div className="flex-1">
                          <label className="sr-only" htmlFor="education-edit">
                            Education
                          </label>
                          <input
                            id="education-edit"
                            type="text"
                            value={editedProfile.education || ""}
                            onChange={(e) =>
                              handleProfileChange("education", e.target.value)
                            }
                            placeholder="Degree - University"
                            className="w-full text-gray-700 text-sm sm:text-base border-b border-gray-300 focus:border-blue-500 focus:outline-none p-0"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Certifications Input */}
                    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                        Certifications
                      </h3>
                      <div className="space-y-2">
                        {/* Only one input for comma-separated certifications */}
                        <div className="flex items-center gap-3">
                          <Award className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-500 min-w-[1rem]" />
                          <div className="flex-1">
                            <label
                              className="sr-only"
                              htmlFor="certifications-edit"
                            >
                              Certifications
                            </label>
                            <input
                              id="certifications-edit"
                              type="text"
                              value={
                                editedProfile.certifications?.join(", ") || ""
                              }
                              onChange={(e) =>
                                handleCertificationsChange(e.target.value)
                              }
                              placeholder="Certs (comma-separated)"
                              className="w-full text-gray-700 text-sm sm:text-base border-b border-gray-300 focus:border-blue-500 focus:outline-none p-0"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Reusing the non-editable Current Activity card */}
                    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-3 sm:p-4 lg:p-6 shadow-sm">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-800 mb-4">
                        Current Activity (View Only)
                      </h3>
                      <div className="grid grid-cols-1 gap-3 sm:gap-4 opacity-70">
                        {/* NOTE: These are non-editable, so we display them as read-only */}
                        <div className="bg-blue-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="text-xl sm:text-2xl font-bold text-blue-600">
                            {students.length}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            Active Students
                          </div>
                        </div>
                        {/* ... other stats remain the same as in view mode */}
                        <div className="bg-green-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="text-xl sm:text-2xl font-bold text-green-600">
                            {suggestions.length}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            Suggestions Sent
                          </div>
                        </div>
                        <div className="bg-purple-50 p-3 sm:p-4 rounded-lg text-center">
                          <div className="text-xl sm:text-2xl font-bold text-purple-600">
                            {resources.length}
                          </div>
                          <div className="text-xs sm:text-sm text-gray-600">
                            Resources Created
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
  )
}

export default ProfileModal