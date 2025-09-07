

import { useState } from "react"
import { Code, Trophy, Clock, CheckCircle, Play, Star } from "lucide-react"

const PracticePage = () => {
  const [selectedDifficulty, setSelectedDifficulty] = useState("all")
  const [selectedLanguage, setSelectedLanguage] = useState("all")

  const problems = [
    {
      id: 1,
      title: "Two Sum Problem",
      difficulty: "Easy",
      language: "Multiple",
      timeLimit: "30 min",
      points: 100,
      solved: true,
      description: "Given an array of integers, return indices of two numbers that add up to a target.",
      tags: ["Array", "Hash Table"],
      submissions: 1250,
      acceptance: "85%",
    },
    {
      id: 2,
      title: "Binary Tree Traversal",
      difficulty: "Medium",
      language: "Java",
      timeLimit: "45 min",
      points: 200,
      solved: false,
      description: "Implement inorder, preorder, and postorder traversal of a binary tree.",
      tags: ["Tree", "Recursion"],
      submissions: 890,
      acceptance: "72%",
    },
    {
      id: 3,
      title: "Dynamic Programming - Fibonacci",
      difficulty: "Medium",
      language: "Python",
      timeLimit: "40 min",
      points: 250,
      solved: true,
      description: "Solve Fibonacci sequence using dynamic programming approach.",
      tags: ["Dynamic Programming", "Recursion"],
      submissions: 654,
      acceptance: "68%",
    },
    {
      id: 4,
      title: "Graph Shortest Path",
      difficulty: "Hard",
      language: "C++",
      timeLimit: "60 min",
      points: 400,
      solved: false,
      description: "Find shortest path between two nodes using Dijkstra's algorithm.",
      tags: ["Graph", "Algorithm"],
      submissions: 432,
      acceptance: "45%",
    },
    {
      id: 5,
      title: "String Manipulation",
      difficulty: "Easy",
      language: "JavaScript",
      timeLimit: "25 min",
      points: 150,
      solved: true,
      description: "Reverse words in a string while maintaining word order.",
      tags: ["String", "Array"],
      submissions: 987,
      acceptance: "78%",
    },
    {
      id: 6,
      title: "Database Query Optimization",
      difficulty: "Hard",
      language: "SQL",
      timeLimit: "50 min",
      points: 350,
      solved: false,
      description: "Optimize complex SQL queries for better performance.",
      tags: ["Database", "Optimization"],
      submissions: 234,
      acceptance: "52%",
    },
  ]

  const languages = ["all", "Java", "Python", "C++", "JavaScript", "SQL"]
  const difficulties = ["all", "Easy", "Medium", "Hard"]

  const filteredProblems = problems.filter((problem) => {
    const matchesDifficulty = selectedDifficulty === "all" || problem.difficulty === selectedDifficulty
    const matchesLanguage =
      selectedLanguage === "all" || problem.language === selectedLanguage || problem.language === "Multiple"
    return matchesDifficulty && matchesLanguage
  })

  const stats = {
    totalSolved: problems.filter((p) => p.solved).length,
    totalProblems: problems.length,
    totalPoints: problems.filter((p) => p.solved).reduce((sum, p) => sum + p.points, 0),
    streak: 7,
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-4">Code Practice Arena</h1>
          <p className="text-gray-600 text-lg">Sharpen your programming skills with coding challenges</p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalSolved}</p>
                <p className="text-sm text-gray-600">Problems Solved</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Code className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalProblems}</p>
                <p className="text-sm text-gray-600">Total Problems</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-full flex items-center justify-center">
                <Trophy className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.totalPoints}</p>
                <p className="text-sm text-gray-600">Points Earned</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{stats.streak}</p>
                <p className="text-sm text-gray-600">Day Streak</p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl p-6 mb-8 shadow-sm">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
              <select
                value={selectedDifficulty}
                onChange={(e) => setSelectedDifficulty(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {difficulties.map((difficulty) => (
                  <option key={difficulty} value={difficulty}>
                    {difficulty === "all" ? "All Difficulties" : difficulty}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
              <select
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {languages.map((language) => (
                  <option key={language} value={language}>
                    {language === "all" ? "All Languages" : language}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Problems List */}
        <div className="space-y-4">
          {filteredProblems.map((problem) => (
            <div
              key={problem.id}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
            >
              <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-xl font-bold text-gray-800">{problem.title}</h3>
                    {problem.solved && <CheckCircle className="w-5 h-5 text-green-600" />}
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        problem.difficulty === "Easy"
                          ? "bg-green-100 text-green-800"
                          : problem.difficulty === "Medium"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                      }`}
                    >
                      {problem.difficulty}
                    </span>
                  </div>

                  <p className="text-gray-600 mb-3">{problem.description}</p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    {problem.tags.map((tag) => (
                      <span key={tag} className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        {tag}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-500">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      {problem.timeLimit}
                    </div>
                    <div>Language: {problem.language}</div>
                    <div>{problem.submissions} submissions</div>
                    <div>Acceptance: {problem.acceptance}</div>
                  </div>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="text-right">
                    <p className="text-lg font-bold text-blue-600">{problem.points} pts</p>
                  </div>
                  <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors duration-200 flex items-center gap-2">
                    <Play className="w-4 h-4" />
                    {problem.solved ? "Solve Again" : "Start Coding"}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default PracticePage
