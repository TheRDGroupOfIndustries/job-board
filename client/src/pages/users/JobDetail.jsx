import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { allApplication, getAllJobs } from "../../API";


import {
  Share2,
  BookmarkPlus,
  MapPin,
  Clock,
  Users,
  DollarSign,
  Briefcase,
  Mail,
  Calendar,
} from "lucide-react";
import { useAuth } from "../../context/useAuth";
import { toast } from "react-toastify";
import { applyJob } from "../../API";

const bgClassMap = {
  blue: "bg-blue-100 border-blue-500 text-blue-600",
  green: "bg-green-100 border-green-500 text-green-600",
  pink: "bg-pink-100 border-pink-500 text-pink-600",
  yellow: "bg-yellow-100 border-yellow-500 text-yellow-600",
  purple: "bg-purple-100 border-purple-500 text-purple-600",
  orange: "bg-orange-100 border-orange-500 text-orange-600",
};
const textColorMap = {
  blue: "text-blue-600",
  green: "text-green-600",
  pink: "text-pink-600",
  yellow: "text-yellow-600",
  purple: "text-purple-600",
  orange: "text-orange-600",
  gray: "text-gray-600",
};

const SummaryCard = ({ icon: Icon, label, value, color }) => (
  <div className={`rounded-lg p-4 shadow-sm border ${bgClassMap[color]}`}>
    <div className="flex items-center gap-3">
      <Icon className={`w-5 h-5 ${textColorMap[color]}`} />
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className={`text-base font-semibold ${textColorMap[color]}`}>
          {value}
        </p>
      </div>
    </div>
  </div>
);

