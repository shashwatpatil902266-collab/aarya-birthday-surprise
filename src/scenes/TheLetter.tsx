import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MailOpen, Mail } from 'lucide-react';
import { config } from '../config';

export default function TheLetter({ onNext }: { onNext: () => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <motion.div 
      className="w-full h-full relative bg-pink-50 flex flex-col items-center justify-start p-4 py-8 md:p-12 md:py-12 overflow-y-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 1 } }}
    >
      <AnimatePresence mode="wait">
        {!isOpen ? (
          <motion.div
            key="envelope"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.2, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="cursor-pointer my-auto bg-white w-64 h-48 rounded-lg shadow-2xl flex flex-col items-center justify-center border-2 border-pink-200 hover:border-pink-400 transition-colors group relative overflow-hidden"
          >
            <div className="absolute top-0 w-0 h-0 border-l-[128px] border-l-transparent border-r-[128px] border-r-transparent border-t-[100px] border-t-pink-100 z-10"></div>
            <Mail className="text-pink-300 w-16 h-16 mt-4 group-hover:scale-110 transition-transform" />
            <span className="mt-4 font-serif text-pink-500 font-medium">Tap to open</span>
          </motion.div>
        ) : (
          <motion.div
            key="letter"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="bg-[#fcfaf5] w-full max-w-5xl rounded-sm shadow-2xl flex flex-col md:flex-row overflow-hidden my-auto"
            style={{
              // TODO: self-host this texture in /public once available, to avoid the external dependency
              backgroundImage: 'url("https://www.transparenttextures.com/patterns/handmade-paper.png")',
              boxShadow: '0 20px 50px rgba(0,0,0,0.1), inset 0 0 60px rgba(200,150,150,0.05)'
            }}
          >
            {/* Photo Section */}
            <div className="w-full md:w-2/5 p-6 md:p-8 bg-white/50 border-r border-pink-100/50 flex items-center justify-center">
              <div className="bg-white p-4 pb-12 shadow-md transform -rotate-2 w-full max-w-sm">
                <img 
                  src="/photos/01.jpg?v=2" 
                  alt="Us" 
                  className="w-full aspect-square object-cover bg-slate-200" 
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement!.innerHTML = '<div class="w-full aspect-square bg-slate-200 flex items-center justify-center text-slate-400 text-sm p-4 text-center">Place photo in /public/photos/01.jpg</div>';
                  }}
                />
              </div>
            </div>

            {/* Letter Section */}
            <div className="w-full md:w-3/5 p-6 md:p-12 relative flex flex-col justify-between md:min-h-[600px]">
              <div className="whitespace-pre-wrap font-handwriting text-slate-800 text-2xl sm:text-3xl md:text-4xl leading-relaxed">
                {config.letter}
              </div>
              
              <div className="mt-8 text-right">
                <p className="font-handwriting text-slate-600 text-2xl mb-1">Yours truly,</p>
                <p className="font-handwriting text-5xl text-pink-600 drop-shadow-sm">{config.sender}</p>
              </div>

              <div className="mt-12 pt-6 border-t-2 border-pink-200/50 text-center">
                <p className="font-serif text-pink-500/80 italic text-lg">
                  “No matter how crazy life gets, remember: your brother Aashu is always here for you.”
                </p>
              </div>

              <div className="mt-10 flex justify-center pb-4">
                <button
                  onClick={onNext}
                  className="px-8 py-3 bg-pink-400 hover:bg-pink-500 text-white rounded-full font-semibold shadow-md transition-transform transform hover:scale-105"
                >
                  Close Letter
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
