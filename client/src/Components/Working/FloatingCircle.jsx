import { motion } from 'framer-motion';

const FloatingCircle = ({ size, color, position, animation }) => {
  return (
    <motion.div
      className={`absolute rounded-full ${color}`}
      style={{
        width: `${size}rem`,
        height: `${size}rem`,
        ...position,
      }}
      animate={{
        y: animation.y,
        x: animation.x,
      }}
      transition={{
        duration: animation.duration,
        repeat: Infinity,
        ease: "easeInOut",
      }}
    />
  );
};

export default FloatingCircle;
