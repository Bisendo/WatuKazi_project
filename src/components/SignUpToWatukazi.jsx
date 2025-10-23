import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  FaUser, 
  FaEnvelope, 
  FaPhone, 
  FaLock, 
  FaVenusMars, 
  FaCalendarAlt,
  FaBriefcase,
  FaTools,
  FaArrowRight,
  FaArrowLeft,
  FaCheck,
  FaGlobe,
  FaExclamationCircle,
  FaSpinner,
  FaBuilding,
  FaMapMarkerAlt,
  FaInfoCircle,
  FaHome
} from "react-icons/fa";
import { useLanguage } from "../components/LanguageContext";
import { useVerification } from "../contexts/verificationCode";

const SignupForm = () => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const { setVerificationInfo } = useVerification();

  const [formData, setFormData] = useState({
    // Step 1 - User Type & Basic Info
    role: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    
    // Step 2 - Personal Details
    gender: "",
    dateOfBirth: "",
    
    // Step 3 - Business Info (for service providers)
    businessName: "",
    bio: "",
    city: "",
    country: "",
    address: "",
    
    // Step 4 - Security
    password: "",
    confirmPassword: "",
    referralCode: ""
  });

  // Use language context
  const { language, toggleLanguage } = useLanguage();

  // Language content for SignupForm
  const signupContent = {
    sw: {
      // General
      createAccount: "Fungua Akaunti",
      alreadyHaveAccount: "Tayari una akaunti?",
      signIn: "Ingia",
      // Steps
      basicInfo: "Aina ya Mtumiaji",
      personalDetails: "Taarifa Binafsi",
      businessInfo: "Taarifa za Biashara",
      security: "Usalama",
      // Step 1
      client: "Tafuta Huduma",
      provider: "Toa Huduma",
      firstName: "Jina la Kwanza",
      lastName: "Jina la Mwisho",
      email: "Barua Pepe",
      emailOptional: "(Hiari)",
      phone: "Namba ya Simu",
      // Step 2
      gender: "Jinsia",
      male: "Mwanaume",
      female: "Mwanamke",
      other: "Nyingine",
      dateOfBirth: "Tarehe ya Kuzaliwa",
      // Step 3 - Business Info
      businessName: "Jina la Biashara",
      bio: "Maelezo Mafupi",
      city: "Jiji",
      country: "Nchi",
      address: "Anwani Kamili",
      referralCode: "Msimbo wa Kukaribisha",
      // Step 4
      password: "Nenosiri",
      confirmPassword: "Thibitisha Nenosiri",
      createPassword: "Tengeneza nenosiri",
      confirmYourPassword: "Thibitisha nenosiri lako",
      // Buttons
      back: "Nyuma",
      next: "Endelea",
      createAccountBtn: "Fungua Akaunti",
      creatingAccount: "Inafungua Akaunti...",
      // Placeholders
      firstNamePlaceholder: "Jina",
      lastNamePlaceholder: "Jina la Ukoo",
      emailPlaceholder: "barua@pepe.com",
      phonePlaceholder: "+255 123 456 789",
      businessNamePlaceholder: "Jina la biashara yako",
      bioPlaceholder: "Eleza huduma unazotoa...",
      cityPlaceholder: "Jiji lako",
      countryPlaceholder: "Nchi yako",
      addressPlaceholder: "Anwani yako kamili",
      referralPlaceholder: "Msimbo wa kukaribisha (hiari)",
      // Messages
      successMessage: "Akaunti imefunguliwa kikamilifu!",
      passwordMismatch: "Nenosiri halifanani",
      fillAllFields: "Tafadhali jaza sehemu zote muhimu",
      somethingWentWrong: "Kuna hitilafu imetokea, tafadhali jaribu tena",
      // Descriptions
      clientDesc: "Nikitafuta huduma mbalimbali",
      providerDesc: "Nikitoa huduma kwa wateja"
    },
    en: {
      // General
      createAccount: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      signIn: "Sign in",
      // Steps
      basicInfo: "User Type",
      personalDetails: "Personal Details",
      businessInfo: "Business Info",
      security: "Security",
      // Step 1
      client: "Find Services",
      provider: "Offer Services",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      emailOptional: "(Optional)",
      phone: "Phone Number",
      // Step 2
      gender: "Gender",
      male: "Male",
      female: "Female",
      other: "Other",
      dateOfBirth: "Date of Birth",
      // Step 3 - Business Info
      businessName: "Business Name",
      bio: "Bio Description",
      city: "City",
      country: "Country",
      address: "Full Address",
      // Step 4
      password: "Password",
      confirmPassword: "Confirm Password",
      createPassword: "Create a password",
      confirmYourPassword: "Confirm your password",
      // Buttons
      back: "Back",
      next: "Next",
      createAccountBtn: "Create Account",
      creatingAccount: "Creating Account...",
      // Placeholders
      firstNamePlaceholder: "John",
      lastNamePlaceholder: "Doe",
      emailPlaceholder: "your@email.com",
      phonePlaceholder: "+1 234 567 8900",
      businessNamePlaceholder: "Your business name",
      bioPlaceholder: "Describe the services you offer...",
      cityPlaceholder: "Your city",
      countryPlaceholder: "Your country",
      addressPlaceholder: "Your full address",
      // Messages
      successMessage: "Account created successfully!",
      passwordMismatch: "Passwords do not match",
      fillAllFields: "Please fill all required fields",
      somethingWentWrong: "Something went wrong, please try again",
      // Descriptions
      clientDesc: "Looking for various services",
      providerDesc: "Offering services to clients"
    }
  };

  const t = signupContent[language];

  const steps = [
    { number: 1, title: t.basicInfo, icon: <FaUser /> },
    { number: 2, title: t.personalDetails, icon: <FaVenusMars /> },
    ...(formData.role === 'provider' ? [{ number: 3, title: t.businessInfo, icon: <FaBuilding /> }] : []),
    { number: formData.role === 'provider' ? 4 : 3, title: t.security, icon: <FaLock /> }
  ];

  const totalSteps = formData.role === 'provider' ? 4 : 3;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear error when user starts typing
    if (error) setError("");
  };

  const validateStep = (currentStep) => {
    switch (currentStep) {
      case 1:
        if (!formData.role || !formData.firstName || !formData.lastName || !formData.phone) {
          setError(t.fillAllFields);
          return false;
        }
        break;
      case 2:
        if (!formData.gender || !formData.dateOfBirth) {
          setError(t.fillAllFields);
          return false;
        }
        break;
      case 3:
        if (formData.role === 'provider') {
          if (!formData.businessName || !formData.city || !formData.country) {
            setError(t.fillAllFields);
            return false;
          }
        } else {
          // For clients, step 3 is security
          if (!formData.password || !formData.confirmPassword) {
            setError(t.fillAllFields);
            return false;
          }
          if (formData.password !== formData.confirmPassword) {
            setError(t.passwordMismatch);
            return false;
          }
          if (formData.password.length < 6) {
            setError(language === 'sw' 
              ? "Nenosiri lazima liwe na herufi 6 au zaidi" 
              : "Password must be at least 6 characters long"
            );
            return false;
          }
        }
        break;
      case 4:
        // Only for providers - security step
        if (!formData.password || !formData.confirmPassword) {
          setError(t.fillAllFields);
          return false;
        }
        if (formData.password !== formData.confirmPassword) {
          setError(t.passwordMismatch);
          return false;
        }
        if (formData.password.length < 6) {
          setError(language === 'sw' 
            ? "Nenosiri lazima liwe na herufi 6 au zaidi" 
            : "Password must be at least 6 characters long"
          );
          return false;
        }
        break;
      default:
        return true;
    }
    return true;
  };

  const nextStep = () => {
    if (validateStep(step)) {
      setError("");
      if (step < totalSteps) setStep(step + 1);
    }
  };

  const prevStep = () => {
    setError("");
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Final validation
    if (!validateStep(totalSteps)) {
      return;
    }

    setLoading(true);
    setError("");

    try {
      const API_URL = "https://api.watukazi.com/api/v1";
      
      // Prepare data based on role
      const submitData = {
        phone: formData.phone,
        email: formData.email || "",
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        referralCode: formData.referralCode || "",
        gender: formData.gender,
        dateOfBirth: formData.dateOfBirth
      };

      // Add provider-specific fields if role is provider
      if (formData.role === 'provider') {
        submitData.businessName = formData.businessName;
        submitData.bio = formData.bio || "";
        submitData.city = formData.city;
        submitData.country = formData.country;
        submitData.address = formData.address || "";
      }

      const endpoint = formData.role === 'provider' 
        ? `${API_URL}/auth/register-provider` 
        : `${API_URL}/auth/register`;

      console.log("Submitting data to:", endpoint, submitData);

      const response = await axios.post(endpoint, submitData, {
        headers: {
          'Content-Type': 'application/json',
        },
        timeout: 10000,
      });

      console.log("Registration response:", response.data);

      if (response.status === 201 || response.status === 200) {
        setSuccess(true);
        
        // Store the identifier (phone/email) in context - this is the most important part
        // The verification token will be obtained when we resend OTP
        setVerificationInfo({
          phone: formData.phone,
          email: formData.email || "",
          verificationToken: null, // Will be set when we resend OTP
          isVerified: false
        });

        // Store in localStorage
        localStorage.setItem("verificationPhone", formData.phone);
        if (formData.email) {
          localStorage.setItem("verificationEmail", formData.email);
        }

        console.log("Stored verification data:", {
          phone: formData.phone,
          email: formData.email
        });

        // Show success message for 2 seconds then redirect to verification
        setTimeout(() => {
          navigate("/verify");
        }, 2000);
      }
    } catch (err) {
      console.error("Signup error:", err);
      
      // Handle different error scenarios
      if (err.response) {
        const errorMessage = err.response.data?.message || err.response.data?.error || t.somethingWentWrong;
        setError(errorMessage);
      } else if (err.request) {
        setError(language === 'sw' 
          ? "Hitilafu ya mtandao. Tafadhali angalia muunganisho wako wa intaneti na ujaribu tena." 
          : "Network error. Please check your internet connection and try again."
        );
      } else {
        setError(t.somethingWentWrong);
      }
    } finally {
      setLoading(false);
    }
  };

  const stepVariants = {
    initial: { x: 300, opacity: 0 },
    in: { x: 0, opacity: 1 },
    out: { x: -300, opacity: 0 }
  };

  // If success, show success message
  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700 text-center max-w-md w-full"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg"
          >
            <FaCheck className="text-white text-3xl" />
          </motion.div>
          
          <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-4">
            {t.createAccount}
          </h2>
          
          <p className="text-green-600 dark:text-green-400 text-lg font-semibold mb-6">
            {t.successMessage}
          </p>
          
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
          
          <p className="text-gray-600 dark:text-gray-300 text-sm mt-4">
            {language === 'sw' 
              ? "Inaelekezwa kwenye ukurasa wa uthibitisho..." 
              : "Redirecting to verification page..."}
          </p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-2xl lg:max-w-4xl mx-4">
        
        {/* Language Toggle - Floating */}
        <motion.button
          onClick={toggleLanguage}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed top-4 sm:top-6 right-4 sm:right-6 p-2 sm:p-3 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700 shadow-lg z-10"
          aria-label={language === 'sw' ? "Switch to English" : "Badilisha lugha kwa Kiswahili"}
        >
          <div className="flex items-center gap-1 sm:gap-2">
            <FaGlobe className="w-3 h-3 sm:w-4 sm:h-4" />
            <span className="text-xs sm:text-sm font-medium">{language === 'sw' ? 'EN' : 'SW'}</span>
          </div>
        </motion.button>

        {/* Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-2xl sm:rounded-3xl shadow-2xl p-4 sm:p-6 lg:p-8 border border-gray-100 dark:border-gray-700"
        >
          {/* Header */}
          <div className="text-center mb-6 sm:mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl sm:rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg"
            >
              <FaUser className="text-white text-2xl sm:text-3xl" />
            </motion.div>
            
            {/* Progress Steps */}
            <div className="flex justify-center mb-4 sm:mb-6">
              {steps.map((stepItem, index) => (
                <div key={stepItem.number} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 rounded-full flex items-center justify-center border-2 text-xs sm:text-sm ${
                      step >= stepItem.number 
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 border-transparent text-white shadow-lg' 
                        : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500 bg-white dark:bg-gray-800'
                    } transition-all duration-300 relative`}
                  >
                    {step > stepItem.number ? <FaCheck /> : stepItem.icon}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className={`w-6 sm:w-8 lg:w-12 h-1 mx-1 sm:mx-2 rounded-full ${
                      step > stepItem.number 
                        ? 'bg-gradient-to-r from-green-500 to-blue-500' 
                        : 'bg-gray-300 dark:bg-gray-600'
                    } transition-all duration-300`} />
                  )}
                </div>
              ))}
            </div>

            <motion.h1
              key={step}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-xl sm:text-2xl lg:text-3xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent mb-2"
            >
              {t.createAccount}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-300 text-sm sm:text-base"
            >
              {steps.find(s => s.number === step)?.title}
            </motion.p>
          </div>

          {/* Error Message */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 sm:mb-6 p-3 sm:p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg sm:rounded-xl flex items-center gap-2 sm:gap-3"
            >
              <FaExclamationCircle className="text-red-500 flex-shrink-0 text-sm sm:text-base" />
              <p className="text-red-700 dark:text-red-300 text-xs sm:text-sm">{error}</p>
            </motion.div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                variants={stepVariants}
                initial="initial"
                animate="in"
                exit="out"
                transition={{ type: "tween", duration: 0.3 }}
              >
                {/* Step 1: User Type & Basic Info */}
                {step === 1 && (
                  <div className="space-y-4 sm:space-y-6">
                    {/* User Type Selection */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
                      <button
                        type="button"
                        onClick={() => handleChange({ target: { name: 'role', value: 'client' } })}
                        className={`p-4 sm:p-6 lg:p-8 border-2 rounded-xl sm:rounded-2xl text-center transition-all duration-300 ${
                          formData.role === 'client'
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 shadow-lg scale-105'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md'
                        }`}
                      >
                        <FaBriefcase className="mx-auto mb-2 sm:mb-3 lg:mb-4 text-xl sm:text-2xl lg:text-3xl" />
                        <span className="text-base sm:text-lg lg:text-xl font-semibold block mb-1 sm:mb-2 lg:mb-3">{t.client}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{t.clientDesc}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange({ target: { name: 'role', value: 'provider' } })}
                        className={`p-4 sm:p-6 lg:p-8 border-2 rounded-xl sm:rounded-2xl text-center transition-all duration-300 ${
                          formData.role === 'provider'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 shadow-lg scale-105'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md'
                        }`}
                      >
                        <FaTools className="mx-auto mb-2 sm:mb-3 lg:mb-4 text-xl sm:text-2xl lg:text-3xl" />
                        <span className="text-base sm:text-lg lg:text-xl font-semibold block mb-1 sm:mb-2 lg:mb-3">{t.provider}</span>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{t.providerDesc}</span>
                      </button>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2 sm:space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                          {t.firstName} *
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 dark:text-white text-base sm:text-lg"
                          placeholder={t.firstNamePlaceholder}
                          required
                        />
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                          {t.lastName} *
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-3 sm:px-4 py-3 sm:py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 dark:text-white text-base sm:text-lg"
                          placeholder={t.lastNamePlaceholder}
                          required
                        />
                      </div>
                    </div>

                    {/* Email (Optional) */}
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        {t.email} <span className="text-gray-400 text-xs">{t.emailOptional}</span>
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base sm:text-lg" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-10 sm:pl-12 lg:pl-14 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 dark:text-white text-base sm:text-lg"
                          placeholder={t.emailPlaceholder}
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        {t.phone} *
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base sm:text-lg" />
                        <input
                          type="tel"
                          name="phone"
                          value={formData.phone}
                          onChange={handleChange}
                          className="w-full pl-10 sm:pl-12 lg:pl-14 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 dark:text-white text-base sm:text-lg"
                          placeholder={t.phonePlaceholder}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Details */}
                {step === 2 && (
                  <div className="space-y-6 sm:space-y-8">
                    {/* Gender Selection */}
                    <div className="space-y-3 sm:space-y-4">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                        {t.gender} *
                      </label>
                      <div className="grid grid-cols-3 gap-2 sm:gap-3 lg:gap-4">
                        {[
                          { value: 'male', label: t.male, icon: <FaVenusMars /> },
                          { value: 'female', label: t.female, icon: <FaVenusMars /> },
                          { value: 'other', label: t.other, icon: <FaVenusMars /> }
                        ].map((gender) => (
                          <button
                            key={gender.value}
                            type="button"
                            onClick={() => handleChange({ target: { name: 'gender', value: gender.value } })}
                            className={`p-3 sm:p-4 lg:p-6 border-2 rounded-lg sm:rounded-xl text-center transition-all duration-200 ${
                              formData.gender === gender.value
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 shadow-md scale-105'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500 hover:shadow-md'
                            }`}
                          >
                            <div className="text-lg sm:text-xl lg:text-2xl mb-1 sm:mb-2 lg:mb-3">{gender.icon}</div>
                            <span className="text-xs sm:text-sm lg:text-base font-medium">{gender.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        {t.dateOfBirth} *
                      </label>
                      <div className="relative">
                        <FaCalendarAlt className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base sm:text-lg" />
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className="w-full pl-10 sm:pl-12 lg:pl-14 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 dark:text-white text-base sm:text-lg"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Business Info (Only for Providers) */}
                {step === 3 && formData.role === 'provider' && (
                  <div className="space-y-6 sm:space-y-8">
                    {/* Business Name */}
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        {t.businessName} *
                      </label>
                      <div className="relative">
                        <FaBuilding className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base sm:text-lg" />
                        <input
                          type="text"
                          name="businessName"
                          value={formData.businessName}
                          onChange={handleChange}
                          className="w-full pl-10 sm:pl-12 lg:pl-14 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white text-base sm:text-lg"
                          placeholder={t.businessNamePlaceholder}
                          required
                        />
                      </div>
                    </div>

                    {/* Bio */}
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        {t.bio}
                      </label>
                      <div className="relative">
                        <FaInfoCircle className="absolute left-3 sm:left-4 top-4 text-gray-400 text-base sm:text-lg" />
                        <textarea
                          name="bio"
                          value={formData.bio}
                          onChange={handleChange}
                          rows="3"
                          className="w-full pl-10 sm:pl-12 lg:pl-14 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white text-base sm:text-lg resize-none"
                          placeholder={t.bioPlaceholder}
                        />
                      </div>
                    </div>

                    {/* City and Country */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="space-y-2 sm:space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                          {t.city} *
                        </label>
                        <div className="relative">
                          <FaMapMarkerAlt className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base sm:text-lg" />
                          <input
                            type="text"
                            name="city"
                            value={formData.city}
                            onChange={handleChange}
                            className="w-full pl-10 sm:pl-12 lg:pl-14 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white text-base sm:text-lg"
                            placeholder={t.cityPlaceholder}
                            required
                          />
                        </div>
                      </div>
                      <div className="space-y-2 sm:space-y-3">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                          {t.country} *
                        </label>
                        <div className="relative">
                          <FaGlobe className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base sm:text-lg" />
                          <input
                            type="text"
                            name="country"
                            value={formData.country}
                            onChange={handleChange}
                            className="w-full pl-10 sm:pl-12 lg:pl-14 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white text-base sm:text-lg"
                            placeholder={t.countryPlaceholder}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    {/* Address */}
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        {t.address}
                      </label>
                      <div className="relative">
                        <FaHome className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base sm:text-lg" />
                        <input
                          type="text"
                          name="address"
                          value={formData.address}
                          onChange={handleChange}
                          className="w-full pl-10 sm:pl-12 lg:pl-14 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white text-base sm:text-lg"
                          placeholder={t.addressPlaceholder}
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3/4: Security */}
                {(step === (formData.role === 'provider' ? 4 : 3)) && (
                  <div className="space-y-6 sm:space-y-8">
                    {/* Password */}
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        {t.password} *
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base sm:text-lg" />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-10 sm:pl-12 lg:pl-14 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white text-base sm:text-lg"
                          placeholder={t.createPassword}
                          required
                          minLength="6"
                        />
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1 sm:mt-2">
                        {language === 'sw' 
                          ? "Nenosiri lazima liwe na herufi 6 au zaidi" 
                          : "Password must be 6 characters or longer"}
                      </p>
                    </div>

                    {/* Confirm Password */}
                    <div className="space-y-2 sm:space-y-3">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1 sm:mb-2">
                        {t.confirmPassword} *
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-3 sm:left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-base sm:text-lg" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-10 sm:pl-12 lg:pl-14 pr-3 sm:pr-4 py-3 sm:py-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white text-base sm:text-lg"
                          placeholder={t.confirmYourPassword}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            </AnimatePresence>

            {/* Navigation Buttons */}
            <div className="flex justify-between mt-6 sm:mt-8 lg:mt-10">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={prevStep}
                className={`flex items-center px-4 sm:px-6 lg:px-8 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all text-sm sm:text-base lg:text-lg ${
                  step === 1 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600 shadow-md'
                }`}
                disabled={step === 1 || loading}
              >
                <FaArrowLeft className="mr-2 sm:mr-3" />
                {t.back}
              </motion.button>

              {step === totalSteps ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  disabled={loading}
                  className="flex items-center px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg text-sm sm:text-base lg:text-lg"
                >
                  {loading ? (
                    <>
                      <FaSpinner className="animate-spin mr-2 sm:mr-3" />
                      {t.creatingAccount}
                    </>
                  ) : (
                    <>
                      {t.createAccountBtn}
                      <FaCheck className="ml-2 sm:ml-3" />
                    </>
                  )}
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-6 sm:px-8 lg:px-10 py-3 sm:py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg sm:rounded-xl font-semibold hover:shadow-xl transition-all duration-300 shadow-lg text-sm sm:text-base lg:text-lg"
                >
                  {t.next}
                  <FaArrowRight className="ml-2 sm:ml-3" />
                </motion.button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6 sm:mt-8 pt-6 sm:pt-8 border-t border-gray-200 dark:border-gray-600"
          >
            <p className="text-gray-600 dark:text-gray-300 text-sm sm:text-base">
              {t.alreadyHaveAccount}{" "}
              <Link
                to="/signin"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors text-sm sm:text-base lg:text-lg"
              >
                {t.signIn}
              </Link>
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default SignupForm;