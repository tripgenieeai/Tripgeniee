export function useVideoPlayer({ durations }: { durations: Record<string, number> }) {
  // Mock implementation for preview purposes
  // In a real environment, this handles recording lifecycle
  const [currentScene, setCurrentScene] = window.React?.useState(0) || [0, () => {}];
  
  window.React?.useEffect(() => {
    const keys = Object.keys(durations);
    let current = 0;
    
    const playNext = () => {
      const duration = durations[keys[current]];
      setTimeout(() => {
        current = (current + 1) % keys.length;
        setCurrentScene(current);
        playNext();
      }, duration);
    };
    
    playNext();
  }, [durations]);

  return { currentScene };
}
