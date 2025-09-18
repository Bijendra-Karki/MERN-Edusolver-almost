import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ChevronDown, Eye, UserPlus } from "lucide-react"

export default function ExpertsDropdown() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()

  const toggleDropdown = () => setIsOpen(!isOpen)

  const handleOptionClick = (option) => {
    console.log("Selected option:", option)
    setIsOpen(false)

    if (option === "Add Register New Expert and Drop Teacher") {
      navigate("/TeacherAddpage")
    }
  }

  return (
    <div className="relative inline-block w-full">
      <button
        onClick={toggleDropdown}
        className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 text-gray-800 border border-blue-100 flex items-center justify-between"
      >
        <span>View Experts</span>
        <ChevronDown
          className={`w-4 h-4 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-10">
          <button
            onClick={() => handleOptionClick("Show Details")}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2 border-b border-gray-100"
          >
            <Eye className="w-4 h-4 text-gray-600" />
            <span className="text-gray-800">Show Details</span>
          </button>
          <button
            onClick={() => handleOptionClick("Add Register New Expert and Drop Teacher")}
            className="w-full text-left px-4 py-3 hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
          >
            <UserPlus className="w-4 h-4 text-gray-600" />
            <span className="text-gray-800">Add/Register Expert & Drop Teacher</span>
          </button>
        </div>
      )}
    </div>
  )
}
