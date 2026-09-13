import { useState, useMemo, useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, Environment } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import confetti from 'canvas-confetti';
import * as THREE from 'three';
import { config } from '../config';

const POP_REQUIREMENT = 5; // how many to pop before next button

function Balloon({ position, color, message, onPop }: any) {
  const [popped, setPopped] = useState(false);
  const meshRef = useRef<THREE.Group>(null);

  // floating animation
  useFrame((state) => {
    if (meshRef.current && !popped) {
      meshRef.current.position.y += Math.sin(state.clock.elapsedTime * 2 + position[0]) * 0.005;
    }
  });

  const handlePop = (e: any) => {
    e.stopPropagation();
    if (popped) return;
    setPopped(true);
    onPop(message);
    
    // trigger confetti at this rough screen location
    confetti({
      particleCount: 30,
      spread: 60,
      colors: [color, '#ffffff', '#fbcfe8'],
      origin: { y: 0.5 } // approximate middle
    });
  };

  if (popped) return null;

  return (
    <group ref={meshRef} position={position} onClick={handlePop}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={1}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <sphereGeometry args={[0.6, 32, 32]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
        </mesh>
        <mesh position={[0, -0.6, 0]}>
          <coneGeometry args={[0.1, 0.2, 16]} />
          <meshStandardMaterial color={color} roughness={0.2} metalness={0.1} />
        </mesh>
        {/* String */}
        <mesh position={[0, -1.2, 0]}>
          <cylinderGeometry args={[0.01, 0.01, 1]} />
          <meshBasicMaterial color="#d1d5db" />
        </mesh>
      </Float>
    </group>
  );
}

export default function BalloonMessages({ onNext }: { onNext: () => void }) {
  const [poppedMessages, setPoppedMessages] = useState<string[]>([]);
  const [currentPopMsg, setCurrentPopMsg] = useState<string | null>(null);

  const handlePop = (msg: string) => {
    setPoppedMessages(prev => {
      if (!prev.includes(msg)) return [...prev, msg];
      return prev;
    });
    setCurrentPopMsg(msg);
    setTimeout(() => setCurrentPopMsg(null), 3000); // hide message after 3s
  };

  const balloonData = useMemo(() => {
    const colors = ['#f472b6', '#d8b4fe', '#fbcfe8', '#e9d5ff', '#ec4899'];
    return config.balloonMessages.map((msg, i) => ({
      id: i,
      msg,
      color: colors[i % colors.length],
      pos: [
        (Math.random() - 0.5) * 8, 
        (Math.random() - 0.5) * 4, 
        (Math.random() - 0.5) * 4 - 2
      ] as [number, number, number]
    }));
  }, []);

  return (
    <motion.div 
      className="w-full h-full relative bg-lilac-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 50 }}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[5, 10, 5]} intensity={1} color="#ffffff" />
          
          {balloonData.map((b) => (
            <Balloon key={b.id} position={b.pos} color={b.color} message={b.msg} onPop={handlePop} />
          ))}
          <Environment preset="apartment" />
        </Canvas>
      </div>

      <div className="absolute top-10 w-full flex justify-center z-10 pointer-events-none">
        <h2 className="text-xl md:text-3xl font-serif text-pink-600 bg-white/60 px-6 py-2 rounded-full backdrop-blur-md">
          Pop the balloons!
        </h2>
      </div>

      {/* Floating message display */}
      <AnimatePresence>
        {currentPopMsg && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -50, scale: 0.8 }}
            className="absolute inset-0 m-auto w-max h-max max-w-[80%] z-20 pointer-events-none"
          >
            <div className="bg-white/90 backdrop-blur-lg px-8 py-6 rounded-3xl shadow-2xl border border-pink-200 text-center">
              <p className="text-2xl font-serif text-slate-700">{currentPopMsg}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute bottom-10 w-full flex justify-center z-10 pointer-events-none">
        <AnimatePresence>
          {poppedMessages.length >= POP_REQUIREMENT && (
            <motion.button
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              onClick={onNext}
              className="px-8 py-4 bg-pink-500 hover:bg-pink-600 text-white rounded-full font-bold shadow-[0_0_20px_rgba(236,72,153,0.6)] pointer-events-auto transition-transform transform hover:scale-105"
            >
              Make a birthday wish ✨
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
