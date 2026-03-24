import React from 'react';
import { Sparkles } from "lucide-react";

const SummaryPanel: React.FC = () => (
  <div className="h-full bg-white/3 border border-white/10 rounded-2xl p-5 flex flex-col">
    <div className="flex items-center gap-2 mb-4 text-cyan-400 font-bold text-xs uppercase tracking-tighter">
      <Sparkles size={14} />
      AI Executive Summary
    </div>
    <div className="overflow-y-auto pr-2 space-y-3">
      <p className="text-sm text-slate-300 leading-relaxed">
        This document outlines a <span className="text-purple-400">15% growth</span> in operational efficiency. 
        Key risks identified in section 4.2 regarding supply chain latency.
      </p>
    
    </div>
  </div>
);

export default SummaryPanel;