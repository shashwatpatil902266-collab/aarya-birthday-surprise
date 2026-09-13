import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Star } from 'lucide-react';
import { config } from '../config';

export default function EighteenStars({ onNext }: { onNext: () => void }) {
  const [readStars, setReadStars] = useState<number[]>([]);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const handleStarClick = (index: number) => {
    setActiveIndex(index);
    if (!readStars.includes(index)) {
      setReadStars(prev => [...prev, index]);
    }
  };

  const allRead = readStars.length === 18;

  return (
    <motion.div 
      className="w-full h-full relative overflow-y-auto bg-pearl flex flex-col items-center px-4 pb-28 pt-20 md:pt-24"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      <h2 className="text-3xl md:text-5xl font-serif text-pink-600 font-bold mb-8 text-center">
        18 Little Letters for 18 Years
      </h2>
      
      <p className="text-slate-500 mb-12 text-center max-w-md">
        Every star holds a different birthday paragraph. Read them all to unlock the letter.
      </p>

      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3 sm:gap-4 md:gap-8 max-w-3xl mx-auto z-10">
        {Array.from({ length: 18 }).map((_, i) => {
          const isRead = readStars.includes(i);
          return (
            <motion.button
              key={i}
              whileHover={{ scale: 1.2, rotate: 180 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => handleStarClick(i)}
              aria-label={`Read birthday note ${i + 1}`}
              aria-pressed={isRead}
              className={`relative flex items-center justify-center p-3 rounded-full transition-colors ${
                isRead ? 'bg-pink-100 text-pink-300' : 'bg-pink-400 text-yellow-300 shadow-lg shadow-pink-200'
              }`}
            >
              <Star fill={isRead ? 'transparent' : 'currentColor'} size={32} />
              {isRead && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-pink-400 font-bold text-xs">✓</span>
                </div>
              )}
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {activeIndex !== null && (
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mt-8 md:mt-12 bg-white p-5 md:p-6 rounded-2xl shadow-xl max-w-xl w-full text-center border border-pink-100 z-10"
          >
            <p className="mb-3 text-xs font-bold uppercase tracking-[0.2em] text-pink-400">
              Birthday note {activeIndex + 1} of 18
            </p>
            <p className="text-base md:text-lg font-serif text-slate-700 leading-relaxed">
              {config.eighteenMessages[activeIndex]}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {allRead && (
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            className="fixed bottom-6 z-20"
          >
            <button
              onClick={onNext}
              className="px-10 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-transform transform hover:scale-105"
            >
              Read my letter
            </button>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Background decorations */}
      <div className="absolute inset-0 pointer-events-none opacity-30 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-pink-100 via-pearl to-pearl" />
    </motion.div>
  );
}
