import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Clock } from "lucide-react";
import { allApplication } from "../../API";
import { toast } from "react-toastify";

const ApplicationsList = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // 👈 For back button

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const response = await allApplication();

        const fetchedApplications = response.data.data.map((app) => ({
          id: app._id,
          title: app.job.jobTitle,
          company: app.job.companyName,
          date: new Date(app.appliedAt).toLocaleDateString(),
          status: app.status,
          statusColor: getStatusColor(app.status),
        }));

        setApplications(fetchedApplications);
        localStorage.setItem("applications", JSON.stringify(fetchedApplications));
      } catch (err) {
        toast.error("Error fetching applications:", err);
        setError("Failed to load applications. Showing cached data.");
        const stored = JSON.parse(localStorage.getItem("applications")) || [];
        setApplications(stored);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "Applied":
        return "bg-blue-100 text-blue-800";
      case "Under Review":
        return "bg-yellow-100 text-yellow-800";
      case "Shortlisted":
        return "bg-green-100 text-green-800";
      case "Rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return <p className="text-center py-10">Loading applications...</p>;
  }

  if (error) {
    return <p className="text-center py-10 text-red-600">{error}</p>;
  }

  if (applications.length === 0) {
    return <p className="text-center py-10">No applications found.</p>;
  }

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      {/* 🔙 Back Button */}
      <button
      onClick={() => navigate("/jobseeker-dashboard")}
      className=" flex items-center gap-2 fixed top-10 right-5 z-50 px-4 py-3 border text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-400 border-pink-600 rounded-md font-medium transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-pink-400"
    >
      Back to Dashboard
    </button>

      <h2 className="text-2xl font-bold mb-6 text-gray-800">All Applications</h2>

      <div className="grid gap-4">
        {applications.map((app) => (
          <Link
            to={`/apps/${app.id}`}
            key={app.id}
            className="block bg-white rounded-lg shadow border hover:shadow-md transition p-5"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg mb-1">{app.title}</h3>
                <p className="text-gray-600">{app.company}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Clock className="w-4 h-4" /> Applied on {app.date}
                </p>
              </div>
              <span className={`px-3 py-1 rounded-full text-sm font-medium ${app.statusColor}`}>
                {app.status}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default ApplicationsList;
