import { motion } from 'framer-motion';

export function Scene3() {
  return (
    <motion.div 
      className="absolute inset-0 flex items-center justify-center bg-[#0B1F3A]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ scale: 1.2, opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="text-center relative z-10">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", duration: 1.5, bounce: 0.4 }}
        >
          <h1 className="text-[8vw] font-black text-white tracking-tight">TripGeniee</h1>
        </motion.div>
        <motion.p
          className="text-[2.5vw] text-[#0FA4AF] mt-[2vh]"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          The AI that plans your perfect trip instantly.
        </motion.p>
      </div>
    </motion.div>
  );
}
