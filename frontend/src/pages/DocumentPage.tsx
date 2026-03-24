import React, { useState } from 'react';
import { PanelLeftClose, PanelLeftOpen, Plus } from "lucide-react";
import HistoryPanel from '../components/document/HistoryPanel';
import DocumentHeader from '../components/document/DocumentHeader';
import SummaryPanel from '../components/document/SummaryPanel';
import ChatPanel from '../components/document/ChatPanel';

const DocumentPage: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  return (
    <div className="flex h-screen w-full bg-[#08060d] text-slate-300 font-sans overflow-hidden">
      
      {/* SIDEBAR */}
      <aside 
        className={`
          ${isSidebarOpen ? 'w-72' : 'w-0 md:w-16'} 
          fixed md:relative z-50 h-full shrink-0 border-r border-white/5 bg-[#050508] 
          flex flex-col transition-all duration-300 ease-in-out overflow-hidden
        `}
      >
        {/* Sidebar Content - Only show full UI when open */}
        <div className={`flex flex-col h-full ${!isSidebarOpen && 'md:items-center'}`}>
          <div className="p-4 flex items-center justify-between">
            {isSidebarOpen && (
               <span className="text-white font-bold tracking-tighter text-sm animate-in fade-in">
                 DocAnalyst.ai
               </span>
            )}
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
              title={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
            >
              {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
            </button>
          </div>

          <div className="p-4">
            <button className={`
              flex items-center justify-center gap-2 rounded-xl bg-white/5 border border-white/10 
              hover:bg-white/10 transition-all text-sm font-medium
              ${isSidebarOpen ? 'w-full py-2.5 px-4' : 'w-10 h-10 p-0'}
            `}>
              <Plus size={18} />
              {isSidebarOpen && <span className="animate-in fade-in">New Chat</span>}
            </button>
          </div>

          {/* Hide History Panel text when collapsed but keep icons for "Pro" feel */}
          <div className="flex-1 overflow-y-auto">
            <HistoryPanel showFull={isSidebarOpen} />
          </div>
        </div>
      </aside>

      {/* MOBILE OVERLAY BACKDROP */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative overflow-hidden bg-[#08060d]">
        <DocumentHeader 
          // Show toggle on header if sidebar is fully closed
          onMenuClick={!isSidebarOpen ? () => setIsSidebarOpen(true) : undefined} 
        />

        <div className="flex-1 overflow-y-auto custom-scrollbar">
          <div className="max-w-4xl mx-auto px-6 py-10 w-full">
          
               <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                 <SummaryPanel />
               
               </div>
            
              <div className="animate-in fade-in duration-500">
                 <ChatPanel isSidebarOpen={isSidebarOpen} />
              </div>
          
          </div>
        </div>
      </main>
    </div>
  );
};

export default DocumentPage;