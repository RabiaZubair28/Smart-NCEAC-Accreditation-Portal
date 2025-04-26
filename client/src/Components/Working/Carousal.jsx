import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const slides = [
  {
    title: "OBJECTIVES & ATTRIBUTES",
    highlight: "MAPPING",
    subtitle: "WITH ASSESSMENTS",
    image: "https://developer.liamcrest.com/image1.png",
  },
  {
    title: "ACCESSIBILITY & INVOLVEMENT OF",
    highlight: "MULTIPLE",
    subtitle: "ENTITIES",
    image: "https://developer.liamcrest.com/image2.png",
  },
  {
    title: "TRANSPARENCY & ",
    highlight: "REPORTING",
    subtitle: "ASSESSMENTS",
    image: "https://developer.liamcrest.com/image3.png",
  },
  {
    title: "BRINGING TRANSITIONS FROM",
    highlight: "GRADES",
    subtitle: "TO OUTCOMES",
    image: "https://developer.liamcrest.com/image4.png",
  },
];

const variants = {
  enter: (direction) => ({
    x: direction > 0 ? 1000 : -1000,
    opacity: 0,
  }),
  center: {
    zIndex: 1,
    x: 0,
    opacity: 1,
  },
  exit: (direction) => ({
    zIndex: 0,
    x: direction < 0 ? 1000 : -1000,
    opacity: 0,
  }),
};

const swipeConfidenceThreshold = 10000;
const swipePower = (offset, velocity) => {
  return Math.abs(offset) * velocity;
};

function Carousal() {
  const [[page, direction], setPage] = useState([0, 0]);
  const [autoPlay, setAutoPlay] = useState(true);

  const slideIndex = ((page % slides.length) + slides.length) % slides.length;

  const paginate = (newDirection) => {
    setPage([page + newDirection, newDirection]);
  };

  useEffect(() => {
    if (autoPlay) {
      const timer = setTimeout(() => {
        paginate(1);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [page, autoPlay]);

  return (
    <div className="relative min-h-[500px] md:min-h-screen bg-[#f7f9fa] overflow-hidden">
      <div className="relative h-[500px] md:h-screen flex items-center justify-center px-4">
        <AnimatePresence initial={false} custom={direction}>
          <motion.div
            key={page}
            custom={direction}
            variants={variants}
            initial="enter"
            animate="center"
            exit="exit"
            transition={{
              x: { type: "spring", stiffness: 300, damping: 30 },
              opacity: { duration: 0.2 },
            }}
            drag="x"
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={1}
            onDragEnd={(e, { offset, velocity }) => {
              const swipe = swipePower(offset.x, velocity.x);
              if (swipe < -swipeConfidenceThreshold) {
                paginate(1);
              } else if (swipe > swipeConfidenceThreshold) {
                paginate(-1);
              }
            }}
            className="absolute w-full max-w-4xl"
            onHoverStart={() => setAutoPlay(false)}
            onHoverEnd={() => setAutoPlay(true)}
          >
            <div className="flex flex-col items-center text-center">
              <motion.img
                src={slides[slideIndex].image}
                alt="Slide"
                className="w-full max-w-2xl mb-12"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              />
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                <h2 className="mt-[-100px] text-lg pt-5 md:pt-0 md:text-2xl md:text-3xl text-[#16205D] font-light">
                  {slides[slideIndex].title}{" "}
                  <span className="font-bold">
                    {slides[slideIndex].highlight}
                  </span>{" "}
                  {slides[slideIndex].subtitle}
                </h2>
              </motion.div>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Navigation Dots */}
        <div className="absolute bottom-12 left-1/2 transform -translate-x-1/2 flex space-x-3">
          {slides.map((_, index) => (
            <motion.button
              key={index}
              onClick={() => {
                const direction = index - slideIndex;
                setPage([page + direction, direction]);
              }}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                slideIndex === index
                  ? "bg-[#16205D] scale-125"
                  : "bg-[#16205D] opacity-30 hover:opacity-50"
              }`}
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
            />
          ))}
        </div>

        {/* Navigation Arrows */}
        <motion.button
          className="absolute left-4 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-[#16205D] hover:bg-white"
          onClick={() => paginate(-1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          ←
        </motion.button>
        <motion.button
          className="absolute right-4 top-1/2 transform -translate-y-1/2 w-12 h-12 flex items-center justify-center rounded-full bg-white/80 backdrop-blur-sm text-[#16205D] hover:bg-white"
          onClick={() => paginate(1)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          →
        </motion.button>
      </div>
    </div>
  );
}

export default Carousal;
