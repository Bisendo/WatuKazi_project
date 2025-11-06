// src/components/Navbar.jsx
import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useLocation, useNavigate } from "react-router-dom";
import logo from "../assets/watukazi.jpeg";
import { useLanguage } from "../components/LanguageContext";
import { useAuth } from "../contexts/authContext";
import Avatar from "./Avatar";

import { 
  FaBell, 
  FaChevronDown, 
  FaUser, 
  FaCog, 
  FaQuestionCircle, 
  FaSignOutAlt, 
  FaBriefcase, 
  FaHome, 
  FaEnvelope, 
  FaInfoCircle,
  FaBuilding,
  FaSignInAlt,
  FaUserPlus,
  FaGlobe
} from "react-icons/fa";

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [activePath, setActivePath] = useState("/");
  const location = useLocation();
  const navigate = useNavigate();

  const { language, toggleLanguage } = useLanguage();
  const { isAuthenticated, user, logout, loading } = useAuth();

  const notificationsRef = useRef(null);
  const profileRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Language content for Navbar
  const navbarContent = {
    sw: {
      home: "Nyumbani",
      service: "Huduma",
      about: "Kuhusu",
      contact: "Wasiliana",
      signIn: "Ingia",
      signUp: "Jisajili",
      signOut: "Toka",
      myProfile: "Profaili Yangu",
      settings: "Mipangilio",
      helpSupport: "Usaidizi",
      premiumMember: "Mwanachama Bora",
      notifications: "Arifa",
      viewAll: "Angalia Zote",
      new: "mpya",
      findJob: "Tafuta Kazi",
      dashboard: "Dashibodi"
    },
    en: {
      home: "Home",
      service: "Service",
      about: "About",
      contact: "Contact",
      signIn: "Sign In",
      signUp: "Sign Up",
      signOut: "Sign Out",
      myProfile: "My Profile",
      settings: "Settings",
      helpSupport: "Help & Support",
      premiumMember: "Premium Member",
      notifications: "Notifications",
      viewAll: "View All",
      new: "new",
      findJob: "Find Your Dream Job",
      dashboard: "Dashboard"
    }
  };

  const t = navbarContent[language];

  const menuItems = [
    { name: t.home, path: "/", icon: FaHome },
    { name: t.service, path: "/services", icon: FaBriefcase },
    { name: t.about, path: "/about", icon: FaInfoCircle },
    { name: t.contact, path: "/contact", icon: FaEnvelope }
  ];

  const notifications = [
    { 
      id: 1, 
      text: language === 'sw' ? "Kazi mpya inakufaa" : "New job matches your profile", 
      time: language === 'sw' ? "Dakika 5 zilizopita" : "5 min ago", 
      unread: true, 
      type: "job_match" 
    },
    { 
      id: 2, 
      text: language === 'sw' ? "Ombi lako limeangaliwa na mwajiri" : "Application viewed by employer", 
      time: language === 'sw' ? "Saa 1 iliyopita" : "1 hour ago", 
      unread: true, 
      type: "application" 
    }
  ];

  const unreadCount = notifications.filter(notification => notification.unread).length;

  // Set active path when location changes
  useEffect(() => {
    setActivePath(location.pathname);
  }, [location]);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  // Add this useEffect in your Navbar component, after the existing useEffects
useEffect(() => {
  // Sync with localStorage on component mount
  const syncAuthData = () => {
    if (!isAuthenticated && !loading) {
      // Check if we have auth data in storage but context doesn't know about it
      const storedUser = localStorage.getItem('userData') || sessionStorage.getItem('userData');
      const token = localStorage.getItem('authToken') || sessionStorage.getItem('authToken');
      
      if (storedUser && token) {
        // We have stored auth data, but context isn't authenticated
        // This can happen after refresh - we should update the context
        try {
          const userData = JSON.parse(storedUser);
          // You might want to trigger a context update here
          // Or simply rely on the context's own initialization
          console.log('Found stored user data:', userData);
        } catch (error) {
          console.error('Error parsing stored user data:', error);
        }
      }
    }
  };

  syncAuthData();
}, [isAuthenticated, loading]);

