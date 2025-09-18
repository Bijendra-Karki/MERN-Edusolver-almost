// src/components/Auth/SignInForm.jsx

"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock, Shield, ArrowLeft } from "lucide-react";
import { useForm, validateSignIn } from "../hooks/useForm";
import { signin, authenticate } from "../utils/authHelper";

export default function SignInForm({ onAuthSuccess, onSwitchForm, isLoading, setIsLoading, setError, setSuccess, error, success }) {
  const [showPassword, setShowPassword] = useState(false);

  const { data, errors, handleChange, handleSubmit } = useForm(
    { username: "", password: "" },
    validateSignIn
  );

  const onSubmit = async (formData) => {
    setIsLoading(true);
    setError("");
    setSuccess("");

    try {
      const result = await signin(formData);
      if (!result.error) {
        setSuccess("Login successful! Redirecting...");
        authenticate(result, () => {
          onAuthSuccess(result);
        });
      } else {
        setError(result.error || "Signin failed. Please try again.");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col justify-start w-full py-4 px-2">
      <div className="mb-4 flex-shrink-0">
        <button
          onClick={onSwitchForm}
          className="text-gray-500 hover:text-gray-700 text-sm transition-all duration-300 flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          Back to Sign Up
        </button>
      </div>

      <div className="text-center mb-6 flex-shrink-0">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Shield className="w-6 h-6 text-blue-600" />
          <h1 className="text-3xl font-bold text-gray-800">
            Welcome Back to Edu<span className="text-blue-600">Solver</span>
          </h1>
        </div>
        <p className="text-gray-600 text-sm">Sign in to continue your learning journey</p>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center gap-2 flex-shrink-0">
          <div className="w-2 h-2 bg-red-500 rounded-full flex-shrink-0"></div>
          <span className="break-words">{error}</span>
        </div>
      )}
      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 text-green-700 rounded-xl text-sm flex items-center gap-2 flex-shrink-0">
          <CheckCircle size={16} className="flex-shrink-0" />
          <span className="break-words">{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 flex-shrink-0">
        <div className="relative group/input">
          <input
            type="text"
            name="username"
            placeholder="Enter username or email"
            value={data.username}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-5 py-4 border-2 border-gray-200 rounded-xl text-gray-800 bg-white transition-all duration-300 outline-none text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
          />
          {errors.username && <span className="absolute left-4 bottom-[-1.5rem] text-red-500 text-xs">{errors.username}</span>}
        </div>

        <div className="relative group/input">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Password"
            value={data.password}
            onChange={handleChange}
            disabled={isLoading}
            className="w-full px-5 py-4 pr-12 border-2 border-gray-200 rounded-xl text-gray-800 bg-white transition-all duration-300 outline-none text-base focus:border-blue-500 focus:ring-4 focus:ring-blue-100 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed hover:border-gray-300"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 rounded transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed z-10"
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.password && <span className="absolute left-4 bottom-[-1.5rem] text-red-500 text-xs">{errors.password}</span>}
        </div>

        <div className="flex justify-end -mt-1 mb-2 flex-shrink-0">
          <button
            type="button"
            className="text-blue-600 text-sm hover:text-blue-700 transition-all duration-300"
          >
            Recovery Password
          </button>
        </div>

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
    </div>
  );
}