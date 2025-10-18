import React from "react";
import { motion } from "framer-motion";

const Hero = () => {
  return (
    <motion.section
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-r from-blue-500 to-blue-700 text-white py-16 text-center rounded-b-3xl shadow-md"
    >
      <h1 className="text-3xl md:text-5xl font-bold mb-4">
        The Right Job is Waiting for You
      </h1>
      <p className="text-lg mb-6">Explore thousands of jobs and take the next step in your career today!</p>
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="Search job title or company..."
          className="w-72 md:w-96 px-4 py-3 rounded-l-full text-gray-800 focus:outline-none"
        />
        <button className="bg-white text-orange-600 px-6 py-3 rounded-r-full font-semibold hover:bg-gray-100 transition">
          Search
        </button>
      </div>
    </motion.section>
  );
};

export default Hero;
