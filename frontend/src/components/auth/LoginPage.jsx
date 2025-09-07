"use client"

import { useState, useEffect } from "react"
import { Eye, EyeOff, User, Mail, Lock, CheckCircle, ArrowLeft, Sparkles, Shield, X } from "lucide-react"
import { useNavigate } from "react-router-dom"
import boyCharacter from "../../assets/img/boy.gif"
import "./LoginPage.css"

export default function LoginPage() {
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(true)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [mounted, setMounted] = useState(false)

  // Sign-up form data
  const [signUpData, setSignUpData] = useState({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  // Sign-in form data
  const [signInData, setSignInData] = useState({
    username: "",
    password: "",
  })

  useEffect(() => {
    setMounted(true)
  }, [])

  const togglePasswordVisibility = () => setShowPassword(!showPassword)
  const toggleConfirmPasswordVisibility = () => setShowConfirmPassword(!showConfirmPassword)

  const handleSignUpChange = (e) => {
    const { name, value } = e.target
    setSignUpData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignInChange = (e) => {
    const { name, value } = e.target
    setSignInData((prev) => ({ ...prev, [name]: value }))
  }

  const validateSignUp = () => {
    if (!signUpData.fullName.trim()) {
      setError("Full name is required")
      return false
    }
    if (!signUpData.email.trim()) {
      setError("Email is required")
      return false
    }
    if (!signUpData.email.includes("@")) {
      setError("Please enter a valid email address")
      return false
    }
    if (!signUpData.password) {
      setError("Password is required")
      return false
    }
    if (signUpData.password.length < 6) {
      setError("Password must be at least 6 characters long")
      return false
    }
    if (signUpData.password !== signUpData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    return true
  }

  const validateSignIn = () => {
    if (!signInData.username || !signInData.password) {
      setError("Please enter both username and password")
      return false
    }
    return true
  }

  // Mock authentication function
  const authenticateUser = async (credentials, isSignUp) => {
    return new Promise((resolve) => {
      setTimeout(() => {
        if (isSignUp) {
          resolve({
            success: true,
            user: {
              id: Date.now(),
              name: credentials.fullName,
              email: credentials.email,
              role: "user",
            },
          })
        } else {
          if (credentials.username === "admin" && credentials.password === "admin123") {
            resolve({
              success: true,
              user: {
                id: 1,
                name: "Admin User",
                email: "admin@edusolver.com",
                role: "admin",
              },
            })
          } else if (credentials.username === "expert" && credentials.password === "expert123") {
            resolve({
              success: true,
              user: {
                id: 3,
                name: "Subject Expert",
                email: "expert@edusolver.com",
                role: "expert",
                expertise: ["Mathematics", "Physics"],
              },
            })
          } else if (credentials.username === "user" && credentials.password === "user123") {
            resolve({
              success: true,
              user: {
                id: 2,
                name: "Students",
                email: "user@edusolver.com",
                role: "Student",
              },
            })
          } else {
            resolve({
              success: false,
              error: "Invalid credentials",
            })
          }
        }
      }, 2000)
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess("")

    const isValid = isSignUp ? validateSignUp() : validateSignIn()
    if (!isValid) {
      setIsLoading(false)
      return
    }

    try {
      const credentials = isSignUp ? signUpData : signInData
      const result = await authenticateUser(credentials, isSignUp)

      if (result.success) {
        setSuccess(`${isSignUp ? "Account created" : "Login"} successful! Redirecting...`)
        localStorage.setItem("user", JSON.stringify(result.user))

        setTimeout(() => {
          if (result.user.role === "admin") {
            navigate("/adminPanel")
          } else if (result.user.role === "expert") {
            navigate("/expertPanel")
          } else if (result.user.role === "Student") {
            navigate("/clientPanel")
          } else {
            navigate("/")
          }
        }, 1500)
      } else {
        setError(result.error || "Authentication failed")
      }
    } catch (error) {
      setError("An error occurred. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    setIsLoading(true)
    setError("")

    try {
      setTimeout(() => {
        const mockGoogleUser = {
          id: Date.now(),
          name: "Google User",
          email: "googleuser@gmail.com",
          role: "user",
        }

        localStorage.setItem("user", JSON.stringify(mockGoogleUser))
        setSuccess(`Google ${isSignUp ? "sign-up" : "sign-in"} successful! Redirecting...`)

        setTimeout(() => {
          alert("Google authentication unsuccessful! Redirecting to Landing Page...")
          navigate("/")

        }, 1500)
      }, 1500)
    } catch (error) {
      setError("Google authentication failed")
    } finally {
      setIsLoading(false)
    }
  }

  const switchToSignIn = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setIsSignUp(false)
      setError("")
      setSuccess("")
      setShowPassword(false)
      setShowConfirmPassword(false)
      setIsTransitioning(false)
    }, 100)
  }

  const switchToSignUp = () => {
    setIsTransitioning(true)
    setTimeout(() => {
      setIsSignUp(true)
      setError("")
      setSuccess("")
      setShowPassword(false)
      setIsTransitioning(false)
    }, 100)
  }

  if (!mounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
        <div className="w-8 h-8 border-4 border-blue-600/30 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    )
  }

  const inputFields = [
    {
      name: "fullName",
      type: "text",
      placeholder: "Full Name",
      icon: User,
      value: signUpData.fullName,
    },
    {
      name: "email",
      type: "email",
      placeholder: "Email Address",
      icon: Mail,
      value: signUpData.email,
    },
    {
      name: "password",
      type: showPassword ? "text" : "password",
      placeholder: "Password",
      icon: Lock,
      value: signUpData.password,
      hasToggle: true,
      toggle: togglePasswordVisibility,
      showPassword,
    },
    {
      name: "confirmPassword",
      type: showConfirmPassword ? "text" : "password",
      placeholder: "Confirm Password",
      icon: Lock,
      value: signUpData.confirmPassword,
      hasToggle: true,
      toggle: toggleConfirmPasswordVisibility,
      showPassword: showConfirmPassword,
    },
  ]

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-500 to-purple-500 relative overflow-hidden">
      {/* Demo Credentials Info */}
      <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm border border-blue-100 rounded-lg p-3 text-gray-700 text-xs shadow-sm">
        <div className="font-semibold mb-1 text-blue-700">Demo Credentials:</div>
        <div>Admin: admin / admin123</div>
        <div>Expert: expert / expert123</div>
        <div>User: user / user123</div>
      </div>

      {/* Mobile-only form container */}
      <div className="md:hidden flex bg-white/90 backdrop-blur-sm border border-blue-100 rounded-2xl overflow-hidden max-w-md w-full min-h-[600px] relative shadow-lg">
        <div className="w-full p-6 flex flex-col relative overflow-hidden">
          {/* Close button */}
          <div className="flex justify-end items-center mb-6 relative z-20 flex-shrink-0">
            <button
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-gray-700 transform hover:scale-110 transition-all duration-300 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>

          {/* Mobile Forms Container */}
          <div className="relative w-full flex-1 overflow-hidden">
            {/* Mobile Sign-Up Form */}
            <div
              className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isSignUp
                  ? "translate-x-0 opacity-100 scale-100"
                  : "translate-x-full opacity-0 scale-95 pointer-events-none"
              } ${isTransitioning ? "blur-sm" : ""}`}
            >
              <div className="h-full overflow-y-auto">
                <div className="flex flex-col justify-start w-full py-4 px-2">
                  {/* Header */}
                  <div className="text-center mb-6 flex-shrink-0">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Sparkles className="w-6 h-6 text-blue-600 animate-pulse" />
                      <h1 className="text-3xl font-bold text-gray-800">
                        Join Edu<span className="text-blue-600">Solver</span>
                      </h1>
                      <Sparkles className="w-6 h-6 text-blue-600 animate-pulse delay-300" />
                    </div>
                    <p className="text-gray-600 text-sm">Create your account and start learning</p>
                  </div>

                  {/* Messages */}
                  {error && isSignUp && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2 flex-shrink-0">
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                      <span className="break-words">{error}</span>
                    </div>
                  )}

                  {success && isSignUp && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2 flex-shrink-0">
                      <CheckCircle size={16} className="flex-shrink-0" />
                      <span className="break-words">{success}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-shrink-0">
                    {/* Input Fields */}
                    {inputFields.map((field, index) => (
                      <div key={field.name} className="relative group/input">
                        <field.icon className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5 transition-all duration-300 group-focus-within/input:text-blue-600 z-10" />
                        <input
                          type={field.type}
                          name={field.name}
                          placeholder={field.placeholder}
                          value={field.value}
                          onChange={handleSignUpChange}
                          disabled={isLoading}
                          className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl text-gray-800 bg-white transition-all duration-300 outline-none text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 relative z-0"
                        />
                        {field.hasToggle && (
                          <button
                            type="button"
                            onClick={field.toggle}
                            disabled={isLoading}
                            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                          >
                            {field.showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none py-4 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        <>
                          <Sparkles className="w-5 h-5 mr-2" />
                          Create Account
                        </>
                      )}
                    </button>
                  </form>

                  {/* Switch Button */}
                  <div className="mt-4 flex-shrink-0">
                    <button
                      onClick={switchToSignIn}
                      disabled={isLoading}
                      className="w-full bg-white text-blue-600 border-2 border-blue-200 py-4 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      Already have an account? Sign In
                    </button>
                  </div>

                  {/* Social Section */}
                  <div className="mt-4 flex-shrink-0">
                    <p className="text-center text-gray-500 text-sm mb-4 relative">
                      <span className="bg-white px-4 relative z-10">Or sign up with</span>
                      <span className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200"></span>
                      </span>
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={handleGoogleAuth}
                        disabled={isLoading}
                        title="Sign up with Google"
                        className="w-14 h-14 border-2 border-gray-200 rounded-xl bg-white flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Mobile Sign-In Form */}
            <div
              className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                !isSignUp
                  ? "translate-x-0 opacity-100 scale-100"
                  : "-translate-x-full opacity-0 scale-95 pointer-events-none"
              } ${isTransitioning ? "blur-sm" : ""}`}
            >
              <div className="h-full overflow-y-auto">
                <div className="flex flex-col justify-start w-full py-4 px-2">
                  {/* Back Button */}
                  <div className="mb-4 flex-shrink-0">
                    <button
                      onClick={switchToSignUp}
                      className="text-gray-500 hover:text-gray-700 text-sm transition-all duration-300 flex items-center gap-2"
                    >
                      <ArrowLeft size={16} />
                      Back to Sign Up
                    </button>
                  </div>

                  {/* Header */}
                  <div className="text-center mb-6 flex-shrink-0">
                    <div className="flex items-center justify-center gap-2 mb-2">
                      <Shield className="w-6 h-6 text-blue-600" />
                      <h1 className="text-3xl font-bold text-gray-800">
                        Welcome Back to Edu<span className="text-blue-600">Solver</span>
                      </h1>
                    </div>
                    <p className="text-gray-600 text-sm">Sign in to continue your learning journey</p>
                  </div>

                  {/* Messages */}
                  {error && !isSignUp && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2 flex-shrink-0">
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                      <span className="break-words">{error}</span>
                    </div>
                  )}

                  {success && !isSignUp && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2 flex-shrink-0">
                      <CheckCircle size={16} className="flex-shrink-0" />
                      <span className="break-words">{success}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="flex flex-col gap-4 flex-shrink-0">
                    {/* Input Fields */}
                    <div className="relative group/input">
                      <input
                        type="text"
                        name="username"
                        placeholder="Enter username or email"
                        value={signInData.username}
                        onChange={handleSignInChange}
                        disabled={isLoading}
                        className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-gray-800 bg-white transition-all duration-300 outline-none text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
                      />
                    </div>

                    <div className="relative group/input">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={signInData.password}
                        onChange={handleSignInChange}
                        disabled={isLoading}
                        className="w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-xl text-gray-800 bg-white transition-all duration-300 outline-none text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        disabled={isLoading}
                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                      >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>

                    <div className="flex justify-end -mt-1 mb-2 flex-shrink-0">
                      <button
                        type="button"
                        className="text-blue-600 text-sm hover:text-blue-700 transition-all duration-300"
                      >
                        Recovery Password
                      </button>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none py-4 rounded-xl text-base font-semibold cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Signing In...</span>
                        </div>
                      ) : (
                        <>
                          <Shield className="w-5 h-5 mr-2" />
                          Sign In
                        </>
                      )}
                    </button>
                  </form>

                  {/* Social Section */}
                  <div className="mt-6 flex-shrink-0">
                    <p className="text-center text-gray-500 text-sm mb-4 relative">
                      <span className="bg-white px-4 relative z-10">Or continue with</span>
                      <span className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200"></span>
                      </span>
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={handleGoogleAuth}
                        disabled={isLoading}
                        title="Sign in with Google"
                        className="w-14 h-14 border-2 border-gray-200 rounded-xl bg-white flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="flex bg-blue-100 backdrop-blur-sm border border-blue-100 rounded-2xl overflow-hidden max-w-5xl w-full h-[550px] relative shadow-lg transform transition-all duration-300 hover:shadow-xl md:flex hidden">
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
          {/* Close button */}
          <div className="flex justify-end items-center mb-4 relative z-20 flex-shrink-0">
            
            <button
              onClick={() => navigate("/")}
              className="text-gray-500 hover:text-gray-700 transform hover:scale-110 transition-all duration-300 p-1 rounded-full hover:bg-gray-100"
            >
              <X size={24} />
            </button>
          </div>

          {/* Forms Container */}
          <div className="relative w-full flex-1 overflow-hidden">
            {/* Sign-Up Form */}
            <div
              className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                isSignUp
                  ? "translate-x-0 opacity-100 scale-100"
                  : "translate-x-full opacity-0 scale-95 pointer-events-none"
              } ${isTransitioning ? "blur-sm" : ""}`}
            >
              <div className="h-full overflow-y-auto">
                <div className="flex flex-col justify-start max-w-sm mx-auto w-full py-3 px-2">
                  {/* Header */}
                  <div className="text-center mb-4 flex-shrink-0">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Sparkles className="w-5 h-5 text-blue-600" />
                      <h1 className="text-2xl font-bold text-blue-900">
                        Join Edu<span className=" font-bold bg-gradient-to-r from-blue-900 to-purple-900 bg-clip-text text-transparent">Solver</span>
                      </h1>
                      <Sparkles className="w-5 h-5 text-blue-600" />
                    </div>
                    <p className="text-gray-600 text-xs">Create your account and start learning</p>
                  </div>

                  {/* Messages */}
                  {error && isSignUp && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2 flex-shrink-0">
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                      <span className="break-words">{error}</span>
                    </div>
                  )}

                  {success && isSignUp && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2 flex-shrink-0">
                      <CheckCircle size={16} className="flex-shrink-0" />
                      <span className="break-words">{success}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-shrink-0">
                    {/* Input Fields */}
                    {inputFields.map((field, index) => (
                      <div key={field.name} className="relative group/input">
                        <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-all duration-300 group-focus-within/input:text-blue-600 z-10" />
                        <input
                          type={field.type}
                          name={field.name}
                          placeholder={field.placeholder}
                          value={field.value}
                          onChange={handleSignUpChange}
                          disabled={isLoading}
                          className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-xl text-gray-800 bg-white transition-all duration-300 outline-none text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 relative z-0"
                        />
                        {field.hasToggle && (
                          <button
                            type="button"
                            onClick={field.toggle}
                            disabled={isLoading}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                          >
                            {field.showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        )}
                      </div>
                    ))}

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Creating Account...</span>
                        </div>
                      ) : (
                        <>
                          <Sparkles className="w-4 h-4 mr-2" />
                          Create Account
                        </>
                      )}
                    </button>
                  </form>

                  {/* Switch Button */}
                  <div className="mt-3 flex-shrink-0">
                    <button
                      onClick={switchToSignIn}
                      disabled={isLoading}
                      className="w-full bg-white text-blue-600 border-2 border-blue-200 py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      Already have an account? Sign In
                    </button>
                  </div>

                  {/* Social Section */}
                  <div className="mt-3 flex-shrink-0">
                    <p className="text-center text-gray-500 text-xs mb-3 relative">
                      <span className="bg-white px-4 relative z-10">Or sign up with</span>
                      <span className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200"></span>
                      </span>
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={handleGoogleAuth}
                        disabled={isLoading}
                        title="Sign up with Google"
                        className="w-12 h-12 border-2 border-gray-200 rounded-xl bg-white flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Sign-In Form */}
            <div
              className={`absolute inset-0 transition-all duration-1000 ease-[cubic-bezier(0.4,0,0.2,1)] ${
                !isSignUp
                  ? "translate-x-0 opacity-100 scale-100"
                  : "-translate-x-full opacity-0 scale-95 pointer-events-none"
              } ${isTransitioning ? "blur-sm" : ""}`}
            >
              <div className="h-full overflow-y-auto">
                <div className="flex flex-col justify-start max-w-sm mx-auto w-full py-3 px-2">
                  {/* Back Button */}
                  <div className="mb-4 flex-shrink-0">
                    <button
                      onClick={switchToSignUp}
                      className="text-gray-500 hover:text-gray-700 text-sm transition-all duration-300 flex items-center gap-2"
                    >
                      <ArrowLeft size={16} />
                      Back to Sign Up
                    </button>
                  </div>

                  {/* Header */}
                  <div className="text-center mb-4 flex-shrink-0">
                    <div className="flex items-center justify-center gap-2 mb-1">
                      <Shield className="w-5 h-5 text-blue-600" />
                      <h1 className="text-2xl font-bold text-gray-800">
                        Welcome Back to Edu<span className="text-blue-600">Solver</span>
                      </h1>
                    </div>
                    <p className="text-gray-600 text-xs">Sign in to continue your learning journey</p>
                  </div>

                  {/* Messages */}
                  {error && !isSignUp && (
                    <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2 flex-shrink-0">
                      <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
                      <span className="break-words">{error}</span>
                    </div>
                  )}

                  {success && !isSignUp && (
                    <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2 flex-shrink-0">
                      <CheckCircle size={16} className="flex-shrink-0" />
                      <span className="break-words">{success}</span>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="flex flex-col gap-3 flex-shrink-0">
                    {/* Input Fields */}
                    <div className="relative group/input">
                      <input
                        type="text"
                        name="username"
                        placeholder="Enter username or email"
                        value={signInData.username}
                        onChange={handleSignInChange}
                        disabled={isLoading}
                        className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl text-gray-800 bg-white transition-all duration-300 outline-none text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
                      />
                    </div>

                    <div className="relative group/input">
                      <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        value={signInData.password}
                        onChange={handleSignInChange}
                        disabled={isLoading}
                        className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl text-gray-800 bg-white transition-all duration-300 outline-none text-sm focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
                      />
                      <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        disabled={isLoading}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>

                    <div className="flex justify-end -mt-1 mb-2 flex-shrink-0">
                      <button
                        type="button"
                        className="text-blue-600 text-sm hover:text-blue-700 transition-all duration-300"
                      >
                        Recovery Password
                      </button>
                    </div>

                    {/* Submit Button */}
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none py-3 rounded-xl text-sm font-semibold cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
                    >
                      {isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                          <span>Signing In...</span>
                        </div>
                      ) : (
                        <>
                          <Shield className="w-4 h-4 mr-2" />
                          Sign In
                        </>
                      )}
                    </button>
                  </form>

                  {/* Social Section */}
                  <div className="mt-3 flex-shrink-0">
                    <p className="text-center text-gray-500 text-xs mb-3 relative">
                      <span className="bg-white px-4 relative z-10">Or continue with</span>
                      <span className="absolute inset-0 flex items-center">
                        <span className="w-full border-t border-gray-200"></span>
                      </span>
                    </p>
                    <div className="flex gap-4 justify-center">
                      <button
                        onClick={handleGoogleAuth}
                        disabled={isLoading}
                        title="Sign in with Google"
                        className="w-12 h-12 border-2 border-gray-200 rounded-xl bg-white flex items-center justify-center cursor-pointer transition-all duration-300 hover:border-gray-300 hover:shadow-md hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
