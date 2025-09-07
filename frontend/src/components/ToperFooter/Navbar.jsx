"use client"

import { useState, useEffect, useRef } from "react"
import { Link, useLocation, useNavigate } from "react-router-dom"
import Logo2 from "../../assets/Img/Logo2.png"
import Button from "../Button"
import {
  LogIn,
  Menu,
  X,
  ChevronDown,
  User,
  Settings,
  LogOut,
  Bell,
  Search,
  Home,
  Info,
  Briefcase,
  Phone,
  Shield,
  BookOpen,
  Award,
  HelpCircle,
  MessageSquare,
  Globe,
} from "lucide-react"

function Navbar({ links = [], user = null, panelType = null, onLogout = null, activeTab = null, onTabChange = null }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isSearchFocused, setIsSearchFocused] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [currentActiveTab, setCurrentActiveTab] = useState("home")

  const location = useLocation()
  const navigate = useNavigate()
  const userDropdownRef = useRef(null)
  const notificationsRef = useRef(null)
  const searchRef = useRef(null)

  // Sample notifications data
  useEffect(() => {
    if (user) {
      setNotifications([
        {
          id: 1,
          type: "message",
          title: "New message from instructor",
          message: "Dr. Smith has replied to your question",
          time: "2 min ago",
          read: false,
        },
        {
          id: 2,
          type: "assignment",
          title: "Assignment due soon",
          message: "Data Structures homework due in 2 hours",
          time: "1 hour ago",
          read: false,
        },
        {
          id: 3,
          type: "achievement",
          title: "Achievement unlocked!",
          message: "You've completed 5 courses this month",
          time: "1 day ago",
          read: true,
        },
      ])
    }
  }, [user])

  // Update active tab based on URL parameters or passed activeTab
  useEffect(() => {
    if (activeTab) {
      setCurrentActiveTab(activeTab)
    } else {
      // Determine active tab from URL
      const urlParams = new URLSearchParams(location.search)
      const tabFromUrl = urlParams.get("tab")
      if (tabFromUrl) {
        setCurrentActiveTab(tabFromUrl)
      } else {
        // Default tab based on current path
        switch (location.pathname) {
          case "/clientPanel":
          case "/adminPanel":
          case "/expertPanel":
            setCurrentActiveTab("home")
            break
          default:
            setCurrentActiveTab("home")
        }
      }
    }
  }, [activeTab, location])

  // Close dropdowns when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (userDropdownRef.current && !userDropdownRef.current.contains(event.target)) {
        setIsUserDropdownOpen(false)
      }
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false)
      }
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsSearchFocused(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen)
    setIsNotificationsOpen(false)
  }

  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen)
    setIsUserDropdownOpen(false)
  }

  const handleLogout = () => {
    if (onLogout) {
      onLogout()
    } else {
      localStorage.removeItem("user")
      localStorage.removeItem("expert")
      navigate("/login")
    }
    setIsUserDropdownOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      console.log("Searching for:", searchQuery)
      // Implement search functionality based on panel type
      switch (panelType) {
        case "client":
          console.log("Client panel search:", searchQuery)
          break
        case "admin":
          console.log("Admin panel search:", searchQuery)
          break
        case "expert":
          console.log("Expert panel search:", searchQuery)
          break
        default:
          console.log("General search:", searchQuery)
      }
    }
  }

  const markNotificationAsRead = (notificationId) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === notificationId ? { ...notif, read: true } : notif)))
  }

  const clearAllNotifications = () => {
    setNotifications([])
    setIsNotificationsOpen(false)
  }

  // Function to get the correct navigation path based on panel type
  const getNavigationPath = (originalPath) => {
    if (panelType === "client" && location.pathname.includes("/clientPanel")) {
      switch (originalPath) {
        case "/":
        case "/home":
          return "/clientPanel"
        case "/about":
          return "/clientPanel?tab=about"
        case "/service":
          return "/clientPanel?tab=services"
        case "/contact":
          return "/clientPanel?tab=contact"
        default:
          return originalPath
      }
    } else if (panelType === "admin" && location.pathname.includes("/adminPanel")) {
      switch (originalPath) {
        case "/":
        case "/home":
          return "/adminPanel"
        case "/about":
          return "/adminPanel?tab=about"
        case "/service":
          return "/adminPanel?tab=services"
        case "/contact":
          return "/adminPanel?tab=contact"
        default:
          return originalPath
      }
    } else if (panelType === "expert" && location.pathname.includes("/expertPanel")) {
      switch (originalPath) {
        case "/":
        case "/home":
          return "/expertPanel"
        case "/about":
          return "/expertPanel?tab=about"
        case "/service":
          return "/expertPanel?tab=services"
        case "/contact":
          return "/expertPanel?tab=contact"
        default:
          return originalPath
      }
    }

    return originalPath
  }

  // Get navigation icon for each link
  const getNavIcon = (path) => {
    switch (path) {
      case "/":
      case "/home":
        return <Home className="w-4 h-4" />
      case "/about":
        return <Info className="w-4 h-4" />
      case "/service":
        return <Briefcase className="w-4 h-4" />
      case "/contact":
        return <Phone className="w-4 h-4" />
      default:
        return <Globe className="w-4 h-4" />
    }
  }

  // Get notification icon based on type
  const getNotificationIcon = (type) => {
    switch (type) {
      case "message":
        return <MessageSquare className="w-4 h-4 text-blue-500" />
      case "assignment":
        return <BookOpen className="w-4 h-4 text-orange-500" />
      case "achievement":
        return <Award className="w-4 h-4 text-green-500" />
      default:
        return <Bell className="w-4 h-4 text-gray-500" />
    }
  }

  // Check if a navigation link is active
  const isNavLinkActive = (path) => {
    if (panelType) {
      // For panel navigation, check the tab parameter
      switch (path) {
        case "/":
        case "/home":
          return currentActiveTab === "home" || currentActiveTab === "dashboard"
        case "/about":
          return currentActiveTab === "about"
        case "/service":
          return currentActiveTab === "services"
        case "/contact":
          return currentActiveTab === "contact"
        default:
          return false
      }
    } else {
      // For regular navigation, check the current path
      return location.pathname === path
    }
  }

  // Handle navigation link click
  const handleNavLinkClick = (path) => {
    if (panelType && onTabChange) {
      // For panel navigation, use tab change handler
      switch (path) {
        case "/":
        case "/home":
          onTabChange("home")
          break
        case "/about":
          onTabChange("about")
          break
        case "/service":
          onTabChange("services")
          break
        case "/contact":
          onTabChange("contact")
          break
        default:
          break
      }
    }
    setIsMobileMenuOpen(false)
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <header className="w-full shadow-lg bg-gradient-to-r from-blue-600 via-blue-700 to-blue-900 text-white sticky top-0 z-50 backdrop-blur-sm">
      <div className="w-full px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-3 lg:py-4">
          {/* Logo and Title */}
          <div className="flex items-center space-x-3">
            <Link
              to={panelType ? getNavigationPath("/") : "/"}
              className="flex items-center space-x-3 hover:opacity-90 transition-opacity"
              onClick={() => handleNavLinkClick("/")}
            >
              <img
                src={Logo2 || "/placeholder.svg?height=64&width=64"}
                alt="EduSolver Logo"
                className="w-10 h-10 sm:w-12 sm:h-12 lg:w-16 lg:h-16 rounded-full object-cover ring-2 ring-white/20 hover:ring-white/40 transition-all duration-300"
              />
              <div className="flex flex-col items-start">
                <span className="text-lg sm:text-xl lg:text-2xl font-bold text-white tracking-tight">EduSolver</span>
                <span className="text-xs sm:text-sm text-white/80 hidden sm:block">
                  {(() => {
                    switch (panelType) {
                      case "client":
                        return "Student Portal"
                      case "admin":
                        return "Admin Dashboard"
                      case "expert":
                        return "Expert Panel"
                      default:
                        return "Learning Platform"
                    }
                  })()}
                </span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-1 xl:space-x-2">
            {links.map((link) => {
              const isActive = isNavLinkActive(link.path)
              return (
                <Link
                  key={link.path}
                  to={getNavigationPath(link.path)}
                  onClick={() => handleNavLinkClick(link.path)}
                  className={`group flex items-center gap-2 px-3 xl:px-4 py-2 rounded-lg transition-all duration-200 text-sm xl:text-base font-medium ${
                    isActive
                      ? "bg-white/20 text-white shadow-lg ring-2 ring-white/30"
                      : "text-white/90 hover:text-white hover:bg-white/10"
                  }`}
                >
                  {getNavIcon(link.path)}
                  <span className="group-hover:translate-x-0.5 transition-transform duration-200">{link.label}</span>
                  {isActive && <div className="w-1 h-1 bg-white rounded-full"></div>}
                </Link>
              )
            })}
          </nav>

          {/* Desktop Search and User Actions */}
          <div className="hidden lg:flex items-center space-x-3 xl:space-x-4">
            {/* Enhanced Search */}
            <div ref={searchRef} className="relative">
              <form onSubmit={handleSearch} className="relative">
                <div
                  className={`flex items-center bg-white/10 backdrop-blur-sm rounded-lg transition-all duration-300 ${
                    isSearchFocused ? "bg-white/20 ring-2 ring-white/30" : "hover:bg-white/15"
                  }`}
                >
                  <Search className="w-4 h-4 text-white/70 ml-3" />
                  <input
                    type="text"
                    placeholder="Search courses, experts..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    className="bg-transparent text-white placeholder-white/60 px-3 py-2 w-48 xl:w-64 focus:outline-none text-sm"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-white/70 hover:text-white mr-3 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {user ? (
              <>
                {/* Notifications */}
                <div ref={notificationsRef} className="relative">
                  <button
                    onClick={toggleNotifications}
                    className="relative p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-medium animate-pulse">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Notifications Dropdown */}
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                        <h3 className="text-gray-800 font-semibold">Notifications</h3>
                        {notifications.length > 0 && (
                          <button
                            onClick={clearAllNotifications}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium transition-colors"
                          >
                            Clear all
                          </button>
                        )}
                      </div>

                      <div className="max-h-96 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-8 text-center text-gray-500">
                            <Bell className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <p>No notifications</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => markNotificationAsRead(notification.id)}
                              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${
                                notification.read ? "border-transparent" : "border-blue-500 bg-blue-50/50"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                {getNotificationIcon(notification.type)}
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-sm font-medium ${
                                      notification.read ? "text-gray-600" : "text-gray-900"
                                    }`}
                                  >
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                </div>
                                {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* User Dropdown */}
                <div ref={userDropdownRef} className="relative">
                  <button
                    onClick={toggleUserDropdown}
                    className="flex items-center gap-2 text-white/90 hover:text-white hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-200 group"
                  >
                    <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center ring-2 ring-white/20 group-hover:ring-white/40 transition-all">
                      <User className="w-4 h-4" />
                    </div>
                    <div className="hidden xl:block text-left">
                      <p className="text-sm font-medium truncate max-w-24">{user.name?.split(" ")[0] || "User"}</p>
                      <p className="text-xs text-white/70 capitalize">{user.role || panelType || "Student"}</p>
                    </div>
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-200 ${isUserDropdownOpen ? "rotate-180" : ""}`}
                    />
                  </button>

                  {/* User Dropdown Menu */}
                  {isUserDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-64 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50 animate-in slide-in-from-top-2 duration-200">
                      {/* User Info */}
                      <div className="px-4 py-3 border-b border-gray-100">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                            <User className="w-5 h-5 text-blue-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-gray-900 font-medium truncate">{user.name || "User Name"}</p>
                            <p className="text-gray-500 text-sm truncate">{user.email || "user@example.com"}</p>
                            <span className="inline-block px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full mt-1 capitalize">
                              {user.role || panelType || "Student"}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Menu Items */}
                      <div className="py-2">
                      

                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 px-4 py-2 text-red-600 hover:bg-red-50 transition-colors w-full text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          <span>Sign Out</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <Link to="/login">
                <Button
                  label="Sign In"
                  icon={<LogIn size={16} />}
                  className="bg-white/10 hover:bg-white/20 border border-white/20 hover:border-white/30 transition-all duration-200"
                />
              </Link>
            )}
          </div>

          {/* Mobile Menu Button and User Actions */}
          <div className="flex items-center gap-2 lg:hidden">
            {user && (
              <>
                {/* Mobile Notifications */}
                <div ref={notificationsRef} className="relative">
                  <button
                    onClick={toggleNotifications}
                    className="relative p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                  >
                    <Bell className="w-5 h-5" />
                    {unreadCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium">
                        {unreadCount > 9 ? "9+" : unreadCount}
                      </span>
                    )}
                  </button>

                  {/* Mobile Notifications Dropdown */}
                  {isNotificationsOpen && (
                    <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-2xl border border-gray-200 py-2 z-50">
                      <div className="flex items-center justify-between px-4 py-2 border-b border-gray-100">
                        <h3 className="text-gray-800 font-semibold">Notifications</h3>
                        {notifications.length > 0 && (
                          <button
                            onClick={clearAllNotifications}
                            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                          >
                            Clear all
                          </button>
                        )}
                      </div>

                      <div className="max-h-80 overflow-y-auto">
                        {notifications.length === 0 ? (
                          <div className="px-4 py-6 text-center text-gray-500">
                            <Bell className="w-6 h-6 mx-auto mb-2 text-gray-300" />
                            <p className="text-sm">No notifications</p>
                          </div>
                        ) : (
                          notifications.map((notification) => (
                            <div
                              key={notification.id}
                              onClick={() => markNotificationAsRead(notification.id)}
                              className={`px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 ${
                                notification.read ? "border-transparent" : "border-blue-500 bg-blue-50/50"
                              }`}
                            >
                              <div className="flex items-start gap-3">
                                {getNotificationIcon(notification.type)}
                                <div className="flex-1 min-w-0">
                                  <p
                                    className={`text-sm font-medium ${
                                      notification.read ? "text-gray-600" : "text-gray-900"
                                    }`}
                                  >
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-gray-500 mt-1">{notification.message}</p>
                                  <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                </div>
                                {!notification.read && <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>}
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Mobile User Button */}
                <Link
                  to={panelType ? getNavigationPath("/") : "/profile"}
                  className="p-2 text-white/90 hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200"
                >
                  <User className="w-5 h-5" />
                </Link>
              </>
            )}

            {!user && (
              <Link to="/login" className="lg:hidden">
                <Button
                  label="Login"
                  icon={<LogIn size={14} />}
                  className="text-xs px-3 py-2 bg-white/10 hover:bg-white/20 border border-white/20"
                />
              </Link>
            )}

            <button
              onClick={toggleMobileMenu}
              className="text-white p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-white/20 py-4 animate-in slide-in-from-top-2 duration-200">
            {/* Mobile Search */}
            <div className="px-2 mb-4">
              <form onSubmit={handleSearch} className="relative">
                <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg">
                  <Search className="w-4 h-4 text-white/70 ml-3" />
                  <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="bg-transparent text-white placeholder-white/60 px-3 py-3 w-full focus:outline-none text-sm"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchQuery("")}
                      className="text-white/70 hover:text-white mr-3"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </form>
            </div>

            {/* Mobile Navigation Links */}
            <nav className="flex flex-col space-y-1 px-2">
              {links.map((link) => {
                const isActive = isNavLinkActive(link.path)
                return (
                  <Link
                    key={link.path}
                    to={getNavigationPath(link.path)}
                    onClick={() => handleNavLinkClick(link.path)}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 font-medium ${
                      isActive ? "bg-white/20 text-white shadow-lg" : "text-white/90 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {getNavIcon(link.path)}
                    {link.label}
                    {isActive && <div className="ml-auto w-2 h-2 bg-white rounded-full"></div>}
                  </Link>
                )
              })}

              {user && (
                <>
                  <hr className="border-white/20 my-2" />

                  {/* Mobile User Menu */}
                  <div className="px-4 py-3">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <User className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium truncate">{user.name || "User Name"}</p>
                        <p className="text-white/70 text-sm truncate">{user.email || "user@example.com"}</p>
                      </div>
                    </div>
                  </div>

                  <Link
                    to={panelType ? getNavigationPath("/") : "/profile"}
                    className="flex items-center gap-3 text-black hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <User className="w-4 h-4" />
                    My Profile
                  </Link>

                  <Link
                    to="/settings"
                    className="flex items-center gap-3 text-black hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <Settings className="w-4 h-4" />
                    Settings
                  </Link>

                  <Link
                    to="/help"
                    className="flex items-center gap-3 text-black hover:text-white hover:bg-white/10 px-4 py-3 rounded-lg transition-all duration-200"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <HelpCircle className="w-4 h-4" />
                    Help & Support
                  </Link>

                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 text-blue-9000 hover:text-red-200 hover:bg-red-500/10 px-4 py-3 rounded-lg transition-all duration-200 w-full text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
