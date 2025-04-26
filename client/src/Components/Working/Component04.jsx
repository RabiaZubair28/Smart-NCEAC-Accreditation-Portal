import { motion } from "framer-motion";

import FloatingCircle from "./FloatingCircle.jsx";

const Component04 = () => {
  const circles = [
    {
      size: 1,
      color: "bg-blue-400/50",
      position: { top: "20%", left: "10%" },
      animation: { y: [0, -20, 0], x: [0, 10, 0], duration: 4 },
    },
    {
      size: 1.5,
      color: "bg-green-400/50",
      position: { top: "30%", right: "20%" },
      animation: { y: [0, 20, 0], x: [0, -10, 0], duration: 5 },
    },
    {
      size: 1.25,
      color: "bg-blue-500/50",
      position: { bottom: "40%", right: "10%" },
      animation: { y: [0, -15, 0], x: [0, 15, 0], duration: 6 },
    },
  ];

  return (
    <div className="relative min-h-screen w-full overflow-hidden bg-[#f7f9fa]">
      {/* Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center z-0 opacity-50"
        style={{
          backgroundImage:
            "url(https://liamcrest.com/assets/static/header/Asset%2072.png)",
        }}
      />

      {/* Floating Circles */}
      {circles.map((circle, index) => (
        <FloatingCircle key={index} {...circle} />
      ))}

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 ">
        <motion.div
          className="max-w-4xl mx-auto"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <img
            src="https://liamcrest.com/assets/static/ourWork/counter.png"
            alt="200+"
            className="w-full "
          />
        </motion.div>

        <motion.h2
          className="text-6xl font-bold text-center text-navy-900 mt-8"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Projects
        </motion.h2>

        <motion.p
          className="text-2xl text-center text-navy-700 mt-4 mb-32 max-w-2xl mx-auto"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          Delivered successfully world wide
        </motion.p>
      </div>
    </div>
  );
};

export default Component04;
