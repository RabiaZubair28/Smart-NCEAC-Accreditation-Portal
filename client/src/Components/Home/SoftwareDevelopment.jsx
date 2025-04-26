import React from "react";

function SoftwareDevelopment() {
  return (
    <div className="relative flex justify-center items-center py-4 sm:py-4 lg:pt-2 lg:pb-8 px-4 sm:px-6 lg:px-8 bg-[#16215c] overflow-hidden">
      {/* Main Card */}
      <div className="flex flex-col lg:flex-row items-center bg-[#1b2871] min-h-[400px] lg:h-[550px] w-full max-w-7xl mx-auto shadow-lg relative p-4 sm:p-8 lg:p-12 rounded-2xl">
        {/* Number Label - Top Right */}
        <div className="absolute top-4 sm:top-6 lg:top-8 right-4 sm:right-6 lg:right-8 text-white text-xl sm:text-2xl font-light">
          02
        </div>

        {/* Image Section */}
        <div className="w-full lg:w-1/2 lg:pr-8 mb-8 lg:mb-0">
          <div className="relative w-full h-[200px] sm:h-[300px] lg:h-[400px] overflow-hidden">
            <img
              src="https://liamcrest.com/assets/static/divisions/WEB%20DEVELOPMENT.png"
              alt="Software Development illustration showing laptop with code and connected services"
              className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Text Section */}
        <div className="w-full lg:w-1/2 text-center lg:text-left px-4 sm:px-8 lg:px-12 space-y-6 lg:space-y-8">
          <div className="flex justify-center md:justify-start items-center mb-4">
            <div className="w-10 h-10 bg-[#faac3e] rounded-full flex justify-center items-center">
              <img
                src="https://liamcrest.com/assets/static/divisions/icons/Asset%204.png"
                alt="Software Development Logo"
                className="w-6 h-6"
              />
            </div>
          </div>
          <h2 className="text-[#faac3e] text-xl sm:text-2xl font-bold">
            Transparency & Reporting
          </h2>
          <p className="text-white text-sm sm:text-base lg:text-lg leading-relaxed">
            Provide detailed and transparent reporting features that allow
            accreditation bodies to monitor progress and outcomes efficiently.
          </p>
          <button className="inline-flex items-center bg-[#faac3e] text-white py-2 sm:py-3 px-6 sm:px-8 rounded-full hover:bg-[#faac3e] transition-all duration-300 hover:scale-105 text-sm sm:text-base font-medium">
            View Site
          </button>
        </div>
      </div>
    </div>
  );
}

export default SoftwareDevelopment;
