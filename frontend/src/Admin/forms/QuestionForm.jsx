"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { AlertCircle, CheckCircle } from "lucide-react";
import { getToken } from "../../components/utils/authHelper";

// ---------- ALERT ----------
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
}) => (
  <div>
    <label className="block text-sm font-semibold text-gray-700 mb-2">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
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
    />
  </div>
);

// ---------- SUBMIT BUTTON ----------
const SubmitButton = ({ loading, text }) => (
  <button
    type="submit"
    disabled={loading}
    className={`w-full py-3 px-4 font-semibold rounded-lg shadow-sm ${
      loading
        ? "bg-gray-400 cursor-not-allowed"
        : "bg-indigo-600 hover:bg-indigo-700 text-white"
    }`}
  >
    {loading ? "Processing..." : text}
  </button>
);

// ---------- MAIN COMPONENT ----------
export default function QuestionForm() {
  const [formData, setFormData] = useState({
    subject: "",
    exam: "",
    examSet: "",
    numQuestions: 45,
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

  const token = getToken();
  const config = {
    headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
  };

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

  // ---------- HANDLE INPUT CHANGES ----------
  const handleChange = (e) => {
    const { name, value } = e.target;

    // handle number of questions dynamically
    if (name === "numQuestions") {
      const num = Math.min(50, Math.max(1, parseInt(value) || 1)); // between 1 and 50
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

    // general field handler
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ---------- HANDLE QUESTION FIELD ----------
  const handleQuestionChange = (index, field, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[index][field] = value;
    setFormData((prev) => ({ ...prev, questions: newQuestions }));
  };

  // ---------- HANDLE OPTION FIELD ----------
  const handleOptionChange = (qIndex, optIndex, value) => {
    const newQuestions = [...formData.questions];
    newQuestions[qIndex].options[optIndex] = value;
    setFormData((prev) => ({ ...prev, questions: newQuestions }));
  };

  // ---------- SUBMIT ----------
  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert(null);

    if (!formData.examSet)
      return setAlert({ type: "error", message: "Select an exam set" });

    setLoading(true);
    try {
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

      // reset form
      setFormData({
        subject: "",
        exam: "",
        examSet: "",
        numQuestions: 1,
        questions: [
          { questionText: "", options: ["", "", "", ""], correctAnswer: "", marks: 1 },
        ],
      });
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
    <div className="w-full max-w-5xl mx-auto">
      <div className="bg-white p-8 rounded-xl shadow border">
        <h2 className="text-2xl font-bold mb-2">🧩 Create Multiple Questions</h2>
        <p className="text-gray-600 mb-6">
          Select subject → exam → exam set → number of questions → fill each question
        </p>

        {alert && <Alert type={alert.type} message={alert.message} />}

        <form onSubmit={handleSubmit} className="space-y-6 mt-6">
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
              <option>Loading...</option>
            ) : (
              subjectList.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.name}
                </option>
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
              <option>Loading...</option>
            ) : (
              examList.map((e) => (
                <option key={e.id} value={e.id}>
                  {e.name}
                </option>
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
              <option>Loading...</option>
            ) : (
              examSetList.map((set) => (
                <option key={set.id} value={set.id}>
                  {set.name}
                </option>
              ))
            )}
          </select>

          {/* Number of Questions */}
          <FormInput
            label="Number of Questions"
            name="numQuestions"
            type="number"
            min={45}
            max={50}
            value={formData.numQuestions}
            onChange={handleChange}
            required
          />

          {/* Question Blocks */}
          {formData.questions.map((q, i) => (
            <div key={i} className="border p-4 rounded-lg space-y-2">
              <h3 className="font-semibold text-lg">Question {i + 1}</h3>
              <FormInput
                label="Question Text"
                value={q.questionText}
                onChange={(e) =>
                  handleQuestionChange(i, "questionText", e.target.value)
                }
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
              <FormInput
                label="Correct Answer"
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
          ))}

          <SubmitButton loading={loading} text="Create Questions" />
        </form>
      </div>
    </div>
  );
}
