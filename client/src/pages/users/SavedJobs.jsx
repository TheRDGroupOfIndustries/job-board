import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, MapPin, Briefcase, Users } from "lucide-react";
import { toast } from "react-toastify";


const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const jobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    setSavedJobs(jobs);
  }, []);

  const handleRemove = (id) => {
    const updatedJobs = savedJobs.filter((job) => job._id !== id);
    setSavedJobs(updatedJobs);
    localStorage.setItem("savedJobs", JSON.stringify(updatedJobs));
    toast.success("❌ Job Removed");
  };

  if (savedJobs.length === 0) {
    return (
      <div className="max-w-3xl mx-auto py-10 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">No Saved Jobs</h2>
        <p className="text-gray-600">Go back and save some interesting jobs.</p>
        <Link
          to="/jobCardGrid"
          className="inline-block mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
        >
          Browse Jobs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Your Saved Jobs</h2>
    <button
      onClick={() => navigate("/jobseeker-dashboard")}
      className="flex items-center gap-2 fixed top-10 right-5 z-50 px-4 py-3 border text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-400 border-pink-600 rounded-md font-medium transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-pink-400"
    >
      Back to Dashboard
    </button>
      <div className="grid gap-6">
        {savedJobs.map((job) => (
          <div
            key={job._id}
            className="p-6 bg-white rounded-xl shadow border border-gray-100 relative hover:shadow-lg transition"
          >
            {/* Remove Button */}
            <button
              onClick={() => handleRemove(job._id)}
              className="absolute top-4 right-4 p-2 bg-red-50 text-red-600 hover:bg-red-100 rounded-full transition"
              title="Remove Job"
            >
              <Trash2 className="w-5 h-5" />
            </button>

            <div className="mb-3">
              <h3 className="text-xl font-semibold text-gray-800">{job.jobTitle}</h3>
              <p className="text-gray-600">{job.companyName}</p>
            </div>

            {/* Details */}
            <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-3">
              <span className="flex items-center gap-1">
                <MapPin className="w-4 h-4" /> {job.location}
              </span>
              <span className="flex items-center gap-1">
                <Briefcase className="w-4 h-4" /> {job.experienceLevel}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-4 h-4" /> {job.saleryRange}
              </span>
            </div>

            {/* Skills */}
            <div className="flex flex-wrap gap-2">
              {(job.skills || []).map((skill) => (
                <span
                  key={skill}
                  className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-xs font-medium"
                >
                  {skill}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SavedJobs;