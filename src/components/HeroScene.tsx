import React, { useRef, useEffect, useMemo, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture, Float, PerspectiveCamera, Html } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import * as THREE from "three";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { logoBase64 } from "../assets/logoBase64";

// Register GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

interface HeroSceneProps {
  isMobile: boolean;
}

// 1. Perspective Grid Floor Component (with custom GLSL shader)
function PerspectiveGrid({ isMobile }: { isMobile: boolean }) {
  const meshRef = useRef<THREE.Mesh>(null);

  const gridShader = useMemo(() => {
    return {
      vertexShader: `
        varying vec2 vUv;
        void main() {
          vUv = uv;
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec2 vUv;
        uniform vec3 uColor1;
        uniform vec3 uColor2;
        uniform float uScroll;
        uniform float uTime;
        uniform float uOpacity;

        void main() {
          // Adjust density based on UV
          float scaleX = 35.0;
          float scaleY = 25.0;
          
          float coordX = vUv.x * scaleX;
          // Slowly flow the grid forward in time and with scroll trigger scrubbing
          float coordY = (vUv.y - uScroll * 0.12 - uTime * 0.02) * scaleY;

          // Compute sharp, beautiful line grid pattern
          float gridX = abs(fract(coordX - 0.5) - 0.5) / fwidth(coordX);
          float gridY = abs(fract(coordY - 0.5) - 0.5) / fwidth(coordY);
          
          float lineX = 1.0 - min(gridX, 1.0);
          float lineY = 1.0 - min(gridY, 1.0);
          
          float intensity = max(lineX * 0.7, lineY);

          // Deep horizon fade-out
          float fade = smoothstep(1.0, 0.0, vUv.y);
          fade = pow(fade, 3.0); // Make grid disappear cleanly at the horizon

          // Blend neon green (color1) and cyan (color2) smoothly across the screen width
          vec3 neonColor = mix(uColor1, uColor2, vUv.x);
          
          // Boost brightness for bloom
          vec3 finalColor = neonColor * intensity * 1.8;

          gl_FragColor = vec4(finalColor, intensity * fade * uOpacity * 0.7);
        }
      `,
      uniforms: {
        uColor1: { value: new THREE.Color("#0066ff") }, // Cyber Blue
        uColor2: { value: new THREE.Color("#00f0ff") }, // Neon Cyan
        uScroll: { value: 0 },
        uTime: { value: 0 },
        uOpacity: { value: 1.0 }
      }
    };
  }, []);

  useFrame((state) => {
    if (meshRef.current) {
      const material = meshRef.current.material as THREE.ShaderMaterial;
      if (material && material.uniforms) {
        material.uniforms.uTime.value = state.clock.getElapsedTime();
      }
    }
  });

  return (
    <mesh 
      ref={meshRef}
      rotation={[-Math.PI / 2, 0, 0]} 
      position={[0, -2.0, 0]}
    >
      <planeGeometry args={[70, 70, 1, 1]} />
      <shaderMaterial
        vertexShader={gridShader.vertexShader}
        fragmentShader={gridShader.fragmentShader}
        uniforms={gridShader.uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}

// 2. Scene Contents with all meshes, lights, particles, and GSAP timelines
function SceneContent({ isMobile }: { isMobile: boolean }) {
  const { camera } = useThree();

  // Load the logo texture natively from our embedded base64 module (bulletproof against CORS/network/file corruption issues)
  const logoTexture = useMemo(() => {
    const img = new Image();
    img.src = logoBase64;
    const texture = new THREE.Texture(img);
    texture.minFilter = THREE.LinearFilter;
    texture.colorSpace = THREE.SRGBColorSpace;
    img.onload = () => {
      texture.needsUpdate = true;
    };
    img.onerror = (e) => {
      console.error("Failed to load base64 logo in WebGL:", e);
    };
    return texture;
  }, []);

  // Refs for tracking and GSAP scroll manipulations
  const logoGroupRef = useRef<THREE.Group>(null);
  const logoMeshRef = useRef<THREE.Mesh>(null);
  const gridMeshRef = useRef<THREE.Mesh>(null);

  // Parallax tracking in useFrame on the inner logo mesh (leaving GSAP free to control the outer group on scroll)
  useFrame((state) => {
    const mouseX = state.mouse.x; // [-1, 1]
    const mouseY = state.mouse.y; // [-1, 1]

    if (logoMeshRef.current) {
      logoMeshRef.current.position.x = THREE.MathUtils.lerp(
        logoMeshRef.current.position.x,
        mouseX * 0.3,
        0.05
      );
      logoMeshRef.current.position.y = THREE.MathUtils.lerp(
        logoMeshRef.current.position.y,
        mouseY * 0.2,
        0.05
      );
      // Extra 3D dynamic micro-rotation as mouse moves
      logoMeshRef.current.rotation.y = THREE.MathUtils.lerp(
        logoMeshRef.current.rotation.y,
        mouseX * 0.25,
        0.05
      );
      logoMeshRef.current.rotation.x = THREE.MathUtils.lerp(
        logoMeshRef.current.rotation.x,
        -mouseY * 0.15,
        0.05
      );
    }
  });

  // Setup GSAP ScrollTrigger timeline to scrub elements out on scroll
  useEffect(() => {
    if (!logoGroupRef.current || !camera) return;

    // Reset initial transforms to avoid hot-reload jumps
    logoGroupRef.current.position.set(0, 1.1, 0);
    logoGroupRef.current.scale.set(1, 1, 1);
    logoGroupRef.current.rotation.set(0, 0, 0);
    
    // Set initial camera position
    camera.position.set(0, 0.2, 5.8);

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#hero-trigger-container",
        start: "top top",
        end: "bottom bottom",
        scrub: 1.2, // Inertia scrub
      }
    });

    // A. Simply scale down the logo smoothly as we scroll
    tl.to(logoGroupRef.current.scale, {
      x: 0,
      y: 0,
      z: 0,
      ease: "power2.inOut"
    }, 0);

    if (logoMeshRef.current && logoMeshRef.current.material) {
      const mat = logoMeshRef.current.material as THREE.Material;
      tl.to(mat, {
        opacity: 0,
        ease: "power2.inOut"
      }, 0);
    }

    // B. Grid material opacity fades to 0
    if (gridMeshRef.current && gridMeshRef.current.material) {
      const mat = gridMeshRef.current.material as THREE.ShaderMaterial;
      tl.to(mat.uniforms.uOpacity, {
        value: 0,
        ease: "power2.inOut"
      }, 0);
      tl.to(mat.uniforms.uScroll, {
        value: 2.0,
        ease: "none"
      }, 0);
    }

    // C. DOM elements fading
    tl.to("#hero-text-container", {
      opacity: 0,
      scale: 0.5,
      y: -100,
      filter: "blur(12px)",
      ease: "power2.inOut"
    }, 0);

    tl.to("#scroll-indicator", {
      opacity: 0,
      y: 40,
      ease: "power1.out"
    }, 0);

    // D. Reveal main content (DOM) on scroll
    tl.fromTo("#main-content", 
      { 
        opacity: 0,
        y: 150,
        filter: "blur(12px)",
        scale: 0.96
      },
      { 
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        scale: 1,
        ease: "power4.out"
      }, 
      0.45 // Delay revealing content till scroll hits mid-way
    );

    return () => {
      // Cleanup this specific ScrollTrigger trigger instance
      ScrollTrigger.getAll().forEach((trigger) => {
        if ((trigger.trigger as any) === "#hero-trigger-container") {
          trigger.kill();
        }
      });
    };
  }, [camera]);

  return (
    <>
      {/* Dynamic Camera setup */}
      <PerspectiveCamera makeDefault position={[0, 0.2, 5.8]} fov={isMobile ? 65 : 52} />

      {/* Deep Cyber Black Background Scene Setup */}
      <color attach="background" args={["#000000"]} />

      {/* Perspective Grid Floor */}
      <group ref={gridMeshRef as any}>
        <PerspectiveGrid isMobile={isMobile} />
      </group>

      {/* Cinematic Ambient Lighting */}
      <ambientLight intensity={0.15} />

      {/* Glowing Cyber Blue Point Light behind Logo projection on Grid */}
      <pointLight 
        position={[0, 0.8, -0.6]} 
        color="#00f0ff" 
        intensity={4.0} 
        distance={7.0} 
        decay={2.0} 
      />

      {/* Dynamic Point Light from above highlighting elements */}
      <directionalLight 
        position={[0, 4, 2]} 
        intensity={0.6} 
        color="#00f0ff" 
      />

      {/* 3. CENTER-TOP: Metal logo.png Plane wrapped in Float for elegant bobbing */}
      <group ref={logoGroupRef}>
        <Float 
          speed={1.6} 
          rotationIntensity={0.35} 
          floatIntensity={0.4} 
          floatingRange={[-0.12, 0.12]}
        >
          <mesh ref={logoMeshRef}>
            <planeGeometry args={[1.7, 1.7]} />
            <meshBasicMaterial 
              map={logoTexture} 
              transparent={true} 
              toneMapped={false} 
              depthWrite={false}
            />
          </mesh>
        </Float>
      </group>

      {/* 5. COHESIVE TEXT LAYERS overlay using Drei's Html helper inside canvas */}
      <Html center position={[0, -0.1, 1.2]} className="pointer-events-none select-none text-center z-10">
        <div id="hero-text-container" className="flex flex-col items-center justify-center transition-all duration-300">
          <h1 
            className="font-montserrat font-extralight text-3xl sm:text-5xl tracking-[0.45em] text-white/95 mt-1 uppercase"
          >
            BIENVENIDO
          </h1>
        </div>
      </Html>

      {/* 6. Post-processing components for Cinematic Bloom, Vignette, and sutil grain Noise */}
      <EffectComposer multisampling={0}>
        <Bloom 
          intensity={1.4} 
          luminanceThreshold={0.12} 
          luminanceSmoothing={0.85} 
          mipmapBlur={true}
        />
        <Noise opacity={0.015} />
        <Vignette eskil={false} offset={0.12} darkness={1.0} />
      </EffectComposer>
    </>
  );
}

