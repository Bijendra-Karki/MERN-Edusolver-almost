// src/components/QuestionForm.jsx
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { AlertCircle, CheckCircle, Edit2, X, Save } from "lucide-react";
import { getToken } from "../../components/utils/authHelper";

// Assume these API endpoints for the new functionality:
// FETCH: GET /api/questions/questionList?examSet={id}
// UPDATE: PUT /api/questions/updateQuestion/{id}

// ---------- ALERT COMPONENT ----------
const Alert = ({ type, message }) => {
  const isError = type === "error";
  return (
    <div
      className={`flex items-center gap-3 p-4 rounded-lg text-sm font-medium ${
        isError
          ? "bg-red-50 text-red-800 border border-red-200"
          : "bg-green-50 text-green-800 border border-green-200"
      }`}
    >
      {isError ? <AlertCircle className="w-5 h-5" /> : <CheckCircle className="w-5 h-5" />}
      {message}
    </div>
  );
};

// ---------- INPUT COMPONENT ----------
const FormInput = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  required,
  min,
  max,
  disabled = false,
  isTextArea = false, // Added for larger text inputs
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {isTextArea ? (
      <textarea
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        rows={3}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition resize-y"
        required={required}
        disabled={disabled}
      />
    ) : (
      <input
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        min={min}
        max={max}
        className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none transition"
        required={required}
        disabled={disabled}
      />
    )}
  </div>
);

// ---------- SUBMIT BUTTON ----------
const SubmitButton = ({ loading, text, type = "submit", icon: Icon = null, className = "", onClick = null }) => (
  <button
    type={type}
    disabled={loading}
    onClick={onClick}
    className={`w-full py-3 px-4 font-semibold rounded-lg shadow-sm flex items-center justify-center gap-2 transition-colors ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-indigo-600 hover:bg-indigo-700 text-white"
    } ${className}`}
  >
    {loading ? "Processing..." : (
      <>
        {Icon && <Icon className="w-5 h-5" />}
        {text}
      </>
    )}
  </button>
);

