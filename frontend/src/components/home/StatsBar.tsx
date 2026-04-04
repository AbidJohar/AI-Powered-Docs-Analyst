import { useEffect, useRef, useState } from "react";

const stats = [
  { value: 22, suffix: "+", label: "Documents Analyzed" },
  { value: 91, suffix: "%", label: "Accuracy Rate" },
  { value: 4, suffix: "+", label: "File Formats Supported" },
  { value: 15, suffix: "x", label: "Faster Than Manual Review" },
];

function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number | null = null;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      setCount(Math.floor(progress * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [target, duration, start]);
  return count;
}

function StatItem({ value, suffix, label, index, animate }: { value: number; suffix: string; label: string; index: number; animate: boolean }) {
  const count = useCountUp(value, 1800, animate);
  return (
    <div
      className="stat-item"
      style={{
        textAlign: "center",
        padding: "0rem 1.5rem",
        opacity: animate ? 1 : 0,
        transform: animate ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s`,
        flex: "1 1 150px",
      }}
    >
      <div style={{ fontSize: "2rem", fontWeight: 700, fontFamily: "'Syne', sans-serif", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", lineHeight: 1 }}>
        {count}{suffix}
      </div>
      <div style={{ marginTop: "0.5rem", fontSize: "0.675rem", color: "var(--color-text-secondary)", letterSpacing: "0.05em", textTransform: "uppercase", fontWeight: 500 }}>
        {label}
      </div>
    </div>
  );
}

export default function StatsBar() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.3 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ background: "var(--color-background-secondary)", borderTop: "1px solid var(--color-border-tertiary)", borderBottom: "1px solid var(--color-border-tertiary)", padding: "1rem 0" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "0 1.5rem", display: "flex", flexWrap: "wrap", justifyContent: "space-around", gap: "0.5rem" }}>
        {stats.map((s, i) => (
          <StatItem key={i} {...s} index={i} animate={visible} />
        ))}
      </div>
    </section>
  );
}