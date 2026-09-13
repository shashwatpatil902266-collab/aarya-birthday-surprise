import { useState, useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, Html, Sparkles, OrbitControls } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';

// Generate 15 photo placeholders, repeating 01-05
const photos = Array.from({ length: 15 }, (_, i) => ({
  id: i,
  url: `/photos/${String((i % 5) + 1).padStart(2, '0')}.jpg?v=2`,
}));

// Shuffle array
const shuffle = (array: any[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

function Polaroid({ url, position, rotation, active, onClick }: any) {
  const meshRef = useRef<THREE.Group>(null);
  
  useFrame(() => {
    if (active && meshRef.current) {
      meshRef.current.position.lerp(new THREE.Vector3(0, 0, 2), 0.1);
      meshRef.current.quaternion.slerp(new THREE.Quaternion(), 0.1);
    } else if (meshRef.current) {
      meshRef.current.position.lerp(position, 0.1);
      meshRef.current.quaternion.slerp(new THREE.Quaternion().setFromEuler(rotation), 0.1);
    }
  });

  return (
    <group ref={meshRef} position={position} rotation={rotation} onClick={(e) => { e.stopPropagation(); onClick(); }}>
      <Float speed={2} rotationIntensity={0.2} floatIntensity={0.5}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.5, 1.8, 0.05]} />
          <meshStandardMaterial color="#fce7f3" roughness={0.8} />
        </mesh>
        
        <Html transform position={[0, 0.1, 0.026]} distanceFactor={2} zIndexRange={[100, 0]}>
          <div className="w-[180px] h-[180px] bg-pink-100/50 flex items-center justify-center overflow-hidden pointer-events-none shadow-inner">
            <img 
              src={url} 
              alt="Memory" 
              className="w-full h-full object-cover" 
              onError={(e) => {
                e.currentTarget.style.display = 'none';
                e.currentTarget.parentElement!.innerHTML = '<span class="text-xs text-slate-400 font-mono text-center px-2">Place photo in /public/photos</span>';
              }} 
            />
          </div>
        </Html>
        <Html transform position={[0, -0.7, 0.026]} distanceFactor={2}>
          <div className="w-[180px] text-center pointer-events-none">
             {/* Optional caption space */}
          </div>
        </Html>
      </Float>
    </group>
  );
}

function Spiral({ shuffledPhotos }: { shuffledPhotos: any[] }) {
  const groupRef = useRef<THREE.Group>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useFrame(() => {
    if (groupRef.current && activeIndex === null) {
      groupRef.current.rotation.y += 0.002;
    }
  });

  const cards = useMemo(() => {
    return shuffledPhotos.map((photo, i) => {
      const angle = (i / shuffledPhotos.length) * Math.PI * 4; // 2 rotations
      const radius = 3 + Math.random();
      const y = (i - shuffledPhotos.length / 2) * 0.4;
      
      const x = Math.cos(angle) * radius;
      const z = Math.sin(angle) * radius;
      
      const pos = new THREE.Vector3(x, y, z);
      const euler = new THREE.Euler(0, -angle + Math.PI / 2, 0);

      return { photo, pos, euler };
    });
  }, [shuffledPhotos]);

  return (
    <group ref={groupRef} onClick={() => setActiveIndex(null)}>
      {cards.map((card, i) => (
        <Polaroid
          key={card.photo.id}
          url={card.photo.url}
          position={card.pos}
          rotation={card.euler}
          active={activeIndex === i}
          onClick={() => setActiveIndex(activeIndex === i ? null : i)}
        />
      ))}
    </group>
  );
}

export default function PhotoGalaxy({ onNext }: { onNext: () => void }) {
  const [shuffled] = useState(() => shuffle(photos));

  return (
    <motion.div 
      className="w-full h-full relative bg-pink-100"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      <div className="absolute inset-0 z-0">
        <Canvas camera={{ position: [0, 0, 8], fov: 60 }}>
          <ambientLight intensity={0.7} />
          <pointLight position={[10, 10, 10]} intensity={1} />
          <Sparkles count={300} scale={15} size={3} speed={0.2} opacity={0.4} color="#f9a8d4" />
          <Spiral shuffledPhotos={shuffled} />
          <OrbitControls enableZoom={false} enablePan={false} />
        </Canvas>
      </div>

      <div className="absolute bottom-10 left-0 right-0 z-10 flex justify-center pointer-events-none">
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 3 }}
          onClick={onNext}
          className="px-8 py-3 bg-pink-400 hover:bg-pink-500 text-white rounded-full font-semibold shadow-lg transition-transform transform hover:scale-105 pointer-events-auto"
        >
          Next surprise →
        </motion.button>
      </div>
      
      <div className="absolute top-10 w-full text-center z-10 pointer-events-none">
         <p className="text-pink-400 font-serif text-xl bg-white/50 inline-block px-4 py-1 rounded-full backdrop-blur-sm">Drag to look around. Tap a photo to view.</p>
      </div>
    </motion.div>
  );
}
