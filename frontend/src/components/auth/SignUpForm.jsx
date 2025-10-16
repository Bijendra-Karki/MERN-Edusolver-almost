// src/components/Auth/SignUpForm.jsx

"use client";

import { useState } from "react";
import { Eye, EyeOff, User, Mail, Lock, Sparkles, Phone, Book, CheckCircle } from "lucide-react";
import { useForm, validateSignUp } from "../hooks/useForm";
import { signup, authenticate } from "../utils/authHelper";

export default function SignUpForm({ onAuthSuccess, onSwitchForm, isLoading, setIsLoading, setError, setSuccess, error, success }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { data, errors, handleChange, handleSubmit } = useForm(
    { name: "", phone: "", email: "", password: "", semester: "", confirmPassword: "" },
    validateSignUp
  );

  const onSubmit = async (formData) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await signup(formData);
      if (!result.error) {
        setSuccess("Account created successfully!");
        authenticate(result, () => {
          onAuthSuccess(result);
        });
      } else {
        setError(result.error || "Signup failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const inputFields = [
    { name: "name", type: "text", placeholder: "Full Name", icon: User },
    { name: "email", type: "email", placeholder: "Email Address", icon: Mail },
    { name: "phone", type: "text", placeholder: "Phone Number", icon: Phone },
    { name: "semester", type: "text", placeholder: "Semester", icon: Book },
  ];

  return (
    <div className="flex flex-col justify-start w-full py-6 px-4">
      <div className="text-center mb-4 flex-shrink-0">
        <div className="flex items-center justify-center gap-1 mb-1">
          {/* Reduced Sparkles size */}
          <Sparkles className="w-5 h-5 text-blue-600 animate-pulse" />
          {/* Reduced Heading size */}
          <h1 className="text-2xl font-bold text-gray-800">
            Join Edu<span className="text-blue-600">Solver</span>
          </h1>
          <Sparkles className="w-5 h-5 text-blue-600 animate-pulse delay-300" />
        </div>
        {/* Reduced paragraph text size and margin */}
        <p className="text-gray-600 text-xs">Create your account and start learning</p>
      </div>

      {error && (
        <div className="mb-3 p-2 bg-red-50 border border-red-200 text-red-700 rounded-lg text-xs flex items-center gap-2 flex-shrink-0">
          <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
          <span className="break-words">{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-3 p-2 bg-green-50 border border-green-200 text-green-700 rounded-lg text-xs flex items-center gap-2 flex-shrink-0">
          {/* Reduced CheckCircle size */}
          <CheckCircle size={14} className="flex-shrink-0" />
          <span className="break-words">{success}</span>
        </div>
      )}

      {/* Reduced gap between form fields */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-3 flex-shrink-0">
        {inputFields.map((field) => (
          <div key={field.name} className="relative group/input">
            {/* Reduced Icon size and repositioned for smaller input */}
            <field.icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-all duration-300 group-focus-within/input:text-blue-600 z-10" />
            <input
              type={field.type}
              name={field.name}
              placeholder={field.placeholder}
              value={data[field.name]}
              onChange={handleChange}
              disabled={isLoading}
              /* KEY CHANGE: Reduced padding (py-3), reduced text size (text-sm), reduced horizontal padding (pl-10 pr-10) */
              className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg text-gray-800 bg-white transition-all duration-300 outline-none text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 relative z-0"
            />
            {/* Reduced error message position */}
            {errors[field.name] && <span className="absolute left-3 bottom-[-1.25rem] text-red-500 text-xs">{errors[field.name]}</span>}
          </div>
        ))}
        {/* Password field */}
        <div className="relative group/input">
          {/* Reduced Icon size and repositioned for smaller input */}
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-all duration-300 group-focus-within/input:text-blue-600 z-10" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={handleChange}
            disabled={isLoading}
            /* KEY CHANGE: Reduced padding (py-3), reduced text size (text-sm), reduced horizontal padding (pl-10 pr-10) */
            className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg text-gray-800 bg-white transition-all duration-300 outline-none text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 relative z-0"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            /* Repositioned button for smaller input */
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            {/* Reduced Eye/EyeOff size */}
            {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          {/* Reduced error message position */}
          {errors.password && <span className="absolute left-3 bottom-[-1.25rem] text-red-500 text-xs">{errors.password}</span>}
        </div>
        {/* Confirm Password field */}
        <div className="relative group/input">
          {/* Reduced Icon size and repositioned for smaller input */}
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 transition-all duration-300 group-focus-within/input:text-blue-600 z-10" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            placeholder="Confirm Password"
            value={data.confirmPassword}
            onChange={handleChange}
            disabled={isLoading}
            /* KEY CHANGE: Reduced padding (py-3), reduced text size (text-sm), reduced horizontal padding (pl-10 pr-10) */
            className="w-full pl-10 pr-10 py-3 border-2 border-gray-200 rounded-lg text-gray-800 bg-white transition-all duration-300 outline-none text-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-100 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300 relative z-0"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            disabled={isLoading}
            /* Repositioned button for smaller input */
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            {/* Reduced Eye/EyeOff size */}
            {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
          </button>
          {/* Reduced error message position */}
          {errors.confirmPassword && <span className="absolute left-3 bottom-[-1.25rem] text-red-500 text-xs">{errors.confirmPassword}</span>}
        </div>

        <button
          type="submit"
          disabled={isLoading}
          /* KEY CHANGE: Reduced vertical padding (py-3) and text size (text-sm) */
          className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white border-none py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center"
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              {/* Reduced Spinner size */}
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Creating Account...</span>
            </div>
          ) : (
            <>
              {/* Reduced Sparkles size */}
              <Sparkles className="w-4 h-4 mr-2" />
              Create Account
            </>
          )}
        </button>
      </form>

      {/* Reduced top margin (mt-3) and vertical padding (py-3) on switch button */}
      <div className="mt-3 flex-shrink-0">
        <button
          onClick={onSwitchForm}
          disabled={isLoading}
          className="w-full bg-white text-blue-600 border-2 border-blue-200 py-3 rounded-lg text-sm font-semibold cursor-pointer transition-all duration-300 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
        >
          Already have an account? Sign In
        </button>
      </div>
    </div>
  );
}