"use client"

import { useState, useEffect } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { Users, Award, TrendingUp, HelpCircle, Home, ChevronRight } from "lucide-react"
import Slide from "./Slide"
import Footer from "../ToperFooter/Footer"
import { BreadCrumb } from "../ToperFooter/BreadCrumb"
import Navbar from "../ToperFooter/Navbar"
import ContactPage from "../Contact/ContactPage"
import { About } from "../about/About"
import { WhatWeDone } from "../about/WhatWeDone"
import { OurMission } from "../about/OurMission"
import { TeamSection } from "../about/TeamSection"
import { CTASection } from "../about/CTASection"
import ServiceSection from "../service/ServiceSection"
import PricingSection from "../service/PricingSection"
import ServiceHowWeWork from "../service/ServiceHowWeWork"

export default function LandingPage() {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const [activeTab, setActiveTab] = useState("home")
  const [user, setUser] = useState(null)

  // Navigation links for the landing page
  const navLinks = [
    { path: "/", label: "Home" },
    { path: "/about", label: "About" },
    { path: "/service", label: "Services" },
    { path: "/contact", label: "Contact" },
  ]

  useEffect(() => {
    // Check if user is logged in (optional for landing page)
    const userData = localStorage.getItem("user")
    if (userData) {
      const parsedUser = JSON.parse(userData)
      setUser(parsedUser)
    }
  }, [])

  // Handle URL parameters for navigation
  useEffect(() => {
    const tab = searchParams.get("tab")
    if (tab) {
      setActiveTab(tab)
    } else {
      setActiveTab("home")
    }
  }, [searchParams])

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  const handleTabChange = (newTab) => {
    setActiveTab(newTab)
    // Update URL parameters
    const newSearchParams = new URLSearchParams(searchParams)
    if (newTab === "home") {
      newSearchParams.delete("tab")
    } else {
      newSearchParams.set("tab", newTab)
    }
    setSearchParams(newSearchParams)
  }

  // Render different content based on active tab
  const renderContent = () => {
    switch (activeTab) {
      case "about":
        return (
          <>
            <BreadCrumb content="About Us" icon1={Home} icon2={ChevronRight} />
            <About />
            <WhatWeDone />
            <OurMission />
            <TeamSection />
            <CTASection />
            <Footer />
          </>
        )
      case "services":
        return (
          <>
            <BreadCrumb content="Service" icon1={Home} icon2={ChevronRight} />
            <ServiceSection />
            <ServiceHowWeWork />
            <PricingSection
              plans={[
                {
                  title: "Starter",
                  price: "$1",
                  period: "/month",
                  features: ["Feature 1", "Feature 2", "Feature 3"],
                  variant: "blue",
                },
                {
                  title: "Pro",
                  price: "$12",
                  period: "/yearly",
                  features: ["All Starter features", "Feature 3", "Feature 4", "Feature 5"],
                  variant: "dark",
                  isPopular: true,
                },
                {
                  title: "Enterprise",
                  price: "$4",
                  period: "/quarter month",
                  features: ["All Starter features", "Feature 3", "Feature 4"],
                  variant: "blue",
                },
              ]}
            />
            <Footer />
          </>
        )
      case "contact":
        return (
          <>
            <BreadCrumb content="Contact Us" icon1={Home} icon2={ChevronRight} />
            <ContactPage />
          </>
        )
      case "home":
      default:
        return (
          <>
            <BreadCrumb content="Home" icon1={Home} icon2={ChevronRight} />
            <Slide />
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              {/* Hero Section */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-16">
                {/* Card 1 */}
                <div className="rounded-lg shadow-lg p-8 text-center bg-gradient-to-r from-blue-500 to-blue-900 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-6xl font-bold text-white mb-2">5</div>
                  <p className="text-lg text-white">Years of Experience</p>
                </div>

                {/* Card 2 */}
                <div className="rounded-lg shadow-lg p-8 text-center bg-gradient-to-r from-blue-500 to-blue-900 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-transform duration-300">
                  <p className="text-lg mb-2 text-white">Do You Need</p>
                  <h2 className="text-2xl font-bold text-white">All In One Platform?</h2>
                </div>

                {/* Card 3 */}
                <div className="rounded-lg shadow-lg p-8 text-center bg-gradient-to-r from-blue-500 to-blue-900 hover:from-blue-600 hover:to-purple-700 transform hover:scale-105 transition-transform duration-300">
                  <p className="text-white mb-2">Call us for free</p>
                  <div className="text-2xl font-bold text-white">9812855741</div>
                </div>
              </div>

              {/* About Section */}
              <section className="mb-16">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-blue-900 mb-4">About EduSolver</h2>
                  <p className="text-lg text-gray-600 max-w-3xl mx-auto">
                    A EduSolver is a <span className="font-semibold">designed</span> to help students learn in an{" "}
                    <span className="font-semibold">interactive and effective</span> way by providing access to test,
                    detailed performance tracking, and a doubt-solving forum where students can help each other.
                  </p>
                </div>
              </section>

              {/* Services Grid */}
              <section className="mb-16">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-blue-900 mb-4">Our Services</h2>
                  <p className="text-lg text-gray-600">We provide Competitive exam solutions and peer Coordination</p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 text-center hover:scale-105 transform duration-300">
                    <TrendingUp className="w-12 h-12 text-blue-900 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Exams</h3>
                    <p className="text-gray-600">
                      Provides all the study material and variety of exam that are recent asked in giant company such as
                      google and Microsoft
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 text-center hover:scale-105 transform duration-300">
                    <Users className="w-12 h-12 text-blue-900 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Peer Connection</h3>
                    <p className="text-gray-600">
                      Student can interact with each other and can help each other in solving doubts
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 text-center hover:scale-105 transform duration-300">
                    <Award className="w-12 h-12 text-blue-900 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Reliable Source</h3>
                    <p className="text-gray-600">
                      Process improvement and enhance student learning experience with reliable and up-to-date resources
                    </p>
                  </div>
                  <div className="bg-white rounded-lg shadow-lg hover:shadow-xl transition-shadow p-6 text-center hover:scale-105 transform duration-300">
                    <HelpCircle className="w-12 h-12 text-blue-900 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Consultation and Doubt-Solving</h3>
                    <p className="text-gray-600">Expert advice and professional guidance</p>
                  </div>
                </div>
              </section>

              {/* Subscription Section */}
              <section className="bg-blue-900 rounded-2xl p-12 text-center text-white">
                <h2 className="text-3xl font-bold mb-4">Ready to Transform You in Expert?</h2>
                <p className="text-xl mb-8">
                  Finding personalized practice questions for subjects and Solving doubts quickly, especially to get
                  your Ambition
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <button
                    className="bg-white text-blue-900 hover:bg-gray-100 px-8 py-3 rounded-lg font-semibold transition-colors"
                    onClick={() => navigate("/subscription")}
                  >
                    Get Subscription
                  </button>
                  <button
                    className="border-2 border-white text-white hover:bg-blue-700 px-8 py-3 rounded-lg font-semibold transition-colors"
                    onClick={() => handleTabChange("about")}
                  >
                    Learn More
                  </button>
                </div>
              </section>
            </main>
          
          </>
        )
    }
  }

  return (
    <div className="w-full min-h-screen bg-blue-100">
  
      {/* Main Content with proper spacing */}
      <div >{renderContent()}</div>
    </div>
  )
}
