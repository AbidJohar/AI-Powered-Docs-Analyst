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
        {/* Subtle Glow Effect on Hover */}
        <div className="absolute -inset-px bg-linear-to-r from-cyan-500/20 to-purple-500/20 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

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
        <section className="relative w-full py-5 bg-[#050814]">
            {/* Background Grid Pattern - Matching your CSS grid effect */}
            <div className="absolute inset-0 z-0 opacity-20 mask-[radial-gradient(ellipse_at_center,black,transparent)] bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-size-[40px_40px]" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <div className="mb-16 text-center">
                    <h2 className="text-sm font-bold uppercase tracking-[0.3em] text-purple-400 mb-4">Capabilities</h2>
                    <h3 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
                        Crafted for <span className="text-transparent bg-clip-text bg-linear-to-r from-cyan-400 to-purple-500">Smooth Performance.</span>
                    </h3>
                </div>

                {/* Bento Grid Layout */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Large Feature 1 */}
                    <FeatureCard
                        className="md:col-span-2"
                        icon={<Cpu size={24} />}
                        title="Neural Context Mapping"
                        description="Our engine doesn't just read words; it understands hierarchy. It maps relationships between clauses in 500+ page documents in under few seconds."
                    />

                    {/* Small Feature 1 */}

                    <FeatureCard
                        icon={<Globe size={24} />}
                        title="Multi-Language"
                        description="Analyze documents in 50+ languages with native-level semantic understanding."
                    />
                    {/* Small Feature 2 */}
                    <FeatureCard
                        icon={<Zap size={24} />}
                        title="Instant Summaries"
                        description="Get executive summaries tailored to your specific department's needs automatically."
                    />

                    {/* Large Feature 2 */}
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