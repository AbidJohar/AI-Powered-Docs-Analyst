import { useEffect, useRef, useState } from "react";

const faqs = [
  { q: "What file formats does DocAnalyst support?", a: "DocAnalyst supports 4+ file formats including PDF, DOCX, XLSX, PPTX, TXT, CSV, and more. If you're unsure about a specific format, just reach out — we're always adding support." },
  { q: "How accurate is the AI analysis?", a: "We achieve 91%+ accuracy on structured documents (contracts, financial reports, forms). For complex handwritten or low-resolution scanned documents, accuracy is typically 92-95%. We always flag low-confidence extractions so you know when to double-check." },
  { q: "What's the maximum file size?", a: "DocAnalyst supports up to 10MB per file." },
  { q: "Do you offer a free trial?", a: "Yes — its totally free you can upload files and analyze it at anytime" },
  { q: "Can DocAnalyst handle multiple documents at once?", a: "No. its only handle one file at a time" },
  { q: "What languages are supported?", a: "DocAnalyst currently support 4+ languages for full analysis." },
];

export default function FAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState<number | null>(0);

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.1 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ padding: "3rem 1.5rem", background: "var(--color-background-secondary)" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "4rem", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all 0.7s ease" }}>
          <span style={{ display: "inline-block", background: "rgba(99,102,241,0.1)", color: "#6366f1", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.4rem 1rem", borderRadius: "100px", marginBottom: "1rem" }}>FAQ</span>
          <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, fontFamily: "'Syne', sans-serif", margin: "0 0 1rem", lineHeight: 1.15 }}>
            Frequently asked questions
          </h2>
        
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", opacity: visible ? 1 : 0, transform: visible ? "none" : "translateY(24px)", transition: "all 0.7s ease 0.15s" }}>
          {faqs.map((faq, i) => (
            <div key={i} style={{ borderRadius: "14px", border: `1px solid ${open === i ? "#6366f155" : "var(--color-border-tertiary)"}`, overflow: "hidden", background: "var(--color-background-primary)", transition: "border-color 0.2s" }}>
              <button
                onClick={() => setOpen(open === i ? null : i)}
                style={{ width: "100%", padding: "1.25rem 1.5rem", display: "flex", justifyContent: "space-between", alignItems: "center", background: "transparent", border: "none", cursor: "pointer", textAlign: "left", gap: "1rem" }}
              >
                <span style={{ fontSize: "0.95rem", fontWeight: 600, color: open === i ? "#6366f1" : "var(--color-text-primary)", lineHeight: 1.4 }}>{faq.q}</span>
                <div style={{ width: "22px", height: "22px", borderRadius: "50%", border: `1.5px solid ${open === i ? "#6366f1" : "var(--color-border-secondary)"}`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, transition: "all 0.2s", background: open === i ? "rgba(99,102,241,0.1)" : "transparent" }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke={open === i ? "#6366f1" : "var(--color-text-secondary)"} strokeWidth={2.5} strokeLinecap="round" style={{ transition: "transform 0.2s", transform: open === i ? "rotate(180deg)" : "none" }}>
                    <polyline points="6 9 12 15 18 9" />
                  </svg>
                </div>
              </button>
              <div style={{ maxHeight: open === i ? "300px" : "0", overflow: "hidden", transition: "max-height 0.35s ease" }}>
                <p style={{ padding: "0 1.5rem 1.25rem", fontSize: "0.9rem", color: "var(--color-text-secondary)", lineHeight: 1.75, margin: 0 }}>{faq.a}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}