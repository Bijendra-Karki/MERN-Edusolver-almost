"use client"

import { useState } from "react"
import { AlertCircle } from "lucide-react"

const AddExam = () => {
  const [formData, setFormData] = useState({
    subject_id: "",
    title: "",
    date: "",
    total_marks: "",
    duration: "",
  })

  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sample subjects - in real app this would come from API
  const subjects = [
    { id: "1", name: "Mathematics" },
    { id: "2", name: "Science" },
    { id: "3", name: "English" },
    { id: "4", name: "History" },
    { id: "5", name: "Geography" },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.subject_id) {
      newErrors.subject_id = "Please select a subject"
    }

    if (!formData.title.trim()) {
      newErrors.title = "Exam title is required"
    }

    if (!formData.date) {
      newErrors.date = "Exam date is required"
    }

    if (!formData.total_marks || formData.total_marks < 0) {
      newErrors.total_marks = "Total marks must be greater than 0"
    }

    if (!formData.duration || formData.duration < 1) {
      newErrors.duration = "Duration must be at least 1 minute"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)

    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000))
      console.log("Exam created:", formData)
      alert("Exam created successfully!")

      // Reset form
      setFormData({
        subject_id: "",
        title: "",
        date: "",
        total_marks: "",
        duration: "",
      })
    } catch (error) {
      console.error("Error creating exam:", error)
      alert("Error creating exam. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    console.log("Draft saved:", formData)
    alert("Draft saved successfully!")
  }

  return (
    <div className="max-w-2xl mx-auto p-8 bg-white rounded-xl shadow-lg border border-gray-200 mt-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Create New Exam</h1>
        <p className="text-gray-600 text-base">Fill in the details below to create a new exam for your students.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject Selection */}
        <div className="space-y-2">
          <label htmlFor="subject_id" className="block text-sm font-semibold text-gray-700">
            Select Subject *
          </label>
          <select
            id="subject_id"
            name="subject_id"
            value={formData.subject_id}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
              errors.subject_id ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
            }`}
          >
            <option value="">Choose a subject...</option>
            {subjects.map((subject) => (
              <option key={subject.id} value={subject.id}>
                {subject.name}
              </option>
            ))}
          </select>
          {errors.subject_id && (
            <p className="text-red-600 text-sm flex items-center gap-1 mt-1">
              <AlertCircle size={14} />
              {errors.subject_id}
            </p>
          )}
        </div>

        {/* Exam Title */}
        <div className="space-y-2">
          <label htmlFor="title" className="block text-sm font-semibold text-gray-700">
            Exam Title *
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter exam title (e.g., Mid-term Mathematics Exam)"
            className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
              errors.title ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
            }`}
          />
          {errors.title && (
            <p className="text-red-600 text-sm flex items-center gap-1 mt-1">
              <AlertCircle size={14} />
              {errors.title}
            </p>
          )}
        </div>

        {/* Exam Date */}
        <div className="space-y-2">
          <label htmlFor="date" className="block text-sm font-semibold text-gray-700">
            Exam Date *
          </label>
          <input
            type="datetime-local"
            id="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
              errors.date ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
            }`}
          />
          {errors.date && (
            <p className="text-red-600 text-sm flex items-center gap-1 mt-1">
              <AlertCircle size={14} />
              {errors.date}
            </p>
          )}
        </div>

        {/* Total Marks and Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label htmlFor="total_marks" className="block text-sm font-semibold text-gray-700">
              Total Marks *
            </label>
            <input
              type="number"
              id="total_marks"
              name="total_marks"
              value={formData.total_marks}
              onChange={handleInputChange}
              min="0"
              placeholder="100"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.total_marks ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
              }`}
            />
            {errors.total_marks && (
              <p className="text-red-600 text-sm flex items-center gap-1 mt-1">
                <AlertCircle size={14} />
                {errors.total_marks}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <label htmlFor="duration" className="block text-sm font-semibold text-gray-700">
              Duration (minutes) *
            </label>
            <input
              type="number"
              id="duration"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              min="1"
              placeholder="60"
              className={`w-full px-4 py-3 bg-gray-50 border rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 ${
                errors.duration ? "border-red-500 bg-red-50" : "border-gray-300 hover:border-gray-400"
              }`}
            />
            {errors.duration && (
              <p className="text-red-600 text-sm flex items-center gap-1 mt-1">
                <AlertCircle size={14} />
                {errors.duration}
              </p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-8">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-all duration-200 font-semibold border border-gray-300"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-semibold disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
          >
            {isSubmitting ? "Creating Exam..." : "Create Exam"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddExam
