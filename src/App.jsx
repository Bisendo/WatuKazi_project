// App.js
import React from "react";
import { Routes, Route } from "react-router-dom";

// Import pages from the "pages" folder
import Home from "../src/pages/Home";
import Hero from "./components/Hero";
import JobList from "./components/Joblist";
import JobCard from "./components/JobCard";
import Navibar from "./components/Navibar";
import AnimationWrapper from "./components/AnimationWrapper";
import Footer from "./components/Footer";
import SignUpForm from "./components/SignUpToWatukazi";
import LoginForm from "./components/SignInToWatukazi";
import { LanguageProvider } from "./components/LanguageContext";
import { ThemeProvider } from "./components/ThemeContext";
import ContactPage from "./components/Contacts";
import AboutUs from "./components/AboutUs";
import ServiceDetail from "./components/ServiceDetails";
import ServiceList from "./components/ServiceLists";
import { VerificationProvider } from "./contexts/verificationCode";
import VerificationForm from "./components/VerificationCodeForm";
import JobDetails from "./components/JobDetails";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ClientDashboard from "./components/ClientsDashboard";
import ServiceProviderDashboard from "./components/ServiceProvider";
import { AuthProvider, useAuth } from "./contexts/authContext";

// Create a layout component that conditionally renders Navibar
const AppLayout = () => {
  const { isAuthenticated, loading } = useAuth();

  // Show loading spinner while checking auth status
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div>
      {/* Only show Navibar if user is NOT authenticated */}
      {!isAuthenticated && <Navibar />}
      
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hero" element={<Hero />} />
        <Route path="/joblist" element={<JobList />} />
        <Route path="/job/:id" element={<JobDetails />} />
        <Route path="/jobcard" element={<JobCard />} />
        <Route path="/animations" element={<AnimationWrapper />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/Signin" element={<LoginForm />} />
        <Route path="/service/:id" element={<ServiceDetail />} />
        <Route path="/service" element={<ServiceList />} />
        <Route path="/client/dashboard" element={<ClientDashboard />} />
        <Route path="/provider/dashboard" element={<ServiceProviderDashboard />} />
        <Route path="/verify" element={<VerificationForm />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
      </Routes>
    </div>
  );
};

const App = () => {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthProvider>
          <VerificationProvider>
            <AppLayout />
          </VerificationProvider>
        </AuthProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
};

export default App;