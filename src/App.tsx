import { lazy, Suspense, useState, useRef, useEffect, Component, ReactNode } from 'react';
import { AnimatePresence, motion, MotionConfig } from 'framer-motion';

const MagicalEntrance = lazy(() => import('./scenes/MagicalEntrance'));
const MainReveal = lazy(() => import('./scenes/MainReveal'));
const PhotoGalaxy = lazy(() => import('./scenes/PhotoGalaxy'));
const PlayfulGame = lazy(() => import('./scenes/PlayfulGame'));
const BalloonMessages = lazy(() => import('./scenes/BalloonMessages'));
const BirthdayCake = lazy(() => import('./scenes/BirthdayCake'));
const EighteenStars = lazy(() => import('./scenes/EighteenStars'));
const TheLetter = lazy(() => import('./scenes/TheLetter'));
const Finale = lazy(() => import('./scenes/Finale'));

// Error Boundary (Fix 8)
class SceneErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() { return { hasError: true }; }
  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error("Scene crashed:", error, info);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div 
          className="w-full h-full flex items-center justify-center bg-pink-50 cursor-pointer p-8 text-center"
          onClick={() => { this.setState({ hasError: false }); window.location.reload(); }}
        >
          <div className="bg-white/40 backdrop-blur-md p-8 rounded-3xl border border-white/60 shadow-xl">
            <h2 className="text-2xl font-serif text-pink-500 mb-4">Oops! Something twinkled out.</h2>
            <p className="text-slate-600">Tap anywhere to reload and continue the magic.</p>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

export default function App() {
  // Session persistence (Fix 9)
  const [currentScene, setCurrentScene] = useState(() => {
    const saved = sessionStorage.getItem('currentScene');
    return saved ? parseInt(saved, 10) : 1;
  });
  
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const nextScene = () => setCurrentScene((prev) => {
    const next = Math.min(prev + 1, 9);
    sessionStorage.setItem('currentScene', next.toString());
    return next;
  });

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  const toggleMute = () => {
    if (audioRef.current) {
      if (audioRef.current.paused) {
        // Acting as a resume button
        audioRef.current.muted = false;
        setIsMuted(false);
        audioRef.current.play().catch(e => console.log("Audio play failed:", e));
      } else {
        audioRef.current.muted = !isMuted;
        setIsMuted(!isMuted);
      }
    }
  };

  useEffect(() => {
    if (!audioRef.current) {
      const audio = new Audio('/instrumental.mp3');
      audio.loop = true;
      audio.volume = 0.35;
      audioRef.current = audio;
      
      // If we resumed midway, try to resume audio (might need user interaction though)
      if (currentScene > 1) {
        audioRef.current.play().catch(() => console.log("Audio needs user interaction to resume"));
      }
    }

    return () => {
      // Don't pause on simple re-renders, but keeping remote's cleanup logic just in case
      // Actually, since we're using lazy loading and React 18, we might mount/unmount.
      // Better to let audioRef persist and just pause on actual unmount.
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []); // Remove currentScene from dep array so it doesn't pause/play on every scene change

  const restart = () => {
    sessionStorage.removeItem('currentScene');
    setCurrentScene(1);
    audioRef.current?.play().catch(() => undefined);
  };

  return (
    <div className="w-screen h-[100dvh] overflow-hidden bg-pearl text-slate-800 relative">
      {/* Audio Toggle (Fix 7) */}
      {currentScene > 1 && (
        <button
          onClick={toggleMute}
          className="absolute top-4 right-4 z-50 p-3 bg-white/30 backdrop-blur-md border border-white/40 rounded-full shadow-md text-pink-500 hover:bg-white/50 transition-colors"
          aria-label={isMuted ? "Unmute" : "Mute"}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><line x1="23" y1="9" x2="17" y2="15"></line><line x1="17" y1="9" x2="23" y2="15"></line></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 5L6 9H2v6h4l5 4V5z"></path><path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path><path d="M19.07 4.93a10 10 0 0 1 0 14.14"></path></svg>
          )}
        </button>
      )}

      {currentScene > 1 && (
        <div className="absolute left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/40 bg-slate-950/30 px-3 py-2 text-xs text-white shadow-lg backdrop-blur-md">
          <span aria-label={`Scene ${currentScene} of 9`} className="font-medium tabular-nums">{currentScene} / 9</span>
          <div className="h-1 w-20 overflow-hidden rounded-full bg-white/30">
            <motion.div className="h-full rounded-full bg-pink-300" animate={{ width: `${(currentScene / 9) * 100}%` }} />
          </div>
        </div>
      )}

      {/* Reduced Motion Config for Framer Motion (Fix 2) */}
      <MotionConfig reducedMotion="user">
        <SceneErrorBoundary>
          <Suspense fallback={<div className="grid h-full place-items-center bg-pearl text-pink-500"><span className="animate-pulse font-serif text-lg">Unwrapping your next surprise…</span></div>}>
            <AnimatePresence mode="wait">
              {currentScene === 1 && <MagicalEntrance key="entrance" onStart={() => { playAudio(); nextScene(); }} />}
              {currentScene === 2 && <MainReveal key="reveal" onNext={nextScene} />}
              {currentScene === 3 && <PhotoGalaxy key="gallery" onNext={nextScene} />}
              {currentScene === 4 && <PlayfulGame key="game" onNext={nextScene} />}
              {currentScene === 5 && <BalloonMessages key="balloons" onNext={nextScene} />}
              {currentScene === 6 && <BirthdayCake key="cake" onNext={nextScene} />}
              {currentScene === 7 && <EighteenStars key="stars" onNext={nextScene} />}
              {currentScene === 8 && <TheLetter key="letter" onNext={nextScene} />}
              {currentScene === 9 && <Finale key="finale" onRestart={restart} />}
            </AnimatePresence>
          </Suspense>
        </SceneErrorBoundary>
      </MotionConfig>
    </div>
  );
}
