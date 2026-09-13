import { useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { Stars, Float, Sparkles, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import confetti from 'canvas-confetti';
import { prefersReducedMotion } from '../config';
import { CanvasErrorBoundary } from '../components/CanvasErrorBoundary';

const crystals = [
  [-7, 4, -6, 0.35], [-5, -3.5, -7, 0.42], [-2.5, 2.7, -5, 0.28], [1.4, -4.2, -8, 0.46],
  [3.9, 3.1, -7, 0.32], [7.1, -2.5, -6, 0.38], [-7.8, -1.2, -9, 0.25], [6.8, 4.5, -8, 0.31],
  [-0.7, 4.8, -10, 0.24], [0.5, -1.5, -7, 0.36],
] as const;

export default function Finale({ onRestart }: { onRestart: () => void }) {
  useEffect(() => {
    const duration = 15 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
        colors: ['#f472b6', '#d8b4fe', '#fef08a', '#ffffff']
      });
      confetti({
        ...defaults, particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
        colors: ['#f472b6', '#d8b4fe', '#fef08a', '#ffffff']
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <motion.div 
      className="w-full h-full relative bg-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      <div className="absolute inset-0 z-0">
        <CanvasErrorBoundary fallbackGradient="bg-slate-900">
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 10], fov: 60 }}>
            <ambientLight intensity={0.5} />
            <Stars radius={100} depth={50} count={700} factor={4} saturation={0} fade speed={2} />
            {!prefersReducedMotion && <Sparkles count={50} scale={20} size={4} speed={0.5} opacity={0.5} color="#f9a8d4" />}
            
            <Float speed={prefersReducedMotion ? 0 : 1} rotationIntensity={prefersReducedMotion ? 0 : 0.5} floatIntensity={prefersReducedMotion ? 0 : 1}>
              <group position={[0, 0, -10]}>
                {crystals.map(([x, y, z, size], i) => (
                  <mesh key={i} position={[x, y, z]}>
                    <octahedronGeometry args={[size]} />
                    <meshBasicMaterial color={['#f472b6', '#d8b4fe', '#ffffff'][i % 3]} />
                  </mesh>
                ))}
              </group>
            </Float>
            <OrbitControls autoRotate={!prefersReducedMotion} autoRotateSpeed={0.5} enableZoom={false} enablePan={false} />
          </Canvas>
        </CanvasErrorBoundary>
      </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center p-4 sm:p-6 pointer-events-none">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="text-center bg-black/40 p-6 sm:p-10 rounded-3xl backdrop-blur-md border border-pink-500/30 shadow-2xl pointer-events-auto"
        >
          <h1 className="text-4xl md:text-6xl font-serif text-pink-300 font-bold mb-6 drop-shadow-lg">
            Happy 18th Birthday,<br />Miss Marshmallow!
          </h1>
          <p className="text-xl md:text-2xl text-pink-100 font-serif mb-12 drop-shadow-md">
            Keep shining. Keep being you.
          </p>

          <div className="flex justify-center items-center mt-8">
            <button
              onClick={onRestart}
              className="px-10 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-transform transform hover:scale-105"
            >
              Replay the surprise
            </button>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
}
