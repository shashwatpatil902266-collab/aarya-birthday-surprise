import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Float, Sparkles } from '@react-three/drei';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { config } from '../config';

const flowers = [
  [-4.1, 2.8, -6], [3.8, 2.2, -7], [-3.5, -2.4, -8], [3.1, -2.5, -6.5], [0.1, 3.7, -9],
] as const;

export default function MainReveal({ onNext }: { onNext: () => void }) {
  useEffect(() => {
    const duration = 3000;
    const end = Date.now() + duration;
    let frameId = 0;

    const frame = () => {
      confetti({
        particleCount: 5,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#fbcfe8', '#f472b6', '#d8b4fe']
      });
      confetti({
        particleCount: 5,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#fbcfe8', '#f472b6', '#d8b4fe']
      });

      if (Date.now() < end) {
        frameId = requestAnimationFrame(frame);
      }
    };
    frame();

    return () => {
      cancelAnimationFrame(frameId);
      confetti.reset();
    };
  }, []);

  return (
    <motion.div 
      className="w-full h-full relative bg-pink-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 5], fov: 50 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[10, 10, 5]} intensity={1} color="#fbcfe8" />
          <Sparkles count={72} scale={12} size={3} speed={0.2} opacity={0.5} color="#ec4899" />
          
          {/* Abstract Lily / Flower shapes in background */}
          {flowers.map((position, i) => (
            <Float key={i} speed={1.5} rotationIntensity={0.5} floatIntensity={2}>
              <group position={position}>
                <mesh rotation={[Math.PI / 4, Math.PI / 4, 0]}>
                  <octahedronGeometry args={[0.5]} />
                  <meshStandardMaterial color={i % 2 === 0 ? "#fbcfe8" : "#e9d5ff"} />
                </mesh>
              </group>
            </Float>
          ))}
        </Canvas>
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-6 text-center pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, type: "spring" }}
          className="bg-white/40 backdrop-blur-md p-10 rounded-3xl border border-white/60 shadow-xl max-w-2xl pointer-events-auto"
        >
          <div className="absolute -right-3 -top-8 h-24 w-20 overflow-hidden border-4 border-white bg-slate-200 shadow-lg rotate-12 sm:-right-8 sm:-top-12 sm:h-32 sm:w-24">
             <img src="/jungkook.jpg" alt="Jung Kook" className="h-full w-full object-cover opacity-75" />
          </div>

          <h1 className="text-4xl md:text-6xl font-serif text-pink-500 font-bold mb-4 drop-shadow-sm">
            Happy 18th Birthday,<br />
            <span className="text-pink-600">{config.name}!</span>
          </h1>
          
          <div className="flex flex-col gap-2 mb-8 text-slate-600 font-medium text-lg">
            <span className="bg-pink-100 px-4 py-1 rounded-full w-max mx-auto">{config.birthdayDate}</span>
            <span className="italic">From {config.sender}</span>
          </div>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            onClick={onNext}
            className="px-8 py-3 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-semibold shadow-lg transition-transform transform hover:scale-105"
          >
            Begin the memory ride
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
