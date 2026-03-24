import React from 'react';
import { Share2, Menu } from "lucide-react";

interface DocumentHeaderProps {
  onMenuClick?: () => void; // Added this optional prop
}

const DocumentHeader: React.FC<DocumentHeaderProps> = ({ onMenuClick }) => (
  <header className="h-16 border-b border-white/10 px-6 flex items-center justify-between bg-[#08060d]/50 backdrop-blur-md shrink-0 z-10">
    <div className="flex items-center gap-4">
      {/* If sidebar is closed, show the menu toggle button */}
      {onMenuClick && (
        <button 
          onClick={onMenuClick}
          className="p-2 mr-2 hover:bg-white/5 rounded-lg text-cyan-400 md:hidden"
        >
          <Menu size={20} />
        </button>
      )}
      
    </div>
    
    <div className="flex items-center gap-3">
       <button className="flex items-center gap-2 px-4 py-2 bg-cyan-500 rounded-lg text-black text-xs font-bold hover:bg-cyan-400 transition-all">
         <Share2 size={14} /> <span className="hidden sm:inline">Share</span>
       </button>
    </div>
  </header>
);

export default DocumentHeader;