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
import LoginForm from "./components/LoginToWatuKazi";

const App = () => {




  return (
    <div>
      <Navibar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/hero" element={<Hero />} />
        <Route path="/joblist" element={<JobList />} />
        <Route path="/jobcard" element={<JobCard />} />
        <Route path="/animations" element={<AnimationWrapper />} />
        <Route path="/footer" element={<Footer />} />
        <Route path="/signup" element={<SignUpForm />} />
        <Route path="/login" element={<LoginForm/>} />


      </Routes>
    </div>
  );
};

export default App;
