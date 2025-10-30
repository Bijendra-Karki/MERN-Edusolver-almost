"use client";

import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import {
  Pencil,
  Trash2,
  BookOpen,
  Loader2,
  CheckCircle,
  AlertCircle,
  Calendar,
  Clock,
} from "lucide-react";
import { getToken } from "../../components/utils/authHelper";

// =================================================================
// 1. Exam Form Component
// =================================================================
const defaultExamForm = {
  subject_id: "",
  set_ids: [],
  title: "",
  total_questions: 50,
  date: "",
  total_marks: 45,
  duration: 60,
};

const ExamFormContent = React.memo(
  ({ initialData = null, onSaveSuccess, subjectList = [], examSets = [], isSubjectLoading }) => {
    const [formData, setFormData] = useState(defaultExamForm);
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showNotification, setShowNotification] = useState(false);
    const [notificationMessage, setNotificationMessage] = useState("");
    const [notificationType, setNotificationType] = useState("success");

    const token = getToken();

    // Load initialData for edit
    useEffect(() => {
      if (initialData) {
        const dateISO = new Date(initialData.date);
        const dateLocal = `${dateISO.getFullYear()}-${(dateISO.getMonth() + 1)
          .toString()
          .padStart(2, "0")}-${dateISO.getDate().toString().padStart(2, "0")}T${dateISO.getHours()
          .toString()
          .padStart(2, "0")}:${dateISO.getMinutes().toString().padStart(2, "0")}`;

        setFormData({
          subject_id: initialData.subject_id || "",
          set_ids: initialData.set_ids || [],
          title: initialData.title || "",
          total_questions: initialData.total_questions || 50,
          date: dateLocal,
          total_marks: initialData.total_marks || 45,
          duration: initialData.duration || 60,
        });
      } else {
        setFormData(defaultExamForm);
      }
    }, [initialData]);

    const handleInputChange = (e) => {
      const { name, value } = e.target;
      const processedValue = name.includes("total") || name === "duration" ? Number(value) : value;
      setErrors((prev) => ({ ...prev, [name]: null }));
      setFormData((prev) => ({ ...prev, [name]: processedValue }));
    };

    const handleSetSelectChange = (e) => {
      const selectedOptions = Array.from(e.target.selectedOptions).map((opt) => opt.value);
      setFormData((prev) => ({ ...prev, set_ids: selectedOptions }));
      setErrors((prev) => ({ ...prev, set_ids: null }));
    };

    const validateForm = () => {
      const newErrors = {};
      if (!formData.subject_id) newErrors.subject_id = "Please select a subject.";
      if (!formData.set_ids.length) newErrors.set_ids = "Please select at least one exam set.";
      if (!formData.title.trim()) newErrors.title = "Exam Title is required.";
      if (!formData.total_questions || formData.total_questions < 1)
        newErrors.total_questions = "Must be a positive number.";
      if (!formData.date) newErrors.date = "Exam date and time is required.";
      if (!formData.total_marks || formData.total_marks < 1) newErrors.total_marks = "Must be a positive number.";
      if (!formData.duration || formData.duration < 1) newErrors.duration = "Duration (in minutes) is required.";

      setErrors(newErrors);
      return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
      e.preventDefault();
      setShowNotification(false);

      if (!validateForm()) {
        setNotificationMessage("Please fix the validation errors.");
        setNotificationType("error");
        setShowNotification(true);
        return;
      }

      setIsSubmitting(true);
      try {
        const dataToSubmit = { ...formData };
        const url = initialData ? `/api/exams/examUpdate/${initialData._id}` : "/api/exams/createExam";
        const method = initialData ? axios.put : axios.post;
        const config = { headers: { Authorization: `Bearer ${token}` } };

        const res = await method(url, dataToSubmit, config);

        setNotificationMessage(`Exam "${res.data.exam.title}" ${initialData ? "updated" : "created"} successfully!`);
        setNotificationType("success");
        setShowNotification(true);

        if (!initialData) setFormData(defaultExamForm);
        if (onSaveSuccess) onSaveSuccess(res.data.exam);
      } catch (err) {
        console.error("Exam submission failed:", err.response?.data || err);
        setNotificationMessage(`Failed to save exam. ${err.response?.data?.message || "Server error."}`);
        setNotificationType("error");
        setShowNotification(true);
      } finally {
        setIsSubmitting(false);
        setTimeout(() => setShowNotification(false), 4000);
      }
    };

    return (
      <div className="bg-white rounded-xl border border-gray-200 shadow-xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-extrabold text-gray-900">
            {initialData ? "Edit Exam ✏️" : "Create New Exam 📝"}
          </h1>
          <p className="text-gray-600 text-sm mt-1">
            Fill in the details below to {initialData ? "update the exam" : "create a new exam"} for your students
          </p>
        </div>

        {showNotification && (
          <div
            className={`mb-6 flex items-center gap-3 p-4 rounded-lg text-sm font-medium ${
              notificationType === "success"
                ? "bg-green-50 text-green-800 border border-green-200"
                : "bg-red-50 text-red-800 border border-red-200"
            }`}
          >
            {notificationType === "success" ? (
              <CheckCircle className="w-5 h-5 flex-shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
            )}
            {notificationMessage}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Subject Dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Subject *</label>
            <select
              name="subject_id"
              value={formData.subject_id}
              onChange={handleInputChange}
              disabled={isSubjectLoading || isSubmitting}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white text-gray-900 ${
                errors.subject_id ? "border-red-500" : "border-gray-300"
              }`}
            >
              <option value="" disabled>
                {isSubjectLoading ? "Loading subjects..." : "Choose a subject..."}
              </option>
              {subjectList.map((s) => (
                <option key={s._id} value={s._id}>
                  {s.name || s.title}
                </option>
              ))}
            </select>
            {errors.subject_id && <p className="text-red-600 text-sm mt-1.5">{errors.subject_id}</p>}
          </div>

          {/* Exam Sets Multi-select */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Select Exam Sets *</label>
            <select
              multiple
              value={formData.set_ids}
              onChange={handleSetSelectChange}
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition bg-white text-gray-900 ${
                errors.set_ids ? "border-red-500" : "border-gray-300"
              }`}
              style={{ height: "120px" }}
            >
              {examSets.map((set) => (
                <option key={set._id} value={set._id}>
                  {set.title || set.name}
                </option>
              ))}
            </select>
            {errors.set_ids && <p className="text-red-600 text-sm mt-1.5">{errors.set_ids}</p>}
          </div>

          {/* Exam Title */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Title *</label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Enter exam title"
              className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-gray-900 ${
                errors.title ? "border-red-500" : "border-gray-300"
              }`}
            />
            {errors.title && <p className="text-red-600 text-sm mt-1.5">{errors.title}</p>}
          </div>

          {/* Total Questions & Date */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Total Questions *</label>
              <input
                type="number"
                name="total_questions"
                value={formData.total_questions}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-gray-900 ${
                  errors.total_questions ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.total_questions && <p className="text-red-600 text-sm mt-1.5">{errors.total_questions}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Exam Date *</label>
              <input
                type="datetime-local"
                name="date"
                value={formData.date}
                onChange={handleInputChange}
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-gray-900 ${
                  errors.date ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.date && <p className="text-red-600 text-sm mt-1.5">{errors.date}</p>}
            </div>
          </div>

          {/* Marks & Duration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Total Marks *</label>
              <input
                type="number"
                name="total_marks"
                value={formData.total_marks}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-gray-900 ${
                  errors.total_marks ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.total_marks && <p className="text-red-600 text-sm mt-1.5">{errors.total_marks}</p>}
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">Duration (minutes) *</label>
              <input
                type="number"
                name="duration"
                value={formData.duration}
                onChange={handleInputChange}
                min="1"
                className={`w-full px-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition text-gray-900 ${
                  errors.duration ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.duration && <p className="text-red-600 text-sm mt-1.5">{errors.duration}</p>}
            </div>
          </div>

          {/* Submit */}
          <div className="flex pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`flex-1 flex items-center justify-center gap-2 px-6 py-3 rounded-lg font-semibold text-white transition duration-200 ${
                isSubmitting ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 shadow-lg"
              }`}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  {initialData ? "Updating Exam..." : "Creating Exam..."}
                </>
              ) : initialData ? (
                "Update Exam"
              ) : (
                "Create Exam"
              )}
            </button>
          </div>
        </form>
      </div>
    );
  }
);
ExamFormContent.displayName = "ExamFormContent";

// =================================================================
// 2. Exam Card Component
// =================================================================
const ExamListCard = ({ exam, onEdit, onDelete }) => {
  const examDate = new Date(exam.date);
  const formattedDate = examDate.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  const formattedTime = examDate.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
  const subjectName = exam.subject_id?.title || exam.subject_id?.name || "Unknown Subject";
  const setsCount = exam.set_ids?.length || 0;

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col md:flex-row justify-between items-start md:items-center hover:shadow-lg transition duration-200 space-y-3 md:space-y-0">
      <div className="flex-1 space-y-1">
        <p className="text-xl font-bold text-gray-900">{subjectName}</p>
        <p className="text-sm text-indigo-600 font-medium">{exam.title}</p>

        <p className="text-sm text-gray-600 mt-1">
          Sets: {setsCount} {setsCount === 1 ? "set" : "sets"}
        </p>

        <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-4 mt-1">
          <span className="flex items-center">
            <Calendar className="w-4 h-4 mr-1 text-gray-400" />
            {formattedDate}
          </span>
          <span className="flex items-center">
            <Clock className="w-4 h-4 mr-1 text-gray-400" />
            {formattedTime}
          </span>
        </div>

        <p className="text-sm text-gray-500 mt-1">
          {exam.total_questions} Questions | {exam.total_marks} Marks | {exam.duration} Minutes
        </p>
      </div>

      <div className="flex space-x-3 flex-shrink-0">
        <button
          onClick={() => onEdit(exam)}
          className="flex items-center p-2 text-indigo-600 border border-indigo-200 hover:bg-indigo-50 rounded-lg transition"
        >
          <Pencil className="w-5 h-5 mr-1" /> Edit
        </button>
        <button
          onClick={() => onDelete(exam._id, exam.title)}
          className="flex items-center p-2 text-red-600 border border-red-200 hover:bg-red-50 rounded-lg transition"
        >
          <Trash2 className="w-5 h-5 mr-1" /> Delete
        </button>
      </div>
    </div>
  );
};


// =================================================================
// 3. Main ManageExamsPage Component
// =================================================================
export default function ManageExamsPage() {
  const [exams, setExams] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [examSets, setExamSets] = useState([]);
  const [isExamListLoading, setIsExamListLoading] = useState(false);
  const [isSubjectLoading, setIsSubjectLoading] = useState(false);
  const [editingExam, setEditingExam] = useState(null);

  const token = getToken();
  const subjectMap = subjects.reduce((map, s) => {
    map[s._id] = s.name || s.title;
    return map;
  }, {});

  const fetchSubjects = useCallback(async () => {
    if (!token) return;
    setIsSubjectLoading(true);
    try {
      const res = await axios.get("/api/subjects/subjectsList", { headers: { Authorization: `Bearer ${token}` } });
      setSubjects(res.data.subjects || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubjectLoading(false);
    }
  }, [token]);



  const fetchExams = useCallback(async () => {
    if (!token) return;
    setIsExamListLoading(true);
    try {
      const res = await axios.get("/api/exams/examList", { headers: { Authorization: `Bearer ${token}` } });
      setExams(res.data.exams || res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setIsExamListLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchSubjects();
    fetchExams();
  }, [fetchSubjects, fetchExams]);

  const handleSaveSuccess = (newOrUpdatedExam) => {
    const subjectName = subjectMap[newOrUpdatedExam.subject_id];
    const examWithSubjectData = { ...newOrUpdatedExam, subject: { _id: newOrUpdatedExam.subject_id, name: subjectName } };

    if (editingExam) {
      setExams((prev) =>
        prev.map((e) => (e._id === examWithSubjectData._id ? examWithSubjectData : e))
      );
      setEditingExam(null);
    } else {
      setExams((prev) => [examWithSubjectData, ...prev]);
    }
  };

  const handleEdit = (exam) => {
    setEditingExam(exam);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (_id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      await axios.delete(`/api/exams/examDelete/${_id}`, { headers: { Authorization: `Bearer ${token}` } });
      setExams((prev) => prev.filter((e) => e._id !== _id));
      if (editingExam?._id === _id) setEditingExam(null);
    } catch (err) {
      console.error(err);
      alert(`Failed to delete exam "${title}".`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <div className="max-w-4xl mx-auto space-y-10">
        <ExamFormContent
          initialData={editingExam}
          onSaveSuccess={handleSaveSuccess}
          subjectList={subjects}
          examSets={examSets}
          isSubjectLoading={isSubjectLoading}
        />

        {editingExam && (
          <div className="flex justify-center">
            <button
              onClick={() => setEditingExam(null)}
              className="text-indigo-600 hover:text-indigo-800 font-medium transition flex items-center gap-1"
            >
              <span className="text-xl">←</span> Back to Create New Exam
            </button>
          </div>
        )}

        <hr className="border-gray-300" />

        <div className="bg-white rounded-xl shadow-xl border border-gray-100 p-6 space-y-6">
          <h2 className="text-2xl font-bold text-gray-900 border-b pb-3 flex items-center">
            <BookOpen className="w-6 h-6 mr-2 text-indigo-600" /> Exams ({exams.length})
          </h2>

          {isExamListLoading ? (
            <div className="flex justify-center items-center py-8 text-indigo-600">
              <Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading exams list...
            </div>
          ) : exams.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No exams scheduled yet.</p>
          ) : (
            <div className="space-y-4">
              {exams.map((exam) => (
                <ExamListCard
                  key={exam._id}
                  exam={exam}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
