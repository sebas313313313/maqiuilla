import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { ChevronLeft, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const AnnouncementBanner = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      try {
        const res = await axios.get('/api/announcements');
        setAnnouncements(res.data);
      } catch (error) {
        console.error('Error fetching announcements:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  useEffect(() => {
    if (announcements.length <= 1) return;
    
    const interval = setInterval(() => {
      handleNext();
    }, 6000); // Cambia cada 6 segundos

    return () => clearInterval(interval);
  }, [announcements, currentIndex]);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % announcements.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + announcements.length) % announcements.length);
  };

  if (loading || announcements.length === 0) return null;

  const current = announcements[currentIndex];

  return (
    <div className="relative w-full bg-gradient-to-r from-[#C4638A]/20 via-[#F3E8F0]/40 to-[#C4638A]/20 border-b border-[#F3E8F0]/40 py-3.5 px-4 overflow-hidden select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between text-center relative z-10">
        
        {/* Navigation Buttons for desktop */}
        {announcements.length > 1 && (
          <button 
            onClick={handlePrev}
            className="hidden md:flex p-1.5 rounded-full hover:bg-white/50 text-primary transition-all duration-300"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>
        )}

        {/* Content with elegant animations */}
        <div className="flex-1 flex flex-col md:flex-row items-center justify-center gap-1.5 md:gap-3">
          <AnimatePresence mode="wait">
            <motion.div
              key={current._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4 }}
              className="flex flex-col md:flex-row items-center gap-2 md:gap-4"
            >
              {current.image && (
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-primary/50 overflow-hidden shadow-sm shrink-0">
                  <img src={current.image} alt="Anuncio" className="w-full h-full object-cover" />
                </div>
              )}
              <div className="flex flex-col md:flex-row items-center gap-2">
                <div className="flex items-center gap-1.5 bg-primary/20 text-primary-dark px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                  <Sparkles className="w-3 h-3 animate-spin" /> Anuncio
                </div>
                <span className="font-semibold text-dark text-sm md:text-base">
                  {current.title}
                </span>
                {current.description && (
                  <span className="text-gray-600 text-xs md:text-sm border-t md:border-t-0 md:border-l border-primary/30 pt-1 md:pt-0 md:pl-3">
                    {current.description}
                  </span>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {announcements.length > 1 && (
          <button 
            onClick={handleNext}
            className="hidden md:flex p-1.5 rounded-full hover:bg-white/50 text-primary transition-all duration-300"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Elegant Dots indicators */}
      {announcements.length > 1 && (
        <div className="flex justify-center gap-1.5 mt-2">
          {announcements.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === currentIndex ? 'w-4 bg-primary' : 'w-1.5 bg-primary/30'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default AnnouncementBanner;
