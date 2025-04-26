import React from 'react';
import { motion } from 'framer-motion';

const ProjectCounter = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1, delay: 0.3 }}
      className="relative w-full max-w-4xl mx-auto"
    >
      <div className="relative">
        <img 
          src="https://liamcrest.com/assets/static/ourWork/counter.png"
          alt="200+ Projects"
          className="w-full h-auto"
        />
      </div>
    </motion.div>
  );
};

export default ProjectCounter;
