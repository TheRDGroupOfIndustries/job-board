import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  BookmarkPlus,
  MapPin,
  Clock,
  Users,
  TrendingUp,
  Eye,
  Briefcase,
  Building2,
} from "lucide-react";
import { getAllJobs } from "../../API";
import { toast } from "react-toastify";

const JobRecommendations = () => {
  const [jobData, setJobData] = useState([]);
  const [appData, setAppData] = useState([]);
  const [userSkills, setUserSkills] = useState([]);
  const [profileCompletion, setProfileCompletion] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [savedCount, setSavedCount] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("savedJobs")) || [];
    return saved.length;
  });

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await getAllJobs();
        setJobData(response.data.data || []);
        localStorage.setItem("allJobs", JSON.stringify(response.data.data));
      } catch (err) {
        console.error("Failed to fetch jobs:", err);
        setError("Failed to load job recommendations. Please try again later.");
        setJobData(JSON.parse(localStorage.getItem("allJobs")) || []);
      } finally {
        setLoading(false);
      }
    };

    const storedApplications =
      JSON.parse(localStorage.getItem("applications")) || [];
    setAppData(storedApplications);

    const skills = JSON.parse(localStorage.getItem("userSkills")) || [];
    setUserSkills(skills);

    const profileData = JSON.parse(localStorage.getItem("userProfile")) || {};
    const requiredFields = ["skills", "experience", "education", "resume"];
    const completedFields = requiredFields.filter(
      (field) => profileData[field] && profileData[field].length > 0
    ).length;
    const completionPercentage = Math.round(
      (completedFields / requiredFields.length) * 100
    );
    setProfileCompletion(completionPercentage);

    fetchJobs();
  }, []);

  const recommendedJobs =
    userSkills.length > 0
      ? jobData.filter((job) =>
          job.skills.some((skill) => userSkills.includes(skill.toLowerCase()))
        )
      : [];

  const quickActions = [
    {
      label: "Saved Jobs",
      icon: BookmarkPlus,
      color: "bg-blue-100 text-blue-500",
      count: (JSON.parse(localStorage.getItem("savedJobs")) || []).length,
    },
    {
      label: "Browse Jobs",
      icon: Briefcase,
      color: "bg-yellow-100 text-yellow-500",
      count: jobData.length,
    },
    {
      label: "Update Profile",
      icon: Users,
      color: "bg-green-100 text-green-500",
      count: `${profileCompletion}%`,
    },
  ];

  const handleSaveJob = (job) => {
    const existing = JSON.parse(localStorage.getItem("savedJobs")) || [];
    const isAlreadySaved = existing.find((j) => j._id === job._id);
    if (!isAlreadySaved) {
      const updated = [...existing, job];
      localStorage.setItem("savedJobs", JSON.stringify(updated));
    }
    if (!isAlreadySaved) {
      const updated = [...existing, job];
      localStorage.setItem("savedjobs", JSON.stringify(updated));
      setSavedCount(updated.length);
      toast.success("job saved")
    }
  };

  return (
    <div className="overflow-hidden bg-[conic-gradient(at_top_left,_#DBEAFE,_#FCE7F3,_#FEF9C3,_#DCFCE7,_#EDE9FE,_#FECACA)]">
      <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-6 flex flex-col">
        {/* Loading and Error States */}
        {loading && (
          <div className="text-center text-gray-600 p-6">
            Loading job recommendations...
          </div>
        )}
        {error && <div className="text-center text-red-600 p-6">{error}</div>}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-4">
          {[
            {
              label: "Total Applications",
              value: appData.length,
              icon: <Briefcase className="w-6 h-6 text-blue-600" />,
              bg: "bg-blue-100",
            },
            {
              label: "Under Review",
              value: appData.filter((app) => app.status === "Under Review")
                .length,
              icon: <Eye className="w-6 h-6 text-red-600" />,
              bg: "bg-red-100",
            },
            {
              label: "Shortlisted",
              value: appData.filter((app) => app.status === "Shortlisted")
                .length,
              icon: <TrendingUp className="w-6 h-6 text-green-600" />,
              bg: "bg-green-100",
            },
            {
              label: "Available Jobs",
              value: jobData.length,
              icon: <Building2 className="w-6 h-6 text-pink-600" />,
              bg: "bg-pink-100",
            },
          ].map((stat, idx) => (
            <div
              key={idx}
              className={`rounded-xl p-6 shadow-sm border border-gray-100 ${stat.bg}`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {stat.value}
                  </p>
                </div>
                <div className="p-3 rounded-full bg-white shadow">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-grow overflow-hidden">
          {/* Left Section */}
          <div className="lg:col-span-2 flex flex-col overflow-hidden">
            <div className="overflow-auto scrollbar-hide space-y-6 pr-2 max-h-full">
              {/* Applications */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    Recent Applications
                  </h2>
                  <Link
                    to="/app-posts"
                    className="text-gray-600 hover:text-green-700 font-medium"
                  >
                    View All
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {appData.length > 0 ? (
                    appData.slice(0, 2).map((app) => (
                      <Link
                        to={`/apps/${app.id}`}
                        key={app.id}
                        className="block p-6 hover:bg-gray-50 transition-colors"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-gray-800 mb-1">
                              {app.title}
                            </h3>
                            <p className="text-gray-600 mb-2">{app.company}</p>
                            <p className="text-sm text-gray-500 flex items-center gap-1">
                              <Clock className="w-4 h-4" /> Applied on{" "}
                              {app.date}
                            </p>
                          </div>
                          <span
                            className={`px-3 py-1 rounded-full text-sm font-medium ${app.statusColor}`}
                          >
                            {app.status}
                          </span>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-600">
                      No recent applications found.
                    </div>
                  )}
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                  <h2 className="text-xl font-bold text-gray-800">
                    Recommended Jobs
                  </h2>
                  <Link
                    to="/job-posts"
                    className="text-blue-600 hover:text-blue-700 font-medium"
                  >
                    View All
                  </Link>
                </div>
                <div className="divide-y divide-gray-100">
                  {recommendedJobs.length > 0 ? (
                    recommendedJobs.slice(0, 2).map((job) => (
                      <Link
                        to={`/jobs/${job._id}`}
                        key={job._id}
                        className="block p-6 hover:bg-blue-50 transition-all duration-200 rounded-xl"
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600">
                              {job.jobTitle}
                            </h3>
                            <p className="text-gray-600">{job.companyName}</p>
                            <p className="text-sm text-gray-500">
                              Location: {job.location || "N/A"}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                handleSaveJob(job);
                              }}
                              className="p-2 bg-gray-50 hover:bg-gray-100 rounded-full transition cursor-pointer"
                              title="Save Job"
                            >
                              <BookmarkPlus className="w-4 h-4 text-blue-500" />
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-3">
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
                            {job.saleryRange}
                          </div>
                        </div>
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap gap-2">
                            {job.skills.map((skill) => (
                              <span
                                key={skill}
                                className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
                              >
                                {skill}
                              </span>
                            ))}
                          </div>
                          <div className="flex items-center gap-3 text-sm text-gray-500">
                            <span className="flex items-center gap-1">
                              <Clock className="w-4 h-4" />
                              {new Date(job.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                      </Link>
                    ))
                  ) : (
                    <div className="p-6 text-center text-gray-600">
                      {userSkills.length > 0
                        ? "No jobs match your skills. Try updating your profile or browsing all jobs."
                        : "Please add skills to your profile to see personalized job recommendations."}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-8 overflow-y-auto scrollbar-hide">
            <div className="bg-white rounded-xl p-10 border border-gray-100 shadow-lg">
              <h3 className="text-lg font-bold text-gray-800 mb-4">
                Quick Actions
              </h3>
              <div className="space-y-3">
                {quickActions.map((action, index) => (
                  <button
                    key={index}
                    onClick={() =>
                      navigate(
                        action.label === "Saved Jobs"
                          ? "/saved-jobs"
                          : action.label === "Browse Jobs"
                          ? "/getJobs"
                          : "/update-profile"
                      )
                    }
                    className={`w-full flex items-center justify-between p-3 rounded-lg ${action.color} hover:shadow-lg transition-all`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-full bg-white/20">
                        <action.icon className="w-5 h-5" />
                      </div>
                      <span className="font-medium">{action.label}</span>
                    </div>
                    <span className="font-semibold text-sm">
                      {action.count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-blue-100 rounded-xl p-6 text-gray-700">
              <h3 className="text-lg font-bold mb-2">Complete Your Profile</h3>
              <p className="text-sm text-gray-700 mb-4">
                Complete your profile to get better job recommendations
              </p>
              <div className="w-full bg-white rounded-full h-2 mb-4">
                <div
                  className="bg-gray-500 h-2 rounded-full"
                  style={{ width: `${profileCompletion}%` }}
                ></div>
              </div>
              <p className="text-sm text-gray-700 mb-4">
                {profileCompletion}% Complete
              </p>
              <Link to="/jobseeker-setting">
                <button className="w-full bg-blue-300 text-blue-700 py-2 rounded-lg font-medium hover:bg-blue-50">
                  Complete Profile
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default JobRecommendations;
