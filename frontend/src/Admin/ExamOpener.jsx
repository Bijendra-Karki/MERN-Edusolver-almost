import React from "react";
import { useNavigate } from "react-router-dom";
import { UserPlus } from "lucide-react";

export default function ExamOpener() {
  const navigate = useNavigate();

  const handleOptionClick = () => {
    console.log("Navigating to Create Exam page...");
    navigate("/Exampage");
  };

  return (
    <button
      onClick={handleOptionClick}
      className="w-full text-left p-3 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all duration-300 text-gray-800 border border-blue-100 flex items-center gap-2"
    >
      <UserPlus className="w-4 h-4 text-gray-600" />
      <span className="text-gray-800">Create Exam</span>
    </button>
  );
}
