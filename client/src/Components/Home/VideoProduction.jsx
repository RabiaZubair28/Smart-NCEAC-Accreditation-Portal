import React from "react";

function VideoProduction() {
  return (
    <div className="bg-[#f7f9fa] py-2 sm:py-4 lg:pt-12 lg:pb-8 px-4 sm:px-8 lg:px-12">
      <div className="max-w-6xl mx-auto bg-white rounded-lg sm:rounded-xl lg:rounded-2xl overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center p-4 sm:p-8 lg:p-12">
          {/* Left Content */}
          <div className="space-y-6 sm:space-y-8 order-2 lg:order-1">
            <div className="flex flex-col space-y-4">
              <div className="bg-[#faac3e] w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                <img
                  src="https://liamcrest.com/assets/static/divisions/icons/Asset%206.png"
                  alt="Video Production Icon"
                  className="w-6 h-6 sm:w-8 sm:h-8"
                />
              </div>
              <h2 className="text-[#16215c] text-2xl sm:text-3xl lg:text-4xl font-bold">
                Data Collection & Integration
              </h2>
            </div>

            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              Implement a robust three-tier architecture for enhanced
              scalability, data management, and system security. Gather and
              integrate university infrastructure, faculty, and student data.
            </p>

            <button className="bg-[#faac3e] text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-full text-sm sm:text-base font-medium hover:bg-[#faac3e] hover:scale-105 transform transition-all duration-300 ease-in-out">
              View Site
            </button>
          </div>

          {/* Right Image */}
          <div className="relative order-1 lg:order-2">
            <div className="absolute -top-4 right-0 text-[#16215c] text-4xl sm:text-5xl lg:text-6xl font-bold opacity-20">
              04
            </div>
            <div className="relative w-full h-[200px] sm:h-[300px] lg:h-[400px] overflow-hidden">
              <img
                src="https://liamcrest.com/assets/static/divisions/VIDEO%20PRODUCTION.png"
                alt="Video Production Illustration"
                className="w-full h-full object-contain transform hover:scale-105 transition-transform duration-500"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default VideoProduction;
