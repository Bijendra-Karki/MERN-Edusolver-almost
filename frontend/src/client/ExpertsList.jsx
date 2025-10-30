"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import {
  User,
  Star,
  Clock,
  MessageCircle,
  Video,
  Calendar,
  Award,
  BookOpen,
  Search,
  MapPin,
  CheckCircle,
} from "lucide-react";
import { getToken } from "../components/utils/authHelper";

const ExpertsList = () => {
  const [experts, setExperts] = useState([]);
  const [selectedSpecialty, setSelectedSpecialty] = useState("all");
  const [selectedExperience, setSelectedExperience] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedExpert, setSelectedExpert] = useState(null);

  const token = getToken();

  // Fetch experts from API
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        const res = await axios.get("/api/auth/user/list", {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        // Filter only experts with role === 'expert'
        const expertUsers = res.data.filter((user) => user.role === "expert");
        setExperts(expertUsers);
      } catch (err) {
        console.error("Failed to fetch experts:", err);
      }
    };
    fetchExperts();
  }, [token]);

  // Filter experts based on search, specialty, and experience
  const filteredExperts = experts.filter((expert) => {
    const matchesSpecialty =
      selectedSpecialty === "all" || expert.specialization?.includes(selectedSpecialty);
    const matchesExperience =
      selectedExperience === "all" ||
      (expert.experience &&
        expert.experience.includes(selectedExperience.replace("+", "")));
    const matchesSearch =
      expert.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (expert.title && expert.title.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (expert.company && expert.company.toLowerCase().includes(searchTerm.toLowerCase())) ||
      (expert.skills &&
        expert.skills.some((skill) => skill.toLowerCase().includes(searchTerm.toLowerCase())));
    return matchesSpecialty && matchesExperience && matchesSearch;
  });

  const specialties = [
    { id: "all", name: "All Specialties" },
    { id: "web-development", name: "Web Development" },
    { id: "machine-learning", name: "Machine Learning" },
    { id: "mobile-development", name: "Mobile Development" },
    { id: "database", name: "Database" },
    { id: "cybersecurity", name: "Cybersecurity" },
    { id: "devops", name: "DevOps" },
  ];

  const experienceLevels = [
    { id: "all", name: "All Experience" },
    { id: "5+", name: "5+ Years" },
    { id: "8+", name: "8+ Years" },
    { id: "10+", name: "10+ Years" },
  ];

  const getSpecialtyColor = (specialty) => {
    const colors = {
      "web-development": "bg-blue-100 text-blue-800",
      "machine-learning": "bg-purple-100 text-purple-800",
      "mobile-development": "bg-green-100 text-green-800",
      database: "bg-orange-100 text-orange-800",
      cybersecurity: "bg-red-100 text-red-800",
      devops: "bg-yellow-100 text-yellow-800",
    };
    return colors[specialty] || "bg-gray-100 text-gray-800";
  };

  const ExpertModal = ({ expert, onClose }) => {
    if (!expert) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex items-start justify-between mb-6">
              <div className="flex items-center gap-4">
                <img
                  src={expert.avatar || "/placeholder.svg"}
                  alt={expert.name}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h2 className="text-2xl font-bold text-gray-800">{expert.name}</h2>
                    {expert.verified && <CheckCircle className="w-5 h-5 text-green-600" />}
                  </div>
                  <p className="text-lg text-blue-600 font-medium">{expert.title}</p>
                  <p className="text-gray-600">{expert.company}</p>
                  <div className="flex items-center gap-4 mt-2">
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 mr-1" />
                      <span className="font-medium">{expert.rating}</span>
                      <span className="text-gray-500 ml-1">({expert.reviews} reviews)</span>
                    </div>
                    <span className="text-2xl font-bold text-green-600">{expert.hourlyRate}/hr</span>
                  </div>
                </div>
              </div>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">
                ×
              </button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{expert.totalSessions}</p>
                <p className="text-sm text-gray-600">Total Sessions</p>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{expert.successRate}</p>
                <p className="text-sm text-gray-600">Success Rate</p>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{expert.responseTime}</p>
                <p className="text-sm text-gray-600">Response Time</p>
              </div>
              <div className="text-center p-3 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{expert.experience}</p>
                <p className="text-sm text-gray-600">Experience</p>
              </div>
            </div>

            {/* Bio */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">About</h3>
              <p className="text-gray-600">{expert.bio}</p>
            </div>

            {/* Skills */}
            <div className="mb-6">
              <h3 className="text-lg font-bold text-gray-800 mb-2">Skills</h3>
              <div className="flex flex-wrap gap-2">
                {expert.skills.map((skill) => (
                  <span key={skill} className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Details Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                <h3 className="text-lg font-bold text-black mb-3">Details</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-black">{expert.address}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-black">Available: {expert.availability}</span>
                  </div>
                  <div className="flex items-center">
                    <BookOpen className="w-4 h-4 text-gray-400 mr-2" />
                    <span className="text-black">{expert.education}</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-3">Certifications</h3>
                <div className="space-y-1">
                  {expert.certifications?.map((cert) => (
                    <div key={cert} className="flex items-center text-sm">
                      <Award className="w-4 h-4 text-yellow-500 mr-2" />
                      <span className="text-black">{cert}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2">
                <MessageCircle className="w-5 h-5" />
                Send Message
              </button>
              <button className="flex-1 bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2">
                <Video className="w-5 h-5" />
                Book Session
              </button>
              <button className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 flex items-center justify-center gap-2">
                <Calendar className="w-5 h-5" />
                Schedule
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-6">
      <div className="max-w-full mx-auto px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-blue-800 text-center mb-4">Expert Guidance</h1>
          <p className="text-gray-600 text-lg text-center">
            Connect with industry experts and get personalized guidance for your CSIT journey
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-blue-900 rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search experts by name, skills, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-blue-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-bold text-white mb-2">Specialty</label>
              <select
                value={selectedSpecialty}
                onChange={(e) => setSelectedSpecialty(e.target.value)}
                className="w-full p-3 border border-blue-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-blue-500"
              >
                {specialties.map((specialty) => (
                  <option className="text-gray-800 " key={specialty.id} value={specialty.id}>
                    {specialty.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-bold text-white mb-2">Experience</label>
              <select
                value={selectedExperience}
                onChange={(e) => setSelectedExperience(e.target.value)}
                className="w-full p-3 border border-blue-300 rounded-lg text-gray-700 bg-white focus:ring-2 focus:ring-blue-500"
              >
                {experienceLevels.map((level) => (
                  <option key={level.id} value={level.id}>
                    {level.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Experts Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {filteredExperts.map((expert) => (
            <div
              key={expert.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden cursor-pointer"
              onClick={() => setSelectedExpert(expert)}
            >
              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  <img
                    src={expert.avatar || "/placeholder.svg"}
                    alt={expert.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-lg font-bold text-gray-800 truncate">{expert.name}</h3>
                      {expert.verified && <CheckCircle className="w-4 h-4 text-green-600 flex-shrink-0" />}
                    </div>
                    <p className="text-blue-600 font-medium text-sm mb-1">{expert.title}</p>
                    <p className="text-gray-600 text-sm">{expert.company}</p>
                  </div>
                </div>

                <div className="flex items-center justify-between mb-4">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getSpecialtyColor(expert.specialization)}`}>
                    {specialties.find((s) => s.id === expert.specialization)?.name}
                  </span>
                  <span className="text-lg font-bold text-green-600">{expert.hourlyRate}/hr</span>
                </div>

                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{expert.bio}</p>

                <div className="flex flex-wrap gap-1 mb-4">
                  {expert.skills.slice(0, 3).map((skill) => (
                    <span key={skill} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {skill}
                    </span>
                  ))}
                  {expert.skills.length > 3 && (
                    <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      +{expert.skills.length - 3} more
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 text-yellow-500 mr-1" />
                    <span className="font-medium">{expert.rating}</span>
                    <span className="ml-1">({expert.reviews})</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    <span>{expert.responseTime}</span>
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle message action
                    }}
                  >
                    <MessageCircle className="w-4 h-4" />
                    Message
                  </button>
                  <button
                    className="flex-1 bg-green-600 text-white py-2 px-3 rounded-lg hover:bg-green-700 transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle book session action
                    }}
                  >
                    <Video className="w-4 h-4" />
                    Book
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredExperts.length === 0 && (
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No experts found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Expert Detail Modal */}
        <ExpertModal expert={selectedExpert} onClose={() => setSelectedExpert(null)} />
      </div>
    </div>
  );
};

export default ExpertsList;
