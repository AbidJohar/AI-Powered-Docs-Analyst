import React, { useState } from 'react';
import { Bot, Send } from "lucide-react";

interface ChatPanelProps {
  isSidebarOpen: boolean; // Added this
}

const ChatPanel: React.FC<ChatPanelProps> = ({ isSidebarOpen }) => {
  const [input, setInput] = useState('');

  return (
    <div className="flex flex-col gap-8 pb-32">
      {/* AI Message Example */}
      <div className="flex gap-4 items-start mt-5 animate-in fade-in slide-in-from-left-2">
        <div className="h-8 w-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
          <Bot size={18}   />
        </div>
        <div className="max-w-[80%] space-y-2 ">
          <p className="text-sm leading-relaxed  text-slate-300 bg-white/5 p-4 rounded-2xl border border-white/5 shadow-sm">
            Analysis complete. I've found 4 key action items in this document. How would you like to proceed?
          </p>
        </div>
      </div>

      {/* Floating Input Bar */}
      <div 
        className={`
          fixed bottom-8 right-0 flex justify-center px-6 transition-all duration-300
          ${isSidebarOpen ? 'left-72' : 'left-0 md:left-16'}
        `}
      >
        <div className="max-w-3xl w-full relative group">
          <div className="absolute -inset-1   rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
          <div className="relative">
            <input 
              value={input}
              onChange={(e) => setInput(e.target.value)}
              className="w-full bg-[#16171d] border border-white/10 rounded-2xl py-4 px-6 pr-14 text-white focus:outline-none focus:border-cyan-500/50   placeholder:text-slate-600"
              placeholder="Ask a question about the document..."
            />
            <button className="absolute right-3 top-2.5 p-2.5 bg-cyan-500 rounded-xl text-black hover:bg-cyan-400 transition-colors">
              <Send size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;