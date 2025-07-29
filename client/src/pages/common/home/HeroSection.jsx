// src/components/HeroSection.jsx
import React from "react";
import CountUp from "react-countup";
import { Typewriter } from "react-simple-typewriter";
import { FiGlobe, FiMapPin,  FiSearch, FiBriefcase } from "react-icons/fi";
import { Link } from "react-router-dom";

const HeroSection = () => {
  return (
    <section className="bg-[conic-gradient(at_top_left,_#DBEAFE,_#FCE7F3,_#FEF9C3,_#DCFCE7,_#EDE9FE,_#FECACA)] w-full  overflow-x-hidden px-6 py-12 flex flex-col justify-center items-center text-center font-sans">
      {/* Hero Title */}
      
      <h1 className="text-4xl sm:text-5xl font-extrabold max-w-3xl leading-tight mb-4">
  Find Your{" "}
  <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-600 to-orange-400">
    <Typewriter
      words={["Dream Job", "Perfect Role", "Ideal Career"]}
      loop={true}
      cursor
      cursorStyle="|"
      typeSpeed={70}
      deleteSpeed={50}
      delaySpeed={1500}
    />
  </span>{" "}
  That
  <br />
   Suit  With Exciting Opportunities
</h1>
      <p className="text-gray-800 max-w-xl text-sm mb-6">
        Embark on a journey towards your dream career, your ultimate job-finding companion! We’ve curated a platform that connects talented individuals with exciting opportunities.
      </p>

      {/* Search Bar */}
     <div className="bg-white rounded-xl shadow-lg px-3 py-2 w-full max-w-2xl mx-auto mt-6">
      <form className="flex flex-col md:flex-row items-stretch gap-4">
        {/* Job Title */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md flex-grow">
          <FiBriefcase className="text-gray-500 text-lg" />
          <input
            type="text"
            placeholder="Job title or keyword"
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-md flex-grow">
          <FiMapPin className="text-gray-500 text-lg" />
          <input
            type="text"
            placeholder="Location"
            className="bg-transparent outline-none text-sm w-full"
          />
        </div>

        {/* Submit Button */}
     <Link to="/jobCardGrid">
       <button className="bg-gradient-to-r from-pink-400 to-orange-300 text-gray-700 px-6 py-2 rounded-md">
            Explore Now
          </button>
     </Link>
      </form>
    </div>

      {/* Categories */}
     
        <div className="mt-3 text-sm text-black-700">
          Popular Categories:
          <span className="text-gray-600 ml-2 cursor-pointer">Product Manager</span>,
          <span className="text-gray-600 ml-2 cursor-pointer">Frontend Dev</span>,
          <span className="text-gray-600 ml-2 cursor-pointer">Data Analyst</span>
        </div>

    

      {/* Stats */}
     <div className="grid grid-cols-2 sm:grid-cols-4 gap-10 mt-10 text-left">
  <div>
    <p className="text-2xl font-bold">
      <CountUp end={30000} duration={2} separator="," />+
    </p>
    <p className="text-sm text-gray-700">Live Jobs</p>
  </div>
  <div>
    <p className="text-2xl font-bold">
      <CountUp end={5000} duration={2} separator="," />+
    </p>
    <p className="text-sm text-gray-700">Daily Job Post</p>
  </div>
  <div>
    <p className="text-2xl font-bold">
      <CountUp end={25000} duration={2} separator="," />+
    </p>
    <p className="text-sm text-gray-700">People Get Hired</p>
  </div>
  <div>
    <p className="text-2xl font-bold">
      <CountUp end={1000} duration={2} separator="," />+
    </p>
    <p className="text-sm text-gray-700">Companies</p>
  </div>
</div>

    </section>
   

  );
};

export default HeroSection;
