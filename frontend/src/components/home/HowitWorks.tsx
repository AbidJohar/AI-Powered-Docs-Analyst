import { useEffect, useRef, useState } from "react";

const steps = [
  {
    number: "01",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
      </svg>
    ),
    title: "Upload Your Document",
    desc: "Browse to upload PDFs, DOCX, XLSX, and TXT  formats. Supports files up to 10MB.",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.08)",
  },
  {
    number: "02",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z" />
      </svg>
    ),
    title: "AI Analyzes Content",
    desc: "Our AI reads, understands, and processes your document — extracting key entities, clauses, data, and hidden insights in seconds.",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
  },
  {
    number: "03",
    icon: (
      <svg width="28" height="28" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
      </svg>
    ),
    title: "Get Actionable Insights",
    desc: "Receive structured summaries, Q&A responses,  and risk flags. Chat with your document like a teammate.",
    color: "#a855f7",
    bg: "rgba(168,85,247,0.08)",
  },
];

export default function HowItWorks() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.15 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);



  return (
    <section ref={ref} style={{ padding: "2rem 1.5rem", background: "#050814" }}>

      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "all 0.7s ease" }}>
          <span style={{ display: "inline-block", background: "rgba(99,102,241,0.1)", color: "#6366f1", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.4rem 1rem", borderRadius: "100px", marginBottom: "1rem" }}>How It Works</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, fontFamily: "'Syne', sans-serif", margin: "0 0 1rem", lineHeight: 1.15 }}>
            From document to insight<br />in three simple steps
          </h2>
          <p style={{ fontSize: "1.1rem", color: "var(--color-text-secondary)", maxWidth: "520px", margin: "0 auto", lineHeight: 1.7 }}>
            No complex setup. No technical knowledge required. Just upload and start asking questions.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "2rem", position: "relative" }}>
          {steps.map((step, i) => (
            <div
              onClick={() => setActiveIndex(i)}
              key={i}
              style={{
                position: "relative",
                padding: "2rem",
                borderRadius: "20px",
                border: "1px solid var(--color-border-tertiary)",
                background: "var(--color-background-primary)",
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(32px)",
                transition: `all 0.7s ease ${0.15 + i * 0.18}s`,
                cursor: "default",
                overflow: "hidden",
              }}
              onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = `0 20px 60px ${step.color}22`; (e.currentTarget as HTMLDivElement).style.borderColor = step.color + "55"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(-6px)"; }}
              onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.boxShadow = "none"; (e.currentTarget as HTMLDivElement).style.borderColor = "var(--color-border-tertiary)"; (e.currentTarget as HTMLDivElement).style.transform = "translateY(0)"; }}
            >
              <div
                style={{ position: "absolute", top: "1.5rem", right: "1.5rem", fontSize: "3.5rem", fontWeight: 800, fontFamily: "'Syne', sans-serif", color: activeIndex === i ? "#fff" : "inherit", lineHeight: 1 }}>{step.number}</div>
              <div

                style={{ width: "56px", height: "56px", borderRadius: "14px", background: step.bg, display: "flex", alignItems: "center", justifyContent: "center", color: step.color, marginBottom: "1.25rem" }}>
                {step.icon}
              </div>
              <h3 style={{ fontSize: "1.15rem", fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: "0 0 0.75rem" }}>{step.title}</h3>
              <p style={{ fontSize: "0.93rem", color: "var(--color-text-secondary)", lineHeight: 1.7, margin: 0 }}>{step.desc}</p>
            </div>
          ))}
        </div>
      </div>
      
    </section>
  );
}