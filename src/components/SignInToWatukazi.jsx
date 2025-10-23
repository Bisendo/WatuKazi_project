import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import {
  FaPhone, FaLock, FaGoogle, FaApple, FaSignInAlt,
  FaEye, FaEyeSlash, FaGlobe, FaExclamationCircle, FaSpinner
} from "react-icons/fa";
import { useLanguage } from "../components/LanguageContext";

const LoginForm = () => {
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
      phonePlaceholder: "0699571386",
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
      setFormData(prev => ({ ...prev, identifier: rememberedPhone, rememberMe: true }));
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
    setFormData(prev => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    if (error) setError("");
  };

  const handlePhoneChange = (e) => {
    const digits = e.target.value.replace(/\D/g, "");
    if (digits.length <= 10) setFormData(prev => ({ ...prev, identifier: digits }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.identifier || !formData.password) {
      setError(t.fillAllFields);
      return;
    }

    const phoneRegex = /^\d{10}$/;
    if (!phoneRegex.test(formData.identifier)) {
      setError(language === "sw"
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
      const res = await axios.post(`${API_URL}/auth/login`, loginData, {
        headers: { "Content-Type": "application/json" },
        timeout: 10000,
      });

      console.log("✅ Login success:", res.data);

      if (formData.rememberMe)
        localStorage.setItem("rememberedPhone", formData.identifier);
      else localStorage.removeItem("rememberedPhone");

      if (res.data.token) {
        localStorage.setItem("authToken", res.data.token);
        localStorage.setItem("userData", JSON.stringify(res.data.user));
        sessionStorage.setItem("authToken", res.data.token);
        sessionStorage.setItem("userData", JSON.stringify(res.data.user));
      }

      setTimeout(() => {
        navigate("/dashboard", {
          replace: true,
          state: { user: res.data.user, message: t.loginSuccess },
        });
      }, 800);

    } catch (err) {
      console.error("❌ Login error:", err);
      if (err.response) {
        if (err.response.status === 401 || err.response.status === 404) setError(t.invalidCredentials);
        else if (err.response.status >= 500)
          setError(language === "sw" ? "Hitilafu ya seva, tafadhali jaribu tena baadaye" : "Server error, please try again later");
        else setError(err.response.data?.message || err.response.data?.error || t.somethingWentWrong);
      } else if (err.request) setError(t.networkError);
      else setError(t.somethingWentWrong);
    } finally {
      setLoading(false);
    }
  };

  if (!isMounted)
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900">
        <FaSpinner className="animate-spin text-blue-600 text-3xl" />
      </div>
    );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto relative">
        {/* Top buttons */}
        <div className="fixed top-4 right-4 flex gap-2 z-10">
          <motion.button
            onClick={toggleLanguage}
            whileHover={{ scale: 1.1 }}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow border border-gray-300 dark:border-gray-700 text-xs flex items-center gap-1"
          >
            <FaGlobe /> {language === "sw" ? "EN" : "SW"}
          </motion.button>
          <motion.button
            onClick={toggleDarkMode}
            whileHover={{ scale: 1.1 }}
            className="p-2 bg-white dark:bg-gray-800 rounded-full shadow border border-gray-300 dark:border-gray-700"
          >
            {isDarkMode ? "☀️" : "🌙"}
          </motion.button>
        </div>

        {/* Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="text-center mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-3">
              <FaSignInAlt className="text-white text-xl" />
            </div>
            <h1 className="text-2xl font-bold dark:text-white">{t.welcome}</h1>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{t.subtitle}</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg flex items-center gap-2">
              <FaExclamationCircle className="text-red-500" />
              <p className="text-xs text-red-600 dark:text-red-300">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Phone */}
            <div>
              <label className="block text-sm font-medium dark:text-gray-300">{t.phoneLabel}</label>
              <div className="relative">
                <FaPhone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="tel"
                  name="identifier"
                  value={formData.identifier}
                  onChange={handlePhoneChange}
                  className="w-full pl-10 pr-3 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                  placeholder={t.phonePlaceholder}
                  maxLength="10"
                />
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{t.phoneHelp}</p>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium dark:text-gray-300">{t.passwordLabel}</label>
              <div className="relative">
                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full pl-10 pr-10 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white"
                  placeholder={t.passwordPlaceholder}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <FaEyeSlash /> : <FaEye />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex justify-between text-sm">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleChange}
                />
                {t.rememberMe}
              </label>
              <Link to="/forgot-password" className="text-blue-500 hover:underline">
                {t.forgotPassword}
              </Link>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded-lg font-semibold transition flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? <><FaSpinner className="animate-spin" /> {t.signingIn}</> : <><FaSignInAlt /> {t.signIn}</>}
            </button>
          </form>

          {/* Divider */}
          <div className="my-4 border-t border-gray-300 dark:border-gray-700"></div>

          {/* Social */}
          <div className="grid grid-cols-2 gap-2">
            <button className="flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-600">
              <FaGoogle className="text-red-500" /> {t.google}
            </button>
            <button className="flex items-center justify-center gap-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 py-2 rounded-lg text-sm hover:bg-gray-50 dark:hover:bg-gray-600">
              <FaApple /> {t.apple}
            </button>
          </div>

          {/* Signup link */}
          <p className="text-center text-xs text-gray-500 dark:text-gray-400 mt-4">
            {t.noAccount}{" "}
            <Link to="/signup" className="text-blue-500 hover:underline">{t.signUp}</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginForm;
