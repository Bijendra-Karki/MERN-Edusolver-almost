import React from 'react'

function expertForm() {
    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-2xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex justify-center mb-4">
                        <div className="p-3 bg-blue-100 rounded-full">
                            <svg
                                className="h-8 w-8 text-blue-600"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 14l9-5-9-5-9 5 9 5z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z"
                                />
                            </svg>
                        </div>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                        Teacher Registration
                    </h1>
                    <p className="text-gray-600">
                        Join our educational platform and make a difference in students'
                        lives
                    </p>
                </div>
                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* 1. Personal & Account Information (EXISTING SECTION) */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            1. Personal & Account Information
                        </h2>

                        {/* Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name *</label>
                            <input
                                id="name"
                                type="text"
                                value={formData.name}
                                onChange={(e) => handleInputChange("name", e.target.value)}
                                className={`w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.name ? "border-red-500" : "border-gray-300"}`}
                                placeholder="e.g., Dr. Sarah Johnson"
                            />
                            {errors.name && (<p className="text-sm text-red-600">{errors.name}</p>)}
                        </div>

                        {/* Email (Kept for consistency, although typically a login field) */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address *</label>
                            <input
                                id="email"
                                type="email"
                                value={formData.email}
                                onChange={(e) => handleInputChange("email", e.target.value)}
                                className={`w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.email ? "border-red-500" : "border-gray-300"}`}
                                placeholder="your.email@example.com"
                            />
                            {errors.email && (<p className="text-sm text-red-600">{errors.email}</p>)}
                        </div>

                        {/* Phone */}
                        <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone Number *</label>
                            <input
                                id="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={(e) => handleInputChange("phone", e.target.value)}
                                className={`w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.phone ? "border-red-500" : "border-gray-300"}`}
                                placeholder="(+997) 9812345678"
                            />
                            {errors.phone && (<p className="text-sm text-red-600">{errors.phone}</p>)}
                        </div>

                        {/* Password Fields */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password *</label>
                            <input
                                id="password"
                                type="password"
                                value={formData.password}
                                onChange={(e) => handleInputChange("password", e.target.value)}
                                className={`w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.password ? "border-red-500" : "border-gray-300"}`}
                                placeholder="Enter your password"
                            />
                            {errors.password && (<p className="text-sm text-red-600">{errors.password}</p>)}
                        </div>
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">Confirm Password *</label>
                            <input
                                id="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                                className={`w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${errors.confirmPassword ? "border-red-500" : "border-gray-300"}`}
                                placeholder="Re-enter your password"
                            />
                            {errors.confirmPassword && (<p className="text-sm text-red-600">{errors.confirmPassword}</p>)}
                        </div>
                    </div>

                    {/* 2. Professional Details (NEW SECTION) */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            2. Professional Details
                        </h2>

                        {/* Title */}
                        <div>
                            <label htmlFor="title" className="block text-sm font-medium text-gray-700">Current Role/Title *</label>
                            <input
                                id="title"
                                type="text"
                                placeholder="Senior Software Engineer"
                                className="w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                            />
                        </div>

                        {/* Employer & Location (Side-by-side) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="employer" className="block text-sm font-medium text-gray-700">Current Employer</label>
                                <input
                                    id="employer"
                                    type="text"
                                    placeholder="e.g., Google, Amazon, Freelancer"
                                    className="w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                                />
                            </div>
                            <div>
                                <label htmlFor="location" className="block text-sm font-medium text-gray-700">Location</label>
                                <input
                                    id="location"
                                    type="text"
                                    placeholder="San Francisco, CA"
                                    className="w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                                />
                            </div>
                        </div>

                        {/* Experience & Rate (Side-by-side) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Years of Experience *</label>
                                <input
                                    id="experience"
                                    type="number"
                                    min="0"
                                    placeholder="8+"
                                    className="w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                                />
                            </div>
                            <div>
                                <label htmlFor="rate" className="block text-sm font-medium text-gray-700">Hourly Rate ($) *</label>
                                <input
                                    id="rate"
                                    type="number"
                                    min="10"
                                    placeholder="80"
                                    className="w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                                />
                            </div>
                        </div>
                    </div>

                    {/* 3. Profile Content & Skills (NEW SECTION) */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            3. Profile Content & Skills
                        </h2>

                        {/* About/Bio */}
                        <div>
                            <label htmlFor="bio" className="block text-sm font-medium text-gray-700">About (Bio) *</label>
                            <textarea
                                id="bio"
                                rows="4"
                                placeholder="Full-stack developer with expertise in React, Node.js, and cloud architecture..."
                                className="w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                            ></textarea>
                        </div>

                        {/* Skills (Using a simple text input for simplicity, though a tag component would be better) */}
                        <div>
                            <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Key Skills (Comma Separated)</label>
                            <input
                                id="skills"
                                type="text"
                                placeholder="React, Node.js, AWS, MongoDB, TypeScript"
                                className="w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                Separate each skill with a comma (e.g., JavaScript, Python, AWS).
                            </p>
                        </div>
                    </div>

                    {/* 4. Qualifications & Availability (NEW SECTION) */}
                    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 space-y-4">
                        <h2 className="text-xl font-semibold text-gray-900">
                            4. Qualifications & Availability
                        </h2>

                        {/* Education */}
                        <div>
                            <label htmlFor="education" className="block text-sm font-medium text-gray-700">Education (Highest Degree)</label>
                            <input
                                id="education"
                                type="text"
                                placeholder="e.g., MS Computer Science - Stanford University"
                                className="w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                            />
                        </div>

                        {/* Certifications (Using a simple text input for simplicity) */}
                        <div>
                            <label htmlFor="certifications" className="block text-sm font-medium text-gray-700">Certifications (Comma Separated)</label>
                            <input
                                id="certifications"
                                type="text"
                                placeholder="AWS Solutions Architect, Google Cloud Professional"
                                className="w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300"
                            />
                            <p className="mt-1 text-xs text-gray-500">
                                List your professional certifications, separated by a comma.
                            </p>
                        </div>

                        {/* Availability */}
                        <div>
                            <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Primary Availability</label>
                            <select
                                id="availability"
                                className="w-full px-3 py-2 border text-black rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 border-gray-300 bg-white"
                            >
                                <option value="">Select your main availability</option>
                                <option value="weekdays">Weekdays (M-F)</option>
                                <option value="weekends">Weekends (Sat-Sun)</option>
                                <option value="evenings">Evenings Only</option>
                                <option value="flexible">Flexible/Varies</option>
                            </select>
                        </div>
                    </div>

                    {/* Submit */}
                    <div className="flex justify-center">
                        <button
                            type="submit"
                            className="w-full md:w-auto px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-md shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition duration-150"
                        >
                            Complete Profile & Register
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default expertForm