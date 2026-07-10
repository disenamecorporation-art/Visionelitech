import React, { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";

interface LoadingScreenProps {
  onFinished: () => void;
}

export default function LoadingScreen({ onFinished }: LoadingScreenProps) {
  const { progress, active } = useProgress();
  const [visible, setVisible] = useState(true);
  const [percentage, setPercentage] = useState(0);

  // Smoothly interpolate percentage for high-end aesthetic feedback
  useEffect(() => {
    let animationFrame: number;
    const target = Math.min(100, Math.floor(progress));
    
    const updateProgress = () => {
      setPercentage((prev) => {
        if (prev < target) {
          const diff = target - prev;
          const step = Math.max(1, Math.ceil(diff * 0.1)); // smooth lerp step
          return prev + step;
        }
        return prev;
      });
      animationFrame = requestAnimationFrame(updateProgress);
    };

    updateProgress();
    return () => cancelAnimationFrame(animationFrame);
  }, [progress]);

  useEffect(() => {
    // When progress hits 100% and loading has completed, delay fade out slightly for solid UX
    if (percentage >= 100 && !active) {
      const timer = setTimeout(() => {
        setVisible(false);
        onFinished();
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [percentage, active, onFinished]);

  // Safety fallback: force fade out of loading screen after 3.5 seconds
  // to guarantee the user gets inside the experience even on slow or WebGL-failing browsers
  useEffect(() => {
    const safetyTimer = setTimeout(() => {
      setVisible(false);
      onFinished();
    }, 3500);

    return () => clearTimeout(safetyTimer);
  }, [onFinished]);

  if (!visible) return null;

  return (
    <div 
      className={`fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center transition-all duration-1000 ease-in-out`}
      style={{
        opacity: percentage >= 100 && !active ? 0 : 1,
        pointerEvents: percentage >= 100 && !active ? "none" : "all"
      }}
      id="vision-experience-loader"
    >
      {/* Background cinematic particle visual noise */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:35px_35px] pointer-events-none opacity-40" />
      <div className="absolute w-[300px] h-[300px] bg-[#00ff66]/5 rounded-full blur-[100px] animate-pulse pointer-events-none" />

      <div className="space-y-6 text-center max-w-sm w-full px-8 relative z-10">
        {/* Animated metallic-style branding node */}
        <div 
          className="relative w-16 h-16 mx-auto flex items-center justify-center rounded-2xl bg-black/40 border border-white/10 shadow-[0_0_25px_rgba(59,130,246,0.3)] animate-[cyberPulse_3s_infinite_ease-in-out]"
          id="loading-logo"
        >
          <img 
            src="/assets/icono.png" 
            alt="Logo" 
            className="w-11 h-11 object-contain drop-shadow-[0_0_12px_rgba(0,240,255,0.45)]"
          />
        </div>
        
        <div className="space-y-2">
          <span className="font-sans text-[9px] text-[#00f0ff] tracking-[0.4em] block uppercase font-bold animate-pulse">
            SISTEMA DE ULTRA-VANGUARDIA
          </span>
          <h3 className="font-sans font-bold text-xs text-white tracking-[0.2em] uppercase">
            Cargando experiencia...
          </h3>
        </div>

        {/* Neon Progress Bar Wrapper */}
        <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden relative border border-white/5 shadow-[0_0_10px_rgba(0,0,0,0.8)]">
          <div 
            className="h-full bg-gradient-to-r from-blue-500 via-emerald-500 to-green-400 rounded-full transition-all duration-300 ease-out"
            style={{ 
              width: `${percentage}%`,
              boxShadow: "0 0 10px rgba(16,185,129,0.9)"
            }}
          />
        </div>

        <div className="flex justify-between items-center text-sans text-[10px] text-white/30 font-mono tracking-wider px-1">
          <span>SECURE PROTOCOL</span>
          <span>{percentage}%</span>
        </div>
      </div>
    </div>
  );
}
