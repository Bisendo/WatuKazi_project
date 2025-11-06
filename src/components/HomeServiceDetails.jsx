import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import axios from "axios";
import { 
  FaMapMarkerAlt, 
  FaClock, 
  FaUsers, 
  FaBuilding, 
  FaMoneyBillWave,
  FaTimes
} from "react-icons/fa";

const HomeDetails = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [job, setJob] = useState(location.state?.job || null);
  const [loading, setLoading] = useState(!job);
  const [error, setError] = useState(null);
  const [showApplicationForm, setShowApplicationForm] = useState(false);
  const [formData, setFormData] = useState({
    workLocation: "",
    workDescription: "",
    urgency: "medium",
    preferredDate: ""
  });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  // Check if user is authenticated
  const isAuthenticated = () => {
    const token = localStorage.getItem("token"); // or your auth token storage method
    return !!token;
  };

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

  const handleApplyClick = () => {
    if (!isAuthenticated()) {
      alert("Please login to apply for this job");
      navigate("/signin"); // Redirect to login page
      return;
    }
    setShowApplicationForm(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError("");

    try {
      const token = localStorage.getItem("token");
      const applicationData = {
        serviceId: id,
        applicationType: "client_to_provider",
        clientApplication: {
          workLocation: formData.workLocation,
          workDescription: formData.workDescription,
          urgency: formData.urgency,
          preferredDate: formData.preferredDate ? new Date(formData.preferredDate).toISOString() : null
        }
      };

      const response = await axios.post(
        `${process.env.REACT_APP_BASE_URL || "http://localhost:5000"}/service-applications`,
        applicationData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.status === 201) {
        alert("Application submitted successfully!");
        setShowApplicationForm(false);
        setFormData({
          workLocation: "",
          workDescription: "",
          urgency: "medium",
          preferredDate: ""
        });
      }
    } catch (err) {
      setFormError(
        err.response?.data?.message || 
        "Failed to submit application. Please try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const closeForm = () => {
    setShowApplicationForm(false);
    setFormError("");
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;

  return (
    <>
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
            <button 
              onClick={handleApplyClick}
              className="mt-3 bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg transition-transform hover:-translate-y-0.5"
            >
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

      {/* Application Form Popup */}
      {showApplicationForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto"
          >
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                  Apply for {job.title}
                </h2>
                <button
                  onClick={closeForm}
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                >
                  <FaTimes size={20} />
                </button>
              </div>

              {formError && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmitApplication}>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Work Location *
                    </label>
                    <input
                      type="text"
                      name="workLocation"
                      value={formData.workLocation}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter work address"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Work Description *
                    </label>
                    <textarea
                      name="workDescription"
                      value={formData.workDescription}
                      onChange={handleInputChange}
                      required
                      rows="4"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Describe the work you need done..."
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Urgency *
                    </label>
                    <select
                      name="urgency"
                      value={formData.urgency}
                      onChange={handleInputChange}
                      required
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="datetime-local"
                      name="preferredDate"
                      value={formData.preferredDate}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
                    />
                  </div>
                </div>

                <div className="mt-6 flex gap-3">
                  <button
                    type="button"
                    onClick={closeForm}
                    className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={formLoading}
                    className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    {formLoading ? "Submitting..." : "Submit Application"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
};

export default HomeDetails;