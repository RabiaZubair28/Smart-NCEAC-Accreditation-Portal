import React from 'react';
import { motion } from 'framer-motion';

const WaveBackground = () => {
  return (
    <>
      {/* Top light background */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1 }}
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: 'url(https://liamcrest.com/assets/static/header/Asset%2072.png)',
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        }}
      />
      
      {/* Bottom dark wave */}
      <motion.div 
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, delay: 0.3 }}
        className="absolute bottom-0 left-0 right-0 z-10 w-full"
        style={{
          backgroundImage: 'url(https://liamcrest.com/assets/static/header/Asset%2073.png)',
          backgroundSize: '100% auto',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'bottom center',
          height: '40vh',
          minHeight: '300px'
        }}
      />
    </>
  );
};

export default WaveBackground;
