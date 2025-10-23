import React, { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaUsers, 
  FaBuilding, 
  FaMoneyBillWave 
} from "react-icons/fa";

const JobDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const [job, setJob] = useState(location.state?.job || null);
  const [loading, setLoading] = useState(!job);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!job) {
      const fetchJob = async () => {
        try {
          const res = await axios.get(`http://localhost:5000/services/${id}`);
          setJob(res.data);
          setLoading(false);
        } catch (err) {
          setError("Failed to load job details");
          setLoading(false);
        }
      };
      fetchJob();
    }
  }, [id, job]);

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <motion.div
      className="max-w-5xl mx-auto mt-10 bg-white dark:bg-gray-900 rounded-xl shadow-lg p-8 border border-gray-100 dark:border-gray-700"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {/* Header Section */}
      <div className="flex flex-col md:flex-row items-start md:items-center gap-6">
        <img
          src={job.logo || "https://via.placeholder.com/120"}
          alt={`${job.company} logo`}
          className="w-24 h-24 rounded-xl object-cover border border-gray-200 dark:border-gray-700"
        />

        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{job.title}</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-2">{job.company}</p>

          <div className="flex flex-wrap gap-4 text-gray-500 dark:text-gray-400">
            <span className="flex items-center"><FaMapMarkerAlt className="mr-2" /> {job.location}</span>
            <span className="flex items-center"><FaClock className="mr-2" /> {job.posted || "Recently"}</span>
            <span className="flex items-center"><FaUsers className="mr-2" /> {job.applicants || 0} applicants</span>
          </div>
        </div>

        <div className="text-right">
          <p className="text-xl font-bold text-blue-600 dark:text-blue-400">{job.salary || "Negotiable"}</p>
          <button className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-transform hover:-translate-y-0.5">
            Apply Now
          </button>
        </div>
      </div>

      <hr className="my-6 border-gray-200 dark:border-gray-700" />

      {/* Job Info Section */}
      <div className="grid md:grid-cols-3 gap-6">
        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg"
        >
          <h3 className="text-gray-900 dark:text-white font-semibold mb-2 flex items-center gap-2">
            <FaBuilding /> Company
          </h3>
          <p className="text-gray-700 dark:text-gray-300">{job.company}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg"
        >
          <h3 className="text-gray-900 dark:text-white font-semibold mb-2 flex items-center gap-2">
            <FaMapMarkerAlt /> Location
          </h3>
          <p className="text-gray-700 dark:text-gray-300">{job.location}</p>
        </motion.div>

        <motion.div
          whileHover={{ scale: 1.03 }}
          className="bg-yellow-50 dark:bg-yellow-900/20 p-4 rounded-lg"
        >
          <h3 className="text-gray-900 dark:text-white font-semibold mb-2 flex items-center gap-2">
            <FaMoneyBillWave /> Salary
          </h3>
          <p className="text-gray-700 dark:text-gray-300">{job.salary}</p>
        </motion.div>
      </div>

      {/* Description */}
      <div className="mt-8">
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">Job Description</h2>
        <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
          {job.description || "No description available for this job."}
        </p>
      </div>

      {/* Tags */}
      <div className="mt-6 flex flex-wrap gap-3">
        {job.type && (
          <span className="px-3 py-1 bg-blue-100 dark:bg-blue-800 text-blue-800 dark:text-blue-200 rounded-full text-sm font-medium">
            {job.type}
          </span>
        )}
        {job.level && (
          <span className="px-3 py-1 bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200 rounded-full text-sm font-medium">
            {job.level}
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default JobDetails;
