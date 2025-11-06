import React from "react";
import Hero from "../components/Hero";
import JobList from "../components/HomeServiceList";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-800 dark:text-white transition-colors duration-300">
      <Hero />
      <div className="max-w-7xl mx-auto px-4 md:px-8 py-10">
        <div className="grid md:grid-cols-4 gap-6">
          <div className="col-span-6">
            <JobList />

          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Home;
