import React, { useEffect, useState } from "react";
import { useProgress } from "@react-three/drei";
import { logoBase64 } from "../assets/logoBase64";

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

      <div className="space-y-4 text-center max-w-sm w-full px-8 relative z-10">
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

        <div className="flex justify-center items-center text-sans text-[11px] text-white/50 font-mono tracking-widest">
          <span>{percentage}%</span>
        </div>
      </div>
    </div>
  );
}
