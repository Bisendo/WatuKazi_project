import React from "react";
import JobCard from "./JobCard";

const JobList = () => {
  const jobs = [
    {
      id: 1,
      company: "Amazon",
      title: "Software Engineer",
      location: "San Francisco, CA",
      salary: "$90,000 - $120,000 / yr",
      level: "Mid-Level",
      type: "Full-time",
    },
    {
      id: 2,
      company: "Facebook",
      title: "Product Manager",
      location: "Remote",
      salary: "$110,000 - $140,000 / yr",
      level: "Senior",
      type: "Full-time",
    },
  ];

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobList;
