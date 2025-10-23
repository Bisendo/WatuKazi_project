import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaClock, FaUsers, FaStar, FaBolt, FaShoppingBag } from "react-icons/fa";

const JobCard = ({ job }) => {
  const navigate = useNavigate();

  const handleApplyNow = () => {
    navigate(`/job/${job.id}`, { 
      state: { 
        job: job 
      } 
    });
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg hover:shadow-xl p-4 sm:p-6 transition-all border border-gray-100 dark:border-gray-700"
    >
      <div className="flex flex-col lg:flex-row gap-4 lg:gap-6">
        {/* Product Image Section */}
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          {/* Product Image */}
          <div className="flex-shrink-0 mx-auto sm:mx-0">
            <div className="relative">
              <img
                src={job.image || job.logo}
                alt={`${job.title} product`}
                className="w-full h-48 sm:w-40 sm:h-40 md:w-48 md:h-48 rounded-lg object-cover border border-gray-200 dark:border-gray-600"
                onError={(e) => {
                  e.target.src = `https://via.placeholder.com/200/3B82F6/FFFFFF?text=${job.title?.charAt(0) || 'P'}`;
                }}
              />
              {/* Product Type Badge */}
              {job.category && (
                <span className="absolute top-2 left-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200">
                  <FaShoppingBag className="w-3 h-3 mr-1" />
                  {job.category}
                </span>
              )}
            </div>
          </div>
          
          {/* Product Details */}
          <div className="flex-1 min-w-0">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between mb-3 gap-2">
              <div className="flex-1">
                <h2 className="font-bold text-lg sm:text-xl text-gray-900 dark:text-white mb-1 line-clamp-2">
                  {job.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 font-medium mb-2">
                  {job.company}
                </p>
              </div>
              
              {/* Featured and Urgent Badges */}
              <div className="flex sm:flex-col gap-2 sm:gap-1">
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

            {/* Product Specifications */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 text-sm text-gray-600 dark:text-gray-400 mb-3">
              <div className="flex items-center">
                <FaMapMarkerAlt className="w-4 h-4 mr-1 flex-shrink-0" />
                <span className="truncate">{job.location}</span>
              </div>
              <div className="flex items-center">
                <FaClock className="w-4 h-4 mr-1 flex-shrink-0" />
                {job.posted}
              </div>
              <div className="flex items-center">
                <FaUsers className="w-4 h-4 mr-1 flex-shrink-0" />
                {job.applicants} applicants
              </div>
            </div>

            {/* Product Description */}
            {job.description && (
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {job.description}
              </p>
            )}

            {/* Product Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                {job.type}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                {job.level}
              </span>
              {job.tags && job.tags.slice(0, 2).map((tag, index) => (
                <span 
                  key={index}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Price and Action Button */}
        <div className="flex flex-row lg:flex-col items-center justify-between lg:items-end lg:justify-between space-y-3 border-t lg:border-t-0 pt-4 lg:pt-0 lg:pl-4 lg:border-l border-gray-200 dark:border-gray-700">
          <div className="text-left lg:text-right">
            <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
              {job.salary}
            </p>
            {job.originalPrice && (
              <p className="text-sm text-gray-500 dark:text-gray-400 line-through">
                {job.originalPrice}
              </p>
            )}
          </div>
          
          <button 
            onClick={handleApplyNow}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-transform text-sm sm:text-base"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default JobCard;