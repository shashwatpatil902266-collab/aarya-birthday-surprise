import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function PlayfulGame({ onNext }: { onNext: () => void }) {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);

  const moveNoButton = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const btn = e.currentTarget.getBoundingClientRect();
    
    // Find the original layout position by subtracting the current translation
    const origX = btn.left - noPosition.x;
    const origY = btn.top - noPosition.y;
    
    // Calculate maximum allowable translation in each direction with 20px padding
    const maxMoveLeft = Math.max(0, origX - 20);
    const maxMoveRight = Math.max(0, container.width - (origX + btn.width) - 20);
    const maxMoveUp = Math.max(0, origY - 20);
    const maxMoveDown = Math.max(0, container.height - (origY + btn.height) - 20);
    
    // Random position within these strict bounds
    const randomX = (Math.random() * (maxMoveLeft + maxMoveRight)) - maxMoveLeft;
    const randomY = (Math.random() * (maxMoveUp + maxMoveDown)) - maxMoveUp;

    setNoPosition({ x: randomX, y: randomY });
  };

  return (
    <motion.div 
      className="w-full h-full relative bg-pink-100 flex items-center justify-center overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
      ref={containerRef}
    >
      <div className="text-center z-10 p-8">
        <h2 className="text-4xl md:text-5xl font-serif text-pink-500 font-bold mb-12 drop-shadow-sm">
          Ready for the next surprise?
        </h2>
        
        <div className="flex justify-center items-center gap-12 h-32 relative">
          <button 
            onClick={onNext}
            className="px-10 py-4 bg-pink-400 hover:bg-pink-500 text-white rounded-xl font-bold text-xl shadow-lg transition-transform transform hover:scale-105"
          >
            Absolutely!
          </button>

          <motion.button 
            onMouseEnter={moveNoButton}
            onClick={moveNoButton}
            animate={{ x: noPosition.x, y: noPosition.y }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="px-10 py-4 bg-slate-300 text-slate-700 rounded-xl font-bold text-xl shadow-lg absolute right-0 md:relative md:right-auto"
            style={{ zIndex: 20 }}
          >
            Not yet
          </motion.button>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-10 left-10 text-6xl opacity-20">🌸</div>
      <div className="absolute bottom-20 right-20 text-6xl opacity-20">🎀</div>
    </motion.div>
  );
}
