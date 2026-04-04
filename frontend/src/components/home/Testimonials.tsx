import { useEffect, useRef, useState } from "react";

const testimonials = [
  { name: "Sarah Chen", role: "Senior Legal Counsel", company: "Apex Legal Group", avatar: "SC", color: "#6366f1", bg: "rgba(99,102,241,0.12)", quote: "DocAnalyst cut our contract review time from 4 hours to 20 minutes. It flags risks I might have missed and the summaries are always spot-on. It's become indispensable for our team." },
  { name: "Marcus Webb", role: "VP of Finance", company: "Meridian Capital", avatar: "MW", color: "#0ea5e9", bg: "rgba(14,165,233,0.12)", quote: "Processing 200+ page financial reports used to take our analysts entire days. Now it's done before morning standup. The accuracy is remarkable — better than junior analysts frankly." },
  { name: "Dr. Priya Nair", role: "Research Director", company: "BioNex Institute", avatar: "PN", color: "#10b981", bg: "rgba(16,185,129,0.12)", quote: "We process thousands of research papers per quarter. DocAnalyst helps us synthesize findings across studies in ways that simply weren't possible before. It's transformed our literature reviews." },
  { name: "James Okafor", role: "Operations Manager", company: "GlobalFlow Logistics", avatar: "JO", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", quote: "Custom clearance documents, supplier contracts, compliance certs — DocAnalyst handles them all. We've eliminated an entire data entry role and redirected that person to higher-value work." },
  { name: "Lisa Tanaka", role: "Real Estate Attorney", company: "Tanaka & Associates", avatar: "LT", color: "#ec4899", bg: "rgba(236,72,153,0.12)", quote: "Title documents and lease agreements are notoriously dense. DocAnalyst pulls out exactly what I need — dates, obligations, easements — instantly. My clients love the fast turnaround." },
  { name: "Rafael Souza", role: "Compliance Officer", company: "Nexus Bank", avatar: "RS", color: "#8b5cf6", bg: "rgba(139,92,246,0.12)", quote: "Regulatory documents are complex and high-stakes. DocAnalyst not only understands the language, it flags policy gaps and produces audit-ready reports. Our regulators have been impressed." },
];

// Duplicate for seamless infinite loop
const row1 = [...testimonials, ...testimonials];
const row2 = [...testimonials.slice(3), ...testimonials.slice(0, 3), ...testimonials.slice(3), ...testimonials.slice(0, 3)];

function Stars() {
  return (
    <div style={{ display: "flex", gap: "2px", marginBottom: "0.75rem" }}>
      {[...Array(5)].map((_, i) => (
        <svg key={i} width="14" height="14" viewBox="0 0 24 24" fill="#f59e0b">
          <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
        </svg>
      ))}
    </div>
  );
}

function TestimonialCard({ t, style }: { t: typeof testimonials[0]; style?: React.CSSProperties }) {
  const [hovered, setHovered] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        flexShrink: 0,
        width: "340px",
        padding: "1.5rem",
        borderRadius: "16px",
        border: `1px solid ${hovered ? t.color + "55" : "rgba(255,255,255,0.07)"}`,
        background: hovered ? `rgba(255,255,255,0.04)` : "rgba(255,255,255,0.02)",
        backdropFilter: "blur(12px)",
        boxShadow: hovered ? `0 20px 60px ${t.color}22, 0 0 0 1px ${t.color}22` : "none",
        transform: hovered ? "translateY(-6px) scale(1.02)" : "translateY(0) scale(1)",
        transition: "all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)",
        cursor: "default",
        ...style,
      }}
    >
      <Stars />
      <p style={{ fontSize: "0.88rem", color: "rgba(255,255,255,0.55)", lineHeight: 1.75, margin: "0 0 1.25rem", fontStyle: "italic" }}>"{t.quote}"</p>
      <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
        <div style={{
          width: "38px", height: "38px", borderRadius: "50%",
          background: t.bg, display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "0.75rem", fontWeight: 700,
          color: t.color, flexShrink: 0,
          boxShadow: hovered ? `0 0 12px ${t.color}55` : "none",
          transition: "box-shadow 0.3s ease",
        }}>{t.avatar}</div>
        <div>
          <div style={{ fontSize: "0.875rem", fontWeight: 600, color: "#fff" }}>{t.name}</div>
          <div style={{ fontSize: "0.78rem", color: "rgba(255,255,255,0.4)" }}>{t.role} · {t.company}</div>
        </div>
      </div>
    </div>
  );
}

function MarqueeRow({ items, duration, reverse = false, paused }: {
  items: typeof testimonials;
  duration: number;
  reverse?: boolean;
  paused: boolean;
}) {
  return (
    <div style={{ overflow: "hidden", width: "100%", position: "relative", padding: "2rem 0rem" }}>
      <div style={{
        display: "flex",
        gap: "1.25rem",
        width: "max-content",
        animation: `${reverse ? "marqueeReverse" : "marquee"} ${duration}s linear infinite`,
        animationPlayState: paused ? "paused" : "running",
      }}>
        {items.map((t, i) => (
          <TestimonialCard key={i} t={t} />
        ))}
      </div>
    </div>
  );
}

export default function Testimonials() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } },
      { threshold: 0.1 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ padding: "3rem 0rem", background: "#050814", overflow: "hidden" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />

      <style>{`
        @keyframes marquee {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marqueeReverse {
          0%   { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>

      {/* Header */}
      <div style={{
        textAlign: "center", marginBottom: "4rem", padding: "0 1.5rem",
        opacity: visible ? 1 : 0,
        animation: visible ? "fadeSlideUp 0.7s ease forwards" : "none",
      }}>
        <span style={{
          display: "inline-block", background: "rgba(99,102,241,0.1)", color: "#6366f1",
          fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em",
          textTransform: "uppercase", padding: "0.4rem 1rem", borderRadius: "100px", marginBottom: "1rem"
        }}>Testimonials</span>
        <h2 style={{
          fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800,
          fontFamily: "'Syne', sans-serif", margin: "0 0 1rem",
          lineHeight: 1.15, color: "rgba(255,255,255,0.4)"
        }}>
          Trusted by professionals<br />across every industry
        </h2>
        <p style={{ color: "rgba(255,255,255,0.4)", fontSize: "1rem" }}>
          Hover to pause · {testimonials.length} reviews
        </p>
      </div>

      {/* Marquee Rows */}
      <div
        onMouseEnter={() => setPaused(true)}
        onMouseLeave={() => setPaused(false)}
        style={{
          display: "flex", flexDirection: "column", gap: "1.25rem",
          opacity: visible ? 1 : 0, transition: "opacity 0.8s ease 0.3s"
        }}
      >
        {/* Row 1 — left to right scroll (standard) */}
        <MarqueeRow  items={row1} duration={38} paused={paused} />

        {/* Row 2 — right to left (reverse) */}
        <MarqueeRow items={row2} duration={32} reverse paused={paused} />
      </div>

    </section>
  );
}