import React, { useState } from "react";
import JobCard from "./JobCard";

const JobList = () => {
  const [showAllJobs, setShowAllJobs] = useState(false);

  const jobs = [
    {
      id: 1,
      company: "Amazon",
      title: "Software Engineer",
      location: "San Francisco, CA",
      salary: "$90,000 - $120,000 / yr",
      level: "Mid-Level",
      type: "Full-time",
      logo: "https://logo.clearbit.com/amazon.com",
      posted: "2 hours ago",
      applicants: 42,
      urgent: true,
      featured: true
    },
    {
      id: 2,
      company: "Facebook",
      title: "Product Manager",
      location: "Remote",
      salary: "$110,000 - $140,000 / yr",
      level: "Senior",
      type: "Full-time",
      logo: "https://logo.clearbit.com/facebook.com",
      posted: "1 day ago",
      applicants: 28,
      urgent: false,
      featured: true
    },
    {
      id: 3,
      company: "Google",
      title: "Frontend Developer",
      location: "New York, NY",
      salary: "$95,000 - $130,000 / yr",
      level: "Mid-Level",
      type: "Full-time",
      logo: "https://logo.clearbit.com/google.com",
      posted: "3 hours ago",
      applicants: 156,
      urgent: true,
      featured: false
    },
    {
      id: 4,
      company: "Microsoft",
      title: "Data Scientist",
      location: "Seattle, WA",
      salary: "$100,000 - $135,000 / yr",
      level: "Senior",
      type: "Full-time",
      logo: "https://logo.clearbit.com/microsoft.com",
      posted: "5 hours ago",
      applicants: 89,
      urgent: false,
      featured: true
    },
    {
      id: 5,
      company: "Netflix",
      title: "UI/UX Designer",
      location: "Los Angeles, CA",
      salary: "$85,000 - $115,000 / yr",
      level: "Mid-Level",
      type: "Full-time",
      logo: "https://logo.clearbit.com/netflix.com",
      posted: "1 day ago",
      applicants: 67,
      urgent: false,
      featured: false
    },
    {
      id: 6,
      company: "Apple",
      title: "iOS Developer",
      location: "Cupertino, CA",
      salary: "$105,000 - $140,000 / yr",
      level: "Senior",
      type: "Full-time",
      logo: "https://logo.clearbit.com/apple.com",
      posted: "6 hours ago",
      applicants: 203,
      urgent: true,
      featured: true
    },
    {
      id: 7,
      company: "Tesla",
      title: "Backend Engineer",
      location: "Austin, TX",
      salary: "$95,000 - $125,000 / yr",
      level: "Mid-Level",
      type: "Full-time",
      logo: "https://logo.clearbit.com/tesla.com",
      posted: "2 days ago",
      applicants: 134,
      urgent: false,
      featured: false
    },
    {
      id: 8,
      company: "Spotify",
      title: "DevOps Engineer",
      location: "Remote",
      salary: "$100,000 - $130,000 / yr",
      level: "Senior",
      type: "Full-time",
      logo: "https://logo.clearbit.com/spotify.com",
      posted: "4 hours ago",
      applicants: 45,
      urgent: true,
      featured: false
    },
    {
      id: 9,
      company: "Airbnb",
      title: "Full Stack Developer",
      location: "San Francisco, CA",
      salary: "$110,000 - $145,000 / yr",
      level: "Senior",
      type: "Full-time",
      logo: "https://logo.clearbit.com/airbnb.com",
      posted: "1 day ago",
      applicants: 178,
      urgent: false,
      featured: true
    },
    {
      id: 10,
      company: "Uber",
      title: "Machine Learning Engineer",
      location: "Remote",
      salary: "$120,000 - $160,000 / yr",
      level: "Senior",
      type: "Full-time",
      logo: "https://logo.clearbit.com/uber.com",
      posted: "3 days ago",
      applicants: 92,
      urgent: false,
      featured: false
    },
    {
      id: 11,
      company: "Twitter",
      title: "React Native Developer",
      location: "Remote",
      salary: "$90,000 - $120,000 / yr",
      level: "Mid-Level",
      type: "Contract",
      logo: "https://logo.clearbit.com/twitter.com",
      posted: "8 hours ago",
      applicants: 56,
      urgent: true,
      featured: false
    },
    {
      id: 12,
      company: "LinkedIn",
      title: "Technical Product Manager",
      location: "Sunnyvale, CA",
      salary: "$115,000 - $150,000 / yr",
      level: "Senior",
      type: "Full-time",
      logo: "https://logo.clearbit.com/linkedin.com",
      posted: "2 days ago",
      applicants: 78,
      urgent: false,
      featured: true
    },
    {
      id: 13,
      company: "Salesforce",
      title: "Cloud Architect",
      location: "Remote",
      salary: "$130,000 - $170,000 / yr",
      level: "Expert",
      type: "Full-time",
      logo: "https://logo.clearbit.com/salesforce.com",
      posted: "1 day ago",
      applicants: 34,
      urgent: true,
      featured: true
    },
    {
      id: 14,
      company: "Adobe",
      title: "UX Researcher",
      location: "San Jose, CA",
      salary: "$85,000 - $110,000 / yr",
      level: "Mid-Level",
      type: "Full-time",
      logo: "https://logo.clearbit.com/adobe.com",
      posted: "5 hours ago",
      applicants: 41,
      urgent: false,
      featured: false
    },
    {
      id: 15,
      company: "Intel",
      title: "Systems Engineer",
      location: "Portland, OR",
      salary: "$95,000 - $125,000 / yr",
      level: "Mid-Level",
      type: "Full-time",
      logo: "https://logo.clearbit.com/intel.com",
      posted: "3 days ago",
      applicants: 63,
      urgent: false,
      featured: false
    }
  ];

  const displayedJobs = showAllJobs ? jobs : jobs.slice(0, 6);

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
      {jobs.length === 0 && (
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