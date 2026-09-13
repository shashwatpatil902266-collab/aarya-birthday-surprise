import { useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Sparkles } from 'lucide-react';

const rotations = [-7, 5, -3, 7, -5, 4, -6, 3, -4, 6, -2];

const photos = Array.from({ length: 11 }, (_, index) => ({
  id: index,
  url: `/photos/${String(index + 1).padStart(2, '0')}.jpg`,
  label: `Memory ${index + 1}`,
  rotation: rotations[index],
}));

export default function PhotoGalaxy({ onNext }: { onNext: () => void }) {
  const [activePhoto, setActivePhoto] = useState(0);

  return (
    <motion.section
      className="relative flex h-full w-full flex-col items-center overflow-y-auto bg-slate-950 px-4 pb-28 pt-20 text-white md:justify-center md:pb-24 md:pt-16"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45 } }}
    >
      <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -left-24 top-1/4 h-72 w-72 rounded-full bg-pink-500/25 blur-3xl" />
        <div className="absolute -right-24 bottom-0 h-80 w-80 rounded-full bg-violet-500/25 blur-3xl" />
        <div className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgba(255,255,255,.8)_1px,transparent_1px)] [background-size:28px_28px]" />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-5xl">
        <div className="mb-6 text-center md:mb-9">
          <p className="mb-2 flex items-center justify-center gap-2 text-xs font-semibold uppercase tracking-[0.26em] text-pink-200">
            <Sparkles size={15} /> a little constellation of us <Sparkles size={15} />
          </p>
          <h2 className="font-serif text-3xl font-bold text-white md:text-5xl">Memory Galaxy</h2>
          <p className="mt-2 text-sm text-violet-100 md:text-base">Tap a photo to bring that moment into focus.</p>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1.1fr_.9fr] lg:items-center lg:gap-10">
          <motion.figure
            key={activePhoto}
            initial={{ opacity: 0, scale: 0.96, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ type: 'spring', stiffness: 180, damping: 18 }}
            className="relative mx-auto w-full max-w-sm rounded-sm bg-white p-3 pb-10 text-slate-700 shadow-[0_28px_70px_rgba(0,0,0,.45)]"
          >
            <img src={photos[activePhoto].url} alt={photos[activePhoto].label} className="aspect-[3/4] w-full rounded-sm object-cover" />
            <figcaption className="absolute inset-x-0 bottom-3 text-center font-handwriting text-2xl text-pink-500">A moment to keep forever</figcaption>
            <Heart className="absolute right-5 top-5 fill-pink-400 text-pink-400 drop-shadow-md" size={25} aria-hidden="true" />
          </motion.figure>

          <div className="grid grid-cols-4 gap-2 sm:grid-cols-6 sm:gap-3 lg:grid-cols-3">
            {photos.map((photo, index) => {
              const active = activePhoto === index;
              return (
                <motion.button
                  type="button"
                  key={photo.id}
                  onClick={() => setActivePhoto(index)}
                  aria-label={`Show ${photo.label}`}
                  aria-pressed={active}
                  whileHover={{ y: -7, rotate: 0 }}
                  whileTap={{ scale: 0.96 }}
                  className={`relative overflow-hidden rounded-xl border-2 bg-white p-1 shadow-xl transition ${active ? 'border-pink-300 ring-4 ring-pink-300/30' : 'border-white/70 opacity-75 hover:opacity-100'}`}
                  style={{ rotate: `${photo.rotation}deg` }}
                >
                  <img src={photo.url} alt="" className="aspect-[3/4] w-full object-cover" />
                  {active && <span className="absolute inset-x-1 bottom-1 rounded-b-lg bg-pink-500/90 py-1 text-[10px] font-bold uppercase tracking-wider text-white">In focus</span>}
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>

      <motion.button
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        type="button"
        onClick={onNext}
        className="fixed bottom-6 z-20 rounded-full bg-pink-400 px-7 py-3 font-semibold text-white shadow-[0_0_24px_rgba(244,114,182,.55)] transition hover:scale-105 hover:bg-pink-500"
      >
        Next surprise <span aria-hidden="true">→</span>
      </motion.button>
    </motion.section>
  );
}
