import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { config } from '../config';

const POP_REQUIREMENT = 5;
const balloonColors = ['#f37fae', '#a78bfa', '#fb9ab8', '#c4b5fd', '#ec5e9a', '#f5a8bd', '#b694f5', '#e778ab'];

export default function BalloonMessages({ onNext }: { onNext: () => void }) {
  const [poppedIds, setPoppedIds] = useState<number[]>([]);
  const [currentMessage, setCurrentMessage] = useState<string | null>(null);

  const popBalloon = (index: number, event: React.MouseEvent<HTMLButtonElement>) => {
    if (poppedIds.includes(index)) return;

    const box = event.currentTarget.getBoundingClientRect();
    setPoppedIds((previous) => [...previous, index]);
    setCurrentMessage(config.balloonMessages[index]);
    window.setTimeout(() => setCurrentMessage(null), 3200);
    confetti({
      particleCount: 36,
      spread: 70,
      startVelocity: 24,
      colors: [balloonColors[index], '#ffffff', '#fbcfe8', '#fef08a'],
      origin: { x: (box.left + box.width / 2) / window.innerWidth, y: (box.top + box.height / 2) / window.innerHeight },
    });
  };

  const poppedCount = poppedIds.length;

  return (
    <motion.section
      className="relative flex h-full w-full flex-col items-center overflow-hidden bg-gradient-to-b from-[#fff5f8] via-[#f8f0ff] to-[#e9dcfb] px-4 pb-24 pt-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45 } }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 top-1/4 h-64 w-64 rounded-full bg-pink-300/40 blur-3xl" />
        <div className="absolute -right-20 bottom-8 h-72 w-72 rounded-full bg-violet-300/50 blur-3xl" />
      </div>

      <header className="relative z-10 text-center">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.24em] text-pink-500">A little birthday game</p>
        <h2 className="font-serif text-3xl font-bold text-pink-600 sm:text-4xl">Pop the balloons</h2>
        <p className="mt-2 text-sm text-slate-600">Pop any {POP_REQUIREMENT} to reveal sweet notes.</p>
        <div className="mx-auto mt-4 h-2 w-36 overflow-hidden rounded-full bg-white/70 shadow-inner">
          <motion.div className="h-full rounded-full bg-pink-400" animate={{ width: `${Math.min(poppedCount, POP_REQUIREMENT) / POP_REQUIREMENT * 100}%` }} />
        </div>
        <p className="mt-1 text-xs font-bold text-pink-500">{Math.min(poppedCount, POP_REQUIREMENT)} / {POP_REQUIREMENT} popped</p>
      </header>

      <div className="relative z-10 grid w-full max-w-2xl grid-cols-4 place-items-center gap-x-2 gap-y-3 pt-7 sm:gap-x-8 sm:gap-y-5 md:max-w-3xl md:gap-x-12 md:pt-10">
        {config.balloonMessages.map((message, index) => {
          const isPopped = poppedIds.includes(index);
          return (
            <motion.button
              key={message}
              type="button"
              aria-label={isPopped ? `Birthday note ${index + 1} opened` : `Pop balloon ${index + 1}`}
              disabled={isPopped}
              onClick={(event) => popBalloon(index, event)}
              initial={{ opacity: 0, y: 24 }}
              animate={isPopped ? { opacity: 0, scale: 1.35, rotate: 12 } : { opacity: 1, y: [0, -8, 0], scale: 1 }}
              transition={isPopped ? { duration: 0.25 } : { delay: index * 0.07, y: { repeat: Infinity, duration: 2.3 + index * 0.09, ease: 'easeInOut' } }}
              whileTap={isPopped ? undefined : { scale: 0.88 }}
              className="group relative flex h-28 w-16 items-start justify-center sm:h-36 sm:w-20 md:h-40 md:w-24 disabled:pointer-events-none"
            >
              <span className="relative block h-20 w-16 rounded-full shadow-lg transition-transform duration-200 group-hover:scale-105 sm:h-28 sm:w-20 md:h-32 md:w-24" style={{ background: `radial-gradient(circle at 35% 27%, #ffffffaa 0 8%, transparent 9%), linear-gradient(145deg, ${balloonColors[index]}, ${balloonColors[index]}cc)` }}>
                <span className="absolute -bottom-2 left-1/2 h-3 w-3 -translate-x-1/2 rotate-45" style={{ backgroundColor: balloonColors[index] }} />
              </span>
              <span className="absolute top-[5.4rem] h-8 border-l border-pink-300/70 sm:top-[7.4rem] sm:h-10 md:top-[8.4rem]" />
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {currentMessage && (
          <motion.div
            key={currentMessage}
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.98 }}
            className="relative z-20 mx-auto mt-3 max-w-xl rounded-3xl border border-white/70 bg-white/90 px-5 py-4 text-center shadow-xl backdrop-blur-md sm:mt-5 sm:px-8 sm:py-5"
            aria-live="polite"
          >
            <p className="font-serif text-lg leading-relaxed text-slate-700 sm:text-xl">{currentMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {poppedCount >= POP_REQUIREMENT && (
          <motion.button
            type="button"
            initial={{ opacity: 0, y: 18, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            onClick={onNext}
            className="fixed bottom-6 z-30 rounded-full bg-pink-500 px-7 py-3 font-bold text-white shadow-[0_0_24px_rgba(236,72,153,.45)] transition hover:scale-105 hover:bg-pink-600"
          >
            Make a birthday wish <span aria-hidden="true">✨</span>
          </motion.button>
        )}
      </AnimatePresence>
    </motion.section>
  );
}
