import React from 'react';

const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#050814] border-t border-white/5 py-12">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
        
        {/* Brand / Logo Area */}
        <div className="flex items-center gap-2">
          <div className="h-6 w-6 rounded bg-linear-to-br from-cyan-400 to-purple-500" />
          <span className="text-white font-bold tracking-tighter text-lg">DocAnalyst.ai</span>
        </div>

        {/* Minimal Navigation */}
        <nav className="flex gap-8 text-sm font-medium text-slate-500">
          <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
          <a href="#security" className="hover:text-cyan-400 transition-colors">Security</a>
          <a href="#privacy" className="hover:text-cyan-400 transition-colors">Privacy</a>
          <a href="#api" className="hover:text-cyan-400 transition-colors">API</a>
        </nav>

        {/* Copyright & Status */}
        <div className="flex flex-col items-end gap-1">
          <div className="flex items-center gap-2 text-[10px] uppercase tracking-[0.2em] text-cyan-400/60 font-bold">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500"></span>
            </span>
            Systems Operational
          </div>
          <p className="text-xs text-slate-600">
            © {currentYear} DocAnalyst Inc. All rights reserved.
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;