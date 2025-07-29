import React from "react";

const Advice = () => {
  return (
    <section className="py-10 px-6 text-white">
      <div className=" text-center">
        <h2 className="text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-300 mb-2">
          Advice From <span className="text-black">Our Expertise</span>
        </h2>
        <p className="text-black max-w-2xl mx-auto mb-16">
          Advice from Experts on JobLink can provide valuable insights and tips
          for your journey from experienced professionals
        </p>

        {/* Main Flex Layout */}
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          {/* Left Side (1 & 2) */}
          <div className="flex flex-col gap-10 w-60">
            {/* Block 1 */}
            <div className="text-left space-y-2">
              <div className="text-black text-xl font-semibold flex items-center gap-2">
                <span className="text-2xl">1</span> Explore Companies
              </div>
              <p className="text-sm text-gray-600">
                Browse through our featured companies or use the search function
                to find companies based on industry or location
              </p>
            </div>

            {/* Block 2 */}
            <div className="text-left space-y-2">
              <div className="text-black text-xl font-semibold flex items-center gap-2">
                <span className="text-2xl">2</span> Learn About Cultures
              </div>
              <p className="text-sm text-gray-600">
                Dive into each company's profile to understand their mission,
                values, and workplace culture
              </p>
            </div>
          </div>

    <div className="w-64 h-64 relative rounded-full bg-gradient-to-r from-pink-400 to-orange-300 overflow-hidden">
  <img
    src="/female-removebg-preview.png"
    alt="Human"
    className="w-full h-full object-cover"
  />
</div>






          {/* Right Side (3 & 4) */}
          <div className="flex flex-col gap-10 w-60">
            {/* Block 3 */}
            <div className="text-left space-y-2">
              <div className="text-black text-xl font-semibold flex items-center gap-2">
                Find Openings <span className="text-2xl">3</span>
              </div>
              <p className="text-sm text-gray-600">
                Check out the current job openings at each company and apply for
                positions that align with your skills and career goals
              </p>
            </div>

            {/* Block 4 */}
            <div className="text-left space-y-2">
              <div className="text-black text-xl font-semibold flex items-center gap-1">
                Connect with Employers <span className="text-2xl">4</span>
              </div>
              <p className="text-sm text-gray-600">
                Use our platform to connect with recruiters. Stay informed about
                upcoming job fairs and networking events
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Advice;
