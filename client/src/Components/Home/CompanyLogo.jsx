import React, { useState } from "react";
import nceac from "../../assets/nceac.jpeg";
import aacsb from "../../assets/aascb.png";
import hec from "../../assets/hec.jpeg";
import lini from "../../assets/linnie.png";
import norpart from "../../assets/norpart.png";
import ogdcl from "../../assets/ogdcl.png";
import pec from "../../assets/pec.jpeg";
import pitb from "../../assets/pitb.jpeg";
import plf from "../../assets/plf.png";
import tapmad from "../../assets/tapmad.png";
import nbeac from "../../assets/nbeac.jpeg";
import saqs from "../../assets/saqs.png";

// Define logos as an array of objects
const logos = [
  { src: nceac, alt: "Company 1" },
  { src: aacsb, alt: "VFC" },
  { src: hec, alt: "Company 2" },
  { src: lini, alt: "Company 3" },
  { src: norpart, alt: "Intuit" },
  { src: ogdcl, alt: "Company 5" },
  { src: pec, alt: "Company 6" },
  { src: pitb, alt: "Company 7" },
  { src: plf, alt: "Company 8" },
  { src: tapmad, alt: "Company 9" },
  { src: nbeac, alt: "Company 10" },
  { src: saqs, alt: "Company 11" },
];

function CompanyLogos() {
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <div className=" bg-[#f7f9fa] max-w-8xl mx-auto px-4 sm:px-6 lg:px-16 py-8">
      <h2 className="text-3xl lg:text-4xl font-bold text-[#16215c] text-center mb-8 lg:mb-16">
        These organizations already trust us
      </h2>
      <div className="grid grid-cols-4 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-8 items-center justify-items-center ">
        {logos.map((logo, index) => (
          <div
            key={index}
            className="relative w-[80px] h-[80px] lg:w-40 lg:h-40 flex items-center justify-center"
            onMouseEnter={() => setHoveredIndex(index)}
            onMouseLeave={() => setHoveredIndex(null)}
          >
            <div
              className={`absolute inset-0 rounded-full bg-white shadow-lg transition-opacity duration-300 ${
                hoveredIndex === null || hoveredIndex === index
                  ? "opacity-100"
                  : "opacity-40"
              }`}
            >
              <img
                src={logo.src}
                alt={logo.alt}
                className="w-full h-full object-contain p-3 lg:p-6"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CompanyLogos;
