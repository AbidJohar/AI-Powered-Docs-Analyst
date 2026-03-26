import { useNavigate } from "react-router-dom";
import { useEffect, useRef } from "react";

const NotFoundPage = () => {
  const navigate = useNavigate();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: {
      x: number; y: number; vx: number; vy: number;
      size: number; alpha: number; color: string;
    }[] = [];

    const colors = ["#06b6d4", "#818cf8", "#a78bfa", "#22d3ee"];

    for (let i = 0; i < 80; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        size: Math.random() * 2 + 0.5,
        alpha: Math.random() * 0.5 + 0.1,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.color + Math.floor(p.alpha * 255).toString(16).padStart(2, "0");
        ctx.fill();
      });

      // Draw connections
      particles.forEach((a, i) => {
        particles.slice(i + 1).forEach((b) => {
          const dist = Math.hypot(a.x - b.x, a.y - b.y);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(a.x, a.y);
            ctx.lineTo(b.x, b.y);
            ctx.strokeStyle = `rgba(6,182,212,${0.08 * (1 - dist / 120)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        });
      });

      animId = requestAnimationFrame(animate);
    };
    animate();

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", resize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <div className="relative flex h-screen w-full items-center justify-center bg-[#08060d] overflow-hidden">
      {/* Particle canvas */}
      <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

      {/* Ambient glow blobs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-cyan-500/5 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-violet-500/5 rounded-full blur-3xl animate-pulse delay-1000" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center text-center px-6">
        
        {/* Glitchy 404 */}
        <div className="relative select-none mb-2">
          <span
            className="text-[6rem] md:text-[8rem] font-black leading-none tracking-tighter text-transparent bg-clip-text"
            style={{
              backgroundImage: "linear-gradient(135deg, #06b6d4 0%, #818cf8 50%, #a78bfa 100%)",
              WebkitBackgroundClip: "text",
              animation: "glitch 4s infinite",
            }}
          >
            404
          </span>

          {/* Glitch layers */}
          <span
            className="absolute inset-0 text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-cyan-400/20"
            style={{ animation: "glitch-1 4s infinite", clipPath: "polygon(0 20%, 100% 20%, 100% 40%, 0 40%)" }}
            aria-hidden
          >
            404
          </span>
          <span
            className="absolute inset-0 text-[10rem] md:text-[14rem] font-black leading-none tracking-tighter text-violet-400/20"
            style={{ animation: "glitch-2 4s infinite", clipPath: "polygon(0 60%, 100% 60%, 100% 80%, 0 80%)" }}
            aria-hidden
          >
            404
          </span>
        </div>

        {/* Divider line */}
        <div className="w-24 h-px bg-linear-to-r from-transparent via-cyan-500 to-transparent mb-2 animate-pulse" />

        {/* Text */}
        <h1 className="text-white text-2xl md:text-3xl font-bold tracking-tight mb-3">
          Page not found
        </h1>
        <p className="text-slate-500 text-sm md:text-base max-w-sm leading-relaxed mb-10">
          The page you're looking for has drifted into the void. Let's get you back.
        </p>

        {/* Buttons */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate(-1)}
            className="px-6 py-2.5 rounded-xl border border-white/10 text-slate-400 text-sm font-medium hover:bg-white/5 hover:text-white transition-all"
          >
            Go back
          </button>
          <button
            onClick={() => navigate("/")}
            className="px-6 py-2.5 rounded-xl bg-cyan-500 text-black text-sm font-bold hover:bg-cyan-400 transition-all"
          >
            Home
          </button>
        </div>

      </div>

      <style>{`
        @keyframes glitch {
          0%, 90%, 100% { transform: translate(0); }
          92% { transform: translate(-3px, 1px); }
          94% { transform: translate(3px, -1px); }
          96% { transform: translate(-2px, 2px); }
          98% { transform: translate(2px, -2px); }
        }
        @keyframes glitch-1 {
          0%, 90%, 100% { transform: translate(0); opacity: 0; }
          92% { transform: translate(6px, 0); opacity: 1; }
          94% { transform: translate(-6px, 0); opacity: 1; }
          96% { opacity: 0; }
        }
        @keyframes glitch-2 {
          0%, 90%, 100% { transform: translate(0); opacity: 0; }
          93% { transform: translate(-4px, 0); opacity: 1; }
          95% { transform: translate(4px, 0); opacity: 1; }
          97% { opacity: 0; }
        }
      `}</style>
    </div>
  );
};

export default NotFoundPage;