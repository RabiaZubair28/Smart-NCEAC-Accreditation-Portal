import React from "react";

function Seemore() {
  return (
    <div
      className="relative h-[450px] lg:h-[400px] bg-cover lg:bg-contain bg-center px-4 sm:px-8 py-6 lg:py-12 flex flex-col lg:flex-row items-start justify-start lg:justify-between w-full aspect-video lg:aspect-[4/3] bg-white/90 rounded-lg shadow-xl overflow-hidden"
      style={{
        backgroundImage:
          "url('https://liamcrest.com/assets/static/footer/FOOTER-01.png')",
        fontFamily: "Chap, sans-serif",
      }}
    >
      {/* Main Content */}
      <div className="z-10 text-center lg:text-left lg:ml-12 xl:ml-32 lg:mb-0 w-full lg:w-1/2">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1F2C73] leading-tight">
          Wanna see more?
        </h1>
        <a href="/contact" className="inline-block mt-4 sm:mt-8">
          <button className="px-6 sm:px-8 py-3 bg-[#1F2C73] hover:bg-white text-white font-medium rounded-lg shadow-md transition-all duration-300 hover:shadow-lg transform hover:-translate-y-1">
            Contact Us
          </button>
        </a>
      </div>

      {/* Overlay Section */}
      {/* <div className="w-full lg:w-[45%] max-w-[600px] aspect-video lg:aspect-[4/3] bg-white/90 rounded-lg shadow-xl overflow-hidden mx-4 lg:mr-12 xl:mr-32">
        <div className="relative w-full h-full">
          <img
            src="https://via.placeholder.com/800x600"
            alt="Compliance Training"
            className="w-full h-full object-cover opacity-60 transition-transform duration-500 hover:scale-105"
          />
        </div>
      </div> */}
    </div>
  );
}

export default Seemore;