// Also, improve the loading state check
if (loading) {
  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/80">
        {/* Your existing loading skeleton */}
      </nav>
      <div className="h-14 sm:h-16 lg:h-20"></div>
    </>
  );
}

  // Handle click outside dropdowns
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (notificationsRef.current && !notificationsRef.current.contains(event.target)) {
        setIsNotificationsOpen(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target) && isMobileMenuOpen) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isMobileMenuOpen]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    setIsProfileOpen(false);
    setIsMobileMenuOpen(false);
    navigate("/");
  };

  const getUserDisplayName = () => {
    if (!user) return "User";
    return user.firstName || user.businessName || user.name || user.email?.split('@')[0] || "User";
  };

  const getUserDashboardRoute = () => {
    if (!user) return "/client/dashboard";
    
    const userType = user?.role || user?.userType || user?.type;
    
    if (userType) {
      const type = userType.toLowerCase();
      if (type.includes("client") || type.includes("customer") || type.includes("user")) {
        return "/client/dashboard";
      } else if (type.includes("provider") || type.includes("service") || type.includes("vendor")) {
        return "/provider/dashboard";
      } else if (type.includes("admin") || type.includes("administrator")) {
        return "/admin-dashboard";
      }
    }

    return "/client/dashboard";
  };

  // Show loading state while authentication is being checked
  if (loading) {
    return (
      <>
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/80">
          <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
            <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
              
              {/* Logo Section - Loading */}
              <div className="flex items-center flex-shrink-0">
                <div className="flex items-center space-x-2 sm:space-x-3">
                  <div className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11 bg-gray-300 rounded-full animate-pulse"></div>
                  <div className="flex flex-col space-y-1">
                    <div className="h-6 w-32 bg-gray-300 rounded animate-pulse"></div>
                    <div className="h-3 w-24 bg-gray-300 rounded animate-pulse hidden xs:block"></div>
                  </div>
                </div>
              </div>

              {/* Desktop Navigation - Loading */}
              <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 mx-4 xl:mx-8">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="h-10 w-20 bg-gray-300 rounded-lg animate-pulse"></div>
                ))}
              </div>

              {/* Right Section - Loading */}
              <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
                <div className="h-10 w-10 bg-gray-300 rounded-lg animate-pulse"></div>
                <div className="h-10 w-20 bg-gray-300 rounded-lg animate-pulse"></div>
                <div className="h-10 w-20 bg-gray-300 rounded-lg animate-pulse"></div>
              </div>

              {/* Mobile Menu - Loading */}
              <div className="flex lg:hidden items-center space-x-1 sm:space-x-2">
                <div className="h-8 w-8 bg-gray-300 rounded-lg animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-300 rounded-lg animate-pulse"></div>
                <div className="h-8 w-8 bg-gray-300 rounded-lg animate-pulse"></div>
              </div>
            </div>
          </div>
        </nav>
        
        {/* Spacer to prevent content from being hidden behind fixed navbar */}
        <div className="h-14 sm:h-16 lg:h-20"></div>
      </>
    );
  }

  return (
    <>
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled 
            ? "bg-white/95 backdrop-blur-lg shadow-lg border-b border-gray-200/80" 
            : "bg-white/90 backdrop-blur-md"
        }`}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex justify-between items-center h-14 sm:h-16 lg:h-20">
            
            {/* Logo Section */}
            <div className="flex items-center flex-shrink-0">
              <Link 
                to="/" 
                className="flex items-center space-x-2 sm:space-x-3 group"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                <motion.div 
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center justify-center"
                >
                  <img 
                    src={logo} 
                    alt="Watu Kazi Logo"
                    className="h-6 w-6 xs:h-7 xs:w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 xl:h-11 xl:w-11 transition-all duration-300 object-contain rounded-full"
                  />
                </motion.div>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-xl lg:text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-700 bg-clip-text text-transparent">
                    Watu Kazi
                  </span>
                  <span className="text-xs text-gray-500 -mt-1 hidden xs:block">
                    {language === 'sw' ? "Tafuta Kazi Ya Ndoto Yako" : "Find Your Dream Job"}
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-1 xl:space-x-2 mx-4 xl:mx-8">
              {menuItems.map((item) => {
                const IconComponent = item.icon;
                return (
                  <Link
                    key={item.name}
                    to={item.path}
                    className={`flex items-center space-x-2 px-3 xl:px-4 py-2 xl:py-3 rounded-lg xl:rounded-xl font-medium transition-all duration-200 ${
                      activePath === item.path
                        ? "text-blue-600 bg-blue-50 border border-blue-100 shadow-sm"
                        : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                    <span className="text-sm xl:text-base">{item.name}</span>
                  </Link>
                );
              })}
            </div>

            {/* Right Section - Desktop */}
            <div className="hidden lg:flex items-center space-x-2 xl:space-x-3">
              
              {/* Language Toggle */}
              <motion.button
                onClick={toggleLanguage}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 xl:p-3 rounded-lg xl:rounded-xl text-gray-600 hover:text-blue-600 hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                aria-label={language === 'sw' ? "Switch to English" : "Badilisha lugha kwa Kiswahili"}
              >
                <div className="flex items-center gap-1">
                  <FaGlobe className="w-4 h-4" />
                  <span className="text-xs font-medium">{language === 'sw' ? 'EN' : 'SW'}</span>
                </div>
              </motion.button>

              {/* Auth Buttons - Show when not logged in */}
              {!isAuthenticated ? (
                <>
                  <Link to="/signin">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-4 xl:px-6 py-2 xl:py-3 text-blue-600 hover:text-blue-700 font-medium rounded-lg xl:rounded-xl hover:bg-blue-50 transition-all duration-200 border border-transparent hover:border-blue-200"
                    >
                      <FaSignInAlt className="w-4 h-4" />
                      <span>{t.signIn}</span>
                    </motion.button>
                  </Link>
                  <Link to="/signup">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-4 xl:px-6 py-2 xl:py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg xl:rounded-xl shadow-lg shadow-blue-500/25 transition-all duration-200"
                    >
                      <FaUserPlus className="w-4 h-4" />
                      <span>{t.signUp}</span>
                    </motion.button>
                  </Link>
                </>
              ) : (
                <>
                  {/* Dashboard Link */}
                  <Link to={getUserDashboardRoute()}>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center space-x-2 px-4 xl:px-6 py-2 xl:py-3 text-green-600 hover:text-green-700 font-medium rounded-lg xl:rounded-xl hover:bg-green-50 transition-all duration-200 border border-transparent hover:border-green-200"
                    >
                      <FaBuilding className="w-4 h-4" />
                      <span>{t.dashboard}</span>
                    </motion.button>
                  </Link>

                  {/* Notification Bell */}
                  <div className="relative" ref={notificationsRef}>
                    <motion.button
                      onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`p-2 xl:p-3 rounded-lg xl:rounded-xl transition-all duration-200 relative ${
                        isNotificationsOpen 
                          ? "bg-blue-50 text-blue-600 border border-blue-100" 
                          : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                    >
                      <FaBell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <motion.span 
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold border-2 border-white shadow-sm"
                        >
                          {unreadCount}
                        </motion.span>
                      )}
                    </motion.button>

                    {/* Notifications Dropdown */}
                    <AnimatePresence>
                      {isNotificationsOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute right-0 mt-2 w-80 xl:w-96 bg-white rounded-xl xl:rounded-2xl shadow-xl border border-gray-200/80 backdrop-blur-lg z-50"
                        >
                          <div className="p-4 border-b border-gray-100">
                            <div className="flex items-center justify-between">
                              <h3 className="font-semibold text-gray-900 text-base xl:text-lg">
                                {t.notifications}
                              </h3>
                              {unreadCount > 0 && (
                                <span className="bg-orange-500 text-white text-xs px-2.5 py-1 rounded-full font-medium">
                                  {unreadCount} {t.new}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="max-h-80 overflow-y-auto">
                            {notifications.map((notification) => (
                              <motion.div
                                key={notification.id}
                                whileHover={{ backgroundColor: "rgba(243, 244, 246, 0.5)" }}
                                className={`p-3 xl:p-4 border-b border-gray-50 cursor-pointer transition-colors duration-150 ${
                                  notification.unread ? 'bg-orange-50' : ''
                                }`}
                              >
                                <div className="flex items-start gap-3 xl:gap-4">
                                  <div className={`flex-shrink-0 w-2 h-2 xl:w-3 xl:h-3 mt-2 rounded-full ${
                                    notification.unread ? 'bg-orange-500' : 'bg-gray-400'
                                  }`} />
                                  <div className="flex-1 min-w-0">
                                    <p className="text-sm text-gray-900 font-medium leading-relaxed">
                                      {notification.text}
                                    </p>
                                    <p className="text-xs text-gray-500 mt-1">
                                      {notification.time}
                                    </p>
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>

                          <div className="p-3 border-t border-gray-100">
                            <button className="w-full text-center text-sm text-blue-600 hover:text-blue-700 font-medium py-2 transition-colors duration-200 rounded-lg hover:bg-blue-50">
                              {t.viewAll} {t.notifications}
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>

                  {/* Profile Dropdown */}
                  <div className="relative" ref={profileRef}>
                    <motion.button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="flex items-center space-x-2 xl:space-x-3 p-1 xl:p-2 rounded-lg xl:rounded-xl hover:bg-gray-50 transition-all duration-200 border border-transparent hover:border-gray-200"
                    >
                      <div className="flex items-center space-x-2">
                        <Avatar user={user} size="sm" />
                        <div className="hidden xl:block text-left">
                          <p className="text-sm font-semibold text-gray-900 truncate max-w-[120px]">
                            {getUserDisplayName()}
                          </p>
                          <p className="text-xs text-gray-500">{t.premiumMember}</p>
                        </div>
                      </div>
                      <FaChevronDown className={`w-3 h-3 text-gray-400 transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                    </motion.button>

                    <AnimatePresence>
                      {isProfileOpen && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.95, y: 10 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          exit={{ opacity: 0, scale: 0.95, y: 10 }}
                          className="absolute right-0 mt-2 w-56 xl:w-64 bg-white rounded-xl xl:rounded-2xl shadow-xl border border-gray-200/80 backdrop-blur-lg z-50"
                        >
                          <div className="p-3 xl:p-4 border-b border-gray-100">
                            <div className="flex items-center space-x-3">
                              <Avatar user={user} size="md" />
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 text-sm xl:text-base truncate">
                                  {getUserDisplayName()}
                                </p>
                                <p className="text-xs xl:text-sm text-gray-500 truncate">
                                  {user?.email || "Premium Member"}
                                </p>
                              </div>
                            </div>
                          </div>

                          <div className="py-2">
                            <Link
                              to="/profile"
                              className="flex items-center space-x-3 px-3 xl:px-4 py-2 xl:py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 group text-sm xl:text-base"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <FaUser className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                              <span>{t.myProfile}</span>
                            </Link>
                            <Link
                              to={getUserDashboardRoute()}
                              className="flex items-center space-x-3 px-3 xl:px-4 py-2 xl:py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 group text-sm xl:text-base"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <FaBuilding className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                              <span>{t.dashboard}</span>
                            </Link>
                            <Link
                              to="/settings"
                              className="flex items-center space-x-3 px-3 xl:px-4 py-2 xl:py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 group text-sm xl:text-base"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <FaCog className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                              <span>{t.settings}</span>
                            </Link>
                            <Link
                              to="/help"
                              className="flex items-center space-x-3 px-3 xl:px-4 py-2 xl:py-3 text-gray-700 hover:bg-gray-50 transition-colors duration-200 group text-sm xl:text-base"
                              onClick={() => setIsProfileOpen(false)}
                            >
                              <FaQuestionCircle className="w-4 h-4 text-gray-400 group-hover:text-blue-600" />
                              <span>{t.helpSupport}</span>
                            </Link>
                          </div>

                          <div className="border-t border-gray-100 p-2">
                            <button 
                              className="flex items-center space-x-3 w-full text-left px-3 xl:px-4 py-2 xl:py-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200 group text-sm xl:text-base"
                              onClick={handleLogout}
                            >
                              <FaSignOutAlt className="w-4 h-4 group-hover:scale-110 transition-transform" />
                              <span className="font-medium">{t.signOut}</span>
                            </button>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </>
              )}
            </div>

            {/* Mobile Search & Menu */}
            <div className="flex lg:hidden items-center space-x-1 sm:space-x-2">
              
              {/* Language Toggle - Mobile */}
              <motion.button
                onClick={toggleLanguage}
                whileTap={{ scale: 0.95 }}
                className="p-2 sm:p-3 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-colors duration-200"
                aria-label={language === 'sw' ? "Switch to English" : "Badilisha lugha kwa Kiswahili"}
              >
                <div className="flex items-center gap-1">
                  <FaGlobe className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="text-xs font-medium hidden sm:inline">{language === 'sw' ? 'EN' : 'SW'}</span>
                </div>
              </motion.button>

              {/* Auth Buttons - Mobile (when not logged in) */}
              {!isAuthenticated && (
                <div className="flex items-center space-x-1 sm:space-x-2">
                  <Link to="/signin">
                    <motion.button
                      whileTap={{ scale: 0.95 }}
                      className="p-2 sm:p-3 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg sm:rounded-xl transition-colors duration-200"
                    >
                      <FaSignInAlt className="w-4 h-4 sm:w-5 sm:h-5" />
                    </motion.button>
                  </Link>
                </div>
              )}

              {/* Dashboard Button - Mobile (when logged in) */}
              {isAuthenticated && (
                <Link to={getUserDashboardRoute()}>
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="p-2 sm:p-3 text-green-600 hover:text-green-700 hover:bg-green-50 rounded-lg sm:rounded-xl transition-colors duration-200"
                  >
                    <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5" />
                  </motion.button>
                </Link>
              )}

              {/* Notification Bell - Mobile (when logged in) */}
              {isAuthenticated && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  className="p-2 sm:p-3 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-colors duration-200 relative"
                >
                  <FaBell className="w-4 h-4 sm:w-5 sm:h-5" />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center font-bold border-2 border-white">
                      {unreadCount}
                    </span>
                  )}
                </motion.button>
              )}

              {/* Profile Icon - Mobile (when logged in) */}
              {isAuthenticated && (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className="p-1 sm:p-2 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-colors duration-200"
                >
                  <Avatar user={user} size="sm" />
                </motion.button>
              )}

              {/* Mobile Menu Button */}
              <motion.button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
                className="p-2 sm:p-3 text-gray-600 hover:text-blue-600 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-colors duration-200"
              >
                <div className="w-5 h-5 sm:w-6 sm:h-6 flex flex-col justify-center space-y-1">
                  <span className={`block h-0.5 w-5 sm:w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5 sm:translate-y-2' : ''}`}></span>
                  <span className={`block h-0.5 w-5 sm:w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
                  <span className={`block h-0.5 w-5 sm:w-6 bg-current transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5 sm:-translate-y-2' : ''}`}></span>
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            {/* Menu Content */}
            <motion.div
              ref={mobileMenuRef}
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-80 max-w-full bg-white shadow-2xl z-50 lg:hidden overflow-y-auto"
            >
              <div className="p-4 sm:p-6 border-b border-gray-200">
                <div className="flex items-center justify-between mb-4 sm:mb-6">
                  <Link to="/" className="flex items-center space-x-3" onClick={() => setIsMobileMenuOpen(false)}>
                    <img 
                      src={logo} 
                      alt="Watu Kazi Logo"
                      className="w-10 h-10 rounded-full object-contain"
                    />
                    <span className="text-xl font-bold text-gray-900">Watu Kazi</span>
                  </Link>
                  <button
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                {/* User Info - Show when logged in */}
                {isAuthenticated && (
                  <div className="flex items-center space-x-3 p-3 sm:p-4 bg-gray-50 rounded-xl mb-4 sm:mb-6">
                    <Avatar user={user} size="md" />
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {getUserDisplayName()}
                      </p>
                      <p className="text-xs sm:text-sm text-gray-500 truncate">{t.premiumMember}</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Mobile Menu Items */}
              <div className="p-3 sm:p-4 space-y-1">
                {menuItems.map((item) => {
                  const IconComponent = item.icon;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-sm sm:text-base ${
                        activePath === item.path
                          ? "text-blue-600 bg-blue-50 border border-blue-100"
                          : "text-gray-700 hover:text-blue-600 hover:bg-gray-50"
                      }`}
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <IconComponent className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}

                {/* Dashboard Link - Mobile (when logged in) */}
                {isAuthenticated && (
                  <Link
                    to={getUserDashboardRoute()}
                    className="flex items-center space-x-3 px-3 sm:px-4 py-3 sm:py-4 rounded-lg sm:rounded-xl font-medium transition-all duration-200 text-sm sm:text-base text-green-600 bg-green-50 border border-green-100"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <FaBuilding className="w-4 h-4 sm:w-5 sm:h-5" />
                    <span>{t.dashboard}</span>
                  </Link>
                )}
              </div>

              {/* Mobile Actions */}
              <div className="p-3 sm:p-4 border-t border-gray-200 mt-4 space-y-3">
                {/* Language Toggle in Mobile Menu */}
                <button
                  onClick={toggleLanguage}
                  className="flex items-center space-x-3 w-full text-left p-3 sm:p-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-colors duration-200 text-sm sm:text-base"
                >
                  <FaGlobe className="w-4 h-4 sm:w-5 sm:h-5" />
                  <span className="font-medium">
                    {language === 'sw' ? 'Switch to English' : 'Badilisha kwa Kiswahili'}
                  </span>
                </button>

                {/* Auth Buttons - Show when not logged in */}
                {!isAuthenticated ? (
                  <div className="space-y-3">
                    <Link to="/signin" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="flex items-center space-x-3 w-full text-left p-3 sm:p-4 text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg sm:rounded-xl transition-colors duration-200 text-sm sm:text-base font-medium">
                        <FaSignInAlt className="w-4 h-4 sm:w-5 sm:h-5" />
                        <span>{t.signIn}</span>
                      </button>
                    </Link>
                    <Link to="/signup" onClick={() => setIsMobileMenuOpen(false)}>
                      <button className="flex items-center space-x-3 w-full text-left p-3 sm:p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg sm:rounded-xl transition-colors duration-200 text-sm sm:text-base font-medium">
                        <FaUserPlus className="w-4 h-4 sm:w-5 sm:w-5" />
                        <span>{t.signUp}</span>
                      </button>
                    </Link>
                  </div>
                ) : (
                  <>
                    <button className="flex items-center space-x-3 w-full text-left p-3 sm:p-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-colors duration-200 text-sm sm:text-base">
                      <FaBell className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span className="font-medium">{t.notifications} ({unreadCount})</span>
                    </button>
                    <Link 
                      to="/profile"
                      className="flex items-center space-x-3 w-full text-left p-3 sm:p-4 text-gray-700 hover:text-blue-600 hover:bg-gray-50 rounded-lg sm:rounded-xl transition-colors duration-200 text-sm sm:text-base"
                      onClick={() => setIsMobileMenuOpen(false)}
                    >
                      <FaUser className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{t.myProfile}</span>
                    </Link>
                    <button 
                      className="flex items-center space-x-3 w-full text-left p-3 sm:p-4 text-red-600 hover:bg-red-50 rounded-lg sm:rounded-xl transition-colors duration-200 text-sm sm:text-base font-medium"
                      onClick={handleLogout}
                    >
                      <FaSignOutAlt className="w-4 h-4 sm:w-5 sm:h-5" />
                      <span>{t.signOut}</span>
                    </button>
                  </>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Spacer to prevent content from being hidden behind fixed navbar */}
      <div className="h-14 sm:h-16 lg:h-20"></div>
    </>
  );
};

export default Navbar;