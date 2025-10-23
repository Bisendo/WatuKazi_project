import React, { useState, useEffect } from "react";
import axios from "axios";
import JobCard from "./JobCard";

const JobList = () => {
  const [showAllJobs, setShowAllJobs] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to fetch jobs from API
  const fetchJobs = async () => {
    try {
      setLoading(true);
      // Replace with your actual API endpoint
      const response = await axios.get("https://api.watukazi.com/api/v1/services");
      
      // Transform the API data to match the JobCard component structure
      const transformedJobs = response.data.services.map(service => ({
        id: service.id,
        company: service.creator.businessName || `${service.creator.firstName} ${service.creator.lastName}`,
        title: service.title,
        location: service.location,
        salary: service.budget ? `${service.budget} ${service.currency}` : "Negotiable",
        level: getExperienceLevel(service),
        type: getJobType(service),
        logo: service.images && JSON.parse(service.images)[0] || getDefaultLogo(service.creator.businessName),
        posted: getTimeAgo(service.createdAt),
        applicants: service.totalBookings || 0,
        urgent: service.urgency === "high",
        featured: service.featured
      }));

      setJobs(transformedJobs);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch jobs");
      setLoading(false);
      console.error("Error fetching jobs:", err);
    }
  };

  // Helper function to determine experience level
  const getExperienceLevel = (service) => {
    if (service.budget > 100000) return "Expert";
    if (service.budget > 50000) return "Senior";
    if (service.budget > 20000) return "Mid-Level";
    return "Entry-Level";
  };

  // Helper function to determine job type
  const getJobType = (service) => {
    if (service.budgetType === "fixed") return "Fixed Price";
    if (service.budgetType === "negotiable") return "Negotiable";
    if (service.budgetType === "flexible") return "Flexible";
    return "Full-time";
  };

  // Helper function to get default logo
  const getDefaultLogo = (businessName) => {
    // You can replace this with your own default logo logic
    return `https://ui-avatars.com/api/?name=${encodeURIComponent(businessName || "Company")}&background=random`;
  };

  // Helper function to calculate time ago
  const getTimeAgo = (dateString) => {
    const now = new Date();
    const postedDate = new Date(dateString);
    const diffInHours = Math.floor((now - postedDate) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return "Just now";
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    return `${diffInDays} days ago`;
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const displayedJobs = showAllJobs ? jobs : jobs.slice(0, 6);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600 dark:text-gray-400">Loading jobs...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <div className="text-red-400 dark:text-red-500 text-6xl mb-4">⚠️</div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
          Error Loading Jobs
        </h3>
        <p className="text-gray-600 dark:text-gray-400 mb-4">
          {error}
        </p>
        <button
          onClick={fetchJobs}
          className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
            Available Jobs
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Showing {displayedJobs.length} of {jobs.length} jobs
          </p>
        </div>
        
        {/* Sort Options */}
        <div className="flex items-center space-x-4">
          <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm">
            <option>Sort by: Newest</option>
            <option>Sort by: Salary</option>
            <option>Sort by: Relevance</option>
            <option>Sort by: Company</option>
          </select>
        </div>
      </div>

      {/* Jobs Grid */}
      <div className="grid gap-4 sm:gap-6">
        {displayedJobs.map((job) => (
          <JobCard key={job.id} job={job} />
        ))}
      </div>

      {/* Load More Button */}
      {!showAllJobs && jobs.length > 6 && (
        <div className="flex justify-center pt-6">
          <button
            onClick={() => setShowAllJobs(true)}
            className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 transition-transform"
          >
            Load More Jobs ({jobs.length - 6} more)
          </button>
        </div>
      )}

      {/* Show Less Button */}
      {showAllJobs && (
        <div className="flex justify-center pt-6">
          <button
            onClick={() => setShowAllJobs(false)}
            className="px-8 py-3 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors duration-200"
          >
            Show Less
          </button>
        </div>
      )}

      {/* Empty State */}
      {jobs.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 dark:text-gray-500 text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No jobs found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters to see more results.
          </p>
        </div>
      )}
    </div>
  );
};

export default JobList;