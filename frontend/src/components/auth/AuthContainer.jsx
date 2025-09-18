// src/components/Auth/AuthContainer.jsx

"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import boyCharacter from "../../assets/img/boy.gif";
import SignInForm from "./SignInForm";
import SignUpForm from "./SignUpForm";
import { isAuthenticated } from "../utils/authHelper";

export default function AuthContainer() {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (isAuthenticated()) {
      // Optional: Redirect if already authenticated
      const user = isAuthenticated().user;
      if (user.role === "admin") {
        navigate("/adminPanel");
      } else if (user.role === "expert") {
        navigate("/expertPanel");
      } else if (user.role === "Student") {
        navigate("/clientPanel");
      } else {
        navigate("/");
      }
    }
  }, [navigate]);

  const handleAuthSuccess = (result) => {
    // This function will handle the redirection after successful login/signup
    if (result.user.role === "admin") {
      navigate("/adminPanel");
    } else if (result.user.role === "expert") {
      navigate("/expertPanel");
    } else if (result.user.role === "Student") {
      navigate("/clientPanel");
    } else {
      navigate("/");
    }
  };

  const switchToSignIn = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsSignUp(false);
      setError("");
      setSuccess("");
      setIsTransitioning(false);
    }, 100);
  };

  const switchToSignUp = () => {
    setIsTransitioning(true);
    setTimeout(() => {
      setIsSignUp(true);
      setError("");
      setSuccess("");
      setIsTransitioning(false);
    }, 100);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-purple-500 relative overflow-hidden">
      {/* Demo Credentials Info */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-blue-100 rounded-lg p-3 text-gray-700 text-xs shadow-sm">
        <div className="font-semibold mb-1 text-blue-700">Demo Credentials:</div>
        <div>Admin: admin / admin123</div>
        <div>Expert: expert / expert123</div>
        <div>User: user / user123</div>
      </div>

      {/* Main Container */}
      <div className="flex bg-blue-100 backdrop-blur-sm border border-blue-100 rounded-2xl overflow-hidden max-w-5xl w-full relative shadow-lg transform transition-all duration-300 hover:shadow-xl md:flex hidden">
        {/* Left side with illustration */}
        <div className="hidden md:flex flex-1 bg-gradient-to-br from-blue-300 to-indigo-100 items-center justify-center p-6 relative overflow-hidden">
          <div className="flex items-center justify-center w-full h-full relative top-30 scale-120">
            <img
              src={boyCharacter || "/placeholder.svg?height=300&width=300"}
              alt="EduSolver Character"
              className="max-w-full max-h-full object-contain drop-shadow-lg"
              style={{ width: "300px", height: "300px" }}
            />
          </div>
        </div>

        {/* Right side with forms */}
        <div className="flex-1 w-full p-6 flex flex-col relative overflow-hidden">
          <div className="flex justify-end items-center mb-4 relative z-20 flex-shrink-0">
            <button
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-gray-700 transform hover:scale-110 transition-all duration-300 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>
          <div className="relative w-full flex-grow">
            {isSignUp ? (
              <SignUpForm
                onAuthSuccess={handleAuthSuccess}
                onSwitchForm={switchToSignIn}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setError={setError}
                setSuccess={setSuccess}
                error={error}
                success={success}
              />
            ) : (
              <SignInForm
                onAuthSuccess={handleAuthSuccess}
                onSwitchForm={switchToSignUp}
                isLoading={isLoading}
                setIsLoading={setIsLoading}
                setError={setError}
                setSuccess={setSuccess}
                error={error}
                success={success}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}