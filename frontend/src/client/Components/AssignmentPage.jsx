
import { useState } from "react"
import { Clock, CheckCircle, AlertCircle, FileText, Upload, Eye } from "lucide-react"

const AssignmentsPage = () => {
  const [selectedStatus, setSelectedStatus] = useState("all")
  const [selectedSubject, setSelectedSubject] = useState("all")

  const assignments = [
    {
      id: 1,
      title: "Data Structures Implementation",
      subject: "Data Structures",
      dueDate: "2024-02-15",
      submittedDate: "2024-02-14",
      status: "submitted",
      grade: "A",
      totalMarks: 100,
      obtainedMarks: 92,
      description: "Implement stack, queue, and binary tree data structures in Java.",
      attachments: ["assignment1.pdf", "code_files.zip"],
      feedback: "Excellent implementation with proper documentation.",
    },
    {
      id: 2,
      title: "Database Design Project",
      subject: "Database Management",
      dueDate: "2024-02-20",
      submittedDate: null,
      status: "pending",
      grade: null,
      totalMarks: 150,
      obtainedMarks: null,
      description: "Design and implement a complete database system for a library management system.",
      attachments: ["requirements.pdf"],
      feedback: null,
    },
    {
      id: 3,
      title: "Web Application Development",
      subject: "Web Technology",
      dueDate: "2024-02-10",
      submittedDate: "2024-02-12",
      status: "late",
      grade: "B+",
      totalMarks: 120,
      obtainedMarks: 98,
      description: "Create a responsive web application using HTML, CSS, JavaScript, and a backend framework.",
      attachments: ["webapp.zip", "documentation.pdf"],
      feedback: "Good work but submitted late. Deducted 5 marks for late submission.",
    },
    {
      id: 4,
      title: "Algorithm Analysis Report",
      subject: "Algorithm Analysis",
      dueDate: "2024-02-25",
      submittedDate: null,
      status: "upcoming",
      grade: null,
      totalMarks: 80,
      obtainedMarks: null,
      description: "Analyze time and space complexity of various sorting algorithms.",
      attachments: ["template.docx"],
      feedback: null,
    },
    {
      id: 5,
      title: "Network Security Assessment",
      subject: "Computer Networks",
      dueDate: "2024-02-05",
      submittedDate: null,
      status: "overdue",
      grade: null,
      totalMarks: 100,
      obtainedMarks: null,
      description: "Conduct a security assessment of a given network infrastructure.",
      attachments: ["guidelines.pdf"],
      feedback: null,
    },
    {
      id: 6,
      title: "Software Testing Plan",
      subject: "Software Engineering",
      dueDate: "2024-03-01",
      submittedDate: null,
      status: "upcoming",
      grade: null,
      totalMarks: 90,
      obtainedMarks: null,
      description: "Develop a comprehensive testing plan for a software project.",
      attachments: ["sample_plan.pdf"],
      feedback: null,
    },
  ]

  const subjects = ["all", ...new Set(assignments.map((a) => a.subject))]
  const statuses = [
    { id: "all", name: "All Assignments" },
    { id: "upcoming", name: "Upcoming" },
    { id: "pending", name: "Pending" },
    { id: "submitted", name: "Submitted" },
    { id: "late", name: "Late Submitted" },
    { id: "overdue", name: "Overdue" },
  ]

  const filteredAssignments = assignments.filter((assignment) => {
    const matchesStatus = selectedStatus === "all" || assignment.status === selectedStatus
    const matchesSubject = selectedSubject === "all" || assignment.subject === selectedSubject
    return matchesStatus && matchesSubject
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "submitted":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "late":
        return "bg-orange-100 text-orange-800"
      case "overdue":
        return "bg-red-100 text-red-800"
      case "upcoming":
        return "bg-blue-100 text-blue-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "submitted":
        return CheckCircle
      case "overdue":
        return AlertCircle
      default:
        return Clock
    }
  }

  const getDaysUntilDue = (dueDate) => {
    const today = new Date()
    const due = new Date(dueDate)
    const diffTime = due - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const stats = {
    total: assignments.length,
    submitted: assignments.filter((a) => a.status === "submitted").length,
    pending: assignments.filter((a) => a.status === "pending" || a.status === "upcoming").length,
    overdue: assignments.filter((a) => a.status === "overdue").length,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Assignment Tracker</h1>
          <p className="text-gray-600 text-lg">Track your assignments, deadlines, and submissions</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                <p className="text-sm text-gray-600">Total Assignments</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.submitted}</p>
                <p className="text-sm text-gray-600">Submitted</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Clock className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.pending}</p>
                <p className="text-sm text-gray-600">Pending</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.overdue}</p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {statuses.map((status) => (
                  <option key={status.id} value={status.id}>
                    {status.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Subject</label>
              <select
                value={selectedSubject}
                onChange={(e) => setSelectedSubject(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {subjects.map((subject) => (
                  <option key={subject} value={subject}>
                    {subject === "all" ? "All Subjects" : subject}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Assignments List */}
        <div className="space-y-4">
          {filteredAssignments.map((assignment) => {
            const StatusIcon = getStatusIcon(assignment.status)
            const daysUntilDue = getDaysUntilDue(assignment.dueDate)

            return (
              <div
                key={assignment.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-800">{assignment.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(assignment.status)}`}>
                        {assignment.status.charAt(0).toUpperCase() + assignment.status.slice(1)}
                      </span>
                      {assignment.grade && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
                          Grade: {assignment.grade}
                        </span>
                      )}
                    </div>

                    <p className="text-gray-600 mb-3">{assignment.description}</p>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-sm text-gray-500 mb-4">
                      <div>
                        <span className="font-medium">Subject:</span> {assignment.subject}
                      </div>
                      <div>
                        <span className="font-medium">Due Date:</span>{" "}
                        {new Date(assignment.dueDate).toLocaleDateString()}
                      </div>
                      <div>
                        <span className="font-medium">Total Marks:</span> {assignment.totalMarks}
                      </div>
                      {assignment.obtainedMarks && (
                        <div>
                          <span className="font-medium">Obtained:</span> {assignment.obtainedMarks}/
                          {assignment.totalMarks}
                        </div>
                      )}
                    </div>

                    {assignment.status === "upcoming" || assignment.status === "pending" ? (
                      <div
                        className={`text-sm font-medium ${
                          daysUntilDue < 0 ? "text-red-600" : daysUntilDue <= 3 ? "text-orange-600" : "text-green-600"
                        }`}
                      >
                        {daysUntilDue < 0
                          ? `${Math.abs(daysUntilDue)} days overdue`
                          : daysUntilDue === 0
                            ? "Due today"
                            : `${daysUntilDue} days remaining`}
                      </div>
                    ) : (
                      assignment.submittedDate && (
                        <div className="text-sm text-gray-500">
                          Submitted on: {new Date(assignment.submittedDate).toLocaleDateString()}
                        </div>
                      )
                    )}

                    {assignment.feedback && (
                      <div className="mt-3 p-3 bg-blue-50 rounded-lg">
                        <p className="text-sm text-blue-800">
                          <strong>Feedback:</strong> {assignment.feedback}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex flex-col gap-2">
                    {assignment.status === "pending" || assignment.status === "upcoming" ? (
                      <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                        <Upload className="w-4 h-4" />
                        Submit
                      </button>
                    ) : (
                      <button className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors duration-200 flex items-center gap-2">
                        <Eye className="w-4 h-4" />
                        View Submission
                      </button>
                    )}

                    {assignment.attachments.length > 0 && (
                      <div className="text-xs text-gray-500">{assignment.attachments.length} attachment(s)</div>
                    )}
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredAssignments.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No assignments found</h3>
            <p className="text-gray-500">Try adjusting your filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default AssignmentsPage
