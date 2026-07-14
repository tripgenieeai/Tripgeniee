import { motion } from 'framer-motion';

export function Scene7() {
  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#0B1F3A]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ delay: 0.5, type: "spring" }}
      >
        <h1 className="text-[10vw] font-black text-white tracking-tight">TripGeniee</h1>
      </motion.div>
      <motion.p
        className="text-[3vw] text-[#F5B942] mt-[2vh] font-light"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 1 }}
      >
        Design your dream trip in seconds, not hours.
      </motion.p>
    </motion.div>
  );
}
