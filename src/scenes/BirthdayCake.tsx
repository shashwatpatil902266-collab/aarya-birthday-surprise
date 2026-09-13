import { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Sparkles, Html } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import * as THREE from 'three';
import { prefersReducedMotion } from '../config';
import { CanvasErrorBoundary } from '../components/CanvasErrorBoundary';

function Candle({ position, isLit, flickering }: { position: [number, number, number], isLit: boolean, flickering: boolean }) {
  const flameRef = useRef<THREE.Mesh>(null);
  const smokeRef = useRef<THREE.Group>(null);

  useFrame((state) => {
    if (isLit && flameRef.current) {
      // flicker effect
      const scale = flickering ? 1 + Math.sin(state.clock.elapsedTime * 20) * 0.2 : 1 + Math.sin(state.clock.elapsedTime * 5) * 0.05;
      flameRef.current.scale.set(scale, scale, scale);
    }
  });

  return (
    <group position={position}>
      {/* Candle stick */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 0.4]} />
        <meshStandardMaterial color="#fbcfe8" roughness={0.1} />
      </mesh>
      {/* Flame */}
      {isLit && (
        <mesh ref={flameRef} position={[0, 0.45, 0]}>
          <coneGeometry args={[0.03, 0.1, 8]} />
          <meshBasicMaterial color="#fef08a" />
        </mesh>
      )}
      {/* Smoke particle placeholder */}
      {!isLit && !prefersReducedMotion && (
        <Sparkles count={5} scale={0.1} size={0.5} speed={0.5} opacity={0.5} color="#cbd5e1" position={[0, 0.5, 0]} />
      )}
    </group>
  );
}

function Cake({ stage }: { stage: number }) {
  const isLit = stage < 2;
  const flickering = stage === 1;

  const candlePositions = useMemo(() => {
    const pos: [number, number, number][] = [];
    // 18 candles around the top tier
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      const radius = 0.5;
      pos.push([Math.cos(angle) * radius, 1.2, Math.sin(angle) * radius]);
    }
    return pos;
  }, []);

  return (
    <group position={[0, -1.2, 0]}>
      <Float speed={prefersReducedMotion ? 0 : 1.5} rotationIntensity={prefersReducedMotion ? 0 : 0.05} floatIntensity={prefersReducedMotion ? 0 : 0.1}>
        {/* Cake Stand Base */}
        <mesh position={[0, -0.4, 0]}>
          <cylinderGeometry args={[1.5, 1.8, 0.2, 64]} />
          <meshStandardMaterial color="#c5a059" metalness={0.6} roughness={0.2} />
        </mesh>
        {/* Cake Stand Pillar */}
        <mesh position={[0, -0.15, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.5, 32]} />
          <meshStandardMaterial color="#c5a059" metalness={0.6} roughness={0.2} />
        </mesh>
        {/* Cake Stand Top Plate */}
        <mesh position={[0, 0.1, 0]}>
          <cylinderGeometry args={[1.8, 1.8, 0.05, 64]} />
          <meshStandardMaterial color="#faf9f6" metalness={0.1} roughness={0.1} />
        </mesh>

        {/* Tier 1 */}
        <mesh position={[0, 0.4, 0]}>
          <cylinderGeometry args={[1.3, 1.3, 0.6, 64]} />
          <meshStandardMaterial color="#f5e6e8" roughness={0.5} />
        </mesh>
        {/* Tier 1 Frosting Trim */}
        <mesh position={[0, 0.7, 0]}>
           <torusGeometry args={[1.3, 0.08, 16, 64]} />
           <meshStandardMaterial color="#cf7c8c" roughness={0.3} />
        </mesh>

        {/* Tier 2 */}
        <mesh position={[0, 1.0, 0]}>
          <cylinderGeometry args={[0.9, 0.9, 0.6, 64]} />
          <meshStandardMaterial color="#fbf5f5" roughness={0.5} />
        </mesh>
        {/* Tier 2 Frosting Trim */}
        <mesh position={[0, 1.3, 0]}>
           <torusGeometry args={[0.9, 0.06, 16, 64]} />
           <meshStandardMaterial color="#cf7c8c" roughness={0.3} />
        </mesh>

        {/* Tier 3 */}
        <mesh position={[0, 1.55, 0]}>
          <cylinderGeometry args={[0.5, 0.5, 0.5, 64]} />
          <meshStandardMaterial color="#f5e6e8" roughness={0.5} />
        </mesh>
        
        {/* Elegant Bunny Topper (Approximation) */}
        <group position={[0, 1.9, 0]}>
           <mesh position={[0, 0, 0]}>
             <sphereGeometry args={[0.15, 32, 32]} />
             <meshStandardMaterial color="#ffffff" roughness={0.1} />
           </mesh>
           <mesh position={[-0.05, 0.2, 0]} rotation={[0, 0, 0.2]}>
             <capsuleGeometry args={[0.03, 0.15, 16, 16]} />
             <meshStandardMaterial color="#ffffff" roughness={0.1} />
           </mesh>
           <mesh position={[0.05, 0.2, 0]} rotation={[0, 0, -0.2]}>
             <capsuleGeometry args={[0.03, 0.15, 16, 16]} />
             <meshStandardMaterial color="#ffffff" roughness={0.1} />
           </mesh>
        </group>

        {/* Candles */}
        <group position={[0, 0.3, 0]}>
          {candlePositions.map((pos, i) => (
            <Candle key={i} position={pos} isLit={isLit} flickering={flickering} />
          ))}
        </group>
      </Float>
    </group>
  );
}

