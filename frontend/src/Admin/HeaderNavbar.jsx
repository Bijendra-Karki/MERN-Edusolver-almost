import React from "react"
import Logo2 from "../assets/Img/Logo2.png"
import Button from "../components/button"
import { LogOut } from "lucide-react"

export default function HeaderNavbar({ user, handleLogout }) {
  return (
    <div>
      <div className="bg-gradient-to-br from-blue-700 to-blue-900 backdrop-blur-sm border-b border-blue-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <div className="flex items-center space-x-2">
                <img
                  src={Logo2}
                  alt="EduSolver Logo"
                  className="w-16 h-16 rounded-full object-cover"
                />
                <span className="text-2xl font-bold text-white">EduSolver</span>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-white">Welcome, {user?.name}</span>
              <Button
                label="Logout"
                onClick={handleLogout}
                icon={<LogOut size={16} />}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
