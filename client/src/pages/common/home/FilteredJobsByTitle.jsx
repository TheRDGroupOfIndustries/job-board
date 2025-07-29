// src/pages/FilteredJobsByTitle.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BookmarkPlus } from "lucide-react";
import { toast } from "react-toastify";
import { getAllJobs } from "../../../API";
import { useAuth } from "../../../context/useAuth";

const FilteredJobsByTitle = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);

  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get("category");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getAllJobs();
        const allJobs = res.data.data || [];

        const filtered = allJobs.filter((job) =>
          job.jobTitle?.toLowerCase().includes(category.toLowerCase())
        );

        setJobs(filtered);
      } catch (error) {
        console.error("Error filtering jobs:", error);
      }
    };

    if (category) {
      fetchJobs();
    }
  }, [category]);

  const handleSaveJob = (e, job) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      toast.warn("Login to save jobs.");
      return navigate("/auth/login");
    }

    const existing = JSON.parse(localStorage.getItem("savedJobs")) || [];
    if (!existing.some((j) => j._id === job._id)) {
      localStorage.setItem("savedJobs", JSON.stringify([...existing, job]));
      toast.success("Job saved!");
    } else {
      toast.info("Already saved.");
    }
  };

  return (
    <section className="py-10 px-6 bg-[conic-gradient(at_top_left,#DBEAFE,#FCE7F3,#FEF9C3,#DCFCE7,#EDE9FE,#FECACA)] min-h-screen">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm bg-pink-100 text-pink-700 px-4 py-2 rounded-md hover:bg-pink-200"
        >
          ← Back
        </button>

        <h2 className="text-3xl font-bold text-gray-800 mb-6">
          Jobs for “{category}”
        </h2>

        {jobs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {jobs.map((job) => (
              <div
                key={job._id}
                onClick={() => navigate(`/jobs/${job._id}`)}
                className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col justify-between relative"
              >
                <button
                  onClick={(e) => handleSaveJob(e, job)}
                  className="absolute top-4 right-4 p-2 bg-gray-50 hover:bg-gray-100 rounded-full"
                >
                  <BookmarkPlus className="w-4 h-4 text-blue-500" />
                </button>

                <h3 className="text-lg font-semibold text-gray-800 mb-2">
                  {job.jobTitle}
                </h3>
                <p className="text-sm text-gray-500">
                  {job.companyName} • {job.location}
                </p>

                <div className="flex flex-wrap gap-2 my-3">
                  {(job.skills || []).map((skill, i) => (
                    <span
                      key={i}
                      className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-gray-500">
            No jobs found for "{category}".
          </p>
        )}
      </div>
    </section>
  );
};

export default FilteredJobsByTitle;
