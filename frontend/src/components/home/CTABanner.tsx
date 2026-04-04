import { useEffect, useRef, useState } from "react";
import {  useNavigate } from "react-router-dom";

export default function CTABanner() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const observer = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setVisible(true); observer.disconnect(); } }, { threshold: 0.2 });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section ref={ref} style={{ padding: "5rem 1.5rem", background: "var(--color-background-primary)" }}>
      <link href="https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&display=swap" rel="stylesheet" />
      <div style={{ maxWidth: "860px", margin: "0 auto" }}>
        <div style={{
          borderRadius: "24px",
          padding: "4rem 3rem",
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a855f7 100%)",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
          opacity: visible ? 1 : 0,
          transform: visible ? "none" : "translateY(32px) scale(0.97)",
          transition: "all 0.8s ease",
        }}>
          {/* Decorative blobs */}
          <div style={{ position: "absolute", top: "-60px", right: "-60px", width: "220px", height: "220px", borderRadius: "50%", background: "rgba(255,255,255,0.06)", pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "-80px", left: "-40px", width: "280px", height: "280px", borderRadius: "50%", background: "rgba(255,255,255,0.04)", pointerEvents: "none" }} />

          <div style={{ position: "relative" }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: "0.5rem", background: "rgba(255,255,255,0.15)", color: "white", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", padding: "0.4rem 1rem", borderRadius: "100px", marginBottom: "1.5rem" }}>
              <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#10b981", display: "inline-block" }} />
              No credit card required
            </div>
            <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)", fontWeight: 800, fontFamily: "'Syne', sans-serif", color: "white", margin: "0 0 1rem", lineHeight: 1.15 }}>
              Start analyzing your first<br />document for free
            </h2>
            <p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.8)", maxWidth: "480px", margin: "0 auto 2.5rem", lineHeight: 1.7 }}>
              Join 500+ professionals who save hours every week with AI-powered document intelligence.
            </p>
            <div style={{ display: "flex", gap: "1rem", justifyContent: "center", flexWrap: "wrap" }}>
              <button
                onClick={() => navigate("/google-login")}
                style={{ padding: "0.9rem 2rem", borderRadius: "100px", background: "white", color: "#6366f1", fontWeight: 700, fontSize: "1rem", border: "none", cursor: "pointer", transition: "all 0.2s ease" }}
                onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px)"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "0 8px 24px rgba(0,0,0,0.2)"; }}
                onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.transform = "none"; (e.currentTarget as HTMLButtonElement).style.boxShadow = "none"; }}
              >
                Get Started Free →
              </button>
             
            </div>
            <p style={{ marginTop: "1.5rem", fontSize: "0.8rem", color: "rgba(255,255,255,0.6)" }}>
              Free forever • No credit card 
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}