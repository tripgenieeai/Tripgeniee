import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

const images = [
  'bali.jpg',
  'tokyo.jpg',
  'santorini.jpg',
  'paris.jpg'
];

export function Scene6() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 2000),
      setTimeout(() => setPhase(2), 4000),
      setTimeout(() => setPhase(3), 6000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 bg-black"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {images.map((img, i) => (
        <motion.img
          key={img}
          src={`${import.meta.env.BASE_URL}images/${img}`}
          className="absolute inset-0 w-full h-full object-cover"
          initial={{ opacity: 0, scale: 1.1 }}
          animate={phase === i ? { opacity: 1, scale: 1 } : { opacity: 0 }}
          transition={{ duration: 0.5 }}
        />
      ))}
    </motion.div>
  );
}
