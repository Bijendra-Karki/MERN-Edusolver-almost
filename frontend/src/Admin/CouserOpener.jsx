import React from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

export default function CourseOpener() {
  const navigate = useNavigate();

  const handleOptionClick = () => {
    console.log("Navigating to Add Course page...");
    navigate("/CourseAddpage");
  };

  return (
    <button
      onClick={handleOptionClick}
      className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 text-gray-800 border border-blue-100 flex items-center gap-2"
    >
      <UserPlus className="w-4 h-4 text-gray-600" />
      <span className="text-gray-800">Add Course</span>
     
    </button>
  
  );
}
