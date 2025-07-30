/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { FiBriefcase, FiMapPin } from "react-icons/fi";
import { BookmarkPlus } from "lucide-react";
import { useAuth } from "../../../context/useAuth";
import { useLocation, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { getAllJobs } from "../../../API";
import LoadingSpinner from "../../../components/Loading";

export default function JobCardGrid() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
const [loading, setLoading] = useState(true);

  const [jobs, setJobs] = useState([]);
  const [searchTitle, setSearchTitle] = useState("");
  const [searchLocation, setSearchLocation] = useState("");

  useEffect(() => {
    const fetchJobs = async () => {
        setLoading(true);
      try {
        const response = await getAllJobs();
        const data = response?.data;
       
        if (Array.isArray(data?.data)) {
          setJobs(data.data);
        } else if (Array.isArray(data?.jobs)) {
          setJobs(data.jobs);
        } else if (Array.isArray(data?.data?.jobs)) {
          setJobs(data.data.jobs);
        } else {
          console.warn("Unexpected API response format:", data);
          toast.error("Unexpected API response format.");
          setJobs([]);
        }
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast.error("Failed to fetch jobs.");
      }finally {
      setLoading(false); 
    }
    };

    fetchJobs();
  }, []);

  const handleGoBack = () => navigate(-1);

  const filteredJobs = jobs.filter((job) => {
    const matchTitle = (job.jobTitle || "")
      .toLowerCase()
      .includes(searchTitle.toLowerCase());
    const matchLocation = (job.location || "")
      .toLowerCase()
      .includes(searchLocation.toLowerCase());
    return matchTitle && matchLocation;
  });

  const jobsToShow =
    location.pathname === "/getJobs" ? filteredJobs : filteredJobs.slice(0, 6);

  const handleSaveJob = (e, job) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.warn("Please log in to save jobs.");
      setTimeout(() => navigate("/auth/login"), 1000);
      return;
    }

    const saved = JSON.parse(localStorage.getItem("savedJobs")) || [];
    if (!saved.some((j) => j._id === job._id)) {
      localStorage.setItem("savedJobs", JSON.stringify([...saved, job]));
      toast.success("Job saved!");
    } else {
      toast.info("Job already saved.");
    }
  };

  return (
    <section className="py-10 px-6 bg-[conic-gradient(at_top_left,#DBEAFE,#FCE7F3,#FEF9C3,#DCFCE7,#EDE9FE,#FECACA)]">
      <div className="max-w-7xl mx-auto">
        {location.pathname === "/jobCardGrid" && (
          <button
            onClick={handleGoBack}
            className="fixed top-10 right-5 z-50 px-4 py-3 border text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-400 border-pink-600 rounded-md font-medium transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-pink-400"
          >
            Go Back
          </button>
        )}

        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900">
            Explore{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-300">
              Job Opportunities
            </span>
          </h2>
          <p className="text-gray-600 mt-2 max-w-xl mx-auto">
            Browse through a wide range of exciting job roles from top
            companies.
          </p>
        </div>

        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-lg px-3 py-2 w-full max-w-2xl mx-auto mb-10">
          <form className="flex flex-col md:flex-row items-stretch gap-4">
            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md flex-grow">
              <FiBriefcase className="text-gray-500 text-lg" />
              <input
                type="text"
                placeholder="Job title or keyword"
                value={searchTitle}
                onChange={(e) => setSearchTitle(e.target.value)}
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>

            <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md flex-grow">
              <FiMapPin className="text-gray-500 text-lg" />
              <input
                type="text"
                placeholder="Location"
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                className="bg-transparent outline-none text-sm w-full"
              />
            </div>

            <button
              type="submit"
              className="bg-gradient-to-r from-pink-400 to-orange-300 text-gray-700 px-6 py-2 rounded-md"
              onClick={(e) => e.preventDefault()}
            >
              Explore Now
            </button>
          </form>
        </div>

        {/* Job Cards */}
        {loading ? (
  <LoadingSpinner size="large" />
) : (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
    {jobsToShow.length > 0 ? (
      jobsToShow.map((job) => (
        <div
          key={job._id}
          onClick={() => navigate(`/jobs/${job._id}`)}
          className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col justify-between relative"
        >
          <button
            onClick={(e) => handleSaveJob(e, job)}
            className="absolute top-4 right-4 p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition"
            title="Save Job"
          >
            <BookmarkPlus className="w-4 h-4 text-blue-500" />
          </button>

          <div className="flex items-center gap-4 mb-4">
            <div>
              <h4 className="text-sm font-medium text-gray-700">
                {job.companyName}
              </h4>
              <p className="text-xs text-gray-400">{job.location}</p>
            </div>
          </div>

          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            {job.jobTitle}
          </h3>

          <div className="flex flex-wrap gap-2 mb-3">
            {Array.isArray(job.skills)
              ? job.skills
                  .flatMap((skill) =>
                    typeof skill === "string" && skill.includes(",")
                      ? skill.split(",").map((s) => s.trim())
                      : [skill]
                  )
                  .map((skill, idx) => (
                    <span
                      key={idx}
                      className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium"
                    >
                      {skill}
                    </span>
                  ))
              : null}
          </div>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 mb-4">
            <span>
              <strong>Experience:</strong> {job.experienceLevel}
            </span>
            <span>
              <strong>Salary:</strong> {job.saleryRange}
            </span>
          </div>

          <div className="flex flex-wrap gap-2 mb-4">
            {(job.tags || []).map((tag, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      ))
    ) : (
      <p className="col-span-full text-center text-gray-500">
        No matching jobs found.
      </p>
    )}
  </div>
)}

      </div>
    </section>
  );
}
