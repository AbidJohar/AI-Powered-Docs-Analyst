import React from 'react';
import { Cpu, Zap, BarChart3, Globe } from "lucide-react";

interface FeatureCardProps {
    title: string;
    description: string;
    icon: React.ReactNode;
    className?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({ title, description, icon, className }) => (
    <div className={`group relative overflow-hidden rounded-2xl border border-white/10 bg-white/2 p-8 transition-all hover:bg-white/5 ${className}`}>
        <div className="absolute -inset-px opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-linear-to-br from-cyan-500/10 to-purple-500/10 border border-white/10 text-cyan-400 group-hover:scale-110 transition-transform duration-300">
                {icon}
            </div>
            <h3 className="mb-2 text-xl font-semibold text-white tracking-tight">{title}</h3>
            <p className="text-sm leading-relaxed text-slate-400">{description}</p>
        </div>
    </div>
);

const FeatureSection: React.FC = () => {
    return (
        <section className="relative w-full bg-[#050814] py-8">
            {/* Background Grid Pattern */}
            <div className="absolute inset-0 z-0 opacity-20 mask-[radial-gradient(ellipse_at_center,black,transparent)] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="mb-16 text-center">
                    <span style={{ display: "inline-block", background: "rgba(99,102,241,0.1)", color: "#6366f1", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.12em", textTransform: "uppercase", padding: "0.4rem 1rem", borderRadius: "100px", marginBottom: "1rem" }}>Capabilities</span>
                    <h2 style={{ fontSize: "clamp(1.8rem, 4vw, 2.8rem)", fontWeight: 800, fontFamily: "'Syne', sans-serif", margin: "0 0 1rem", lineHeight: 1.15 }}>
                        Crafted for<br />Smooth Performance
                    </h2>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <FeatureCard
                        className="md:col-span-2"
                        icon={<Cpu size={24} />}
                        title="Neural Context Mapping"
                        description="Our engine doesn't just read words; it understands hierarchy. It maps relationships between clauses in 500+ page documents in under few seconds."
                    />
                    <FeatureCard
                        icon={<Globe size={24} />}
                        title="Multi-Language"
                        description="Analyze documents in 4+ languages with native-level semantic understanding."
                    />
                    <FeatureCard
                        icon={<Zap size={24} />}
                        title="Instant Summaries"
                        description="Get executive summaries tailored to your specific department's needs automatically."
                    />
                    <FeatureCard
                        className="md:col-span-2"
                        icon={<BarChart3 size={24} />}
                        title="Data Insights"
                        description="Ask targeted questions to quickly find specific information, detect inconsistencies, or identify key points across large document sets."
                    />
                </div>
            </div>


        </section>
    );
};

export default FeatureSection;