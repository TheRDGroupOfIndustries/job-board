import React, { useState, useEffect } from "react";
import { getCompanyJobs, deleteJobById } from "./api.js";
import { toast } from "react-toastify";
import {
  MapPin, Clock, Users, Briefcase, Trash2
} from "lucide-react";

const MyJobs = () => {
  const [companyJobs, setCompanyJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchCompanyJobs = async () => {
    try {
      const res = await getCompanyJobs();
      setCompanyJobs(res.data.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch jobs");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this job?")) return;
    try {
      await deleteJobById(id);
      setCompanyJobs(prev => prev.filter(job => job._id !== id));
      toast.success("Job deleted successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete job");
    }
  };

  useEffect(() => {
    fetchCompanyJobs();
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-2xl font-bold mb-6">Your Posted Jobs</h1>

      {loading ? (
        <p>Loading...</p>
      ) : companyJobs.length === 0 ? (
        <p>You have not posted any jobs yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companyJobs.map(job => (
            <div
              key={job._id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition"
            >
              <div className="mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  {job.jobTitle}
                </h3>
                <p className="text-gray-600">{job.companyName}</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Briefcase className="w-4 h-4" />
                  {job.jobType}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Users className="w-4 h-4" />
                  {job.experienceLevel}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <MapPin className="w-4 h-4" />
                  {job.location}
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  {new Date(job.createdAt).toLocaleDateString()}
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-4">
                {job.skills.map(skill => (
                  <span
                    key={skill}
                    className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <button
                onClick={() => handleDelete(job._id)}
                className="flex items-center gap-2 text-red-600 hover:text-red-800 text-sm font-medium"
              >
                <Trash2 className="w-4 h-4" /> Delete Job
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyJobs;