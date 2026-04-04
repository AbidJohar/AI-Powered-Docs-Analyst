import { useEffect, useRef, useState } from "react";

const cases = [
  {
    icon: "⚖️",
    industry: "Legal",
    color: "#6366f1",
    bg: "rgba(99,102,241,0.08)",
    title: "Contract Review & Risk Analysis",
    desc: "Extract key clauses, flag risky terms, summarize obligations, and compare contracts in seconds. What once took hours takes minutes.",
    tags: ["Contracts", "NDAs", "Compliance"],
  },
  {
    icon: "💹",
    industry: "Finance",
    color: "#0ea5e9",
    bg: "rgba(14,165,233,0.08)",
    title: "Financial Report Intelligence",
    desc: "Analyze earnings reports, balance sheets, and filings. Auto-extract KPIs, detect anomalies, and generate executive summaries.",
    tags: ["10-K/10-Q", "Audits", "Forecasts"],
  },
  {
    icon: "🏥",
    industry: "Healthcare",
    color: "#10b981",
    bg: "rgba(16,185,129,0.08)",
    title: "Medical Records Processing",
    desc: "Digitize and analyze patient records, lab reports, and clinical notes with HIPAA-compliant AI that understands medical terminology.",
    tags: ["EHRs", "Lab Reports", "Clinical Notes"],
  },
  {
    icon: "🔬",
    industry: "Research",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.08)",
    title: "Literature Review Automation",
    desc: "Process hundreds of research papers at once. Extract findings, methodologies, citations, and synthesize insights across documents.",
    tags: ["Papers", "Citations", "Meta-Analysis"],
  },
  {
    icon: "🏗️",
    industry: "Real Estate",
    color: "#ec4899",
    bg: "rgba(236,72,153,0.08)",
    title: "Property Document Analysis",
    desc: "Review lease agreements, title documents, inspection reports, and zoning documents quickly and accurately.",
    tags: ["Leases", "Titles", "Zoning"],
  },
  {
    icon: "📦",
    industry: "Supply Chain",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.08)",
    title: "Logistics & Compliance Docs",
    desc: "Process invoices, customs documents, supplier contracts, and compliance certifications with zero manual data entry.",
    tags: ["Invoices", "Customs", "Supplier Docs"],
  },
];

export default function UseCases() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [active, setActive] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ padding: "6rem 1.5rem", background: "var(--color-background-secondary)" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all 0.7s ease" }}>
          <span style={{ display: "inline-block", background: "rgba(99,102,241,0.1)", color: "#6366f1", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.4rem 1rem", borderRadius: "100px", marginBottom: "1rem" }}>Use Cases</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, fontFamily: "'Syne', sans-serif", margin: "0 0 1rem", lineHeight: 1.15 }}>
            Built for every industry
          </h2>
          <p style={{ fontSize: "1.1rem", color: "var(--color-text-secondary)", maxWidth: "500px", margin: "0 auto", lineHeight: 1.7 }}>
            From legal teams to research labs — DocAnalyst adapts to your workflow.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "1.25rem" }}>
          {cases.map((c, i) => (
            <div
              key={i}
              onClick={() => setActive(active === i ? null : i)}
              style={{
                padding: "1.75rem",
                borderRadius: "16px",
                border: `1px solid ${active === i ? c.color + "55" : "var(--color-border-tertiary)"}`,
                background: active === i ? c.bg : "var(--color-background-primary)",
                cursor: "pointer",
                opacity: visible ? 1 : 0,
                transform: visible ? "none" : "translateY(28px)",
                transition: `all 0.6s ease ${i * 0.08}s`,
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "0.75rem" }}>
                <span style={{ fontSize: "1.75rem" }}>{c.icon}</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: c.color, background: c.bg, padding: "0.2rem 0.6rem", borderRadius: "6px" }}>{c.industry}</span>
              </div>
              <h3 style={{ fontSize: "1.05rem", fontWeight: 700, fontFamily: "'Syne', sans-serif", margin: "0 0 0.6rem" }}>{c.title}</h3>
              <p style={{ fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.65, margin: "0 0 1rem" }}>{c.desc}</p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {c.tags.map((tag, j) => (
                  <span key={j} style={{ fontSize: "0.75rem", padding: "0.25rem 0.6rem", borderRadius: "6px", background: "var(--color-background-secondary)", color: "var(--color-text-secondary)", border: "1px solid var(--color-border-tertiary)" }}>{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}