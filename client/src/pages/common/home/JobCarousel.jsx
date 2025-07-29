import React from "react";
import { FaArrowRight } from "react-icons/fa";

const jobs = [
  {
    id: 1,
    company: "Amazon",
    title: "Senior UI/UX Designer",
    rate: "$250/hr",
    location: "San Francisco, CA",
    tags: ["Full Time", "Remote"],
    logo: "/logos/amazon.svg",
  },
  {
    id: 2,
    company: "Google",
    title: "Frontend Developer",
    rate: "$180/hr",
    location: "Mountain View, CA",
    tags: ["Full Time", "Onsite"],
    logo: "/logos/google.svg",
  },
  {
    id: 3,
    company: "Apple",
    title: "Graphic Designer",
    rate: "$150/hr",
    location: "Cupertino, CA",
    tags: ["Part Time", "Remote"],
    logo: "/logos/apple1.svg",
  },
  {
    id: 4,
    company: "Meta",
    title: "Product Designer",
    rate: "$220/hr",
    location: "New York, NY",
    tags: ["Freelance", "Remote"],
    logo: "/logos/meta-3.svg",
  },
  {
    id: 5,
    company: "Dribbble",
    title: "Motion Designer",
    rate: "$200/hr",
    location: "Remote",
    tags: ["Contract", "Remote"],
    logo: "/logos/dribbble.svg",
  },
  {
    id: 6,
    company: "Twitter",
    title: "UX Researcher",
    rate: "$170/hr",
    location: "California, CA",
    tags: ["Full Time", "Hybrid"],
    logo: "/logos/twitter.svg",
  },
  
];

export default function About() {
  return (
    <section className="py-20 bg-[conic-gradient(at_top_left,_#DBEAFE,_#FCE7F3,_#FEF9C3,_#DCFCE7,_#EDE9FE,_#FECACA)] px-6">
      <div className=" ">
        {/* Heading */}
        <div className="text-center mb-10">
          <h2 className="text-4xl font-bold text-gray-900">
            Discover Latest{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-300">
              Job Roles
            </span>
          </h2>
          <p className="text-gray-600 mt-4 max-w-xl mx-auto">
            Explore top opportunities from leading companies hiring for
            designers, developers, and engineers.
          </p>
          <button className="mt-6 bg-gradient-to-r from-pink-400 to-orange-300 text-gray-700 px-6 py-2 rounded-md font-semibold hover:opacity-90">
            View All Jobs
          </button>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {jobs.slice(0, 6).map((job) => (
            <div
              key={job.id}
              className="bg-white p-6 rounded-2xl shadow-md hover:shadow-xl border border-gray-100 transition-all duration-300 flex flex-col justify-between"
            >
              {/* Logo + Company */}
              <div className="flex items-center gap-4 mb-4">
                <div className="w-12 h-12 bg-gray-100 p-2 rounded-lg flex items-center justify-center">
                  <img src={job.logo} alt={job.company} className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700">{job.company}</h4>
                  <p className="text-xs text-gray-400">{job.location}</p>
                </div>
              </div>

              {/* Job Title */}
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                {job.title}
              </h3>

              {/* Tags */}
              <div className="flex flex-wrap gap-2 mb-3">
                {job.tags.map((tag, idx) => (
                  <span
                    key={idx}
                    className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium"
                  >
                    {tag}
                  </span>
                ))}
              </div>

              {/* Rate */}
              <p className="text-sm font-semibold text-gray-600 mb-4">{job.rate}</p>

              {/* Apply Button */}
              <button className="mt-auto  flex items-center gap-2 text-sm text-gray-700 bg-gradient-to-r from-orange-400 to-pink-500 px-4 py-2 rounded-lg hover:shadow-md transition">
                Apply Now <FaArrowRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
