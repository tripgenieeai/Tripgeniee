import { motion } from 'framer-motion';

export function Scene1() {
  return (
    <motion.div 
      className="absolute inset-0"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1.5 }}
    >
      <video
        src={`${import.meta.env.BASE_URL}videos/hero.mp4`}
        className="w-full h-full object-cover"
        autoPlay
        muted
        playsInline
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B1F3A] via-transparent to-transparent opacity-60" />
    </motion.div>
  );
}
