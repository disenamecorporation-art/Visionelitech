import React from "react";

export default function ParticleBackground() {
  return (
    <div
      className="absolute inset-0 w-full h-full bg-black pointer-events-none"
      style={{ zIndex: 0 }}
      id="particles-canvas-container"
    >
      {/* Pure clean elegant black theme */}
    </div>
  );
}

