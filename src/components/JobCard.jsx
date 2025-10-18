import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt, FaUser, FaBuilding, FaCode, FaBriefcase } from "react-icons/fa";

const JobCard = ({ job }) => {
  // Function to get appropriate icon based on job title
  const getJobIcon = (title) => {
    const titleLower = title.toLowerCase();
    if (titleLower.includes('engineer') || titleLower.includes('developer') || titleLower.includes('code')) {
      return <FaCode className="text-blue-500" />;
    } else if (titleLower.includes('manager') || titleLower.includes('lead') || titleLower.includes('director')) {
      return <FaBriefcase className="text-green-500" />;
    } else if (titleLower.includes('analyst') || titleLower.includes('specialist')) {
      return <FaUser className="text-purple-500" />;
    } else {
      return <FaBuilding className="text-gray-500" />;
    }
  };

  // Function to get background color based on company
  const getIconBgColor = (company) => {
    const colors = [
      'bg-blue-100 dark:bg-blue-900',
      'bg-green-100 dark:bg-green-900',
      'bg-purple-100 dark:bg-purple-900',
      'bg-orange-100 dark:bg-orange-900',
      'bg-pink-100 dark:bg-pink-900',
      'bg-teal-100 dark:bg-teal-900'
    ];
    const index = company.length % colors.length;
    return colors[index];
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-sm p-4 sm:p-6 hover:shadow-md transition-all duration-300 w-full"
    >
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
        {/* Left Section - Job Details */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-4 flex-1 min-w-0">
          {/* Profile Icon */}
          <div className="flex-shrink-0 flex justify-center sm:justify-start">
            <div className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl flex items-center justify-center ${getIconBgColor(job.company)} border border-gray-100 dark:border-gray-700`}>
              <div className="text-2xl sm:text-3xl">
                {getJobIcon(job.title)}
              </div>
            </div>
          </div>

          {/* Job Info */}
          <div className="flex-1 min-w-0 text-center sm:text-left">
            <h2 className="font-semibold text-lg sm:text-xl text-gray-800 dark:text-white line-clamp-1">
              {job.title}
            </h2>
            <p className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-medium mb-2">
              {job.company}
            </p>
            <div className="flex items-center justify-center sm:justify-start text-sm text-gray-400 dark:text-gray-500 mb-3">
              <FaMapMarkerAlt className="mr-1 text-orange-500 flex-shrink-0" />
              <span className="line-clamp-1">{job.location}</span>
            </div>
            
            {/* Tags - Mobile */}
            <div className="flex flex-wrap justify-center sm:justify-start gap-2 sm:hidden">
              <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
                {job.type}
              </span>
              <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
                {job.level}
              </span>
            </div>
          </div>
        </div>

        {/* Right Section - Salary & Actions */}
        <div className="flex flex-col sm:flex-row lg:flex-col items-center gap-4 sm:gap-6 lg:gap-3">
          {/* Salary */}
          <div className="text-center sm:text-right">
            <p className="text-orange-500 font-semibold text-lg sm:text-xl">
              {job.salary}
            </p>
            <p className="text-gray-400 dark:text-gray-500 text-sm mt-1">
              per year
            </p>
          </div>

          {/* Tags - Desktop */}
          <div className="hidden sm:flex flex-wrap justify-center lg:justify-end gap-2">
            <span className="px-3 py-1 text-xs rounded-full bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300">
              {job.type}
            </span>
            <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
              {job.level}
            </span>
          </div>

          {/* Apply Button */}
          <button className="w-full sm:w-auto bg-blue-500 hover:bg-blue-600 text-white font-medium py-3 px-6 sm:px-8 rounded-xl transition-all duration-300 shadow-sm hover:shadow-lg transform hover:-translate-y-0.5">
            Apply Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;