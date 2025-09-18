"use client"

import { useState } from "react"
import { AlertCircle, CheckCircle } from "lucide-react"

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
  const [showNotification, setShowNotification] = useState(false)
  const [notificationMessage, setNotificationMessage] = useState("")
  const [notificationType, setNotificationType] = useState("success")

  const subjects = [
    { id: "1", name: "Mathematics" },
    { id: "2", name: "Science" },
    { id: "3", name: "English" },
    { id: "4", name: "History" },
    { id: "5", name: "Geography" },
  ]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}
    if (!formData.subject_id) newErrors.subject_id = "Please select a subject"
    if (!formData.title.trim()) newErrors.title = "Exam title is required"
    if (!formData.date) newErrors.date = "Exam date is required"
    if (!formData.total_marks || formData.total_marks < 0) newErrors.total_marks = "Total marks must be greater than 0"
    if (!formData.duration || formData.duration < 1) newErrors.duration = "Duration must be at least 1 minute"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const showToast = (message, type) => {
    setNotificationMessage(message)
    setNotificationType(type)
    setShowNotification(true)
    setTimeout(() => setShowNotification(false), 3000)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return
    setIsSubmitting(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      showToast("Exam created successfully!", "success")
      setFormData({ subject_id: "", title: "", date: "", total_marks: "", duration: "" })
    } catch (error) {
      showToast("Error creating exam. Please try again.", "error")
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSaveDraft = () => {
    showToast("Draft saved successfully!", "success")
  }
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg border border-gray-200 shadow-md mt-6">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-2">Create New Exam</h1>
        <p className="text-gray-600 text-sm">Fill in the details below to create a new exam for your students.</p>
      </div>

      {showNotification && (
        <div
          className={`mb-4 flex items-center gap-2 p-3 rounded-md text-sm font-medium ${
            notificationType === "success"
              ? "bg-green-100 text-green-800 border border-green-300"
              : "bg-red-100 text-red-800 border border-red-300"
          }`}
        >
          {notificationType === "success" ? <CheckCircle size={18} /> : <AlertCircle size={18} />}
          {notificationMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Subject */}
        <div>
          <label className="block text-sm font-semibold text-gray-800">Select Subject *</label>
          <select
            name="subject_id"
            value={formData.subject_id}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border  rounded-md focus:ring-2 focus:ring-indigo-500 ${
              errors.subject_id ? "border-red-500" : "border-gray-300"
            }`}
          >
            <option value="">Choose a subject...</option>
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name}
              </option>
            ))}
          </select>
          {errors.subject_id && <p className="text-red-600 text-sm mt-1">{errors.subject_id}</p>}
        </div>

        {/* Exam Title */}
        <div>
          <label className="block text-sm font-semibold text-gray-800">Exam Title *</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleInputChange}
            placeholder="Enter exam title"
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
              errors.title ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.title && <p className="text-red-600 text-sm mt-1">{errors.title}</p>}
        </div>

        {/* Exam Date */}
        <div>
          <label className="block text-sm font-semibold text-gray-800">Exam Date *</label>
          <input
            type="datetime-local"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
              errors.date ? "border-red-500" : "border-gray-300"
            }`}
          />
          {errors.date && <p className="text-red-600 text-sm mt-1">{errors.date}</p>}
        </div>

        {/* Marks & Duration */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-semibold text-gray-800">Total Marks *</label>
            <input
              type="number"
              name="total_marks"
              value={formData.total_marks}
              onChange={handleInputChange}
              placeholder="100"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                errors.total_marks ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.total_marks && <p className="text-red-600 text-sm mt-1">{errors.total_marks}</p>}
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-800">Duration (minutes) *</label>
            <input
              type="number"
              name="duration"
              value={formData.duration}
              onChange={handleInputChange}
              placeholder="60"
              className={`w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-indigo-500 ${
                errors.duration ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.duration && <p className="text-red-600 text-sm mt-1">{errors.duration}</p>}
          </div>
        </div>

        {/* Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            type="button"
            onClick={handleSaveDraft}
            className="px-6 py-2 rounded-md bg-gray-200 text-gray-800 font-medium hover:bg-gray-300 transition"
          >
            Save Draft
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-2 rounded-md bg-indigo-600 text-white font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {isSubmitting ? "Creating Exam..." : "Create Exam"}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddExam
