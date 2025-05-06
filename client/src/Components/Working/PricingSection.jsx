import React, { useState } from "react";
import { motion } from "framer-motion";
import { Check } from "lucide-react";
import { useNavigate } from "react-router-dom";

// Pricing data
const plans = [
  {
    name: "Instructor",
    description:
      "A simple and functional multi-page website for small businesses.",
    features: [
      "Add batches to courses & View/Edit Courses",
      "Add Assessments & assign CLO/PLO weights",
      "Upload marks of activities",
    ],
  },
  {
    name: "Head Of Department",
    description:
      "A more comprehensive multi-page website for growing businesses.",
    features: [
      "Edit/Delete own details",
      "Monitor all enrolled courses and batches",
      "Manage Users (Add/Edit/Remove Users)",
    ],
  },
  {
    name: "Student",
    description: "A fully customized and professionally optimized website.",
    features: [
      "View transcript",
      "View Enrolled Courses",
      "Generate PLO, CLO based transcript",
    ],
  },
];

function PricingSection() {
  const [hoveredCard, setHoveredCard] = useState(null);

  const navigate = useNavigate();
  return (
    <div className=" bg-[#16215c] pb-9 lg:pb-24  px-4 ">
      <div className="max-w-7xl mx-auto">
        {/* Title */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="-mt-1 text-3xl md:text-4xl font-semibold text-center text-blue-50 pt-8 lg:pt-12  mb-8 lg:mb-12"
        >
          Our End Users
        </motion.h1>

        {/* Plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:gap-8 gap-4">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.3 }}
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              className={`relative rounded-3xl p-8 cursor-pointer transition-transform duration-200 ease-out transform
                ${
                  hoveredCard === index
                    ? "bg-white text-black shadow-2xl scale-105"
                    : "bg-blue-50 border border-gray-200 hover:shadow-lg"
                }`}
            >
              <div className="text-2xl font-bold mb-2">{plan.name}</div>
              <p className="text-sm mb-8">{plan.description}</p>
              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-center gap-3">
                    <Check
                      className={`w-5 h-5 ${
                        hoveredCard === index
                          ? "text-[#A5E1E9]"
                          : "text-[#F4A340]"
                      }`}
                    />
                    <span className="text-sm">{feature}</span>
                  </li>
                ))}
              </ul>
              <button
                className={`w-full py-3 rounded-xl font-medium transition-all duration-200 ease-out cursor-pointer
                  ${
                    hoveredCard === index
                      ? "bg-[#F4A340] text-white hover:bg-[#f4a340ee] shadow-md"
                      : "bg-[#A5E1E9] text-[#16205D] hover:bg-[#95d1d9]"
                  }`}
                onClick={() => {
                  navigate("/login");
                }}
              >
                Go to {plan.name}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PricingSection;
