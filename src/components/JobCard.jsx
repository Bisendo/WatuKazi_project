import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaUsers, FaStar, FaBolt } from "react-icons/fa";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleApplyNow = () => {
    // Navigate to product details page with job ID
    navigate(`/job/${job.id}`, { 
      state: { 
        job: job 
      } 
    });
    
    // Alternative: if you're using URL parameters only
    // navigate(`/job/${job.id}`);
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl p-6 transition-all border border-gray-100 dark:border-gray-700"
    >
      <div className="flex flex-col md:flex-row gap-4">
        {/* Company Logo and Basic Info */}
        <div className="flex items-start space-x-4 flex-1">
          <div className="flex-shrink-0">
            <img
              src={job.logo}
              alt={`${job.company} logo`}
              className="w-16 h-16 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
              onError={(e) => {
                e.target.src = `https://via.placeholder.com/64/3B82F6/FFFFFF?text=${job.company.charAt(0)}`;
              }}
            />
          </div>
          
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h2 className="font-bold text-lg text-gray-900 dark:text-white mb-1">
                  {job.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                  {job.company}
                </p>
              </div>
              
              {/* Featured and Urgent Badges */}
              <div className="flex space-x-2">
                {job.featured && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                    <FaStar className="w-3 h-3 mr-1" />
                    Featured
                  </span>
                )}
                {job.urgent && (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200">
                    <FaBolt className="w-3 h-3 mr-1" />
                    Urgent
                  </span>
                )}
              </div>
            </div>

            {/* Job Details */}
            <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <div className="flex items-center">
                <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                {job.location}
              </div>
              <div className="flex items-center">
                <FaClock className="w-4 h-4 mr-1" />
                {job.posted}
              </div>
              <div className="flex items-center">
                <FaUsers className="w-4 h-4 mr-1" />
                {job.applicants} applicants
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {job.type}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {job.level}
              </span>
            </div>
          </div>
        </div>

        {/* Salary and Apply Button */}
        <div className="flex flex-col items-end justify-between space-y-3">
          <div className="text-right">
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {job.salary}
            </p>
          </div>
          
          <button 
            onClick={handleApplyNow}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform"
          >
            Apply Now
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;