// Main Canvas Wrapper Component with WebGL detection and fallback
export default function HeroScene({ isMobile }: HeroSceneProps) {
  const [webGlSupported, setWebGlSupported] = useState<boolean | null>(null);

  useEffect(() => {
    try {
      const canvas = document.createElement("canvas");
      const support = !!(
        window.WebGLRenderingContext &&
        (canvas.getContext("webgl") || canvas.getContext("experimental-webgl"))
      );
      setWebGlSupported(support);
    } catch (e) {
      setWebGlSupported(false);
    }
  }, []);

  // While checking, render black
  if (webGlSupported === null) {
    return <div className="w-full h-full bg-black" />;
  }

  // Fallback beautiful static header if WebGL is not supported
  if (!webGlSupported) {
    return (
      <div className="w-full h-full relative flex flex-col items-center justify-center bg-black" id="hero-canvas-viewport">
        {/* Ambient grid background overlay */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.015)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.015)_1px,transparent_1px)] bg-[size:35px_35px] opacity-20" />
        <div className="absolute w-[300px] h-[300px] bg-blue-500/10 rounded-full blur-[120px]" />
        
        <div className="z-10 flex flex-col items-center text-center px-6">
          <img 
            src={logoBase64} 
            alt="Visionelitech Logo" 
            className="w-24 h-24 object-contain drop-shadow-[0_0_25px_rgba(0,240,255,0.35)] animate-pulse-slow mb-6"
          />
          <h1 className="font-montserrat font-extralight text-3xl sm:text-5xl tracking-[0.45em] text-white/95 uppercase">
            BIENVENIDO
          </h1>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative" id="hero-canvas-viewport">
      <Canvas 
        gl={{ 
          antialias: true, 
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
          depth: true
        }}
        className="w-full h-full"
        onError={() => setWebGlSupported(false)}
      >
        <React.Suspense fallback={null}>
          <SceneContent isMobile={isMobile} />
        </React.Suspense>
      </Canvas>
    </div>
  );
}
