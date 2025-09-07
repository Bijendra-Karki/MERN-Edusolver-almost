
import { useState } from "react"
import { Code, Star, Eye, Calendar, User, Tag, ExternalLink, Github } from "lucide-react"

const ProjectsPage = () => {
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedTech, setSelectedTech] = useState("all")

  const projects = [
    {
      id: 1,
      title: "E-Commerce Web Application",
      author: "John Doe",
      semester: "6th",
      category: "web-dev",
      technologies: ["React", "Node.js", "MongoDB"],
      description:
        "A full-stack e-commerce platform with user authentication, product catalog, shopping cart, and payment integration.",
      image: "/placeholder.svg?height=200&width=300",
      stars: 45,
      views: 1250,
      createdDate: "2024-01-15",
      githubUrl: "https://github.com/johndoe/ecommerce-app",
      liveUrl: "https://ecommerce-demo.netlify.app",
      tags: ["Full Stack", "E-commerce", "MERN"],
    },
    {
      id: 2,
      title: "Student Management System",
      author: "Sarah Wilson",
      semester: "5th",
      category: "desktop",
      technologies: ["Java", "MySQL", "Swing"],
      description: "Desktop application for managing student records, grades, and attendance with a user-friendly GUI.",
      image: "/placeholder.svg?height=200&width=300",
      stars: 32,
      views: 890,
      createdDate: "2024-01-20",
      githubUrl: "https://github.com/sarahwilson/student-management",
      liveUrl: null,
      tags: ["Desktop App", "Database", "GUI"],
    },
    {
      id: 3,
      title: "Machine Learning Price Predictor",
      author: "Mike Chen",
      semester: "7th",
      category: "ml",
      technologies: ["Python", "Scikit-learn", "Pandas"],
      description: "ML model to predict house prices using various features with data visualization and analysis.",
      image: "/placeholder.svg?height=200&width=300",
      stars: 67,
      views: 1456,
      createdDate: "2024-01-10",
      githubUrl: "https://github.com/mikechen/price-predictor",
      liveUrl: "https://price-predictor-ml.herokuapp.com",
      tags: ["Machine Learning", "Data Science", "Python"],
    },
    {
      id: 4,
      title: "Mobile Task Manager",
      author: "Emily Rodriguez",
      semester: "6th",
      category: "mobile",
      technologies: ["React Native", "Firebase"],
      description: "Cross-platform mobile app for task management with real-time synchronization and offline support.",
      image: "/placeholder.svg?height=200&width=300",
      stars: 28,
      views: 654,
      createdDate: "2024-01-25",
      githubUrl: "https://github.com/emilyrodriguez/task-manager",
      liveUrl: null,
      tags: ["Mobile App", "Cross Platform", "Firebase"],
    },
    {
      id: 5,
      title: "Network Security Scanner",
      author: "David Kim",
      semester: "8th",
      category: "security",
      technologies: ["Python", "Nmap", "Tkinter"],
      description:
        "Network vulnerability scanner with GUI interface for detecting security issues and generating reports.",
      image: "/placeholder.svg?height=200&width=300",
      stars: 41,
      views: 987,
      createdDate: "2024-01-18",
      githubUrl: "https://github.com/davidkim/network-scanner",
      liveUrl: null,
      tags: ["Security", "Networking", "Python"],
    },
    {
      id: 6,
      title: "Blockchain Voting System",
      author: "Lisa Park",
      semester: "8th",
      category: "blockchain",
      technologies: ["Solidity", "Web3.js", "React"],
      description: "Decentralized voting application using blockchain technology for transparent and secure elections.",
      image: "/placeholder.svg?height=200&width=300",
      stars: 89,
      views: 2134,
      createdDate: "2024-01-12",
      githubUrl: "https://github.com/lisapark/blockchain-voting",
      liveUrl: "https://blockchain-voting-demo.vercel.app",
      tags: ["Blockchain", "Smart Contracts", "DApp"],
    },
  ]

  const categories = [
    { id: "all", name: "All Projects" },
    { id: "web-dev", name: "Web Development" },
    { id: "mobile", name: "Mobile Apps" },
    { id: "desktop", name: "Desktop Apps" },
    { id: "ml", name: "Machine Learning" },
    { id: "security", name: "Security" },
    { id: "blockchain", name: "Blockchain" },
  ]

  const technologies = ["all", "React", "Node.js", "Python", "Java", "React Native", "MongoDB", "MySQL"]

  const filteredProjects = projects.filter((project) => {
    const matchesCategory = selectedCategory === "all" || project.category === selectedCategory
    const matchesTech = selectedTech === "all" || project.technologies.includes(selectedTech)
    return matchesCategory && matchesTech
  })

  const getCategoryColor = (category) => {
    const colors = {
      "web-dev": "bg-blue-100 text-blue-800",
      mobile: "bg-green-100 text-green-800",
      desktop: "bg-purple-100 text-purple-800",
      ml: "bg-orange-100 text-orange-800",
      security: "bg-red-100 text-red-800",
      blockchain: "bg-yellow-100 text-yellow-800",
    }
    return colors[category] || "bg-gray-100 text-gray-800"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Project Showcase</h1>
          <p className="text-gray-600 text-lg">Explore amazing projects created by CSIT students</p>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
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
              <label className="block text-sm font-medium text-gray-700 mb-2">Technology</label>
              <select
                value={selectedTech}
                onChange={(e) => setSelectedTech(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {technologies.map((tech) => (
                  <option key={tech} value={tech}>
                    {tech === "all" ? "All Technologies" : tech}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden"
            >
              <img src={project.image || "/placeholder.svg"} alt={project.title} className="w-full h-48 object-cover" />
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className={`px-2 py-1 rounded text-xs font-medium ${getCategoryColor(project.category)}`}>
                    {categories.find((c) => c.id === project.category)?.name}
                  </span>
                  <span className="text-sm text-gray-500">{project.semester} Semester</span>
                </div>

                <h3 className="text-xl font-bold text-gray-800 mb-2">{project.title}</h3>
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">{project.description}</p>

                <div className="flex items-center text-sm text-gray-500 mb-4">
                  <User className="w-4 h-4 mr-1" />
                  <span className="mr-4">By {project.author}</span>
                  <Calendar className="w-4 h-4 mr-1" />
                  <span>{new Date(project.createdDate).toLocaleDateString()}</span>
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.technologies.map((tech) => (
                    <span key={tech} className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                      {tech}
                    </span>
                  ))}
                </div>

                <div className="flex flex-wrap gap-1 mb-4">
                  {project.tags.map((tag) => (
                    <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded flex items-center">
                      <Tag className="w-3 h-3 mr-1" />
                      {tag}
                    </span>
                  ))}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                  <div className="flex items-center">
                    <Star className="w-4 h-4 mr-1 text-yellow-500" />
                    {project.stars}
                  </div>
                  <div className="flex items-center">
                    <Eye className="w-4 h-4 mr-1" />
                    {project.views} views
                  </div>
                </div>

                <div className="flex gap-2">
                  <a
                    href={project.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-gray-800 text-white py-2 px-3 rounded-lg hover:bg-gray-900 transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                  >
                    <Github className="w-4 h-4" />
                    Code
                  </a>
                  {project.liveUrl && (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2 text-sm"
                    >
                      <ExternalLink className="w-4 h-4" />
                      Live Demo
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProjects.length === 0 && (
          <div className="text-center py-12">
            <Code className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-600 mb-2">No projects found</h3>
            <p className="text-gray-500">Try adjusting your filter criteria</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProjectsPage
