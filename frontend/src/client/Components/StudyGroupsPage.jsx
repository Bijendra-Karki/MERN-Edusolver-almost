

import { useState } from "react"
import { Users, Calendar, Clock, MapPin, MessageCircle, UserPlus, Search } from "lucide-react"

const StudyGroupsPage = () => {
  const [selectedSubject, setSelectedSubject] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const studyGroups = [
    {
      id: 1,
      name: "Data Structures Study Circle",
      subject: "Data Structures",
      description: "Weekly study sessions focusing on algorithms, trees, graphs, and problem-solving techniques.",
      members: 12,
      maxMembers: 15,
      meetingTime: "Saturdays 2:00 PM",
      location: "Library Room 201",
      nextMeeting: "2024-02-17",
      organizer: "Alice Johnson",
      semester: "4th",
      isJoined: false,
      tags: ["Algorithms", "Problem Solving", "Coding"],
    },
    {
      id: 2,
      name: "Web Development Bootcamp",
      subject: "Web Technology",
      description: "Hands-on sessions covering HTML, CSS, JavaScript, React, and full-stack development projects.",
      members: 8,
      maxMembers: 12,
      meetingTime: "Wednesdays 4:00 PM",
      location: "Computer Lab 3",
      nextMeeting: "2024-02-14",
      organizer: "Bob Smith",
      semester: "5th",
      isJoined: true,
      tags: ["Frontend", "Backend", "Projects"],
    },
    {
      id: 3,
      name: "Database Design Masters",
      subject: "Database Management",
      description: "Deep dive into database design, SQL optimization, and real-world database projects.",
      members: 10,
      maxMembers: 10,
      meetingTime: "Fridays 3:00 PM",
      location: "Online (Zoom)",
      nextMeeting: "2024-02-16",
      organizer: "Carol Davis",
      semester: "6th",
      isJoined: false,
      tags: ["SQL", "Design", "Optimization"],
    },
    {
      id: 4,
      name: "Machine Learning Enthusiasts",
      subject: "Artificial Intelligence",
      description: "Explore ML algorithms, work on projects, and discuss latest trends in AI and machine learning.",
      members: 15,
      maxMembers: 20,
      meetingTime: "Sundays 10:00 AM",
      location: "AI Lab",
      nextMeeting: "2024-02-18",
      organizer: "David Wilson",
      semester: "7th",
      isJoined: true,
      tags: ["ML", "AI", "Python", "Projects"],
    },
    {
      id: 5,
      name: "Network Security Squad",
      subject: "Computer Networks",
      description: "Study network protocols, security concepts, and hands-on cybersecurity exercises.",
      members: 6,
      maxMembers: 10,
      meetingTime: "Tuesdays 5:00 PM",
      location: "Network Lab",
      nextMeeting: "2024-02-13",
      organizer: "Eva Martinez",
      semester: "6th",
      isJoined: false,
      tags: ["Security", "Networking", "Protocols"],
    },
    {
      id: 6,
      name: "Software Engineering Pros",
      subject: "Software Engineering",
      description: "Focus on software development methodologies, project management, and team collaboration.",
      members: 9,
      maxMembers: 12,
      meetingTime: "Thursdays 6:00 PM",
      location: "Conference Room A",
      nextMeeting: "2024-02-15",
      organizer: "Frank Brown",
      semester: "7th",
      isJoined: false,
      tags: ["SDLC", "Agile", "Team Work"],
    },
  ]

  const subjects = ["all", ...new Set(studyGroups.map((g) => g.subject))]

  const filteredGroups = studyGroups.filter((group) => {
    const matchesSubject = selectedSubject === "all" || group.subject === selectedSubject
    const matchesSearch =
      group.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      group.organizer.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesSubject && matchesSearch
  })

  const getDaysUntilMeeting = (meetingDate) => {
    const today = new Date()
    const meeting = new Date(meetingDate)
    const diffTime = meeting - today
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Study Groups</h1>
          <p className="text-gray-600 text-lg">Join study groups and collaborate with your classmates</p>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search study groups..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="lg:w-64">
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

        {/* Study Groups Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredGroups.map((group) => {
            const daysUntilMeeting = getDaysUntilMeeting(group.nextMeeting)
            const isFull = group.members >= group.maxMembers

            return (
              <div
                key={group.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{group.name}</h3>
                    <p className="text-blue-600 font-medium text-sm mb-2">{group.subject}</p>
                    <p className="text-gray-600 text-sm mb-4">{group.description}</p>
                  </div>
                  {group.isJoined && (
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">Joined</span>
                  )}
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {group.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="w-4 h-4 mr-2 text-gray-400" />
                    <span>
                      {group.members}/{group.maxMembers} members
                    </span>
                    {isFull && <span className="ml-2 text-red-600 font-medium">(Full)</span>}
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Clock className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{group.meetingTime}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                    <span>{group.location}</span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <Calendar className="w-4 h-4 mr-2 text-gray-400" />
                    <span>Next meeting: {new Date(group.nextMeeting).toLocaleDateString()}</span>
                    <span
                      className={`ml-2 font-medium ${
                        daysUntilMeeting === 0
                          ? "text-red-600"
                          : daysUntilMeeting <= 2
                            ? "text-orange-600"
                            : "text-green-600"
                      }`}
                    >
                      (
                      {daysUntilMeeting === 0
                        ? "Today"
                        : daysUntilMeeting === 1
                          ? "Tomorrow"
                          : `${daysUntilMeeting} days`}
                      )
                    </span>
                  </div>

                  <div className="flex items-center text-sm text-gray-600">
                    <span className="font-medium">Organizer:</span>
                    <span className="ml-1">
                      {group.organizer} ({group.semester} Semester)
                    </span>
                  </div>
                </div>

                <div className="flex gap-3">
                  {group.isJoined ? (
                    <>
                      <button className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2">
                        <MessageCircle className="w-4 h-4" />
                        Chat
                      </button>
                      <button className="px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200">
                        Leave
                      </button>
                    </>
                  ) : (
                    <button
                      disabled={isFull}
                      className={`flex-1 py-2 px-4 rounded-lg transition-colors duration-200 flex items-center justify-center gap-2 ${
                        isFull
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-blue-600 text-white hover:bg-blue-700"
                      }`}
                    >
                      <UserPlus className="w-4 h-4" />
                      {isFull ? "Group Full" : "Join Group"}
                    </button>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No study groups found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}

        {/* Create New Group Button */}
        <div className="fixed bottom-6 right-6">
          <button className="bg-blue-600 text-white p-4 rounded-full shadow-lg hover:bg-blue-700 transition-colors duration-200 hover:shadow-xl">
            <UserPlus className="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>
  )
}

export default StudyGroupsPage
