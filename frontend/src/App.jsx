"use client"

import "./App.css"
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom"
import { useState, useEffect } from "react"
import PageNotFound from "./components/PageNotFound"
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google"
import LandingPage from "./components/home/LandingPage"
import MainAbout from "./components/about/MainAbout"
import Service from "./components/service/Service"
import ContactPage from "./components/Contact/ContactPage"
import LoginPage from "./components/auth/LoginPage"
import ExpertPanel from "./Export/ExpertPanel"
import ClientPanel from "./client/ClientPanel"
import AdminPanel from "./Admin/AdminPanel"
import CoursesPage from "./client/Components/CoursesPage"
import PracticePage from "./client/Components/PracticePage"
import MaterialsPage from "./client/Components/MaterialsPage"
import AssignmentsPage from "./client/Components/AssignmentPage"
import StudyGroupsPage from "./client/Components/StudyGroupsPage"
import ProjectsPage from "./client/Components/ProjectsPage"
import Feed from "./components/feed/Feed"
import Navbar from "./components/ToperFooter/Navbar"

function AppContent() {
  const location = useLocation()
  const [user, setUser] = useState(null)

  // Navigation links for the app
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/service", label: "Services" },
    { path: "/contact", label: "Contact" },
  ]

  // Routes where navbar should not be displayed
  const noNavbarRoutes = ["/login", "/google-login", "/clientPanel", "/adminPanel", "/expertPanel"]

  // Check if current route should show navbar
  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname)

  useEffect(() => {
    // Check if user is logged in
    const userData = localStorage.getItem("user")
    if (userData) {
      try {
        const parsedUser = JSON.parse(userData)
        setUser(parsedUser)
      } catch (error) {
        console.error("Error parsing user data:", error)
        localStorage.removeItem("user")
      }
    }
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("user")
    setUser(null)
    window.location.href = "/login"
  }

  const getCurrentTab = () => {
    const path = location.pathname
    if (path === "/") return "home"
    return path.substring(1)
  }

  const GoogleAuthWrapper = () => {
    return (
      <GoogleOAuthProvider clientId="314824028312-1hh17m9aatjohq75fkdp7h268a13du5m.apps.googleusercontent.com">
        <GoogleLogin />
      </GoogleOAuthProvider>
    )
  }

  return (
    <div className="min-h-screen bg-blue-100">
      {/* Conditional Navbar - Only show on public pages */}
      {shouldShowNavbar && (
        <div className="sticky top-0 z-50 bg-white shadow-sm">
          <Navbar
            links={navLinks}
            user={user}
            panelType="landing"
            onLogout={handleLogout}
            activeTab={getCurrentTab()}
          />
        </div>
      )}

      {/* Main Content */}
      <div className={shouldShowNavbar ? "pt-0" : ""}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/google-login" element={<GoogleAuthWrapper />} />
          <Route path="/clientPanel" element={<ClientPanel />} />
          <Route path="/adminPanel" element={<AdminPanel />} />
          <Route path="/expertPanel" element={<ExpertPanel />} />
          <Route path="/about" element={<MainAbout />} />
          <Route path="/service" element={<Service />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/courses" element={<CoursesPage />} />
          <Route path="/practice" element={<PracticePage />} />
          <Route path="/materials" element={<MaterialsPage />} />
          <Route path="/assignments" element={<AssignmentsPage />} />
          <Route path="/projects" element={<ProjectsPage />} />
          <Route path="/study-groups" element={<StudyGroupsPage />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  )
}

export default App
