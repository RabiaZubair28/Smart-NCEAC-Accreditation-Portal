import React from "react";
import { motion } from "framer-motion";
import FloatingDots from "./FloatingDots";
import ProjectCounter from "./ProjectCounter";
import WaveBackground from "./WaveBackground";
import Navbar from "../Home/Navbar";
function App() {
  return (
    <div className="bg-[#16215c] relative min-h-screen overflow-hidden pt-24">
      <Navbar /> {/* Backgrounds */}
      <WaveBackground />
      {/* Animated Dots */}
      <FloatingDots />
      {/* Content */}
      <div className=" relative z-20 flex flex-col items-center justify-center min-h-screen px-4 pb-32">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-4xl md:text-3xl font-bold text-navy-900 mb-8 text-center"
        >
          Our Project Has
        </motion.h1>

        <ProjectCounter />

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="text-4xl md:text-5xl font-bold text-navy-900 mt-4 text-center"
        >
          Students
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9 }}
          className="text-xl md:text-2xl text-navy-700 mt-4 text-center"
        >
          Enrolled successfully with Assessments
        </motion.p>
      </div>
    </div>
  );
}

export default App;
