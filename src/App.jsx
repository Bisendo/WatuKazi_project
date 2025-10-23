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


const App = () => {




  return (
    <div>
      
        <ThemeProvider>
          <LanguageProvider>
            <Navibar />
            <VerificationProvider>
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
              <Route path="/verify" element={<VerificationForm />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/about" element={<AboutUs />} />






            </Routes>
                  </VerificationProvider>

          </LanguageProvider>
        </ThemeProvider>
    </div>
  );
};

export default App;
