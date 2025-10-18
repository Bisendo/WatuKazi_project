import React from "react";
import JobCard from "./JobCard";

const JobList = () => {
  const jobs = [
    {
      id: 1,
      company: "Amazon",
      title: "Software Engineer",
      location: "San Francisco, CA",
      salary: "$90K - $120K",
      level: "Mid-Level",
      type: "Full-time",
    },
    {
      id: 2,
      company: "Facebook",
      title: "Product Manager",
      location: "Remote",
      salary: "$110K - $140K",
      level: "Senior",
      type: "Full-time",
    },
    {
      id: 3,
      company: "Google",
      title: "Frontend Developer",
      location: "New York, NY",
      salary: "$85K - $115K",
      level: "Junior",
      type: "Full-time",
    },
    {
      id: 4,
      company: "Microsoft",
      title: "Data Analyst",
      location: "Seattle, WA",
      salary: "$100K - $130K",
      level: "Mid-Level",
      type: "Contract",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6 max-w-6xl mx-auto">
      {jobs.map((job) => (
        <JobCard key={job.id} job={job} />
      ))}
    </div>
  );
};

export default JobList;