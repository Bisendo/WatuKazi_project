import React from "react";
import AnimationWrapper from "../components/AnimationWrapper";
import JobCard from "../components/JobCard";

const SavedJobs = () => {
  const saved = [
    { id: 1, company: "Google", title: "UI/UX Designer", location: "Remote", salary: "$70k - $100k", type: "Full-time", level: "Mid" },
    { id: 2, company: "Tesla", title: "Software Engineer", location: "Texas", salary: "$120k - $150k", type: "Full-time", level: "Senior" },
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold text-orange-600 mb-8">Saved Jobs</h1>
      <div className="space-y-4">
        {saved.map((job, index) => (
          <AnimationWrapper key={job.id} delay={index * 0.1}>
            <JobCard job={job} />
          </AnimationWrapper>
        ))}
      </div>
    </div>
  );
};

export default SavedJobs;
