"use client"

import { useState } from "react"


import { BookOpen, Settings, HelpCircle } from "lucide-react"
import AddExam from "../forms/AddExam"

import ExamSetForm from "../forms/ExamSetForm"
import QuestionForm from "../forms/QuestionForm"


export default function Exampage() {
  const [activeTab, setActiveTab] = useState("create")

  const tabs = [
    { id: "create", name: "Add New Exam", component: AddExam, icon: BookOpen },
    { id: "set", name: "Create SET for Exam", component: ExamSetForm, icon: Settings },
    { id: "question", name: "Add Question", component: QuestionForm, icon: HelpCircle },
  ]

  const renderContent = () => {
    const CurrentComponent = tabs.find((tab) => tab.id === activeTab)?.component
    return CurrentComponent ? <CurrentComponent /> : null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-12">
      <div className="max-w-8xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Exam Management</h1>
          <p className="text-gray-600">Create and manage exams, exam sets, and questions</p>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden mb-6">
          <div className="flex border-b border-gray-200 ">
            {tabs.map((tab) => {
              const Icon = tab.icon
              const isActive = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex-1 flex items-center justify-center gap-2 py-4 px-6 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  <span className="hidden sm:inline">{tab.name}</span>
                  <span className="sm:hidden text-xs">{tab.name.split(" ")[0]}</span>
                </button>
              )
            })}
          </div>
        </div>

        {/* Tab Content */}
        <div className="mt-6">{renderContent()}</div>
      </div>
    </div>
  )
}