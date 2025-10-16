// src/App.jsx

"use client";

import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { useState } from "react";
import PageNotFound from "./components/PageNotFound";
import LandingPage from "./components/home/LandingPage";
import MainAbout from "./components/about/MainAbout";
import Service from "./components/service/Service";
import ContactPage from "./components/Contact/ContactPage";
import LoginPage from "./components/pages/LoginPage";
import ExpertPanel from "./Expert/ExpertPanel";
import ClientPanel from "./client/ClientPanel";
import AdminPanel from "./Admin/AdminPanel";
import CoursesPage from "./client/Components/CoursesPage";
import PracticePage from "./client/Components/PracticePage";
import MaterialsPage from "./client/Components/MaterialsPage";
import AssignmentsPage from "./client/Components/AssignmentPage";
import StudyGroupsPage from "./client/Components/StudyGroupsPage";
import ProjectsPage from "./client/Components/ProjectsPage";
import Feed from "./components/feed/Feed";
import Navbar from "./components/ToperFooter/Navbar";
import CourseAddpage from "./Admin/page/CourseAddpage";
import TeacherAddpage from "./Admin/page/TeacherAddpage";
import Responsepage from "./Admin/page/Responsepage";
import Exampage from "./Admin/page/Exampage";
import ProtectedRoute from "./components/auth/ProtectedRoute";
import StudentTable from "./Admin/forms/StudentTable";
import TeacherTable from "./Admin/forms/TeacherTable";
import EsewaPaymentPage from "./client/Components/EsewaPaymentPage";
import PaymentSucces from "./client/Components/PaymentSucces";
import PaymentFailure from "./client/Components/PaymentFailure";



import EsewaPayment from "./client/Components/EsewaPayment";


function AppContent() {
  const location = useLocation();

  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/service", label: "Services" },
    { path: "/contact", label: "Contact" },
  ];

  const noNavbarRoutes = ["/login"];
  const shouldShowNavbar = !noNavbarRoutes.includes(location.pathname);

  // The user check and state management are now handled by ProtectedRoute.
  // We can remove the redundant user state and useEffect hook.

  const handleLogout = () => {
    localStorage.removeItem("jwt"); // Use the correct key from authHelpers
    window.location.href = "/login";
  };

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === "/") return "home";
    return path.substring(1);
  };

  return (
    <div className="min-h-screen bg-blue-100">
      {shouldShowNavbar && (
        <div className="sticky top-0 z-50 bg-white shadow-sm">
          <Navbar
            links={navLinks}
            onLogout={handleLogout}
            panelType="landing"
            activeTab={getCurrentTab()}
          />
        </div>
      )}

      <div className={shouldShowNavbar ? "pt-0" : ""}>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />

          {/* Protected routes */}
          <Route
            path="/adminPanel"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          <Route
            path="/clientPanel"
            element={
              <ProtectedRoute requiredRole="student">
                <ClientPanel />

              </ProtectedRoute>
            }
          />

          <Route
            path="/expertPanel"
            element={
              <ProtectedRoute requiredRole="expert">
                <ExpertPanel />
              </ProtectedRoute>
            }
          />

          {/* Other routes */}
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
          <Route path="/studentsList" element={<StudentTable />} />
          <Route path="/TeacherList" element={<TeacherTable />} />



          <Route path="/TeacherAddpage" element={<TeacherAddpage />} />
          <Route path="/CourseAddpage" element={<CourseAddpage />} />
          <Route path="/ResponseAddpage" element={<Responsepage />} />
          <Route path="/Exampage" element={<Exampage />} />
          <Route path='esewa-payment' element={<EsewaPaymentPage />} />
          <Route path='payment-success' element={<PaymentSucces />} />
          <Route path='payment-failure' element={<PaymentFailure />} />



          {/* test */}
          <Route path='pay' element={<EsewaPayment/>} />



          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}