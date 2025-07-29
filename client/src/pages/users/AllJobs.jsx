import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Briefcase, Users, Clock  } from "lucide-react";
import { getAllJobs } from "../../API";

const AllJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getAllJobs();

        setJobs(response.data.data || []);
        localStorage.setItem("allJobs", JSON.stringify(response.data.data)); // Cache in localStorage
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Failed to load jobs. Please try again later.");
        setJobs(JSON.parse(localStorage.getItem("allJobs")) || []); // Fallback to cached jobs
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-tr from-blue-50 via-pink-50 to-yellow-50 py-10 px-4">
      <div className="max-w-6xl mx-auto">
        <h2 className="text-3xl font-bold text-gray-800 mb-8 text-center">
          All Job Listings
        </h2>
        <button
      onClick={() => navigate("/jobseeker-dashboard")}
      className="flex items-center gap-2 fixed top-10 right-5 z-50 px-4 py-3 border text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-400 border-pink-600 rounded-md font-medium transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-pink-400"
    >
      Back to Dashboard
    </button>

        {/* Loading and Error States */}
        {loading && (
          <div className="text-center text-gray-600 p-6">Loading jobs...</div>
        )}
        {error && <div className="text-center text-red-600 p-6">{error}</div>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {jobs.length > 0
            ? jobs.map((job) => (
                <Link
                  to={`/jobs/${job._id}`} // ✅ Fixed template string
                  key={job._id}
                  className="bg-white p-6 rounded-xl shadow hover:shadow-md border border-gray-100 transition-all duration-300 block"
                >
                  <div className="mb-3">
                    <h3 className="text-xl font-semibold text-gray-800 hover:text-blue-600">
                      {job.jobTitle}
                    </h3>
                    <p className="text-gray-600">{job.companyName}</p>
                    <p className="text-sm text-gray-500">{job.location}</p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" />
                      {job.jobType}
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      {job.experienceLevel}
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4" />
                      {job.saleryRange}
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2 mb-2">
                    {job.skills?.map((skill, i) => (
                      <span
                        key={i}
                        className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded-full font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <div className="text-sm text-gray-500 flex justify-between items-center">
                    <span className="flex items-center gap-1">
                      <Clock className="w-4 h-4" />
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </Link>
              ))
            : !loading && (
                <div className="text-center text-gray-600 p-6">
                  No jobs available. Please check back later.
                </div>
              )}
        </div>
      </div>
    </div>
  );
};

export default AllJobs;