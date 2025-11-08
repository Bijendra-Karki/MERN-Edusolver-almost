"use client";

import React, { useState, useEffect } from "react";
import axios from "axios";
import { AlertCircle, CheckCircle, Pencil, Trash2, Loader2 } from "lucide-react";
import { getToken } from "../../components/utils/authHelper";

export default function ExamSetForm() {
  const [formData, setFormData] = useState({
    subject_id: "",
    exam_id: "",
    exam_tittle: "",
    setName: "",
    description: ""
  
  });

  const [subjectList, setSubjectList] = useState([]);
  const [examList, setExamList] = useState([]);
  const [examSetList, setExamSetList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingExams, setLoadingExams] = useState(false);
  const [loadingExamSets, setLoadingExamSets] = useState(true);
  const [alert, setAlert] = useState(null);
  const [editingExamSet, setEditingExamSet] = useState(null);

  const token = getToken();
  const config = { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } };

  // Fetch Subjects
  useEffect(() => {
    if (!token) return setLoadingSubjects(false);
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("/api/subjects/subjectsList", config);
        const transformedSubjects = (res.data || []).map((s) => ({ id: s._id, name: s.title || s.name }));
        setSubjectList(transformedSubjects);
      } catch (err) {
        console.error(err);
        setAlert({ type: "error", message: "Failed to fetch subjects." });
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, [token]);

  // Fetch Exam Sets
  useEffect(() => {
    if (!token) return setLoadingExamSets(false);
    const fetchExamSets = async () => {
      try {
        const res = await axios.get("/api/examSets/examSetList", config);
        setExamSetList(res.data || []);
      } catch (err) {
        console.error(err);
        setAlert({ type: "error", message: "Failed to fetch exam sets." });
      } finally {
        setLoadingExamSets(false);
      }
    };
    fetchExamSets();
  }, [token]);

  // Fetch Exams for selected subject
  const fetchExamsForSubject = async (subjectId, selectedExamId = "") => {
    if (!subjectId) return setExamList([]);
    setLoadingExams(true);
    try {
      const res = await axios.get(`/api/exams/examList?subject_id=${subjectId}`, config);
      const exams = res.data.exams || res.data || [];
      setExamList(exams);

      if (selectedExamId) {
        const exists = exams.find((ex) => ex._id === selectedExamId);
        setFormData((prev) => ({
          ...prev,
          exam_id: exists ? selectedExamId : "",
        }));
      }
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: "Failed to fetch exams for selected subject." });
    } finally {
      setLoadingExams(false);
    }
  };

  // Handlers
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "totalMarks" || name === "duration" ? Number(value) : value,
    }));
  };

  const handleSubjectChange = (e) => {
    const subjectId = e.target.value;
    setFormData((prev) => ({
      ...prev,
      subject_id: subjectId,
      exam_id: "",
      exam_tittle: "",
    }));
    fetchExamsForSubject(subjectId);
  };

  const handleExamChange = (e) => {
    const selectedExam = examList.find((ex) => ex._id === e.target.value);
    setFormData((prev) => ({
      ...prev,
      exam_id: selectedExam?._id || "",
      exam_tittle: selectedExam?.title || "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!formData.subject_id) return setAlert({ type: "error", message: "Please select a subject." });
    if (!formData.exam_id) return setAlert({ type: "error", message: "Please select an exam." });
    if (!formData.setName?.trim()) return setAlert({ type: "error", message: "Please enter a Set Name." });

    setLoading(true);
    try {
      const payload = { ...formData };
      let res;
      if (editingExamSet) {
        res = await axios.put(`/api/examSets/examSetUpdate/${editingExamSet._id}`, payload, config);
      } else {
        res = await axios.post("/api/examSets/createExamSet", payload, config);
      }

      const newOrUpdatedExamSet = res.data.examSet || res.data;
      setExamSetList((prev) =>
        editingExamSet ? prev.map((ex) => (ex._id === newOrUpdatedExamSet._id ? newOrUpdatedExamSet : ex)) : [newOrUpdatedExamSet, ...prev]
      );

      setFormData({
        subject_id: "",
        exam_id: "",
        exam_tittle: "",
        setName: "",
        description: "",
      
      });
      setEditingExamSet(null);
      setAlert({ type: "success", message: `Exam Set ${editingExamSet ? "updated" : "created"} successfully!` });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to submit Exam Set." });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (examSet) => {
    setEditingExamSet(examSet);
    setFormData({
      subject_id: examSet.subject_id?._id || examSet.subject_id || "",
      exam_id: "", // will be set after exams are loaded
      exam_tittle: examSet.exam_tittle || "",
      setName: examSet.setName || "",
      description: examSet.description || "",
  
    });
    fetchExamsForSubject(examSet.subject_id?._id || examSet.subject_id, examSet.exam_id?._id || examSet.exam_id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this Exam Set?")) return;
    try {
      await axios.delete(`/api/examSets/examSetDelete/${id}`, config);
      setExamSetList((prev) => prev.filter((ex) => ex._id !== id));
      if (editingExamSet?._id === id) setEditingExamSet(null);
      setAlert({ type: "success", message: "Exam Set deleted successfully!" });
      setTimeout(() => setAlert(null), 3000);
    } catch (err) {
      console.error(err);
      setAlert({ type: "error", message: err.response?.data?.message || "Failed to delete Exam Set." });
    }
  };

  return (
    <div className="w-full max-w-8xl mx-auto space-y-10 py-10">
      {/* FORM */}
      <form onSubmit={handleSubmit} className="space-y-6 p-8 bg-white rounded-xl shadow-lg border border-gray-200">
        {alert && (
          <div className={`flex items-center gap-3 p-4 rounded-lg text-sm font-medium ${alert.type === "error" ? "bg-red-50 text-red-800 border border-red-200" : "bg-green-50 text-green-800 border border-green-200"}`} role="alert">
            {alert.type === "error" ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
            {alert.message}
          </div>
        )}

        <h2 className="text-3xl font-extrabold text-gray-900">{editingExamSet ? "Edit Exam Set ✏️" : "Create New Exam Set 📚"}</h2>

        {/* Subject */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Subject *</label>
          <select name="subject_id" value={formData.subject_id || ""} onChange={handleSubjectChange} disabled={loading || loadingSubjects} className="w-full px-4 py-2.5 border rounded-lg">
            <option value="" disabled>{loadingSubjects ? "Loading subjects..." : "Select subject..."}</option>
            {subjectList.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>
        </div>

        {/* Exam */}
        {formData.subject_id && (
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Exam *</label>
            <select name="exam_id" value={formData.exam_id || ""} onChange={handleExamChange} disabled={loadingExams || loading} className="w-full px-4 py-2.5 border rounded-lg">
              <option value="" disabled>{loadingExams ? "Loading exams..." : "Select exam..."}</option>
              {examList.map((ex) => <option key={ex._id} value={ex._id}>{ex.title}</option>)}
            </select>
          </div>
        )}

        {/* Set Name */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Set Name *</label>
          <input type="text" name="setName" value={formData.setName || ""} onChange={handleChange} placeholder="e.g., Set 1" className="w-full px-4 py-2.5 border rounded-lg" />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-semibold text-gray-700 mb-2">Description</label>
          <textarea name="description" value={formData.description || ""} onChange={handleChange} rows={3} className="w-full px-4 py-2.5 border rounded-lg" />
        </div>

        {/* Submit */}
        <button type="submit" disabled={loading} className="w-full py-3 rounded-lg bg-indigo-600 text-white flex items-center justify-center gap-2">
          {loading ? <><Loader2 className="w-5 h-5 animate-spin" /> Submitting...</> : (editingExamSet ? "Update Exam Set" : "Create Exam Set")}
        </button>
      </form>

      {/* EXAM SET LIST */}
      <div className="space-y-4 pt-4">
        <h2 className="text-2xl font-bold text-gray-900 border-b pb-3">Existing Exam Sets ({examSetList.length})</h2>
        {loadingExamSets ? (
          <div className="flex justify-center items-center py-8 text-indigo-600"><Loader2 className="w-6 h-6 animate-spin mr-2" /> Loading Exam Sets...</div>
        ) : examSetList.length === 0 ? (
          <p className="text-center text-gray-500 py-8 border rounded-lg bg-white">No exam sets available. Create one above!</p>
        ) : (
          <div className="space-y-4">
            {examSetList.map((ex) => {
              const subjectName = subjectList.find(s => s.id === (ex.subject_id?._id || ex.subject_id))?.name || "Unknown Subject";
              console.log(ex.description)
              return (
                <div key={ex._id} className="flex justify-between items-center p-4 bg-white border rounded-lg shadow-sm hover:shadow-md transition duration-150">
                  <div>
                    <p className="font-semibold text-lg text-black">Subject: {subjectName}</p>
                    <p className="text-indigo-600 font-medium">Exam: {ex.exam_tittle}</p>
                    <p className="text-gray-800">Set: {ex.setName}</p>
                    <p className="text-gray-700 text-sm italic">{ex.description}</p>
                    
                    
                   
                  </div>
                  <div className="flex space-x-2 flex-shrink-0">
                    <button onClick={() => handleEdit(ex)} className="flex items-center gap-1 text-indigo-600 border border-indigo-200 hover:bg-indigo-50 px-3 py-1.5 rounded-lg transition">
                      <Pencil className="w-4 h-4" /> Edit
                    </button>
                    <button onClick={() => handleDelete(ex._id)} className="flex items-center gap-1 text-red-600 border border-red-200 hover:bg-red-50 px-3 py-1.5 rounded-lg transition">
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
