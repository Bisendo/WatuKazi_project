import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import { FaPhone, FaLock, FaGoogle, FaApple, FaSignInAlt, FaEye, FaEyeSlash, FaGlobe, FaExclamationCircle, FaSpinner } from "react-icons/fa";
import { useLanguage } from "../components/LanguageContext";

const LoginForm = () => {
  const [formData, setFormData] = useState({
    phone: "",
    password: "",
    rememberMe: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get language from context
  const { language, toggleLanguage } = useLanguage();

  // Language content
  const content = {
    sw: {
      welcome: "Karibu Tena",
      subtitle: "Ingia kwa namba yako ya simu",
      phoneLabel: "Namba ya Simu",
      phonePlaceholder: "(123) 456-7890",
      phoneHelp: "Weka namba yako ya simu (tarakimu 10)",
      passwordLabel: "Nenosiri",
      passwordPlaceholder: "Weka nenosiri lako",
      rememberMe: "Nikumbuke",
      forgotPassword: "Umesahau nenosiri?",
      signIn: "Ingia",
      signingIn: "Inaingiza...",
      orContinue: "Au ingia kwa",
      noAccount: "Huna akaunti?",
      signUp: "Jisajili",
      google: "Google",
      apple: "Apple",
      // Error messages
      fillAllFields: "Tafadhali jaza namba ya simu na nenosiri",
      invalidCredentials: "Namba ya simu au nenosiri si sahihi",
      networkError: "Hitilafu ya mtandao. Tafadhali angalia muunganisho wako",
      somethingWentWrong: "Kuna hitilafu imetokea, tafadhali jaribu tena",
      loginSuccess: "Umefanikiwa kuingia!"
    },
    en: {
      welcome: "Welcome Back",
      subtitle: "Sign in with your phone number",
      phoneLabel: "Phone Number",
      phonePlaceholder: "(123) 456-7890",
      phoneHelp: "Enter your 10-digit phone number",
      passwordLabel: "Password",
      passwordPlaceholder: "Enter your password",
      rememberMe: "Remember me",
      forgotPassword: "Forgot password?",
      signIn: "Sign In",
      signingIn: "Signing in...",
      orContinue: "Or continue with",
      noAccount: "Don't have an account?",
      signUp: "Sign up",
      google: "Google",
      apple: "Apple",
      // Error messages
      fillAllFields: "Please fill in phone number and password",
      invalidCredentials: "Invalid phone number or password",
      networkError: "Network error. Please check your connection",
      somethingWentWrong: "Something went wrong, please try again",
      loginSuccess: "Login successful!"
    }
  };

  const t = content[language];

  // Check for success message from signup
  useEffect(() => {
    if (location.state?.message) {
      // You can show a success message here if needed
      console.log(location.state.message);
    }
  }, [location.state]);

  // Initialize dark mode from localStorage
  useEffect(() => {
    setIsMounted(true);
    
    const savedDarkMode = localStorage.getItem('darkMode') === 'true';
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialDarkMode = savedDarkMode !== null ? savedDarkMode : systemPrefersDark;

    setIsDarkMode(initialDarkMode);
    if (initialDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    // Check for remembered phone number
    const rememberedPhone = localStorage.getItem('rememberedPhone');
    if (rememberedPhone) {
      setFormData(prev => ({
        ...prev,
        phone: rememberedPhone,
        rememberMe: true
      }));
    }
  }, []);

  const toggleDarkMode = () => {
    const newDarkMode = !isDarkMode;
    setIsDarkMode(newDarkMode);
    localStorage.setItem('darkMode', newDarkMode.toString());

    if (newDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Basic validation
    if (!formData.phone || !formData.password) {
      setError(t.fillAllFields);
      return;
    }

    setLoading(true);
    setError("");

    try {
      // Prepare data for backend
      const loginData = {
        phoneNumber: formData.phone.replace(/\D/g, ''), // Remove formatting for backend
        password: formData.password
      };

      // Use environment variable with fallback
      const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000/api";
      
      console.log("Attempting login to:", `${API_URL}/auth/login`);

      const response = await axios.post(`${API_URL}/auth/login`, loginData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      console.log("Login successful:", response.data);

      // Store remember me phone if checked
      if (formData.rememberMe) {
        localStorage.setItem('rememberedPhone', formData.phone);
      } else {
        localStorage.removeItem('rememberedPhone');
      }

      // Store authentication token
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('userData', JSON.stringify(response.data.user));
      }

      // Show success message
      setError(""); // Clear any errors
      
      // Navigate to dashboard after successful login
      setTimeout(() => {
        navigate("/dashboard", { 
          replace: true,
          state: { 
            user: response.data.user,
            message: t.loginSuccess
          }
        });
      }, 1000);

    } catch (err) {
      console.error("Login error:", err);
      
      // Handle different error scenarios
      if (err.response) {
        // Server responded with error status
        if (err.response.status === 401) {
          setError(t.invalidCredentials);
        } else if (err.response.status === 404) {
          setError(t.invalidCredentials);
        } else {
          const errorMessage = err.response.data?.message || err.response.data?.error || t.somethingWentWrong;
          setError(errorMessage);
        }
      } else if (err.request) {
        // Request was made but no response received
        setError(t.networkError);
      } else {
        // Something else happened
        setError(t.somethingWentWrong);
      }
    } finally {
      setLoading(false);
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Format phone number as user types
  const formatPhoneNumber = (value) => {
    const phoneNumber = value.replace(/\D/g, '');
    
    if (phoneNumber.length <= 3) {
      return phoneNumber;
    } else if (phoneNumber.length <= 6) {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3)}`;
    } else {
      return `(${phoneNumber.slice(0, 3)}) ${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6, 10)}`;
    }
  };

  const handlePhoneChange = (e) => {
    const formattedPhone = formatPhoneNumber(e.target.value);
    setFormData(prev => ({
      ...prev,
      phone: formattedPhone
    }));
  };

  // Handle social login (placeholder functions)
  const handleGoogleLogin = async () => {
    console.log("Google login clicked");
    // Implement Google OAuth here
  };

  const handleAppleLogin = async () => {
    console.log("Apple login clicked");
    // Implement Apple OAuth here
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
        <div className="w-full max-w-sm">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700">
            <div className="text-center">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
                <FaSignInAlt className="text-white text-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto">
        
        {/* Language and Dark Mode Toggles */}
        <div className="fixed top-4 right-4 flex gap-2 z-10">
          {/* Language Toggle */}
          <motion.button
            onClick={toggleLanguage}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700 shadow-lg"
            aria-label={language === 'sw' ? "Switch to English" : "Badilisha lugha kwa Kiswahili"}
            disabled={loading}
          >
            <div className="flex items-center gap-1">
              <FaGlobe className="w-3 h-3" />
              <span className="text-xs font-medium">{language === 'sw' ? 'EN' : 'SW'}</span>
            </div>
          </motion.button>

          {/* Dark Mode Toggle */}
          <motion.button
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="p-2 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700 shadow-lg"
            aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
            disabled={loading}
          >
            {isDarkMode ? (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
              </svg>
            )}
          </motion.button>
        </div>

        {/* Card Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 border border-gray-100 dark:border-gray-700"
        >
          {/* Header */}
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3"
            >
              <FaSignInAlt className="text-white text-xl" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold text-gray-800 dark:text-white mb-1"
            >
              {t.welcome}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-300 text-sm"
            >
              {t.subtitle}
            </motion.p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg flex items-center gap-3"
            >
              <FaExclamationCircle className="text-red-500 flex-shrink-0 text-sm" />
              <p className="text-red-700 dark:text-red-300 text-xs">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.phoneLabel}
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handlePhoneChange}
                  className="w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                  placeholder={t.phonePlaceholder}
                  maxLength="14"
                  required
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {t.phoneHelp}
              </p>
            </motion.div>

            {/* Password Field */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-sm"
                  placeholder={t.passwordPlaceholder}
                  required
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={togglePasswordVisibility}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors duration-200"
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash className="text-xs" /> : <FaEye className="text-xs" />}
                </button>
              </div>
            </motion.div>

            {/* Remember Me & Forgot Password */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="flex items-center justify-between text-sm"
            >
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="w-3 h-3 text-blue-500 rounded focus:ring-blue-400 border-gray-300 dark:border-gray-600"
                  disabled={loading}
                />
                <span className="text-gray-600 dark:text-gray-300">{t.rememberMe}</span>
              </label>
              <Link
                to="/forgot-password"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-200"
              >
                {t.forgotPassword}
              </Link>
            </motion.div>

            {/* Login Button */}
            <motion.button
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 rounded-lg font-semibold shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-2 hover:from-blue-600 hover:to-blue-700 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin text-xs" />
                  {t.signingIn}
                </>
              ) : (
                <>
                  <FaSignInAlt className="text-xs" />
                  {t.signIn}
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.9 }}
            className="relative my-4"
          >
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200 dark:border-gray-600"></div>
            </div>
            <div className="relative flex justify-center">
              <span className="bg-white dark:bg-gray-800 px-2 text-xs text-gray-500 dark:text-gray-400">{t.orContinue}</span>
            </div>
          </motion.div>

          {/* Social Login */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
            className="grid grid-cols-2 gap-2"
          >
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleGoogleLogin}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 py-2 px-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaGoogle className="text-red-500 text-xs" />
              <span>{t.google}</span>
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAppleLogin}
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-white dark:bg-gray-700 text-gray-700 dark:text-white border border-gray-300 dark:border-gray-600 py-2 px-3 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-600 transition-all duration-300 text-xs disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <FaApple className="text-gray-800 dark:text-white text-xs" />
              <span>{t.apple}</span>
            </motion.button>
          </motion.div>

          {/* Sign Up Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1 }}
            className="text-center mt-4 pt-4 border-t border-gray-200 dark:border-gray-600"
          >
            <p className="text-gray-600 dark:text-gray-300 text-xs">
              {t.noAccount}{" "}
              <Link
                to="/signup"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors duration-200"
              >
                {t.signUp}
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;