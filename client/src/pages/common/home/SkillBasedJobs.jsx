import React, { useEffect, useState } from "react";

const SkillBasedJobs = ({ skills }) => {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    fetch("/jobs.json")
      .then((res) => res.json())
      .then((data) => {
        const filtered = data.filter((job) =>
          skills.some((skill) =>
            job.title.toLowerCase().includes(skill.toLowerCase())
          )
        );
        setJobs(filtered.slice(0, 10));
      });
  }, [skills]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-6 px-6">
      {jobs.map((job, i) => (
        <div key={i} className="p-4 bg-white rounded-xl shadow">
          <h4 className="font-semibold">{job.title}</h4>
          <p className="text-sm text-gray-500">{job.company}</p>
        </div>
      ))}
    </div>
  );
};

export default SkillBasedJobs;