const DetailSection = ({ title, color, items }) => (
  <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
    <h3 className={`text-lg font-bold ${textColorMap[color]} mb-4`}>{title}</h3>
    <ul className="space-y-3">
      {items.map((item, idx) => (
        <li key={idx} className="flex items-start gap-3">
          <div
            className={`w-2 h-2 ${
              bgClassMap[color].split(" ")[0]
            } rounded-full mt-2`}
          ></div>
          <span className="text-gray-700">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const JobDetails = () => {
  const { id } = useParams();
  const [isSaved, setIsSaved] = useState(false);
  const [jobDetail, setJobDetail] = useState(null);
  const [isApplied, setIsApplied] = useState(false);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const { isAuthenticated , role} = useAuth();

  const handleGoBack = () => {
    navigate(-1);
  };



useEffect(() => {
  const fetchAndSetJob = async () => {
    try {
      const res = await getAllJobs(); 
      const jobList = res.data.data; 
      
      const job = jobList.find((job) => job._id === id);
      setJobDetail(job);
if (job && isAuthenticated) {
  const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
  const appliedJobs = JSON.parse(localStorage.getItem("applications")) || [];

  setIsSaved(!!savedJobs.find((j) => j._id === job._id));
  setIsApplied(!!appliedJobs.find((j) => j.title === job.jobTitle));

  allApplication()
    .then((res) => {
      const userApplications = res.data.data;

      const alreadyApplied = userApplications.find(
        (app) => app.job === job._id || app.job?._id === job._id
      );

      setIsApplied(!!alreadyApplied);
    })
    .catch((err) => {
      console.log(err);
    });
}

    } catch (error) {
      console.error("Error fetching jobs:", error);
      setJobDetail(null);
    }finally {
      setLoading(false); 
    }
  };

  fetchAndSetJob();
}, [id, isAuthenticated]);

if (loading) {
  return (
    <div className="flex flex-col items-center justify-center h-64 space-y-3">
      <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
      <p className="text-green-600 font-medium text-lg">Loading job details...</p>
    </div>
  );
}

  if (!jobDetail && !loading) {
    return (
      <div className="p-6 text-red-600 font-semibold text-center text-xl">
        Job not found
      </div>
    );
  }

  const handleSaveJob = () => {
    if (!isAuthenticated) {
      toast.error("Please login to save this job!");
      navigate("/auth/login");
      return;
    }
 if (role?.toLowerCase() !== "Jobseeker") {
    return toast.warn("Only job seekers can save jobs.");
  }
    const savedJobs = JSON.parse(localStorage.getItem("savedJobs")) || [];
    const alreadySaved = savedJobs.find((j) => j._id === jobDetail._id);
    if (!alreadySaved) {
      const updated = [...savedJobs, jobDetail];
      localStorage.setItem("savedJobs", JSON.stringify(updated));
      setIsSaved(true);
      toast.success("Job saved successfully!");
    }
  };

  const handleApply = async () => {
    if (!isAuthenticated) {
      toast.error("Please login to apply for this job!");
      navigate("/auth/login");
      return;
    }
 if (role?.toLowerCase() !== "jobseeker") {
    return toast.warn("Only job seekers can apply.");
  }
    try {
      const response = await applyJob(jobDetail._id);

      const application = response.data.data;
      const newApplication = {
        id: application._id,
        title: jobDetail.jobTitle,
        company: jobDetail.companyName,
        date: new Date(application.appliedAt).toLocaleDateString(),
        status: application.status,
        statusColor: getStatusColor(application.status),
      };

      const storedApplications =
        JSON.parse(localStorage.getItem("applications")) || [];
      const updatedApplications = [...storedApplications, newApplication];
      localStorage.setItem("applications", JSON.stringify(updatedApplications));

      setIsApplied(true);
      toast.success("Application submitted successfully!");
    } catch (error) {
      if (error.response?.status === 409) {
        toast.warn("You have already applied for this job");
        setIsApplied(true); // So button disables
      } else {
        toast.error(error.response?.data?.message || "Failed to apply");
      }
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

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 ">
      <div className="bg-[conic-gradient(at_top_left,_#DBEAFE,_#FCE7F3,_#FEF9C3,_#DCFCE7,_#EDE9FE,_#FECACA)] py-8">
        <button
          onClick={handleGoBack}
          className="flex items-center gap-2 fixed bottom-10 right-5 z-50 px-4 py-3 border text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-400 border-pink-600 rounded-md font-medium transition-all duration-300 hover:scale-105 hover:shadow-md hover:border-pink-400"
        >
          Back to Dashboard
        </button>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold mb-2">
                {jobDetail.jobTitle}
              </h1>
              <p className="text-lg font-medium text-gray-700">
                {jobDetail.companyName}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Clock className="w-4 h-4" />
                <span className="text-sm text-gray-700">
                  Posted: {new Date(jobDetail.createdAt).toLocaleDateString()}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => handleApply(jobDetail._id)}
                className={`py-3 px-3 rounded-lg font-semibold transition-all ${
                  role?.toLowerCase() === "jobseeker" && isApplied
                    ? "bg-green-300 text-gray-600 cursor-not-allowed"
                    : "bg-green-200 text-green-700 hover:bg-green-300"
                }`}
               
              >
                {role?.toLowerCase() === "jobseeker" && isApplied ? "Applied" : "Apply Now"}
              </button>
              <button className="p-3 rounded-full bg-white/20 text-gray-700 hover:bg-white/30 transition-all">
                <Share2 className="w-5 h-5" />
              </button>
              <button
                onClick={handleSaveJob}
                className={`p-3 rounded-full transition-all ${
                  role?.toLowerCase() === "jobseeker" && isSaved
                    ? "bg-yellow-500 text-white"
                    : "bg-white/20 text-gray-700 hover:bg-white/30"
                }`}
              >
                <BookmarkPlus
                  className="w-5 h-5"
                  fill={role?.toLowerCase() === "jobseeker" && isSaved ? "currentColor" : "none"}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <SummaryCard
                icon={DollarSign}
                label="Salary"
                value={jobDetail.saleryRange}
                color="blue"
              />
              <SummaryCard
                icon={Briefcase}
                label="Experience"
                value={jobDetail.experienceLevel}
                color="pink"
              />
              <SummaryCard
                icon={MapPin}
                label="Location"
                value={jobDetail.location}
                color="yellow"
              />
              <SummaryCard
                icon={Users}
                label="Job Type"
                value={jobDetail.jobType}
                color="green"
              />
            </div>
            <DetailSection
              title="Job Description"
              color="blue"
              items={[jobDetail.jobDescription]}
            />
            <DetailSection
              title="Company Description"
              color="green"
              items={[jobDetail.companyDescription]}
            />
            <DetailSection
              title="Requirements"
              color="purple"
              items={jobDetail.requirements || []}
            />
            <DetailSection
              title="Benefits"
              color="orange"
              items={jobDetail.benefits || []}
            />
          </div>
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 sticky top-6">
              <div className="text-center space-y-4">
                <span className="inline-block px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                  Apply by:{" "}
                  {new Date(jobDetail.applicationDeadline).toLocaleDateString()}
                </span>
                <button
                  onClick={() => handleApply(jobDetail._id)}
                  className={`w-full py-3 rounded-lg font-semibold transition-all ${
                    role?.toLowerCase() === "jobseeker" && isApplied
                      ? "bg-green-300 text-gray-600 cursor-not-allowed"
                      : "bg-green-100 text-green-700 hover:bg-green-300"
                  }`}
                  disabled={role?.toLowerCase() === "jobseeker" && isApplied}
                >
                  {role?.toLowerCase() === "jobseeker" && isApplied ? "Applied" : "Apply Now"}
                </button>
                <button
                  onClick={handleSaveJob}
                  className={`w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-all ${
                    role?.toLowerCase() === "jobseeker" && isSaved  ? "bg-yellow-100" : ""
                  }`}
                >
                  {role?.toLowerCase() === "jobseeker" && isSaved ? "Saved" : "Save Job"}
                </button>
              </div>
            </div>
            <InfoCard
              icon={Mail}
              label="Contact Email"
              value={jobDetail.contactEmail}
              color="blue"
            />
            <InfoCard
              icon={Calendar}
              label="Application Deadline"
              value={new Date(
                jobDetail.applicationDeadline
              ).toLocaleDateString()}
              color="green"
            />
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Key Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {Array.isArray(jobDetail.skills)
                  ? jobDetail.skills
                      .flatMap((skill) =>
                        typeof skill === "string" && skill.includes(",")
                          ? skill.split(",").map((s) => s.trim())
                          : [skill]
                      )
                      .map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium border border-blue-200"
                        >
                          {skill}
                        </span>
                      ))
                  : null}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoCard = ({ icon: Icon, label, value, color }) => (
  <div className={`bg-white rounded-xl p-6 shadow-sm border border-gray-100`}>
    <div className="flex items-center gap-3">
      <Icon className={`w-5 h-5 ${textColorMap[color]}`} />
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className={`text-base font-medium ${textColorMap[color]}`}>
          {value}
        </p>
      </div>
    </div>
  </div>
);

export default JobDetails;
