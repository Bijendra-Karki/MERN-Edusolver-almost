

import { useState } from "react"
import { FileText, Download, Eye, BookOpen, Video, FileCode, Search } from "lucide-react"

const MaterialsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [searchTerm, setSearchTerm] = useState("")

  const materials = [
    {
      id: 1,
      title: "Data Structures and Algorithms - Complete Notes",
      type: "PDF",
      category: "programming",
      subject: "Data Structures",
      semester: "3rd",
      size: "2.5 MB",
      downloads: 1250,
      uploadDate: "2024-01-15",
      description: "Comprehensive notes covering arrays, linked lists, trees, graphs, and sorting algorithms.",
      author: "Dr. Smith Johnson",
      icon: FileText,
    },
    {
      id: 2,
      title: "Object Oriented Programming in Java",
      type: "Video",
      category: "programming",
      subject: "OOP",
      semester: "2nd",
      size: "450 MB",
      downloads: 890,
      uploadDate: "2024-01-20",
      description: "Video lectures on OOP concepts, inheritance, polymorphism, and design patterns.",
      author: "Prof. Sarah Wilson",
      icon: Video,
    },
    {
      id: 3,
      title: "Database Management System Lab Manual",
      type: "PDF",
      category: "database",
      subject: "DBMS",
      semester: "4th",
      size: "1.8 MB",
      downloads: 654,
      uploadDate: "2024-01-10",
      description: "Practical exercises and lab assignments for database design and SQL queries.",
      author: "Dr. Emily Chen",
      icon: FileText,
    },
    {
      id: 4,
      title: "Web Development Project Templates",
      type: "Code",
      category: "web-dev",
      subject: "Web Technology",
      semester: "5th",
      size: "15 MB",
      downloads: 432,
      uploadDate: "2024-01-25",
      description: "HTML, CSS, JavaScript templates and React project starters.",
      author: "John Martinez",
      icon: FileCode,
    },
    {
      id: 5,
      title: "Computer Networks - Protocol Analysis",
      type: "PDF",
      category: "networking",
      subject: "Computer Networks",
      semester: "6th",
      size: "3.2 MB",
      downloads: 321,
      uploadDate: "2024-01-18",
      description: "Detailed analysis of TCP/IP, HTTP, and other network protocols.",
      author: "Prof. Michael Brown",
      icon: FileText,
    },
    {
      id: 6,
      title: "Software Engineering Case Studies",
      type: "PDF",
      category: "software-eng",
      subject: "Software Engineering",
      semester: "7th",
      size: "4.1 MB",
      downloads: 567,
      uploadDate: "2024-01-12",
      description: "Real-world case studies and project management methodologies.",
      author: "Lisa Anderson",
      icon: FileText,
    },
  ]

  const categories = [
    { id: "all", name: "All Categories" },
    { id: "programming", name: "Programming" },
    { id: "database", name: "Database" },
    { id: "web-dev", name: "Web Development" },
    { id: "networking", name: "Networking" },
    { id: "software-eng", name: "Software Engineering" },
  ]

  const types = [
    { id: "all", name: "All Types" },
    { id: "PDF", name: "PDF Documents" },
    { id: "Video", name: "Video Lectures" },
    { id: "Code", name: "Code Files" },
  ]

  const filteredMaterials = materials.filter((material) => {
    const matchesCategory = selectedCategory === "all" || material.category === selectedCategory
    const matchesType = selectedType === "all" || material.type === selectedType
    const matchesSearch =
      material.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      material.author.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesType && matchesSearch
  })

  const getTypeIcon = (type) => {
    switch (type) {
      case "PDF":
        return FileText
      case "Video":
        return Video
      case "Code":
        return FileCode
      default:
        return FileText
    }
  }

  const getTypeColor = (type) => {
    switch (type) {
      case "PDF":
        return "bg-red-100 text-red-800"
      case "Video":
        return "bg-purple-100 text-purple-800"
      case "Code":
        return "bg-green-100 text-green-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Study Materials</h1>
          <p className="text-gray-600 text-lg">
            Access comprehensive study materials, notes, and resources for CSIT courses
          </p>
        </div>

        {/* Search and Filters */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col lg:flex-row gap-4 mb-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search materials, subjects, or authors..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
              <select
                value={selectedType}
                onChange={(e) => setSelectedType(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {types.map((type) => (
                  <option key={type.id} value={type.id}>
                    {type.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Materials Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredMaterials.map((material) => {
            const IconComponent = getTypeIcon(material.type)
            return (
              <div
                key={material.id}
                className="bg-white rounded-xl p-6 shadow-sm hover:shadow-lg transition-all duration-300"
              >
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                    <IconComponent className="w-6 h-6 text-blue-600" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="text-lg font-bold text-gray-800 truncate">{material.title}</h3>
                      <span className={`px-2 py-1 rounded text-xs font-medium ${getTypeColor(material.type)}`}>
                        {material.type}
                      </span>
                    </div>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">{material.description}</p>

                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 mb-4">
                      <div>
                        <span className="font-medium">Subject:</span> {material.subject}
                      </div>
                      <div>
                        <span className="font-medium">Semester:</span> {material.semester}
                      </div>
                      <div>
                        <span className="font-medium">Author:</span> {material.author}
                      </div>
                      <div>
                        <span className="font-medium">Size:</span> {material.size}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm text-gray-500">
                        {material.downloads} downloads • {new Date(material.uploadDate).toLocaleDateString()}
                      </div>
                      <div className="flex gap-2">
                        <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors duration-200">
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors duration-200">
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {filteredMaterials.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No materials found</h3>
            <p className="text-gray-500">Try adjusting your search or filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default MaterialsPage
