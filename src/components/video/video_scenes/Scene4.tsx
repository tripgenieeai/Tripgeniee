import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

export function Scene4() {
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const timers = [
      setTimeout(() => setPhase(1), 500),
      setTimeout(() => setPhase(2), 2000),
      setTimeout(() => setPhase(3), 3500),
      setTimeout(() => setPhase(4), 5000),
    ];
    return () => timers.forEach(t => clearTimeout(t));
  }, []);

  return (
    <motion.div 
      className="absolute inset-0 bg-[#F0F4F8] text-[#0B1F3A] flex flex-col justify-center px-[10vw]"
      initial={{ y: '100%' }}
      animate={{ y: 0 }}
      exit={{ y: '-100%' }}
      transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
    >
      <h2 className="text-[5vw] font-bold mb-[8vh] text-center">Everything Organized.</h2>
      
      <div className="grid grid-cols-2 gap-[4vw]">
        <motion.div 
          className="bg-white p-[3vw] rounded-[2vw] shadow-xl"
          initial={{ opacity: 0, x: -50 }}
          animate={phase >= 1 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        >
          <h3 className="text-[2.5vw] font-bold text-[#0FA4AF] mb-[1vh]">Day-by-Day Itinerary</h3>
          <div className="h-[10vh] bg-gray-100 rounded mt-[2vh]" />
        </motion.div>
        
        <motion.div 
          className="bg-white p-[3vw] rounded-[2vw] shadow-xl"
          initial={{ opacity: 0, x: 50 }}
          animate={phase >= 2 ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        >
          <h3 className="text-[2.5vw] font-bold text-[#F5B942] mb-[1vh]">Budget Breakdown</h3>
          <div className="h-[10vh] bg-gray-100 rounded mt-[2vh]" />
        </motion.div>
        
        <motion.div 
          className="bg-white p-[3vw] rounded-[2vw] shadow-xl"
          initial={{ opacity: 0, x: -50 }}
          animate={phase >= 3 ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
        >
          <h3 className="text-[2.5vw] font-bold text-[#0FA4AF] mb-[1vh]">Hotel Picks</h3>
          <div className="h-[10vh] bg-gray-100 rounded mt-[2vh]" />
        </motion.div>
        
        <motion.div 
          className="bg-white p-[3vw] rounded-[2vw] shadow-xl"
          initial={{ opacity: 0, x: 50 }}
          animate={phase >= 4 ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
        >
          <h3 className="text-[2.5vw] font-bold text-[#F5B942] mb-[1vh]">Packing List</h3>
          <div className="h-[10vh] bg-gray-100 rounded mt-[2vh]" />
        </motion.div>
      </div>
    </motion.div>
  );
}
