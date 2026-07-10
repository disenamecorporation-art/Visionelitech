import React, { useState, useEffect, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { CAROUSEL_SLIDES } from "../data";
import { cyberSound } from "./CyberSound";

interface HeroSliderProps {
  onSelectDetails: (detailsId: string) => void;
  imageUrls: { slide1: string; slide2: string; slide3: string };
}

export default function HeroSlider({ onSelectDetails, imageUrls }: HeroSliderProps) {
  const slides = CAROUSEL_SLIDES(imageUrls);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0); // -1 for left, 1 for right
  const autoPlayTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Auto-cycling
  useEffect(() => {
    autoPlayTimerRef.current = setInterval(() => {
      handleNext();
    }, 6000); // 6 seconds per slide

    return () => {
      if (autoPlayTimerRef.current) clearInterval(autoPlayTimerRef.current);
    };
  }, [currentIndex]);

  const handlePrev = () => {
    cyberSound.playSweep();
    setDirection(-1);
    setCurrentIndex((prevIndex) => (prevIndex === 0 ? slides.length - 1 : prevIndex - 1));
  };

  const handleNext = () => {
    cyberSound.playSweep();
    setDirection(1);
    setCurrentIndex((prevIndex) => (prevIndex === slides.length - 1 ? 0 : prevIndex + 1));
  };

  const handleDotClick = (index: number) => {
    cyberSound.playClick();
    setDirection(index > currentIndex ? 1 : -1);
    setCurrentIndex(index);
  };

  const currentSlide = slides[currentIndex];

  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 300 : -300,
      opacity: 0,
      scale: 0.98
    }),
    center: {
      x: 0,
      opacity: 1,
      scale: 1,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    },
    exit: (dir: number) => ({
      x: dir > 0 ? -300 : 300,
      opacity: 0,
      scale: 0.98,
      transition: {
        x: { type: "spring", stiffness: 300, damping: 30 },
        opacity: { duration: 0.4 },
        scale: { duration: 0.4 }
      }
    })
  };

  return (
    <div
      className="relative w-full max-w-[1290px] mx-auto px-4 md:px-0 pt-28 pb-8 flex flex-col items-center"
      id="hero-slider-section"
    >
      {/* Slider Container with fixed aspect ratio/size 1290x500 */}
      <div 
        className="w-full h-[220px] sm:h-[350px] md:h-[500px] rounded-[24px] border border-white/10 bg-black overflow-hidden relative shadow-[0_25px_60px_-15px_rgba(0,0,0,0.9)] group"
        id="slider-stage"
      >
        <AnimatePresence initial={false} custom={direction} mode="wait">
          <motion.div
            key={currentSlide.id}
            custom={direction}
            variants={slideVariants}
            initial="enter"
            animate="center"
            exit="exit"
            className="absolute inset-0 w-full h-full"
          >
            <img
              src={currentSlide.image}
              alt={`Slide ${currentSlide.id}`}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover transition-transform duration-[10000ms] ease-out scale-100 hover:scale-[1.05]"
            />
          </motion.div>
        </AnimatePresence>

        {/* CHEVRON MANUAL CONTROLS */}
        <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 flex justify-between pointer-events-none z-30 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handlePrev}
            onMouseEnter={() => cyberSound.playHover()}
            className="w-10 h-10 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all duration-300 cursor-pointer pointer-events-auto hover:scale-105 active:scale-95 shadow-lg"
            id="slider-prev-btn"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            onClick={handleNext}
            onMouseEnter={() => cyberSound.playHover()}
            className="w-10 h-10 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center text-gray-400 hover:text-white hover:border-white/30 transition-all duration-300 cursor-pointer pointer-events-auto hover:scale-105 active:scale-95 shadow-lg"
            id="slider-next-btn"
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* PAGINATION DOTS overlayed at bottom */}
        <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 bg-black/40 backdrop-blur-md border border-white/10 rounded-full px-4 py-2 shadow-[0_4px_12px_rgba(0,0,0,0.5)]">
          {slides.map((slide, idx) => {
            const isActive = currentIndex === idx;
            return (
              <button
                key={slide.id}
                onClick={() => handleDotClick(idx)}
                onMouseEnter={() => cyberSound.playHover()}
                className={`w-2.5 h-2.5 rounded-full transition-all duration-300 cursor-pointer relative ${
                  isActive
                    ? "bg-blue-400 border-blue-400 shadow-[0_0_8px_#60a5fa] scale-110"
                    : "bg-white/20 hover:bg-white/40"
                }`}
                title={`Ver Slide 0${slide.id}`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