export default function BirthdayCake({ onNext }: { onNext: () => void }) {
  const [stage, setStage] = useState(0); // 0: lit, 1: flickering, 2: blown out
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);

  const handlePointerDown = (e: React.PointerEvent) => {
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    if (!pointerStartRef.current) return;
    const dx = e.clientX - pointerStartRef.current.x;
    const dy = e.clientY - pointerStartRef.current.y;
    const distance = Math.hypot(dx, dy);
    pointerStartRef.current = null;

    // Suppress interaction if the movement was a drag/orbit camera gesture
    if (distance > 10) return;

    handleInteraction();
  };

  const handleInteraction = () => {
    if (stage === 0) {
      setStage(1);
    } else if (stage === 1) {
      setStage(2);
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.6 },
        colors: ['#f472b6', '#d8b4fe', '#fef08a']
      });
    }
  };

  return (
    <motion.div 
      className="w-full h-full relative bg-slate-900"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      <div 
        className="absolute inset-0 z-0 cursor-pointer" 
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
      >
        <CanvasErrorBoundary fallbackGradient="bg-slate-900">
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 1.5, 5], fov: 50 }}>
            <ambientLight intensity={stage < 2 ? 0.2 : 0.8} />
            <directionalLight position={[5, 5, 5]} intensity={stage < 2 ? 0.3 : 1} />
            {stage < 2 && (
              <pointLight position={[0, 1.5, 0]} intensity={stage === 1 ? 1.5 : 1} color="#fef08a" distance={4} />
            )}
            <Cake stage={stage} />
            <OrbitControls enableZoom={false} maxPolarAngle={Math.PI/2 + 0.1} minPolarAngle={Math.PI/4} />
          </Canvas>
        </CanvasErrorBoundary>
      </div>

      <div className="absolute top-10 w-full flex justify-center z-10 pointer-events-none">
        <AnimatePresence mode="wait">
          <motion.div
            key={stage}
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="text-center"
          >
            {stage === 0 && (
              <h2 className="text-3xl font-serif text-white drop-shadow-md bg-black/30 px-6 py-2 rounded-full backdrop-blur-md">
                Tap to prepare your wish ✨
              </h2>
            )}
            {stage === 1 && (
              <h2 className="text-3xl font-serif text-pink-200 drop-shadow-lg bg-black/30 px-6 py-2 rounded-full backdrop-blur-md">
                Make a wish and tap to blow out...
              </h2>
            )}
            {stage === 2 && (
              <h2 className="text-2xl md:text-4xl font-serif text-pink-300 drop-shadow-xl bg-black/40 px-8 py-4 rounded-3xl backdrop-blur-lg max-w-2xl mx-auto leading-relaxed">
                May your 18th year be full of laughter, confidence, peace, and everything beautiful.
              </h2>
            )}
          </motion.div>
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {stage === 2 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2 }}
            className="absolute bottom-10 w-full flex justify-center z-20"
          >
            <button
              onClick={onNext}
              className="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold shadow-[0_0_20px_rgba(236,72,153,0.6)] transition-transform transform hover:scale-105"
            >
              One last thing...
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
