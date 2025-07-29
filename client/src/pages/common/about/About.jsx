import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaArrowRight } from "react-icons/fa";
import { useAuth } from "../../../context/useAuth";


const companies = [
  { name: "Mitsubishi", jobs: 64, logo: "/logos/mitsubishi.svg" },
  { name: "Vodafone", jobs: 50, logo: "/logos/vodafone.svg" },
  { name: "Pepsi", jobs: 50, logo: "/logos/pepsi.svg" },
  { name: "Apple", jobs: 30, logo: "/logos/apple1.svg" },
  { name: "Microsoft", jobs: 56, logo: "/logos/microsoft-5.svg" },
  { name: "Shell", jobs: 53, logo: "/logos/shell-4.svg" },
  { name: "LG", jobs: 42, logo: "/logos/lg-electronics.svg" },
  { name: "Meta", jobs: 102, logo: "/logos/meta-3.svg" },
];

export default function About() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleApplyClick = () => {
    if (!isAuthenticated) {
      toast.warn("Please log in to apply for jobs.");
      setTimeout(()=>{
        navigate("/auth/login");
      },2000)
    } else {
      // You can route to a filtered job list or job page for the company
      navigate(`/jobs?company=${encodeURIComponent()}`);
    }
  };

  return (
    <section className="py-16 bg-[conic-gradient(at_top_left,_#DBEAFE,_#FCE7F3,_#FEF9C3,_#DCFCE7,_#EDE9FE,_#FECACA)]   ">
      <div className="text-center">
        <h2 className="text-4xl font-bold text-gray-900">
          Choose Your Dream{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-300">
            Companies
          </span>
        </h2>
        <p className="text-gray-700 mt-4 max-w-xl mx-auto">
          Start your journey towards a fulfilling career by exploring the top companies that are actively seeking talented individuals like you
        </p>
        <button className="mt-6 bg-gradient-to-r from-pink-400 to-orange-300 text-gray-700 px-6 py-2 rounded-md font-medium">
          View All Companies
        </button>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {companies.map((company) => (
            <div
              key={company.name}
              className="bg-white p-6 rounded-xl shadow-lg hover:scale-105 transition-transform duration-300 relative group"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-orange-400 to-pink-500 rounded-t-xl" />
              <img
                src={company.logo}
                alt={company.name}
                className="w-12 h-12 object-contain mb-4 mx-auto"
              />
              <h3 className="text-lg font-bold text-center text-gray-800">
                {company.name}
              </h3>
              <p className="text-xs text-center text-gray-500 mb-3">
                {company.jobs} Jobs Available
              </p>
              <p className="text-sm text-gray-600 text-center mb-4">
                Search and find your dream job is now easier than ever. Just browse a job and apply if you need to.
              </p>
              <div className="flex justify-center gap-2 mb-4">
                <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded-full font-medium">
                  Full Time
                </span>
                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full font-medium">
                  Remote
                </span>
              </div>
              <div className="text-center">
                <button
                  onClick={() => handleApplyClick()}
                  className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-orange-500 transition"
                >
                  Apply <FaArrowRight className="mt-[2px]" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
