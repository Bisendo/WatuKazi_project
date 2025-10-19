import React from "react";
import { motion } from "framer-motion";
import { FaMapMarkerAlt } from "react-icons/fa";

const JobCard = ({ job }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-sm p-5 flex flex-col md:flex-row items-start md:items-center justify-between transition-all border border-gray-100 dark:border-gray-700"
    >
      <div>
        <h2 className="font-semibold text-lg">{job.title}</h2>
        <p className="text-gray-500 text-sm mb-2">{job.company}</p>
        <div className="flex items-center text-sm text-gray-400">
          <FaMapMarkerAlt className="mr-2" /> {job.location}
        </div>
      </div>
      <div className="text-right mt-3 md:mt-0">
        <p className="text-blue-500 font-semibold">{job.salary}</p>
        <p className="text-sm">{job.type} • {job.level}</p>
        <button className="mt-3 bg-blue-500 hover:bg-blue-600 text-white py-2 px-5 rounded-full transition">
          Apply
        </button>
      </div>
    </motion.div>
  );
};

export default JobCard;
