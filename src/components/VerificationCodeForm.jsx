// components/VerificationForm.js
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { verificationService } from "../components/verificationservice";
import { useVerification } from "../contexts/verificationCode";
import { useLanguage } from "./LanguageContext";
import {
  FaPhone,
  FaEnvelope,
  FaCheckCircle,
  FaExclamationCircle,
  FaSpinner,
  FaRedo,
} from "react-icons/fa";

const VerificationForm = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [verificationToken, setVerificationToken] = useState(null);
  
  // Use refs to prevent multiple automatic resends
  const autoResendAttempted = useRef(false);
  const isInitialMount = useRef(true);

  const navigate = useNavigate();
  const { verificationData, setVerificationInfo, clearVerification } = useVerification();
  const { language } = useLanguage();

  const t = {
    sw: {
      title: "Thibitisha Akaunti Yako",
      phoneSubtitle: "Tumetuma nambari ya 6 kwenye simu yako",
      emailSubtitle: "Tumetuma nambari ya 6 kwenye barua pepe yako",
      enterOtp: "Weka nambari ya 6 iliyotumwa",
      verify: "Thibitisha",
      verifying: "Inathibitisha...",
      resend: "Tuma tena",
      resending: "Inatuma tena...",
      success: "Akaunti imethibitishwa! Inakuelekeza...",
      invalidOtp: "Nambari si sahihi",
      tryAgain: "Tafadhali jaribu tena",
      seconds: "sekundi",
      didNotReceive: "Hukupokea nambari?",
      goBack: "Rudi nyuma",
    },
    en: {
      title: "Verify Your Account",
      phoneSubtitle: "We've sent a 6-digit code to your phone",
      emailSubtitle: "We've sent a 6-digit code to your email",
      enterOtp: "Enter the 6-digit code sent to you",
      verify: "Verify",
      verifying: "Verifying...",
      resend: "Resend",
      resending: "Resending...",
      success: "Account verified! Redirecting...",
      invalidOtp: "Invalid verification code",
      tryAgain: "Please try again",
      seconds: "seconds",
      didNotReceive: "Didn't receive the code?",
      goBack: "Go Back",
    },
  }[language];

  // Get identifier from multiple sources
  const getIdentifier = () => {
    // Try context first
    if (verificationData.phone || verificationData.email) {
      return verificationData.phone || verificationData.email;
    }
    
    // Then try localStorage
    const storedPhone = localStorage.getItem("verificationPhone");
    const storedEmail = localStorage.getItem("verificationEmail");
    
    return storedPhone || storedEmail || "";
  };

  const identifier = getIdentifier();

  // Try to get token from multiple sources
  useEffect(() => {
    const token = 
      verificationData.verificationToken ||
      localStorage.getItem("verificationToken");
    
    setVerificationToken(token);
  }, [verificationData.verificationToken]);

  // Auto-resend OTP only once when component mounts
  useEffect(() => {
    // Only run on initial mount and if we have an identifier
    if (isInitialMount.current && identifier && !autoResendAttempted.current) {
      isInitialMount.current = false;
      
      const initializeVerification = async () => {
        console.log("Auto-resending OTP for identifier:", identifier);
        autoResendAttempted.current = true;
        await handleResendOTP(true); // Pass true to indicate it's auto-resend
      };

      initializeVerification();
    }
  }, [identifier]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setTimeout(() => setCountdown(prev => prev - 1), 1000);
    return () => clearTimeout(timer);
  }, [countdown]);

  // OTP input handlers
  const handleOtpChange = (el, idx) => {
    const val = el.value.replace(/\D/g, "");
    if (!val && val !== "") return;
    
    setOtp(prev => prev.map((v, i) => (i === idx ? val.slice(-1) : v)));
    
    if (val && el.nextSibling) {
      el.nextSibling.focus();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Backspace" && !e.target.value && e.target.previousSibling) {
      e.target.previousSibling.focus();
    }
  };

  // VERIFY OTP
  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const code = otp.join("");
    if (code.length !== 6) {
      setError(t.invalidOtp);
      return;
    }

    if (!identifier) {
      setError("Identifier missing. Please go back and try again.");
      return;
    }

    setLoading(true);
    try {
      let res;
      if (verificationToken && !verificationToken.startsWith('temp_')) {
        res = await verificationService.verifyOTP(identifier, code, verificationToken);
      } else {
        // If no real token, try without token
        res = await verificationService.verifyOTP(identifier, code, null);
      }
      
      if (res.success || res.message === "verified" || res.status === "success") {
        setSuccess(t.success);
        setVerificationInfo({ isVerified: true });
        
        // Clear all stored data
        clearVerification();
        localStorage.removeItem("verificationToken");
        localStorage.removeItem("verificationPhone");
        localStorage.removeItem("verificationEmail");
        
        setTimeout(() => {
          navigate("/signin");
        }, 1400);
      } else {
        setError(res.message || "Verification failed");
      }
    } catch (err) {
      console.error("Verification error:", err);
      
      if (err?.message?.includes('token') || err?.message?.includes('Token')) {
        setError("Verification failed. Please try resending the code.");
      } else {
        setError(err?.message || err?.error || "Verification failed");
      }
      
      setOtp(["", "", "", "", "", ""]);
      const el = document.getElementById("otp-0");
      if (el) el.focus();
    } finally {
      setLoading(false);
    }
  };

  // RESEND OTP - Modified to prevent multiple calls
  const handleResendOTP = async (isAutoResend = false) => {
    // Prevent multiple simultaneous requests
    if (resendLoading || countdown > 0) return;
    
    if (!identifier) {
      setError("Identifier is required to resend OTP");
      return;
    }

    setResendLoading(true);
    setError("");
    
    // Only show success message for manual resends, not auto-resends
    if (!isAutoResend) {
      setSuccess("");
    }

    try {
      const res = await verificationService.resendOTP(identifier);
      
      console.log("Resend OTP response:", res);

      if (res.success || res.message?.includes('sent')) {
        // Only show success message for manual resends
        if (!isAutoResend) {
          setSuccess(language === "sw" ? "Nambari imetumwa tena!" : "Code has been resent!");
        }
        
        setCountdown(60);
        
        // Create a placeholder token since API doesn't return one
        const placeholderToken = `temp_${Date.now()}_${identifier}`;
        
        setVerificationInfo({ 
          verificationToken: placeholderToken,
          phone: identifier.includes('@') ? '' : identifier,
          email: identifier.includes('@') ? identifier : ''
        });
        
        setVerificationToken(placeholderToken);
        localStorage.setItem("verificationToken", placeholderToken);
        
        console.log("Using placeholder token for verification:", placeholderToken);
      } else {
        setError(res?.message || "Failed to send OTP");
      }
    } catch (err) {
      console.error("Resend OTP error:", err);
      setError(err?.message || err?.error || "Failed to resend OTP");
    } finally {
      setResendLoading(false);
    }
  };

  const maskIdentifier = (id) => {
    if (!id) return "";
    if (!id.includes("@")) {
      return `${id.slice(0, 4)}****${id.slice(-2)}`;
    }
    const [local, domain] = id.split("@");
    return `${local.slice(0, 2)}****@${domain}`;
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md mx-auto">
        <motion.div 
          initial={{ opacity: 0, y: 20 }} 
          animate={{ opacity: 1, y: 0 }} 
          className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700"
        >
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
              {identifier && identifier.includes("@") ? 
                <FaEnvelope className="text-white text-2xl" /> : 
                <FaPhone className="text-white text-2xl" />
              }
            </div>
            <h1 className="text-2xl font-bold dark:text-white mb-2">{t.title}</h1>
            <p className="text-gray-600 dark:text-gray-400">
              {identifier && identifier.includes("@") ? t.emailSubtitle : t.phoneSubtitle}
            </p>
            {identifier && (
              <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mt-2">
                {maskIdentifier(identifier)}
              </p>
            )}
            {resendLoading && (
              <p className="text-sm text-blue-500 mt-2">
                {language === 'sw' ? 'Inatuma nambari...' : 'Sending code...'}
              </p>
            )}
          </div>

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-lg flex items-center gap-2">
              <FaExclamationCircle className="text-red-500 flex-shrink-0" />
              <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
            </motion.div>
          )}

          {success && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mb-4 p-3 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-700 rounded-lg flex items-center gap-2">
              <FaCheckCircle className="text-green-500 flex-shrink-0" />
              <p className="text-sm text-green-600 dark:text-green-300">{success}</p>
            </motion.div>
          )}

          <form onSubmit={handleVerify} className="space-y-6">
            <label className="block text-sm font-medium dark:text-gray-300 mb-3">
              {t.enterOtp}
            </label>
            <div className="flex justify-center gap-2">
              {otp.map((v, i) => (
                <input 
                  key={i} 
                  id={`otp-${i}`} 
                  type="text" 
                  inputMode="numeric" 
                  pattern="\d*" 
                  maxLength="1" 
                  value={v} 
                  onChange={e => handleOtpChange(e.target, i)} 
                  onKeyDown={handleKeyDown} 
                  onFocus={e => e.target.select()} 
                  className="w-12 h-12 text-center text-lg font-semibold bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:text-white" 
                  disabled={loading || resendLoading} 
                />
              ))}
            </div>

            <button 
              type="submit" 
              disabled={loading || resendLoading || otp.join("").length !== 6} 
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white py-3 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center gap-2 disabled:cursor-not-allowed"
            >
              {loading ? <><FaSpinner className="animate-spin" /> {t.verifying}</> : t.verify}
            </button>
          </form>

          <div className="text-center mt-6">
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
              {t.didNotReceive}
            </p>
            <button 
              onClick={() => handleResendOTP(false)} // false = manual resend
              disabled={resendLoading || countdown > 0} 
              className="text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {resendLoading ? <FaSpinner className="animate-spin" /> : <FaRedo />} 
              {countdown > 0 ? `${countdown} ${t.seconds}` : t.resend}
            </button>
          </div>

          <button 
            onClick={() => navigate(-1)} 
            className="w-full mt-4 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 py-2 rounded-lg font-medium transition-colors"
          >
            {t.goBack}
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default VerificationForm;