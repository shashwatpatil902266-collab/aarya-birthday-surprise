import { Canvas } from '@react-three/fiber';
import { Sparkles, Float, Stars, PresentationControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import { prefersReducedMotion } from '../config';
import { CanvasErrorBoundary } from '../components/CanvasErrorBoundary';

export default function MagicalEntrance({ onStart }: { onStart: () => void }) {
  return (
    <motion.div 
      className="w-full h-full relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-indigo-950 via-purple-900 to-pink-900" />
      
      <div className="absolute inset-0 z-0">
        <CanvasErrorBoundary fallbackGradient="bg-gradient-to-b from-indigo-950 via-purple-900 to-pink-900">
          <Canvas dpr={[1, 1.5]} camera={{ position: [0, 0, 5], fov: 45 }}>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} intensity={1} />
            <Stars radius={100} depth={50} count={700} factor={4} saturation={0} fade speed={1} />
            {!prefersReducedMotion && <Sparkles count={40} scale={10} size={2} speed={0.4} opacity={0.3} color="#fbcfe8" />}
          
          <PresentationControls
            global
            rotation={[0, 0, 0]}
            polar={[-Math.PI / 4, Math.PI / 4]}
            azimuth={[-Math.PI / 4, Math.PI / 4]}
          >
            <Float speed={prefersReducedMotion ? 0 : 2} rotationIntensity={prefersReducedMotion ? 0 : 0.5} floatIntensity={prefersReducedMotion ? 0 : 1}>
              {/* Minimal Gift Box Representation */}
              <group position={[0, -0.5, 0]}>
                <mesh castShadow receiveShadow>
                  <boxGeometry args={[1.5, 1.2, 1.5]} />
                  <meshStandardMaterial color="#fce7f3" roughness={0.3} metalness={0.1} />
                </mesh>
                {/* Ribbon */}
                <mesh position={[0, 0.61, 0]}>
                  <boxGeometry args={[1.51, 0.05, 0.3]} />
                  <meshStandardMaterial color="#f472b6" roughness={0.4} />
                </mesh>
                <mesh position={[0, 0.61, 0]} rotation={[0, Math.PI/2, 0]}>
                  <boxGeometry args={[1.51, 0.05, 0.3]} />
                  <meshStandardMaterial color="#f472b6" roughness={0.4} />
                </mesh>
                {/* Bow */}
                <mesh position={[0, 0.8, 0]}>
                  <torusGeometry args={[0.2, 0.05, 16, 32]} />
                  <meshStandardMaterial color="#ec4899" />
                </mesh>
              </group>
            </Float>
          </PresentationControls>
        </Canvas>
      </CanvasErrorBoundary>
    </div>

      <div className="absolute inset-0 z-10 flex flex-col items-center justify-center pointer-events-none">
        <motion.div 
          className="text-center p-8 backdrop-blur-sm bg-white/10 rounded-2xl border border-white/20 shadow-2xl pointer-events-auto"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <h1 className="text-3xl md:text-5xl font-serif text-white mb-8 leading-relaxed shadow-sm">
            Something sweet is waiting for <br />
            <span className="text-pink-300 font-bold tracking-wider">Miss Marshmallow ✨</span>
          </h1>
          
          <button 
            onClick={onStart}
            className="px-8 py-4 bg-pink-400 hover:bg-pink-500 text-white rounded-full font-semibold text-lg transition-all transform hover:scale-105 shadow-[0_0_20px_rgba(244,114,182,0.5)] cursor-pointer"
          >
            Open your surprise
          </button>
        </motion.div>
      </div>
    </motion.div>
  );
}
