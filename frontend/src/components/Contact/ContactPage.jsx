"use client"

import { useState } from "react"
import { Mail, Phone, MapPin, Facebook, Twitter, Linkedin, Youtube, PhoneCall } from "lucide-react"
import { BreadCrumb } from "../ToperFooter/BreadCrumb"
import { Home, ChevronRight } from "lucide-react"
import Footer from "../ToperFooter/Footer"
import img from "../../assets/Img/map.jpg"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    contactNumber: "",
    subject: "",
    message: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Contact form submitted:", formData)
    alert("Thank you for your message! We'll get back to you soon.")
    setFormData({
      fullName: "",
      email: "",
      contactNumber: "",
      subject: "",
      message: "",
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      
      <BreadCrumb content="Contact Us" icon1={Home} icon2={ChevronRight} />

      <main className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold semi-bold text-blue-900 mb-4">We'd Love To Hear From You</h1>
          <p className="text-gray-600"> EduSolver Is Here To Support you.</p>
        </div>

        {/* Contact Section input with Map Background */}
        <div className="relative">
          <div className="absolute inset-0 z-0 bg-gray-200">
            <img
              src={img}
              alt="Map"
              className="w-full h-full object-cover opacity-60"
            />
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="bg-black p-2 rounded-md">
                <MapPin className="w-6 h-6 text-white" />
              </div>
            </div>
          </div>

          <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
            <div className="grid md:grid-cols-3 gap-8 mb-10">
              {/* Email Card */}
              <div className="bg-white text-center p-8 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Email Us</h3>
                <p className="text-gray-600">contact@edusolver.com</p>
              </div>

              {/* Phone Card */}
              <div className="bg-white text-center p-8 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Call Us</h3>
                <p className="text-gray-600">+977 9812345678</p>
              </div>

              {/* Address Card */}
              <div className="bg-white text-center p-8 rounded-lg shadow-md">
                <div className="w-12 h-12 bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-blue-900 mb-2">Our Office</h3>
                <p className="text-gray-600">Ambikeshwori, Dang, Nepal</p>
              </div>
            </div>

            {/* Contact Form */}
            <div className="bg-white p-8 rounded-lg shadow-md max-w-xl mx-auto">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    placeholder="Full Name *"
                    className="w-full px-4 py-2 rounded-md placeholder-gray-400  border border-blue-900 outline outline-1 outline-gray-400 focus:outline-2 focus:outline-blue-900  transition-all"
                    required
                  />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="Email Address *"
                    className="w-full px-4 py-2 rounded-md placeholder-gray-400  border border-blue-900 outline outline-1 outline-gray-400 focus:outline-2 focus:outline-blue-900  transition-all"
                    required
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <input
                    type="tel"
                    name="contactNumber"
                    value={formData.contactNumber}
                    onChange={handleChange}
                    placeholder="Contact Number"
                    className="w-full px-4 py-2 rounded-md placeholder-gray-400  border border-blue-900 outline outline-1 outline-gray-400 focus:outline-2 focus:outline-blue-900  transition-all"
                  />
                  <div className="relative">
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={handleChange}
                      placeholder="Subject (e.g., Admission, Help)"
                      className="w-full px-4 py-2 rounded-md placeholder-gray-400  border border-blue-900 outline outline-1 outline-gray-400 focus:outline-2 focus:outline-blue-900  transition-all pr-9"
                    />
                    
                  </div>
                </div>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="Write your message here..."
                  rows={5}
                  className="w-full px-4 py-2 rounded-md placeholder-gray-400  border border-blue-900 outline outline-1 outline-gray-400 focus:outline-2 focus:outline-blue-900  transition-all"
                ></textarea>
                <div className="flex justify-center">
                  <button
                    type="submit"
                    className="px-6 py-2 bg-blue-900 text-white font-medium rounded-full hover:bg-blue-800 transition-colors"
                  >
                    Send to EduSolver
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* Social Media Icons */}
        <div className="flex justify-center space-x-4 mt-12">
          <a
            href=""
            className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href=""
            className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href=""
            className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href=""
            className="w-10 h-10 bg-blue-900 rounded-full flex items-center justify-center text-white hover:bg-blue-800 transition-colors"
          >
            <Youtube className="w-5 h-5" />
          </a>
        </div>

        {/* CTA Banner */}
        <div className="bg-blue-900 rounded-lg p-6 py-15 mt-12 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center mr-4">
              <PhoneCall className="w-5 h-5 text-blue-900" />
            </div>
            <h3 className="text-3xl font-semibold text-white">Let's Plan Your Learning Journey</h3>
          </div>
          <button className="text-3xl px-6 py-2 bg-white text-blue-900 rounded-full hover:bg-blue-100 transition-colors">
            Call EduSolver: +977 9812855741
          </button>
        </div>
      </main>

      <Footer />
    </div>
  )
}
