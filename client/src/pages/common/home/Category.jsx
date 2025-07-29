import React, { useEffect, useState } from "react";
import {
  FaCode,
  FaServer,
  FaPalette,
  FaBullhorn,
  FaCogs,
  FaDatabase,
} from "react-icons/fa";
import { getAllJobs } from "../../../API";
import { useNavigate } from "react-router-dom";

const categoryKeywords = {
  Frontend: ["frontend", "react", "angular", "vue"],
  Backend: ["backend", "node", "django", "express", "spring"],
  "UI/UX": ["ui", "ux", "designer", "figma"],
  Marketing: ["marketing", "seo", "content", "copywriter"],
  DevOps: ["devops", "docker", "kubernetes", "ci", "cd"],
  Data: ["data", "ml", "ai", "analytics", "python"],
};

const iconMap = {
  Frontend: <FaCode />,
  Backend: <FaServer />,
  "UI/UX": <FaPalette />,
  Marketing: <FaBullhorn />,
  DevOps: <FaCogs />,
  Data: <FaDatabase />,
};

const bgColors = {
  Frontend: "bg-blue-100",
  Backend: "bg-green-100",
  "UI/UX": "bg-pink-100",
  Marketing: "bg-yellow-100",
  DevOps: "bg-purple-100",
  Data: "bg-orange-100",
};

const iconBgColors = {
  Frontend: "bg-blue-500",
  Backend: "bg-green-500",
  "UI/UX": "bg-pink-500",
  Marketing: "bg-yellow-500",
  DevOps: "bg-purple-500",
  Data: "bg-orange-500",
};

const Category = () => {
  const [categorizedJobs, setCategorizedJobs] = useState({});
  const navigate = useNavigate();

  const groupJobsByTitleKeyword = (jobs) => {
    const grouped = {};

    // Initialize categories
    Object.keys(categoryKeywords).forEach((cat) => {
      grouped[cat] = [];
    });

    jobs.forEach((job) => {
      const title = job.jobTitle?.toLowerCase() || "";

      for (const [category, keywords] of Object.entries(categoryKeywords)) {
        if (keywords.some((kw) => title.includes(kw))) {
          grouped[category].push(job);
          break;
        }
      }
    });

    return grouped;
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getAllJobs();
        const jobs = res?.data?.data || [];
        const categorized = groupJobsByTitleKeyword(jobs);
        setCategorizedJobs(categorized);
      } catch (error) {
        console.error("Error fetching jobs:", error);
      }
    };

    fetchJobs();
  }, []);

  const handleCategoryClick = (category) => {
    navigate(`/jobs?category=${encodeURIComponent(category)}`);
  };

  return (
    <section className="py-10 px-6">
      <h2 className="text-3xl font-bold text-center mb-2">Browse by Category</h2>
      <p className="text-gray-500 text-center mb-10">
        Explore opportunities by job title category
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {Object.entries(categorizedJobs).map(([category, jobs]) => (
          <div
            key={category}
            onClick={() => handleCategoryClick(category)}
            className={`cursor-pointer rounded-xl border shadow-sm p-6 text-center hover:shadow-md transition ${bgColors[category]}`}
          >
            <div
              className={`w-14 h-14 mx-auto flex items-center justify-center text-white rounded-full text-xl mb-4 ${iconBgColors[category]}`}
            >
              {iconMap[category]}
            </div>
            <h3 className="font-semibold text-lg mb-1">{category}</h3>
            <p className="text-sm text-gray-600">{jobs.length} jobs available</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Category;
