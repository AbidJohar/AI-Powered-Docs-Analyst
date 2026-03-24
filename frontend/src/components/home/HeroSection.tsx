import React, { useRef } from 'react';
import { Canvas, useFrame, extend, type ThreeElement } from '@react-three/fiber';
import { shaderMaterial } from '@react-three/drei';
import { Link } from 'react-router-dom';
import * as THREE from 'three';



// Create the Shader Material 
const DocsAnalystShaderMaterial = shaderMaterial(
    {
        uTime: 0,
        uMouse: new THREE.Vector2(0, 0),
        uResolution: new THREE.Vector2(1, 1),
    },
    // Vertex Shader
    `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = vec4(position, 1.0);
    }
  `,
    // Fragment Shader
    `
    uniform float uTime;
    uniform vec2 uMouse;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;
      
      // Interaction Logic
      float mouseDist = length(uv - (uMouse * 0.5 + 0.5)); // Map -1,1 to 0,1
      float mouseInfluence = smoothstep(0.5, 0.0, mouseDist);

      // AI "Neural" Flow Math
      float wave = sin(uv.x * 8.0 + uTime * 0.5 + mouseInfluence * 3.0);
      wave += cos(uv.y * 10.0 - uTime * 0.3);
      
      // Colors
      vec3 bgColor = vec3(0.02, 0.03, 0.08); 
      vec3 cyanGlow = vec3(0.0, 0.8, 0.9);
      vec3 purpleGlow = vec3(0.4, 0.1, 0.9);

      vec3 color = mix(bgColor, purpleGlow, wave * 0.2);
      color = mix(color, cyanGlow, mouseInfluence * 0.4);

      // Scanning Grid Effect
      float grid = step(0.98, fract(uv.x * 30.0)) + step(0.98, fract(uv.y * 30.0));
      color += grid * 0.05;

      gl_FragColor = vec4(color, 1.0);
    }
  `
);

// Register the custom material for JSX
extend({ DocsAnalystShaderMaterial });

// Add types to the JSX namespace
declare module '@react-three/fiber' {
    interface ThreeElements {
        docsAnalystShaderMaterial: ThreeElement<typeof DocsAnalystShaderMaterial>;
    }
}

const ShaderPlane: React.FC = () => {
    const materialRef = useRef<any>(null);

    useFrame((state) => {
        if (!materialRef.current) return;

        // Direct mutation for performance (avoiding React state)
        materialRef.current.uTime = state.clock.getElapsedTime();

        // Smoothly follow the mouse with a lerp factor of 0.05
        materialRef.current.uMouse.lerp(state.pointer, 0.05);
    });

    return (
        <mesh>
            <planeGeometry args={[2, 2]} />
            <docsAnalystShaderMaterial ref={materialRef} />
        </mesh>
    );
};

const HeroSection: React.FC = () => {
    return (
        <div className="relative w-full h-screen bg-[#050814] overflow-hidden text-white font-sans">
            {/* BACKGROUND: WebGL Layer */}
            <div className="absolute inset-0 z-0">
                <Canvas
                    camera={{ position: [0, 0, 1] }}
                    gl={{ antialias: false, powerPreference: "high-performance" }}
                    dpr={[1, 2]} // Support high-res displays without killing perf
                >
                    <ShaderPlane />
                </Canvas>
            </div>

            {/* FOREGROUND: UI Layer */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full max-w-6xl px-6 mx-auto text-center pointer-events-none">
                <div className="px-4 py-1 mb-8 text-xs font-bold tracking-[0.2em] uppercase border rounded-full bg-cyan-500/5 text-cyan-400 border-cyan-500/20">
                    Neural Document Engine 
                </div>

                <h1 className="mb-6 text-6xl md:text-8xl font-extrabold tracking-tighter">
                    <span className="b  text-white/50 [text-shadow:0_4px_8px_rgba(0,0,0,0.5)]">
                        Analysis at the
                    </span> <br />
                    <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 via-blue-500 to-purple-600">
                        Speed of Thought.
                    </span>
                </h1>

                <p className="max-w-xl mb-14 text-lg md:text-xl text-slate-400 leading-relaxed">
                    Transform PDFs, spreadsheets, and text files into concise summaries using AI.
                    Query your documents to quickly retrieve specific insights without manual reading.
                </p>

                <div className="flex flex-col sm:flex-row gap-5 mt-3 pointer-events-auto">
                    <Link  to="/chat-panel" className="px-10 py-4 font-bold text-black transition-all bg-white rounded-full hover:bg-cyan-400 hover:scale-105 active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                        Analyze Now ( Free )
                    </Link>

                </div>
            </div>

            {/* Aesthetic Grain Overlay */}
            <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />
        </div>
    );
};

export default HeroSection;