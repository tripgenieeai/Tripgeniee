import { motion, AnimatePresence } from 'framer-motion';
import { useVideoPlayer } from '@/lib/video';
import { Scene1 } from './video_scenes/Scene1';
import { Scene2 } from './video_scenes/Scene2';
import { Scene3 } from './video_scenes/Scene3';
import { Scene4 } from './video_scenes/Scene4';
import { Scene5 } from './video_scenes/Scene5';
import { Scene6 } from './video_scenes/Scene6';
import { Scene7 } from './video_scenes/Scene7';

const SCENE_DURATIONS = {
  open: 6000,
  problem: 6000,
  reveal: 6000,
  features: 8000,
  social: 6000,
  montage: 8000,
  close: 6000
};

export default function VideoTemplate() {
  const { currentScene } = useVideoPlayer({ durations: SCENE_DURATIONS });

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0B1F3A] text-[#F0F4F8]" style={{ fontFamily: 'var(--font-display, sans-serif)' }}>
      {/* Persistent global background elements if any */}
      <AnimatePresence mode="sync">
        {currentScene === 0 && <Scene1 key="open" />}
        {currentScene === 1 && <Scene2 key="problem" />}
        {currentScene === 2 && <Scene3 key="reveal" />}
        {currentScene === 3 && <Scene4 key="features" />}
        {currentScene === 4 && <Scene5 key="social" />}
        {currentScene === 5 && <Scene6 key="montage" />}
        {currentScene === 6 && <Scene7 key="close" />}
      </AnimatePresence>
    </div>
  );
}
