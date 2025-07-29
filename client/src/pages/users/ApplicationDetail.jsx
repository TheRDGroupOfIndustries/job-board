import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { Clock } from "lucide-react";
import { allApplication } from "../../API"; // Import from index.jsx
import { toast } from "react-toastify";

const ApplicationDetail = () => {
  const { id } = useParams();
  const [app, setApp] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplication = async () => {
      try {
        const response = await allApplication();
        const found = response.data.data.find((item) => String(item._id) === id);
        if (found) {
          setApp({
            id: found._id,
            title: found.job.jobTitle,
            company: found.job.companyName,
            date: new Date(found.appliedAt).toLocaleDateString(),
            status: found.status,
            statusColor: getStatusColor(found.status),
          });
        } else {
          throw new Error("Application not found");
        }
      } catch (err) {
        console.error("Error fetching application:", err);
        setError("Failed to load application details. Showing cached data.");
        const stored = JSON.parse(localStorage.getItem("applications")) || [];
        const found = stored.find((item) => String(item.id) === id);
        setApp(found);
      } finally {
        setLoading(false);
      }
    };

    fetchApplication();
  }, [id]);

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

  const stages = ["Applied", "Under Review", "Shortlisted", "Rejected"];

  if (loading) return <p className="p-10 text-center">Loading...</p>;
  if (error) return <p className="p-10 text-center text-red-600">{error}</p>;
  if (!app) return <p className="p-10 text-center">Application not found.</p>;

  const currentIndex = stages.findIndex((stage) => stage === app.status);

  return (
    <div className="max-w-3xl mx-auto px-6 py-10 bg-white rounded-xl shadow">
      <h1 className="text-2xl font-bold mb-2">{app.title}</h1>
      <p className="text-gray-600 mb-1">{app.company}</p>
      <p className="text-gray-500 mb-4 flex items-center gap-2">
        <Clock className="w-4 h-4" /> Applied on {app.date}
      </p>
      <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium mb-6 ${app.statusColor}`}>
        {app.status}
      </span>
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Application Progress</h2>
      <div className="flex items-center justify-between gap-2 sm:gap-6">
        {stages.map((stage, index) => {
          let bg = "bg-gray-200 text-gray-500";
          if (index < currentIndex) bg = "bg-green-500 text-white";
          else if (index === currentIndex) bg = "bg-yellow-400 text-white animate-pulse";

          return (
            <div key={stage} className="flex flex-col items-center flex-1 relative">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all duration-300 ${bg}`}
              >
                {index + 1}
              </div>
              <p className="text-xs text-center mt-2 font-medium text-gray-700">{stage}</p>
              {index !== stages.length - 1 && (
                <div
                  className={`absolute top-5 left-full h-1 w-full sm:w-24 transition-all duration-300 z-0 ${
                    index < currentIndex
                      ? "bg-green-400"
                      : index === currentIndex
                      ? "bg-yellow-300"
                      : "bg-gray-300"
                  }`}
                ></div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ApplicationDetail;