"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Users, BookOpen, BarChart3, Settings, LogOut } from "lucide-react"
import Logo2 from "../assets/Img/Logo2.png"; 
import Button from "../components/button";
import TeacherAdd from "./forms/TeacherAdd.jsx";
import ExpertsDropdown from "./forms/ExpertsDropdown.jsx";

  export default function AdminPanel() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)

  useEffect(() => {
const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      if (parsedUser.role !== "admin") {
        navigate("/")
        return
      }
      setUser(parsedUser)
    } else {
      navigate("/login")
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 backdrop-blur-sm border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2">
                <img src={Logo2} alt="EduSolver Logo" className="w-16 h-16 rounded-full object-cover" />
                <span className="text-2xl font-bold text-white">EduSolver</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white">Welcome, {user.name}</span>
              <Button label="Logout" onClick={handleLogout} icon={<LogOut size={16} />} />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard icon={<Users className="w-6 h-6 text-blue-600" />} label="Total Users" value="1,234" color="blue" />
          <StatCard icon={<BookOpen className="w-6 h-6 text-green-600" />} label="Active Courses" value="56" color="green" />
          <StatCard icon={<BarChart3 className="w-6 h-6 text-yellow-600" />} label="Completion Rate" value="87%" color="yellow" />
          <StatCard icon={<Settings className="w-6 h-6 text-purple-600" />} label="System Status" value="Online" color="green" />
        </div>

        <TeacherAdd />

        {/* Admin Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
          <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">User Management</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 text-gray-800 border border-blue-100">
                View Students
              </button>
              <ExpertsDropdown />
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 text-gray-800 border border-blue-100">
                Subscription Management
              </button>
            </div>
          </div>

          <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-6 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Content Management</h2>
            <div className="space-y-3">
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 text-gray-800 border border-blue-100">
                Manage Courses
              </button>
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 text-gray-800 border border-blue-100">
                Add New Course
              </button>
              <button className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 text-gray-800 border border-blue-100">
                Content Analytics
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// --- StatCard Component ---
function StatCard({ icon, label, value, color }) {
  const bgColors = {
    blue: "bg-blue-50",
    green: "bg-green-50",
    yellow: "bg-yellow-50",
    purple: "bg-purple-50",
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center gap-3">
        <div className={`w-12 h-12 ${bgColors[color]} rounded-full flex items-center justify-center`}>
          {icon}
        </div>
        <div>
          <p className="text-gray-600 text-sm">{label}</p>
          <p className="text-2xl font-bold text-gray-800">{value}</p>
        </div>
      </div>
    </div>
  )
}
