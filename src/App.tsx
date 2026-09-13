import { lazy, Suspense, useState, useRef, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const MagicalEntrance = lazy(() => import('./scenes/MagicalEntrance'));
const MainReveal = lazy(() => import('./scenes/MainReveal'));
const PhotoGalaxy = lazy(() => import('./scenes/PhotoGalaxy'));
const PlayfulGame = lazy(() => import('./scenes/PlayfulGame'));
const BalloonMessages = lazy(() => import('./scenes/BalloonMessages'));
const BirthdayCake = lazy(() => import('./scenes/BirthdayCake'));
const EighteenStars = lazy(() => import('./scenes/EighteenStars'));
const TheLetter = lazy(() => import('./scenes/TheLetter'));
const Finale = lazy(() => import('./scenes/Finale'));

export default function App() {
  const [currentScene, setCurrentScene] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const nextScene = () => setCurrentScene((prev) => Math.min(prev + 1, 9));
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  useEffect(() => {
    const audio = new Audio('/instrumental.mp3');
    audio.loop = true;
    audio.volume = 0.35;
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const restart = () => {
    setCurrentScene(1);
    audioRef.current?.play().catch(() => undefined);
  };

  return (
    <div className="w-screen h-[100dvh] overflow-hidden bg-pearl text-slate-800">
      {currentScene > 1 && (
        <div className="absolute left-1/2 top-4 z-50 flex -translate-x-1/2 items-center gap-3 rounded-full border border-white/40 bg-slate-950/30 px-3 py-2 text-xs text-white shadow-lg backdrop-blur-md">
          <span aria-label={`Scene ${currentScene} of 9`} className="font-medium tabular-nums">{currentScene} / 9</span>
          <div className="h-1 w-20 overflow-hidden rounded-full bg-white/30">
            <motion.div className="h-full rounded-full bg-pink-300" animate={{ width: `${(currentScene / 9) * 100}%` }} />
          </div>
        </div>
      )}
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
    </div>
  );
}
