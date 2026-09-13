import { useState, useRef, useEffect } from 'react';
import MagicalEntrance from './scenes/MagicalEntrance';
import MainReveal from './scenes/MainReveal';
import PhotoGalaxy from './scenes/PhotoGalaxy';
import PlayfulGame from './scenes/PlayfulGame';
import BalloonMessages from './scenes/BalloonMessages';
import BirthdayCake from './scenes/BirthdayCake';
import EighteenStars from './scenes/EighteenStars';
import TheLetter from './scenes/TheLetter';
import Finale from './scenes/Finale';

export default function App() {
  const [currentScene, setCurrentScene] = useState(1);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const nextScene = () => setCurrentScene((prev) => prev + 1);
  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play().catch(e => console.log("Audio play failed:", e));
    }
  };

  useEffect(() => {
    // Setup audio
    audioRef.current = new Audio('/instrumental.mp3');
    audioRef.current.loop = true;
    audioRef.current.volume = 0.4;
  }, []);

  return (
    <div className="w-screen h-screen overflow-hidden bg-pearl text-slate-800">
      {currentScene === 1 && <MagicalEntrance onStart={() => { playAudio(); nextScene(); }} />}
      {currentScene === 2 && <MainReveal onNext={nextScene} />}
      {currentScene === 3 && <PhotoGalaxy onNext={nextScene} />}
      {currentScene === 4 && <PlayfulGame onNext={nextScene} />}
      {currentScene === 5 && <BalloonMessages onNext={nextScene} />}
      {currentScene === 6 && <BirthdayCake onNext={nextScene} />}
      {currentScene === 7 && <EighteenStars onNext={nextScene} />}
      {currentScene === 8 && <TheLetter onNext={nextScene} />}
      {currentScene === 9 && <Finale onRestart={() => setCurrentScene(1)} />}
    </div>
  );
}
