"use client"

import { useState } from "react"

const StudentTable = () => {
  const [students] = useState([
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.johnson@email.com",
      age: 20,
      grade: "A",
      major: "Computer Science",
      status: "Active",
      gpa: 3.8,
    },
    {
      id: 2,
      name: "Bob Smith",
      email: "bob.smith@email.com",
      age: 22,
      grade: "B+",
      major: "Mathematics",
      status: "Active",
      gpa: 3.5,
    },
    {
      id: 3,
      name: "Carol Davis",
      email: "carol.davis@email.com",
      age: 19,
      grade: "A-",
      major: "Physics",
      status: "Inactive",
      gpa: 3.7,
    },
    {
      id: 4,
      name: "David Wilson",
      email: "david.wilson@email.com",
      age: 21,
      grade: "B",
      major: "Chemistry",
      status: "Active",
      gpa: 3.2,
    },
    {
      id: 5,
      name: "Emma Brown",
      email: "emma.brown@email.com",
      age: 20,
      grade: "A+",
      major: "Biology",
      status: "Active",
      gpa: 4.0,
    },
    {
      id: 6,
      name: "Frank Miller",
      email: "frank.miller@email.com",
      age: 23,
      grade: "C+",
      major: "Engineering",
      status: "Active",
      gpa: 2.8,
    },
  ])

  const [sortField, setSortField] = useState("")
  const [sortDirection, setSortDirection] = useState("asc")

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc")
    } else {
      setSortField(field)
      setSortDirection("asc")
    }
  }

  const sortedStudents = [...students].sort((a, b) => {
    if (!sortField) return 0

    const aValue = a[sortField]
    const bValue = b[sortField]

    if (typeof aValue === "string") {
      return sortDirection === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue)
    }

    return sortDirection === "asc" ? aValue - bValue : bValue - aValue
  })

  const getStatusBadge = (status) => {
    return status === "Active" ? "bg-accent text-accent-foreground" : "bg-muted text-muted-foreground"
  }

  const getSortIcon = (field) => {
    if (sortField !== field) return "↕️"
    return sortDirection === "asc" ? "↑" : "↓"
  }

  return (
    <div className="p-6 bg-background min-h-screen">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-foreground mb-2">Student Details</h1>
          <p className="text-muted-foreground">Manage and view student information</p>
        </div>

        <div className="bg-card rounded-lg border border-border shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th
                    className="px-4 py-4 text-left text-sm font-semibold text-card-foreground cursor-pointer hover:bg-secondary transition-colors"
                    onClick={() => handleSort("id")}
                  >
                    ID {getSortIcon("id")}
                  </th>
                  <th
                    className="px-4 py-4 text-left text-sm font-semibold text-card-foreground cursor-pointer hover:bg-secondary transition-colors"
                    onClick={() => handleSort("name")}
                  >
                    Name {getSortIcon("name")}
                  </th>
                  <th
                    className="px-4 py-4 text-left text-sm font-semibold text-card-foreground cursor-pointer hover:bg-secondary transition-colors"
                    onClick={() => handleSort("email")}
                  >
                    Email {getSortIcon("email")}
                  </th>
                  <th
                    className="px-4 py-4 text-left text-sm font-semibold text-card-foreground cursor-pointer hover:bg-secondary transition-colors"
                    onClick={() => handleSort("age")}
                  >
                    Age {getSortIcon("age")}
                  </th>
                  <th
                    className="px-4 py-4 text-left text-sm font-semibold text-card-foreground cursor-pointer hover:bg-secondary transition-colors"
                    onClick={() => handleSort("major")}
                  >
                    Major {getSortIcon("major")}
                  </th>
                  <th
                    className="px-4 py-4 text-left text-sm font-semibold text-card-foreground cursor-pointer hover:bg-secondary transition-colors"
                    onClick={() => handleSort("grade")}
                  >
                    Grade {getSortIcon("grade")}
                  </th>
                  <th
                    className="px-4 py-4 text-left text-sm font-semibold text-card-foreground cursor-pointer hover:bg-secondary transition-colors"
                    onClick={() => handleSort("gpa")}
                  >
                    GPA {getSortIcon("gpa")}
                  </th>
                  <th
                    className="px-4 py-4 text-left text-sm font-semibold text-card-foreground cursor-pointer hover:bg-secondary transition-colors"
                    onClick={() => handleSort("status")}
                  >
                    Status {getSortIcon("status")}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {sortedStudents.map((student, index) => (
                  <tr
                    key={student.id}
                    className={`hover:bg-primary/5 transition-colors ${index % 2 === 0 ? "bg-background" : "bg-card"}`}
                  >
                    <td className="px-4 py-4 text-sm text-foreground font-medium">{student.id}</td>
                    <td className="px-4 py-4 text-sm text-foreground font-medium">{student.name}</td>
                    <td className="px-4 py-4 text-sm text-muted-foreground">{student.email}</td>
                    <td className="px-4 py-4 text-sm text-foreground">{student.age}</td>
                    <td className="px-4 py-4 text-sm text-foreground">{student.major}</td>
                    <td className="px-4 py-4 text-sm text-foreground font-medium">{student.grade}</td>
                    <td className="px-4 py-4 text-sm text-foreground font-medium">{student.gpa}</td>
                    <td className="px-4 py-4 text-sm">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadge(student.status)}`}
                      >
                        {student.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="mt-4 text-sm text-muted-foreground">Showing {students.length} students</div>
      </div>
    </div>
  )
}

export default StudentTable
