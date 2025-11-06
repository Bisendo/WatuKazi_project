import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import Hero from "./components/Hero";
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
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import ClientDashboard from "./components/ClientsDashboard";
import ServiceProviderDashboard from "./components/ServiceProvider";
import { AuthProvider, useAuth } from "./contexts/authContext";
import ProtectedRoute from "./components/ProtectRoute";
import HomeDetails from "./components/HomeServiceDetails";
import HomeserviceList from "./components/HomeServiceList";

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;
  if (isAuthenticated) {
    const user = JSON.parse(localStorage.getItem("userData") || localStorage.getItem("user") || "{}");
    const dashboardRoute = determineDashboardRoute(user);
    return <Navigate to={dashboardRoute} replace />;
  }
  return children;
};

const determineDashboardRoute = (userData) => {
  const userType = userData?.role || userData?.userType || userData?.type;
  if (userType?.toLowerCase().includes("provider")) return "/provider/dashboard";
  if (userType?.toLowerCase().includes("admin")) return "/admin-dashboard";
  return "/client/dashboard";
};

const AppContent = () => {
  const { loading } = useAuth();
  if (loading) return <div className="flex items-center justify-center h-screen">Loading...</div>;

  const currentPath = window.location.pathname;
  const hideNavibarRoutes = ["/client/dashboard", "/provider/dashboard", "/admin-dashboard"];
  const shouldShowNavibar = !hideNavibarRoutes.some((r) => currentPath.startsWith(r));

  return (
    <div className="min-h-screen flex flex-col">
      {shouldShowNavibar && <Navibar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/hero" element={<Hero />} />
          <Route path="/joblist" element={<HomeserviceList />} />
          <Route path="/job/:id" element={<HomeDetails/>} />
          <Route path="/jobcard" element={<JobCard />} />
          <Route path="/animations" element={<AnimationWrapper />} />
          <Route path="/footer" element={<Footer />} />

          <Route path="/signup" element={<PublicRoute><SignUpForm /></PublicRoute>} />
          <Route path="/signin" element={<PublicRoute><LoginForm /></PublicRoute>} />

          <Route path="/service/:id" element={<ServiceDetail />} />
          <Route path="/services" element={<ServiceList />} />
          <Route path="/verify" element={<VerificationForm />} />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          <Route path="/client/dashboard/*" element={<ProtectedRoute><ClientDashboard /></ProtectedRoute>} />
          <Route path="/provider/dashboard/*" element={<ProtectedRoute><ServiceProviderDashboard /></ProtectedRoute>} />

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      {shouldShowNavibar}
    </div>
  );
};

const App = () => (
  <ThemeProvider>
    <LanguageProvider>
      <AuthProvider>
        <VerificationProvider>
          <AppContent />
        </VerificationProvider>
      </AuthProvider>
    </LanguageProvider>
  </ThemeProvider>
);

export default App;
