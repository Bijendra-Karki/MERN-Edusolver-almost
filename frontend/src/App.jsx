// src/App.jsx
"use client";

import "./App.css";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import PageNotFound from "./components/PageNotFound";

// --- Public Components ---
import LandingPage from "./components/home/LandingPage";
import MainAbout from "./components/about/MainAbout";
import Service from "./components/service/Service";
import ContactPage from "./components/Contact/ContactPage";
import LoginPage from "./components/pages/LoginPage";
import Feed from "./components/feed/Feed";
import Navbar from "./components/ToperFooter/Navbar";

// --- Panels ---
import ExpertPanel from "./Expert/ExpertPanel";
import ClientPanel from "./client/ClientPanel";
import AdminPanel from "./Admin/AdminPanel";

// --- Client Components ---
import CoursesPage from "./client/Components/CoursesPage";
import PracticePage from "./client/Components/PracticePage";
import MaterialsPage from "./client/Components/MaterialsPage";
import AssignmentsPage from "./client/Components/AssignmentPage";
import StudyGroupsPage from "./client/Components/StudyGroupsPage";
import ProjectsPage from "./client/Components/ProjectsPage";
import EsewaPaymentPage from "./client/Components/EsewaPaymentPage";
import PaymentSucces from "./client/Components/PaymentSucces";
import PaymentFailure from "./client/Components/PaymentFailure";
import EsewaPayment from "./client/Components/EsewaPayment";
import PDfOpener from "./client/Components/PDfOpener";
import ExamDashboard from "./client/Components/ExamDashbord";
import ExamAttemptPage from "./client/Components/ExamAttemptPage";
import Quiz from "./client/Components/Quiz";
import Results from "./client/Components/Results";

// --- Admin Components ---
import CourseAddpage from "./Admin/page/CourseAddpage";
import TeacherAddpage from "./Admin/page/TeacherAddpage";
import Responsepage from "./Admin/page/Responsepage";
import Exampage from "./Admin/page/Exampage";
import StudentTable from "./Admin/forms/StudentTable";
import TeacherTable from "./Admin/forms/TeacherTable";
import CategoryManagement from "./Admin/forms/AddCategory";

// --- Auth ---
import ProtectedRoute from "./components/auth/ProtectedRoute";
import Footer from "./components/ToperFooter/Footer";

// --- Home placeholders ---
const AdminHome = () => <div className="p-6">Admin Panel Dashboard Home</div>;
const ClientHome = () => <div className="p-6">Student Client Panel Home</div>;
const ExpertHome = () => <div className="p-6">Expert Panel Dashboard Home</div>;

// --- Role Helper ---
const getRoleFromToken = () => {
  const token = localStorage.getItem("jwt");
  if (!token) return null;

  // ✅ TODO: Replace with real role decode logic later
  return "student"; // Default for now
};

// --- Main App Content ---
function AppContent() {
  const location = useLocation();
  const userRole = getRoleFromToken();

  // ✅ Fixed syntax for conditional role mapping
  let homePath = "/";
  if (userRole === "student") {
    homePath = "/clientPanel";
  } else if (userRole === "admin") {
    homePath = "/adminPanel";
  } else if (userRole === "expert") {
    homePath = "/expertPanel";
  } else {
    homePath = "/";
  }

  // --- Navbar setup ---
  const navLinks = [
    { path: homePath, label: "Home" },
    { path: "/about", label: "About" },
    { path: "/service", label: "Services" },
    { path: "/contact", label: "Contact" },
  ];

  // Hide Navbar on login + panel routes
  const noNavbarRoutes = ["/login"];
  const isPanelRoute = noNavbarRoutes.some(
    (route) => location.pathname.startsWith(route) && route !== "/login"
  );
  const shouldShowNavbar = !isPanelRoute && location.pathname !== "/login";

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    window.location.href = "/login";
  };

  const getCurrentTab = () => {
    const path = location.pathname;
    if (path === homePath) return "home";
    return path.substring(1).split("/")[0];
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
          {/* --- Public Routes --- */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/about" element={<MainAbout />} />
          <Route path="/service" element={<Service />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/feed" element={<Feed />} />
          <Route path="/login" element={<LoginPage />} />

          {/* --- Payment & Viewer Routes --- */}
          <Route path="esewa-payment" element={<EsewaPaymentPage />} />
          <Route path="payment-success" element={<PaymentSucces />} />
          <Route path="payment-failure" element={<PaymentFailure />} />
          <Route path="PDFViewer/:id" element={<PDfOpener />} />
          <Route path="pay" element={<EsewaPayment />} />

          {/* --- Admin Panel --- */}
          <Route
            path="/adminPanel"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminPanel />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHome />} />
            <Route path="CourseAddpage" element={<CourseAddpage />} />
            <Route path="TeacherAddpage" element={<TeacherAddpage />} />
            <Route path="ResponseAddpage" element={<Responsepage />} />
            <Route path="Exampage" element={<Exampage />} />
            <Route path="studentsList" element={<StudentTable />} />
            <Route path="TeacherList" element={<TeacherTable />} />
            <Route path="CategoryAddpage" element={<CategoryManagement />} />
          </Route>

          {/* --- Student Panel --- */}
          <Route
            path="/clientPanel"
            element={
              <ProtectedRoute requiredRole="student">
                <ClientPanel />
              </ProtectedRoute>
            }
          >
            <Route index element={<ClientHome />} />
            <Route path="courses" element={<CoursesPage />} />
            <Route path="practice" element={<PracticePage />} />
            <Route path="materials" element={<MaterialsPage />} />
            <Route path="assignments" element={<AssignmentsPage />} />
            <Route path="projects" element={<ProjectsPage />} />
            <Route path="study-groups" element={<StudyGroupsPage />} />
            <Route path="ExamDashboard" element={<ExamDashboard />} />
            <Route path="exam/:id" element={<ExamAttemptPage />} />
            <Route path="quiz/:id" element={<Quiz />} />
            <Route path="results/:id" element={<Results />} />
          </Route>

          {/* --- Expert Panel --- */}
          <Route
            path="/expertPanel"
            element={
              <ProtectedRoute requiredRole="expert">
                <ExpertPanel />
              </ProtectedRoute>
            }
          >
            <Route index element={<ExpertHome />} />
          </Route>

          {/* --- 404 Fallback --- */}
          <Route path="*" element={<PageNotFound />} />
        </Routes>
      </div>
      <div className="sticky top-0 z-50 bg-white shadow-sm">
        <Footer/>
      </div>
    </div>
  );
}

// --- App Wrapper ---
export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
