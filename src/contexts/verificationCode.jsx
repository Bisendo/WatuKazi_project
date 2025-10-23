// contexts/VerificationContext.js
import React, { createContext, useContext, useState, useEffect } from "react";

const VerificationContext = createContext();

export const useVerification = () => {
  const context = useContext(VerificationContext);
  if (!context) {
    throw new Error("useVerification must be used within a VerificationProvider");
  }
  return context;
};

export const VerificationProvider = ({ children }) => {
  const [verificationData, setVerificationData] = useState({
    userId: null,
    phone: "",
    email: "",
    verificationToken: null,
    verificationType: "phone",
    expiresAt: null,
    isVerified: false,
  });

  // Load from localStorage on initial render
  useEffect(() => {
    const storedPhone = localStorage.getItem("verificationPhone");
    const storedEmail = localStorage.getItem("verificationEmail");
    const storedToken = localStorage.getItem("verificationToken");
    
    if (storedPhone || storedEmail || storedToken) {
      setVerificationData(prev => ({
        ...prev,
        phone: storedPhone || prev.phone,
        email: storedEmail || prev.email,
        verificationToken: storedToken || prev.verificationToken,
        verificationType: storedPhone ? "phone" : storedEmail ? "email" : prev.verificationType,
      }));
    }
  }, []);

  const setVerificationInfo = (data) => {
    setVerificationData((prev) => {
      const newData = {
        ...prev,
        ...data,
        verificationType: data.phone ? "phone" : data.email ? "email" : prev.verificationType,
      };
      
      // Store in localStorage
      if (data.phone) localStorage.setItem("verificationPhone", data.phone);
      if (data.email) localStorage.setItem("verificationEmail", data.email);
      if (data.verificationToken) localStorage.setItem("verificationToken", data.verificationToken);
      
      return newData;
    });
  };

  const clearVerification = () => {
    setVerificationData({
      userId: null,
      phone: "",
      email: "",
      verificationToken: null,
      verificationType: "phone",
      expiresAt: null,
      isVerified: false,
    });
    
    // Clear localStorage
    localStorage.removeItem("verificationPhone");
    localStorage.removeItem("verificationEmail");
    localStorage.removeItem("verificationToken");
  };

  return (
    <VerificationContext.Provider
      value={{
        verificationData,
        setVerificationInfo,
        clearVerification,
      }}
    >
      {children}
    </VerificationContext.Provider>
  );
};