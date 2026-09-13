import { useState, useRef, useLayoutEffect } from 'react';
import { motion } from 'framer-motion';

export default function PlayfulGame({ onNext }: { onNext: () => void }) {
  const [noPosition, setNoPosition] = useState({ x: 0, y: 0 });
  const containerRef = useRef<HTMLDivElement>(null);
  const btnRef = useRef<HTMLButtonElement>(null);
  const originalPosRef = useRef({ left: 0, top: 0, width: 0, height: 0 });

  useLayoutEffect(() => {
    const updateOrig = () => {
      if (btnRef.current) {
        const rect = btnRef.current.getBoundingClientRect();
        originalPosRef.current = {
          left: rect.left,
          top: rect.top,
          width: rect.width,
          height: rect.height
        };
      }
    };
    updateOrig();
    window.addEventListener('resize', updateOrig);
    return () => window.removeEventListener('resize', updateOrig);
  }, []);

  const moveNoButton = () => {
    if (!containerRef.current) return;
    const container = containerRef.current.getBoundingClientRect();
    const orig = originalPosRef.current;
    
    // Calculate bounds relative to the container's true position
    const relativeOrigX = orig.left - container.left;
    const relativeOrigY = orig.top - container.top;
    
    // Calculate maximum allowable translation in each direction with 20px padding
    const maxMoveLeft = Math.max(0, relativeOrigX - 20);
    const maxMoveRight = Math.max(0, container.width - (relativeOrigX + orig.width) - 20);
    const maxMoveUp = Math.max(0, relativeOrigY - 20);
    const maxMoveDown = Math.max(0, container.height - (relativeOrigY + orig.height) - 20);
    
    let randomX = (Math.random() * (maxMoveLeft + maxMoveRight)) - maxMoveLeft;
    let randomY = (Math.random() * (maxMoveUp + maxMoveDown)) - maxMoveUp;

    // Prevent landing directly on top of the "Absolutely!" button
    if (Math.abs(randomX + 130) < 110 && Math.abs(randomY) < 50) {
      randomY = randomY >= 0 ? randomY + 90 : randomY - 90;
    } else if (Math.abs(randomX) < 60 && randomY > -140 && randomY < -30) {
      randomX = randomX >= 0 ? randomX + 110 : randomX - 110;
    }

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
      <div className="text-center z-10 p-6 sm:p-8">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-serif text-pink-500 font-bold mb-8 sm:mb-12 drop-shadow-sm">
          Ready for the next surprise?
        </h2>
        
        <div className="flex flex-col sm:flex-row justify-center items-center gap-6 sm:gap-12 min-h-32 relative">
          <button 
            onClick={onNext}
            className="px-8 sm:px-10 py-3 sm:py-4 bg-pink-400 hover:bg-pink-500 text-white rounded-xl font-bold text-lg sm:text-xl shadow-lg transition-transform transform hover:scale-105 active:scale-95"
          >
            Absolutely!
          </button>

          <motion.button 
            ref={btnRef}
            onMouseEnter={moveNoButton}
            onTouchStart={moveNoButton}
            onClick={moveNoButton}
            animate={{ x: noPosition.x, y: noPosition.y }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="px-8 sm:px-10 py-3 sm:py-4 bg-slate-300 text-slate-700 rounded-xl font-bold text-lg sm:text-xl shadow-lg relative"
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
