import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FaPhone,
  FaLock,
  FaGoogle,
  FaApple,
  FaSignInAlt,
  FaEye,
  FaEyeSlash,
  FaGlobe,
  FaExclamationCircle,
  FaSpinner,
} from "react-icons/fa";
import { useLanguage } from "../components/LanguageContext";
import { useAuth } from "../contexts/authContext";

const LoginForm = () => {
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    identifier: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { language, toggleLanguage } = useLanguage();

  // Translation text
  const content = {
    sw: {
      welcome: "Karibu Tena",
      subtitle: "Ingia kwa namba yako ya simu",
      phoneLabel: "Namba ya Simu",
      phonePlaceholder: "+255 600 660 555",
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
      fillAllFields: "Tafadhali jaza namba ya simu na nenosiri",
      invalidCredentials: "Namba ya simu au nenosiri si sahihi",
      networkError: "Hitilafu ya mtandao. Tafadhali angalia muunganisho wako",
      somethingWentWrong: "Kuna hitilafu imetokea, tafadhali jaribu tena",
      loginSuccess: "Umefanikiwa kuingia!",
      redirecting: "Inaelekeza...",
    },
    en: {
      welcome: "Welcome Back",
      subtitle: "Sign in with your phone number",
      phoneLabel: "Phone Number",
      phonePlaceholder: "0699571386",
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
      fillAllFields: "Please fill in phone number and password",
      invalidCredentials: "Invalid phone number or password",
      networkError: "Network error. Please check your connection",
      somethingWentWrong: "Something went wrong, please try again",
      loginSuccess: "Login successful!",
      redirecting: "Redirecting...",
    },
  };

  const t = content[language];

  useEffect(() => {
    setIsMounted(true);
    const savedDarkMode = localStorage.getItem("darkMode") === "true";
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const initialDark = savedDarkMode !== null ? savedDarkMode : prefersDark;
    setIsDarkMode(initialDark);

    if (initialDark) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    const rememberedPhone = localStorage.getItem("rememberedPhone");
    if (rememberedPhone) {
      setFormData((prev) => ({ ...prev, identifier: rememberedPhone, rememberMe: true }));
    }
  }, []);

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    localStorage.setItem("darkMode", newMode.toString());
    document.documentElement.classList.toggle("dark", newMode);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (error) setError("");
  };

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (digits.length <= 10) setFormData((prev) => ({ ...prev, identifier: digits }));
  };

  const determineDashboardRoute = (userData) => {
    if (!userData) {
      console.log("⚠️ No user data provided, defaulting to client dashboard");
      return "/client/dashboard";
    }

    // Check user role/type from the API response
    const userType = userData?.role || userData?.userType || userData?.type;
    
    console.log("👤 User data:", userData);
    console.log("🎭 User type:", userType);

    // Map user types to dashboard routes
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

    // Fallback: Check for specific fields that might indicate user type
    if (userData?.isServiceProvider || userData?.isProvider || userData?.serviceProvider) {
      return "/provider/dashboard";
    }
    
    if (userData?.isClient || userData?.hasProjects || userData?.client) {
      return "/client/dashboard";
    }

    // Default fallback
    console.log("🔍 No specific user type detected, defaulting to client dashboard");
    return "/client/dashboard";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    if (!formData.identifier || !formData.password) {
      setError(t.fillAllFields);
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.identifier)) {
      setError(
        language === "sw"
          ? "Tafadhali weka namba ya simu sahihi (tarakimu 10)"
          : "Please enter a valid 10-digit phone number"
      );
      return;
    }

    setLoading(true);
    setError("");

    try {
      const loginData = {
        identifier: formData.identifier,
        password: formData.password,
      };

      const API_URL = "https://api.watukazi.com/api/v1";
      console.log("🚀 Sending login request to:", `${API_URL}/auth/login`);
      
      const response = await axios.post(`${API_URL}/auth/login`, loginData, {
        headers: { 
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        timeout: 15000,
      });

      console.log("✅ Login API Response:", response);
      console.log("✅ Response data:", response.data);

      // Handle remember me
      if (formData.rememberMe) {
        localStorage.setItem("rememberedPhone", formData.identifier);
      } else {
        localStorage.removeItem("rememberedPhone");
      }

      // Extract user data and token from response
      const userData = response.data.user || response.data.data || response.data;
      const accessToken = response.data.accessToken || response.data.token;

      if (!accessToken) {
        throw new Error("No access token received from server");
      }

      if (!userData) {
        throw new Error("No user data received from server");
      }

      // Use the auth context login function
      login(userData, accessToken, formData.rememberMe);

      // Show success message
      setError(""); // Clear any previous errors
      
      // Determine dashboard route
      const dashboardRoute = determineDashboardRoute(userData);
      
      console.log("🎯 Redirecting to:", dashboardRoute);

      // Add a small delay to ensure storage is committed and show success state
      setTimeout(() => {
        navigate(dashboardRoute, {
          replace: true,
          state: {
            user: userData,
            message: t.loginSuccess,
            from: "login",
          },
        });
      }, 1000);

    } catch (err) {
      console.error("❌ Login error:", err);
      
      // Enhanced error handling
      if (err.response) {
        const status = err.response.status;
        const errorData = err.response.data;
        
        console.log("🔍 Error response details:", {
          status,
          data: errorData,
          headers: err.response.headers
        });

        if (status === 401 || status === 404) {
          setError(t.invalidCredentials);
        } else if (status === 422) {
          // Validation errors
          const validationErrors = errorData.errors || errorData.message;
          if (typeof validationErrors === "string") {
            setError(validationErrors);
          } else if (Array.isArray(validationErrors)) {
            setError(validationErrors.join(", "));
          } else {
            setError(t.invalidCredentials);
          }
        } else if (status >= 500) {
          setError(
            language === "sw"
              ? "Hitilafu ya seva, tafadhali jaribu tena baadaye"
              : "Server error, please try again later"
          );
        } else {
          setError(errorData?.message || errorData?.error || t.somethingWentWrong);
        }
      } else if (err.request) {
        console.error("🚫 Network error - no response received:", err.request);
        setError(t.networkError);
      } else {
        console.error("🚫 Request setup error:", err.message);
        setError(err.message || t.somethingWentWrong);
      }
    } finally {
      setLoading(false);
    }
  };

  // Debug current storage state
  useEffect(() => {
    console.log("🔍 Current storage state:", {
      localStorage: {
        authToken: localStorage.getItem("authToken") ? "Present" : "Missing",
        userData: localStorage.getItem("userData") ? "Present" : "Missing",
        rememberedPhone: localStorage.getItem("rememberedPhone"),
      },
      sessionStorage: {
        authToken: sessionStorage.getItem("authToken") ? "Present" : "Missing",
        userData: sessionStorage.getItem("userData") ? "Present" : "Missing",
      },
    });
  }, []);

  if (!isMounted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <FaSpinner className="animate-spin text-blue-600 text-3xl" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto relative">
        {/* Top buttons */}
        <div className="fixed top-4 right-4 flex gap-2 z-10">
          <motion.button
            onClick={toggleLanguage}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-300 dark:border-gray-700 text-xs flex items-center gap-1 transition-colors"
          >
            <FaGlobe className="text-gray-600 dark:text-gray-400" />
            {language === "sw" ? "EN" : "SW"}
          </motion.button>
          <motion.button
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow-lg border border-gray-300 dark:border-gray-700 transition-colors"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </motion.button>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-xl border border-gray-200 dark:border-gray-700"
        >
          <div className="text-center mb-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring" }}
              className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3"
            >
              <FaSignInAlt className="text-white text-xl" />
            </motion.div>
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="text-2xl font-bold dark:text-white"
            >
              {t.welcome}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-400 text-sm mt-1"
            >
              {t.subtitle}
            </motion.p>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg flex items-center gap-2"
            >
              <FaExclamationCircle className="text-red-500 flex-shrink-0" />
              <p className="text-xs text-red-600 dark:text-red-300">{error}</p>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.phoneLabel}
              </label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type="tel"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handlePhoneChange}
                  className="w-full pl-10 pr-3 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  placeholder={t.phonePlaceholder}
                  maxLength="10"
                  disabled={loading}
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.phoneHelp}</p>
            </div>

            {/* Password Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                {t.passwordLabel}
              </label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white placeholder-gray-500 dark:placeholder-gray-400 transition-colors"
                  placeholder={t.passwordPlaceholder}
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:hover:text-gray-300 transition-colors"
                  disabled={loading}
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex justify-between items-center text-sm">
              <label className="flex items-center gap-2 text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                  disabled={loading}
                />
                {t.rememberMe}
              </label>
              <Link
                to="/forgot-password"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
              >
                {t.forgotPassword}
              </Link>
            </div>

            {/* Submit Button */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: loading ? 1 : 1.02 }}
              whileTap={{ scale: loading ? 1 : 0.98 }}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed shadow-lg"
            >
              {loading ? (
                <>
                  <FaSpinner className="animate-spin" />
                  {t.signingIn}
                </>
              ) : (
                <>
                  <FaSignInAlt />
                  {t.signIn}
                </>
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="my-6 border-t border-gray-300 dark:border-gray-700 relative">
            <span className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white dark:bg-gray-800 px-3 text-sm text-gray-500 dark:text-gray-400">
              {t.orContinue}
            </span>
          </div>

          {/* Social Login Buttons */}
          <div className="grid grid-cols-2 gap-3">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              <FaGoogle className="text-red-500" />
              {t.google}
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="button"
              disabled={loading}
              className="flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 py-2.5 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors disabled:opacity-50"
            >
              <FaApple />
              {t.apple}
            </motion.button>
          </div>

          {/* Signup Link */}
          <p className="text-center text-sm text-gray-600 dark:text-gray-400 mt-6">
            {t.noAccount}{" "}
            <Link
              to="/signup"
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors"
            >
              {t.signUp}
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;