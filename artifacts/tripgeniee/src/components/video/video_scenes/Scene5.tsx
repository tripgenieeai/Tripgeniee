import { motion } from 'framer-motion';

export function Scene5() {
  return (
    <motion.div 
      className="absolute inset-0 flex flex-col items-center justify-center bg-[#0FA4AF] text-white"
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 1.1, opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.div 
        className="text-[8vw] font-black"
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        10,000+
      </motion.div>
      <motion.div 
        className="text-[3vw] font-semibold opacity-90 uppercase tracking-widest mb-[6vh]"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        Trips Planned
      </motion.div>

      <div className="flex gap-[8vw]">
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <div className="text-[5vw] font-bold text-[#F5B942]">50</div>
          <div className="text-[2vw]">Destinations</div>
        </motion.div>
        
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <div className="text-[5vw] font-bold text-[#F5B942]">$0</div>
          <div className="text-[2vw]">Research Time</div>
        </motion.div>
      </div>
    </motion.div>
  );
}
