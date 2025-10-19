import React from "react";
import { motion } from "framer-motion";

const JobFilter = () => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -30 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 shadow-md rounded-2xl p-6"
    >
      <h3 className="font-semibold text-lg mb-4">Filter</h3>

      {/* Salary Range */}
      <div className="mb-6">
        <p className="font-medium text-gray-600 dark:text-gray-300 mb-2">
          Salary Range
        </p>
        <div className="flex flex-col space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <label><input type="radio" name="salary" className="mr-2" />Under $1000</label>
          <label><input type="radio" name="salary" className="mr-2" />$1000 - $5000</label>
          <label><input type="radio" name="salary" className="mr-2" />$5000 - $10000</label>
          <label><input type="radio" name="salary" className="mr-2" />Custom</label>
        </div>
      </div>

      {/* Job Type */}
      <div>
        <p className="font-medium text-gray-600 dark:text-gray-300 mb-2">Job Type</p>
        <div className="flex flex-col space-y-2 text-sm text-gray-500 dark:text-gray-400">
          <label><input type="checkbox" className="mr-2" />Full-time</label>
          <label><input type="checkbox" className="mr-2" />Part-time</label>
          <label><input type="checkbox" className="mr-2" />Contract</label>
          <label><input type="checkbox" className="mr-2" />Temporary</label>
        </div>
      </div>

      {/* Smart Auto Apply */}
      <div className="mt-8 p-4 bg-orange-50 dark:bg-orange-900/30 rounded-xl">
        <h4 className="font-semibold text-orange-600 mb-1">Smart Auto-Apply!</h4>
        <p className="text-sm text-gray-500 dark:text-gray-300">
          Let AI apply for jobs automatically on your behalf.
        </p>
        <button className="mt-3 bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm">
          Try Now
        </button>
      </div>
    </motion.div>
  );
};

export default JobFilter;
