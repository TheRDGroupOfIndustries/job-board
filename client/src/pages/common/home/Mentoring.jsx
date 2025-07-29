import React from "react";
import { FaBriefcase, FaBuilding } from "react-icons/fa";
import { FiSearch, FiFilter } from "react-icons/fi";

const mentors = [
  {
    name: "Cellyn Dion",
    role: "UI/UX Designer",
    company: "Tokopedia",
    skills: ["Figma", "Product Design", "+6"],
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
  },
  {
    name: "Sophie Aria",
    role: "Data Engineer",
    company: "Meta",
    skills: ["SQL", "Phyton", "+6"],
    image: "https://images.pexels.com/photos/3760859/pexels-photo-3760859.jpeg",
  },
  {
    name: "Roy William",
    role: "Product Owner",
    company: "Netflix",
    skills: ["Figjam", "Jira", "+6"],
    image: "https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg",
  },
  {
    name: "Vivienne",
    role: "Business Development",
    company: "Airbnb",
    skills: ["Miro", "Whimsical", "+6"],
    image: "https://images.pexels.com/photos/1036623/pexels-photo-1036623.jpeg",
  },
];

const MentorGrid = () => {
  return (
    <div className=" py-10 bg-white ">
   
      {/* Heading */}
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold">
          Connect 1On1 Life And Career <br /> Mentoring With{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-300">1820 Experts</span>
        </h1>
        <p className="text-gray-500 text-sm mt-2">
          Join and be a part of particular number jobs and mentoring community to achieve the goals
        </p>
      </div>

      {/* Search + Filters */}
      <div className="max-w-4xl mx-auto flex flex-wrap gap-3 items-center mb-8">
        <div className="flex-1 flex items-center border rounded-md px-3 py-2 shadow-sm bg-white">
          <FiSearch className="text-gray-400 mr-2" />
          <input
            type="text"
            placeholder="Search by Name, Company, Role, Industry, University, Major..."
            className="w-full outline-none text-sm"
          />
        </div>
        <select className="border text-sm px-3 py-2 rounded-md shadow-sm">
          <option>Levels</option>
        </select>
        <button className="border px-3 py-2 rounded-md shadow-sm">
          <FiFilter />
        </button>
      </div>

      {/* Mentor Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-6 justify-center">
        {mentors.concat(mentors).map((mentor, index) => (
          <div
            key={index}
            className="relative rounded-xl overflow-hidden shadow-lg bg-orange-500 w-full h-[360px]"
          >
            <img
              src={mentor.image}
              alt={mentor.name}
              className="w-full h-full object-cover"
            />

            {/* Bottom Overlay */}
            <div className="absolute bottom-0 left-0 w-full bg-black/60 backdrop-blur-md text-white px-4 py-3">
              <div className="flex justify-between items-center mb-1">
                <h3 className="text-base font-semibold">{mentor.name}</h3>
                <span className="text-xs bg-white text-black px-2 py-0.5 rounded">
                  Available
                </span>
              </div>
              <p className="text-sm flex items-center gap-1 text-gray-200">
                <FaBriefcase className="text-gray-300" /> {mentor.role}
              </p>
              <p className="text-sm flex items-center gap-1 text-gray-200 mb-2">
                <FaBuilding className="text-gray-300" /> {mentor.company}
              </p>
              <div className="flex flex-wrap gap-2">
                {mentor.skills.map((skill, i) => (
                  <span
                    key={i}
                    className="text-xs bg-white text-black px-2 py-0.5 rounded"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>

  );
};

export default MentorGrid;