// --- Question Editor/Viewer Component (Re-usable for both listing and editing) ---
const QuestionRow = ({ 
  question, 
  index, 
  isEditing, 
  onStartEdit, 
  onCancelEdit, 
  onUpdateChange, 
  onUpdateSubmit, 
  updateLoading 
}) => {
  // Utility for correct option mapping
  const optionLetters = ['A', 'B', 'C', 'D'];

  if (isEditing) {
    // --- Editing Mode ---
    return (
      <div className="border border-indigo-300 bg-indigo-50 p-4 rounded-xl space-y-4 shadow-md">
        <h3 className="font-bold text-xl text-indigo-700">Editing Question {index + 1}</h3>
        
        <FormInput
          label="Question Text"
          name="questionText"
          value={question.questionText}
          onChange={onUpdateChange}
          isTextArea={true}
          required
        />
        
        <div className="grid grid-cols-2 gap-4">
          {question.options.map((opt, idx) => (
            <input
              key={idx}
              type="text"
              name={`options.${idx}`} // Custom name for handling options
              value={opt}
              onChange={onUpdateChange}
              placeholder={`Option ${optionLetters[idx]}`}
              className="w-full px-3 py-2 border rounded-lg focus:ring-indigo-500"
              required
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-4">
            <FormInput
                label="Correct Answer"
                name="correctAnswer"
                value={question.correctAnswer}
                onChange={onUpdateChange}
                placeholder="Enter the correct option text"
                required
            />
            <FormInput
                label="Marks"
                name="marks"
                type="number"
                min={1}
                value={question.marks}
                onChange={onUpdateChange}
                required
            />
        </div>

        <div className="flex justify-end space-x-3">
          <SubmitButton
            text="Cancel"
            type="button"
            icon={X}
            className="w-auto bg-gray-500 hover:bg-gray-600"
            onClick={onCancelEdit}
          />
          <SubmitButton
            text="Update Question"
            type="button"
            icon={Save}
            loading={updateLoading}
            className="w-auto"
            onClick={onUpdateSubmit} // <--- Triggers the update API call
          />
        </div>
      </div>
    );
  } else {
    // --- Viewing Mode ---
    return (
      <div className="border border-gray-200 bg-white p-4 rounded-lg space-y-3">
        <div className="flex justify-between items-start">
          <p className="font-semibold text-gray-800">
            {index + 1}. {question.questionText}
          </p>
          <button
            onClick={() => onStartEdit(question)}
            className="flex items-center gap-1 text-sm text-indigo-600 hover:text-indigo-800 transition-colors"
          >
            <Edit2 className="w-4 h-4" />
            Edit
          </button>
        </div>
        
        <div className="grid grid-cols-2 gap-2 text-sm">
          {question.options.map((opt, idx) => (
            <p
              key={idx}
              className={`p-2 rounded-md ${
                opt === question.correctAnswer
                  ? "bg-green-100 text-green-800 font-medium border border-green-200"
                  : "bg-gray-50 text-gray-600"
              }`}
            >
              <span className="font-bold mr-1">{optionLetters[idx]}.</span> {opt}
            </p>
          ))}
        </div>
        <p className="text-sm font-medium pt-2 border-t mt-2">
            Marks: <span className="text-indigo-600">{question.marks}</span>
        </p>
      </div>
    );
  }
};


// ---------- MAIN COMPONENT ----------
export default function QuestionForm() {
  const [formData, setFormData] = useState({
    subject: "",
    exam: "",
    examSet: "",
    numQuestions: 1, 
    questions: [
      { questionText: "", options: ["", "", "", ""], correctAnswer: "", marks: 1 },
    ],
  });

  const [subjectList, setSubjectList] = useState([]);
  const [examList, setExamList] = useState([]);
  const [examSetList, setExamSetList] = useState([]);
  const [alert, setAlert] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingSubjects, setLoadingSubjects] = useState(true);
  const [loadingExams, setLoadingExams] = useState(false);
  const [loadingExamSets, setLoadingExamSets] = useState(false);
  
  // --- States for Existing Questions and Editing ---
  const [existingQuestions, setExistingQuestions] = useState([]);
  const [questionsLoading, setQuestionsLoading] = useState(false);
  const [editingQuestion, setEditingQuestion] = useState(null); // The question object currently being edited
  const [updateLoading, setUpdateLoading] = useState(false);


  const token = getToken();
  const config = {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  };

  // --- FETCH EXISTING QUESTIONS ---
  useEffect(() => {
    if (!formData.examSet) {
      setExistingQuestions([]);
      return;
    }
    setQuestionsLoading(true);
    const fetchQuestions = async () => {
      try {
        // Using the correct API endpoint specified in your router
        const res = await axios.get(
          `/api/questions/questionList?examSet=${formData.examSet}`,
          config
        );
        
        setExistingQuestions(
          (res.data || []).map(q => ({
            ...q,
            options: q.options || ["", "", "", ""], // Ensure options is an array
          }))
        );
      } catch (err) {
        setAlert({
          type: "error",
          message:
            err.response?.data?.message || "Failed to fetch existing questions",
        });
      } finally {
        setQuestionsLoading(false);
      }
    };
    fetchQuestions();
  }, [formData.examSet]); // Re-fetch when exam set changes


  // --- API FETCHES (Subjects, Exams, Exam Sets) ---
  // (These useEffects are copied from your provided code and remain unchanged)
  // ---------- FETCH SUBJECTS ----------
  useEffect(() => {
    if (!token) return;
    const fetchSubjects = async () => {
      try {
        const res = await axios.get("/api/subjects/subjectsList", config);
        setSubjectList(
          (res.data || []).map((s) => ({ id: s._id, name: s.title }))
        );
      } catch (err) {
        setAlert({
          type: "error",
          message:
            err.response?.data?.message || "Failed to fetch subjects",
        });
      } finally {
        setLoadingSubjects(false);
      }
    };
    fetchSubjects();
  }, [token]);

  // ---------- FETCH EXAMS ----------
  useEffect(() => {
    if (!formData.subject) return;
    // Reset examSet when subject changes
    setFormData((prev) => ({ ...prev, exam: "", examSet: "" }));
    setLoadingExams(true);
    const fetchExams = async () => {
      try {
        const res = await axios.get(
          `/api/exams/examList?subject=${formData.subject}`,
          config
        );
        setExamList(
          (res.data || []).map((e) => ({
            id: e._id,
            name: e.examName || e.title,
          }))
        );
      } catch (err) {
        setAlert({
          type: "error",
          message: err.response?.data?.message || "Failed to fetch exams",
        });
      } finally {
        setLoadingExams(false);
      }
    };
    fetchExams();
  }, [formData.subject]);

  // ---------- FETCH EXAM SETS ----------
  useEffect(() => {
    if (!formData.exam) return;
    // Reset examSet when exam changes
    setFormData((prev) => ({ ...prev, examSet: "" }));
    setLoadingExamSets(true);
    const fetchExamSets = async () => {
      try {
        const res = await axios.get(
          `/api/examSets/examSetList?exam=${formData.exam}`,
          config
        );
        setExamSetList(
          (res.data || []).map((s) => ({ id: s._id, name: s.setName }))
        );
      } catch (err) {
        setAlert({
          type: "error",
          message:
            err.response?.data?.message || "Failed to fetch exam sets",
        });
      } finally {
        setLoadingExamSets(false);
      }
    };
    fetchExamSets();
  }, [formData.exam]);
  // --- END OF API FETCHES ---


  // --- HANDLE INPUT CHANGES (Existing & Bulk) ---
  const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "numQuestions") {
      const num = Math.min(50, Math.max(1, parseInt(value) || 1));
      const newQuestions = Array.from({ length: num }, (_, i) =>
        formData.questions[i] || {
          questionText: "",
          options: ["", "", "", ""],
          correctAnswer: "",
          marks: 1,
        }
      );

      setFormData((prev) => ({
        ...prev,
        numQuestions: num,
        questions: newQuestions,
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData((prev) => ({ ...prev, questions: newQuestions }));
  };

  const handleOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[optIndex] = value;
    setFormData((prev) => ({ ...prev, questions: newQuestions }));
  };


  // --- EDITING HANDLERS (Enable Edit Mode) ---
  const startEdit = (question) => {
    // Set the question data to the editing state
    setEditingQuestion(question);
    // Clear any active bulk creation state (optional, but good UX)
    setFormData((prev) => ({ ...prev, numQuestions: 1, questions: [prev.questions[0]] }));
  };

  const cancelEdit = () => {
    setEditingQuestion(null);
    setAlert(null); // Clear update-related alerts on cancel
  };

  const handleUpdateChange = (e) => {
    const { name, value } = e.target;
    // Handle option array changes
    if (name.startsWith('options.')) {
      const index = parseInt(name.split('.')[1]);
      const newOptions = [...editingQuestion.options];
      newOptions[index] = value;
      setEditingQuestion((prev) => ({
        ...prev,
        options: newOptions,
      }));
    } else {
      // Handle other fields
      setEditingQuestion((prev) => ({
        ...prev,
        [name]: name === 'marks' ? Number(value) : value,
      }));
    }
  };

  // --- UPDATE API CALL (Fired by the Save button) ---
  const handleUpdate = async () => {
    if (!editingQuestion || !editingQuestion._id) return;
    
    // Simple client-side validation check
    const requiredFields = ['questionText', 'correctAnswer', 'marks'];
    if (requiredFields.some(field => !editingQuestion[field]) || editingQuestion.options.some(opt => !opt)) {
          return setAlert({ type: "error", message: "All fields must be filled out to update the question." });
    }

    setUpdateLoading(true);
    setAlert(null);

    try {
      // Construct the payload for a single question update
      const payload = {
        questionText: editingQuestion.questionText,
        options: editingQuestion.options,
        correctAnswer: editingQuestion.correctAnswer,
        marks: Number(editingQuestion.marks),
        examSet: editingQuestion.examSet, // Keep the examSet ID
      };

      // This is the PUT request handled by your router
      const res = await axios.put(
        `/api/questions/questionUpdate/${editingQuestion._id}`,
        payload,
        config
      );

      setAlert({
        type: "success",
        message: res.data?.message || `Question ${editingQuestion._id} updated successfully!`,
      });

      // Update the question in the existingQuestions list
      setExistingQuestions(prev => prev.map(q => 
        q._id === editingQuestion._id ? editingQuestion : q
      ));

      setEditingQuestion(null); // Exit editing mode

    } catch (err) {
      console.error(err);
      setAlert({
        type: "error",
        message:
          err.response?.data?.message || "Failed to update question",
      });
    } finally {
      setUpdateLoading(false);
    }
  };


  // --- SUBMIT (Existing Bulk Creation) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!formData.examSet)
      return setAlert({ type: "error", message: "Select an exam set" });
    
    // Check if any question field is empty before submitting
    const hasEmptyFields = formData.questions.some(q => 
        !q.questionText || q.options.some(opt => !opt) || !q.correctAnswer
    );
    if (hasEmptyFields) {
        return setAlert({ type: "error", message: "All question fields (text, options, and correct answer) must be filled out." });
    }

    setLoading(true);
    try {
      // The current submit logic is for bulk creation (POST)
      const payload = formData.questions.map((q) => ({
        examSet: formData.examSet,
        questionText: q.questionText,
        options: q.options,
        correctAnswer: q.correctAnswer,
        marks: Number(q.marks),
      }));

      const res = await axios.post("/api/questions/createQuestion", payload, config);
      setAlert({
        type: "success",
        message: res.data?.message || "Questions created successfully!",
      });

      // Update the existingQuestions list
      if (res.data?.questions) {
        const newQuestions = res.data.questions.map(q => ({
            ...q,
            options: q.options || ["", "", "", ""],
        }));
        setExistingQuestions(prev => [...newQuestions, ...prev]);
      } 
      
      // reset form for next batch
      setFormData((prev) => ({
        ...prev,
        numQuestions: 1,
        questions: [
          { questionText: "", options: ["", "", "", ""], correctAnswer: "", marks: 1 },
        ],
      }));

    } catch (err) {
      setAlert({
        type: "error",
        message:
          err.response?.data?.message || "Failed to create questions",
      });
    } finally {
      setLoading(false);
    }
  };

  // ---------- RENDER ----------
  return (
    <div className="w-full max-w-8xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow border">
        <h2 className="text-2xl font-bold mb-2">🧩 Create/Manage Exam Questions</h2>
        <p className="text-gray-600 mb-6">
          Select subject → exam → exam set to view/add questions.
        </p>

        {alert && <Alert type={alert.type} message={alert.message} />}

        {/* --- SELECTION FORM --- */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            {/* Subject */}
            <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                required
            >
                <option value="">-- Choose Subject --</option>
                {loadingSubjects ? (
                    <option disabled>Loading...</option>
                ) : (
                    subjectList.map((s) => (
                        <option key={s.id} value={s.id}>{s.name}</option>
                    ))
                )}
            </select>

            {/* Exam */}
            <select
                name="exam"
                value={formData.exam}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                disabled={!formData.subject}
                required
            >
                <option value="">-- Choose Exam --</option>
                {loadingExams ? (
                    <option disabled>Loading...</option>
                ) : (
                    examList.map((e) => (
                        <option key={e.id} value={e.id}>{e.name}</option>
                    ))
                )}
            </select>

            {/* Exam Set */}
            <select
                name="examSet"
                value={formData.examSet}
                onChange={handleChange}
                className="w-full border rounded-lg px-3 py-2"
                disabled={!formData.exam}
                required
            >
                <option value="">-- Choose Exam Set --</option>
                {loadingExamSets ? (
                    <option disabled>Loading...</option>
                ) : (
                    examSetList.map((set) => (
                        <option key={set.id} value={set.id}>{set.name}</option>
                    ))
                )}
            </select>
        </div>


        {/* --- ALREADY ADDED QUESTIONS LIST (MOVED TO TOP) --- */}
        {formData.examSet && (
            <div className="mt-12 pt-6 border-t-2 border-indigo-400">
                <h3 className="text-2xl font-bold text-indigo-700 mb-6 flex items-center gap-2">
                    ✅ Existing Questions ({existingQuestions.length})
                </h3>

                {questionsLoading && (
                    <p className="text-center text-gray-500 py-4">Loading existing questions...</p>
                )}

                {!questionsLoading && existingQuestions.length === 0 && (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-yellow-800">
                        No questions have been added to this exam set yet. Start adding them below!
                    </div>
                )}

                <div className="space-y-6">
                    {existingQuestions.map((q, i) => (
                        <QuestionRow
                            key={q._id || i} // Use _id for persistent key
                            // If this question is being edited, use the state copy (editingQuestion), otherwise use the list copy (q)
                            question={editingQuestion?._id === q._id ? editingQuestion : q}
                            index={i}
                            isEditing={editingQuestion?._id === q._id}
                            onStartEdit={startEdit}
                            onCancelEdit={cancelEdit}
                            onUpdateChange={handleUpdateChange}
                            onUpdateSubmit={handleUpdate}
                            updateLoading={updateLoading}
                        />
                    ))}
                </div>
            </div>
        )}

        {/* --- ADD NEW QUESTIONS FORM (MOVED TO BOTTOM) --- */}
        {formData.examSet && !editingQuestion && (
          <div className="mt-8 pt-6 border-t border-gray-200">
            <h3 className="text-xl font-bold mb-4">✍️ Add New Questions to Set: {examSetList.find(s => s.id === formData.examSet)?.name}</h3>
            <form onSubmit={handleSubmit} className="space-y-6">
                
                <FormInput
                    label="Number of Questions to Add"
                    name="numQuestions"
                    type="number"
                    min={1} 
                    max={50}
                    value={formData.numQuestions}
                    onChange={handleChange}
                    required
                />

                {/* Question Blocks */}
                {formData.questions.map((q, i) => (
                    <div key={i} className="border border-dashed p-4 rounded-lg space-y-2 bg-gray-50">
                        <h3 className="font-semibold text-lg">New Question {i + 1}</h3>
                        <FormInput
                            label="Question Text"
                            value={q.questionText}
                            onChange={(e) =>
                                handleQuestionChange(i, "questionText", e.target.value)
                            }
                            isTextArea={true}
                            required
                        />
                        {q.options.map((opt, idx) => (
                            <input
                                key={idx}
                                type="text"
                                value={opt}
                                onChange={(e) =>
                                    handleOptionChange(i, idx, e.target.value)
                                }
                                placeholder={`Option ${String.fromCharCode(65 + idx)}`}
                                className="w-full mb-2 px-3 py-2 border rounded-lg"
                                required
                            />
                        ))}
                        <div className="grid grid-cols-2 gap-4">
                            <FormInput
                                label="Correct Answer (Enter the option text)"
                                value={q.correctAnswer}
                                onChange={(e) =>
                                    handleQuestionChange(i, "correctAnswer", e.target.value)
                                }
                                required
                            />
                            <FormInput
                                label="Marks"
                                type="number"
                                min={1}
                                value={q.marks}
                                onChange={(e) =>
                                    handleQuestionChange(i, "marks", e.target.value)
                                }
                                required
                            />
                        </div>
                    </div>
                ))}

              <SubmitButton loading={loading} text="Create Questions" />
            </form>
          </div>
        )}
      </div>
    </div>
  );
}