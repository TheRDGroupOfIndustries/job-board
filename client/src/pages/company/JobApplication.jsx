import React, { useEffect, useState } from "react";
import axios from "axios";
import { Clock } from "lucide-react";

const CompanyApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:8000/api/v1/applications/company-applications", {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        });

        setApplications(response.data.data);
      } catch (err) {
        console.error("Error fetching applications:", err);
        setError("Failed to load applications.");
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const handleStatusChange = async (applicationId, status) => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:8000/api/v1/applications/update-status",
        { applicationId, status },
        {
          headers: { Authorization: `Bearer ${token}` },
          withCredentials: true,
        }
      );
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId ? { ...app, status } : app
        )
      );
      alert("Application status updated successfully!");
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.response?.data?.message || "Failed to update status");
    }
  };

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

  if (loading) return <p className="text-center py-10">Loading applications...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;
  if (applications.length === 0) return <p className="text-center py-10">No applications found for your jobs.</p>;

  return (
    <div className="max-w-5xl mx-auto py-10 px-4">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Job Applications</h2>
      <div className="grid gap-4">
        {applications.map((app) => (
          <div
            key={app._id}
            className="block bg-white rounded-lg shadow border hover:shadow-md transition p-5"
          >
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-semibold text-gray-800 text-lg mb-1">{app.job.jobTitle}</h3>
                <p className="text-gray-600">Applicant: {app.user.firstName} {app.user.lastName}</p>
                <p className="text-gray-600">Email: {app.user.email}</p>
                <p className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                  <Clock className="w-4 h-4" /> Applied on {new Date(app.appliedAt).toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-600 mt-1">
                  Status: <span className={getStatusColor(app.status)}>{app.status}</span>
                </p>
              </div>
              <div className="flex flex-col gap-2">
                {["Applied", "Under Review", "Shortlisted", "Rejected"].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(app._id, status)}
                    className={`px-3 py-1 rounded-full text-sm font-medium ${
                      app.status === status
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                    }`}
                    disabled={app.status === status}
                  >
                    {status}
                  </button>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyApplications;