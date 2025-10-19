import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
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
  FaGlobe
} from "react-icons/fa";
import { useLanguage } from "../components/LanguageContext"; // Import the language context

const SignupForm = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    userType: "",
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    
    // Step 2
    gender: "",
    dateOfBirth: "",
    
    // Step 3
    password: "",
    confirmPassword: ""
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
      basicInfo: "Taarifa za Msingi",
      personalDetails: "Taarifa Binafsi",
      security: "Usalama",
      // Step 1
      findWork: "Tafuta Kazi",
      offerService: "Toa Huduma",
      firstName: "Jina la Kwanza",
      lastName: "Jina la Mwisho",
      email: "Barua Pepe",
      emailOptional: "(Hiari)",
      phoneNumber: "Namba ya Simu",
      // Step 2
      gender: "Jinsia",
      male: "Mwanaume",
      female: "Mwanamke",
      other: "Nyingine",
      dateOfBirth: "Tarehe ya Kuzaliwa",
      // Step 3
      password: "Nenosiri",
      confirmPassword: "Thibitisha Nenosiri",
      createPassword: "Tengeneza nenosiri",
      confirmYourPassword: "Thibitisha nenosiri lako",
      // Buttons
      back: "Nyuma",
      next: "Endelea",
      createAccountBtn: "Fungua Akaunti",
      // Placeholders
      firstNamePlaceholder: "Jina",
      lastNamePlaceholder: "Jina la Ukoo",
      emailPlaceholder: "barua@pepe.com",
      phonePlaceholder: "+255 123 456 789"
    },
    en: {
      // General
      createAccount: "Create Account",
      alreadyHaveAccount: "Already have an account?",
      signIn: "Sign in",
      // Steps
      basicInfo: "Basic Info",
      personalDetails: "Personal Details",
      security: "Security",
      // Step 1
      findWork: "Find Work",
      offerService: "Offer Service",
      firstName: "First Name",
      lastName: "Last Name",
      email: "Email",
      emailOptional: "(Optional)",
      phoneNumber: "Phone Number",
      // Step 2
      gender: "Gender",
      male: "Male",
      female: "Female",
      other: "Other",
      dateOfBirth: "Date of Birth",
      // Step 3
      password: "Password",
      confirmPassword: "Confirm Password",
      createPassword: "Create a password",
      confirmYourPassword: "Confirm your password",
      // Buttons
      back: "Back",
      next: "Next",
      createAccountBtn: "Create Account",
      // Placeholders
      firstNamePlaceholder: "John",
      lastNamePlaceholder: "Doe",
      emailPlaceholder: "your@email.com",
      phonePlaceholder: "+1 234 567 8900"
    }
  };

  const t = signupContent[language];

  const steps = [
    { number: 1, title: t.basicInfo, icon: <FaUser /> },
    { number: 2, title: t.personalDetails, icon: <FaVenusMars /> },
    { number: 3, title: t.security, icon: <FaLock /> }
  ];

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const nextStep = () => {
    if (step < 3) setStep(step + 1);
  };

  const prevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Signup submitted:", formData);
    // Handle signup logic here
  };

  const stepVariants = {
    initial: { x: 300, opacity: 0 },
    in: { x: 0, opacity: 1 },
    out: { x: -300, opacity: 0 }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        
        {/* Language Toggle - Floating */}
        <motion.button
          onClick={toggleLanguage}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          className="fixed top-4 right-4 p-2 rounded-full bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 transition-all duration-200 border border-gray-200 dark:border-gray-700 shadow-lg z-10"
          aria-label={language === 'sw' ? "Switch to English" : "Badilisha lugha kwa Kiswahili"}
        >
          <div className="flex items-center gap-1">
            <FaGlobe className="w-3 h-3" />
            <span className="text-xs font-medium">{language === 'sw' ? 'EN' : 'SW'}</span>
          </div>
        </motion.button>

        {/* Card Container */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl p-8 border border-gray-100 dark:border-gray-700"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2 }}
              className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4"
            >
              <FaUser className="text-white text-2xl" />
            </motion.div>
            
            {/* Progress Steps */}
            <div className="flex justify-center mb-6">
              {steps.map((stepItem, index) => (
                <div key={stepItem.number} className="flex items-center">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                      step >= stepItem.number 
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 border-transparent text-white' 
                        : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                    } transition-all duration-300`}
                  >
                    {step > stepItem.number ? <FaCheck /> : stepItem.icon}
                  </motion.div>
                  {index < steps.length - 1 && (
                    <div className={`w-8 h-1 mx-2 ${
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
              className="text-3xl font-bold text-gray-800 dark:text-white mb-2"
            >
              {t.createAccount}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-gray-600 dark:text-gray-300"
            >
              {steps[step - 1].title}
            </motion.p>
          </div>

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
                {/* Step 1: Basic Info */}
                {step === 1 && (
                  <div className="space-y-4">
                    {/* User Type Selection */}
                    <div className="grid grid-cols-2 gap-3 mb-4">
                      <button
                        type="button"
                        onClick={() => handleChange({ target: { name: 'userType', value: 'find-work' } })}
                        className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${
                          formData.userType === 'find-work'
                            ? 'border-green-500 bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <FaBriefcase className="mx-auto mb-2 text-lg" />
                        <span className="text-sm font-medium">{t.findWork}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => handleChange({ target: { name: 'userType', value: 'offer-service' } })}
                        className={`p-4 border-2 rounded-xl text-center transition-all duration-200 ${
                          formData.userType === 'offer-service'
                            ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                            : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                        }`}
                      >
                        <FaTools className="mx-auto mb-2 text-lg" />
                        <span className="text-sm font-medium">{t.offerService}</span>
                      </button>
                    </div>

                    {/* Name Fields */}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t.firstName}
                        </label>
                        <input
                          type="text"
                          name="firstName"
                          value={formData.firstName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 dark:text-white"
                          placeholder={t.firstNamePlaceholder}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                          {t.lastName}
                        </label>
                        <input
                          type="text"
                          name="lastName"
                          value={formData.lastName}
                          onChange={handleChange}
                          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 dark:text-white"
                          placeholder={t.lastNamePlaceholder}
                          required
                        />
                      </div>
                    </div>

                    {/* Email (Optional) */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t.email} <span className="text-gray-400 text-xs">{t.emailOptional}</span>
                      </label>
                      <div className="relative">
                        <FaEnvelope className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 dark:text-white"
                          placeholder={t.emailPlaceholder}
                        />
                      </div>
                    </div>

                    {/* Phone Number */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t.phoneNumber}
                      </label>
                      <div className="relative">
                        <FaPhone className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                          type="tel"
                          name="phoneNumber"
                          value={formData.phoneNumber}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all duration-200 dark:text-white"
                          placeholder={t.phonePlaceholder}
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Personal Details */}
                {step === 2 && (
                  <div className="space-y-4">
                    {/* Gender Selection */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t.gender}
                      </label>
                      <div className="grid grid-cols-3 gap-3">
                        {[
                          { value: 'male', label: t.male },
                          { value: 'female', label: t.female },
                          { value: 'other', label: t.other }
                        ].map((gender) => (
                          <button
                            key={gender.value}
                            type="button"
                            onClick={() => handleChange({ target: { name: 'gender', value: gender.value } })}
                            className={`p-3 border-2 rounded-xl text-center transition-all duration-200 ${
                              formData.gender === gender.value
                                ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300'
                                : 'border-gray-200 dark:border-gray-600 hover:border-gray-300 dark:hover:border-gray-500'
                            }`}
                          >
                            <FaVenusMars className="mx-auto mb-1" />
                            <span className="text-xs font-medium">{gender.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Date of Birth */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t.dateOfBirth}
                      </label>
                      <div className="relative">
                        <FaCalendarAlt className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                          type="date"
                          name="dateOfBirth"
                          value={formData.dateOfBirth}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 dark:text-white"
                          required
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Security */}
                {step === 3 && (
                  <div className="space-y-4">
                    {/* Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t.password}
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                          type="password"
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white"
                          placeholder={t.createPassword}
                          required
                        />
                      </div>
                    </div>

                    {/* Confirm Password */}
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        {t.confirmPassword}
                      </label>
                      <div className="relative">
                        <FaLock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 text-sm" />
                        <input
                          type="password"
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 dark:text-white"
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
            <div className="flex justify-between mt-8">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={prevStep}
                className={`flex items-center px-6 py-3 rounded-xl font-semibold transition-all ${
                  step === 1 
                    ? 'bg-gray-400 text-white cursor-not-allowed' 
                    : 'bg-blue-500 text-white hover:bg-blue-600'
                }`}
                disabled={step === 1}
              >
                <FaArrowLeft className="mr-2" />
                {t.back}
              </motion.button>

              {step === 3 ? (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="submit"
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
                >
                  {t.createAccountBtn}
                  <FaCheck className="ml-2" />
                </motion.button>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  type="button"
                  onClick={nextStep}
                  className="flex items-center px-8 py-3 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-xl font-semibold hover:shadow-xl transition-all duration-300"
                >
                  {t.next}
                  <FaArrowRight className="ml-2" />
                </motion.button>
              )}
            </div>
          </form>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-center mt-6 pt-6 border-t border-gray-200 dark:border-gray-600"
          >
            <p className="text-gray-600 dark:text-gray-300 text-sm">
              {t.alreadyHaveAccount}{" "}
              <Link
                to="/signin"
                className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-semibold transition-colors"
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