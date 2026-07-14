import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene2() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center px-[10vw]"
      initial={{ opacity: 0, scale: 1.1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, y: -50 }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <video
        src={`${import.meta.env.BASE_URL}videos/tech-bg.mp4`}
        className="absolute inset-0 w-full h-full object-cover opacity-30"
        autoPlay
        muted
        playsInline
      />
      
      <div className="relative z-10 text-center flex flex-col gap-[4vh]">
        <motion.h2 
          className="text-[4vw] font-bold text-[#F5B942]"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 1 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        >
          Hours of research.
        </motion.h2>
        <motion.h2 
          className="text-[4vw] font-bold text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 2 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        >
          Endless tabs.
        </motion.h2>
        <motion.h2 
          className="text-[4vw] font-bold text-[#0FA4AF]"
          initial={{ opacity: 0, y: 20 }}
          animate={phase >= 3 ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        >
          Still not sure where to start.
        </motion.h2>
      </div>
    </motion.div>
  );
}
