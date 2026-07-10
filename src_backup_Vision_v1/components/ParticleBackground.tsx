import React, { useEffect, useRef } from "react";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  color: string;
  alpha: number;
  decay: number;
}

export default function ParticleBackground() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = container.clientWidth;
    let height = container.clientHeight;

    canvas.width = width;
    canvas.height = height;

    const particles: Particle[] = [];
    const colors = [
      "rgba(59, 130, 246, 0.6)",   // electric blue
      "rgba(168, 85, 247, 0.6)",  // deep purple
      "rgba(236, 72, 153, 0.6)",   // hot pink
      "rgba(132, 204, 22, 0.6)",   // lime green
      "rgba(234, 179, 8, 0.6)"     // neon yellow
    ];

    // Initialize particles
    const particleCount = Math.min(60, Math.floor((width * height) / 25000));
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        radius: Math.random() * 2 + 1,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: Math.random() * 0.5 + 0.2,
        decay: Math.random() * 0.005 + 0.002
      });
    }

    // Function to draw hexagon grid
    const drawHexGrid = (context: CanvasRenderingContext2D, w: number, h: number) => {
      context.strokeStyle = "rgba(168, 85, 247, 0.035)"; // subtle purple glow
      context.lineWidth = 1;
      const r = 40; // hex radius
      const hexWidth = r * Math.sqrt(3);
      const hexHeight = r * 1.5;

      for (let y = -r; y < h + r; y += hexHeight) {
        const isOffset = Math.floor(y / hexHeight) % 2 === 0;
        const xOffset = isOffset ? hexWidth / 2 : 0;
        for (let x = -hexWidth; x < w + hexWidth; x += hexWidth) {
          const cx = x + xOffset;
          const cy = y;

          context.beginPath();
          for (let side = 0; side < 6; side++) {
            const angle = (side * Math.PI) / 3;
            const px = cx + r * Math.cos(angle);
            const py = cy + r * Math.sin(angle);
            if (side === 0) {
              context.moveTo(px, py);
            } else {
              context.lineTo(px, py);
            }
          }
          context.closePath();
          context.stroke();
        }
      }
    };

    const animate = () => {
      // Clear with dark, slightly translucent black to create a tail trail effect
      ctx.fillStyle = "rgba(0, 0, 0, 0.15)";
      ctx.fillRect(0, 0, width, height);

      // Update and draw particles
      particles.forEach((p, idx) => {
        p.x += p.vx;
        p.y += p.vy;

        // Bounce from edges with smooth wrapping
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.shadowBlur = 10;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.shadowBlur = 0; // reset shadow

        // Link close particles
        for (let j = idx + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dist = Math.hypot(p.x - p2.x, p.y - p2.y);
          if (dist < 100) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            // Gradient connecting line using neutral soft white/blue instead of purple
            ctx.strokeStyle = `rgba(255, 255, 255, ${0.05 * (1 - dist / 100)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };

    animate();

    // Use ResizeObserver as instructed in Responsive Design Guidelines
    const resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { width: newWidth, height: newHeight } = entry.contentRect;
        width = newWidth;
        height = newHeight;
        if (canvas) {
          canvas.width = newWidth;
          canvas.height = newHeight;
        }
      }
    });

    resizeObserver.observe(container);

    return () => {
      cancelAnimationFrame(animationFrameId);
      resizeObserver.disconnect();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 w-full h-full overflow-hidden bg-black"
      style={{ zIndex: 0 }}
      id="particles-canvas-container"
    >
      {/* Real-time interactive particles & subtle hexagon canvas */}
      <canvas ref={canvasRef} className="block w-full h-full pointer-events-none relative z-10" />
    </div>
  );
}
