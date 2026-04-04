import React, { useEffect, useRef, useState } from "react";
import { Bot, Loader2, Send, User } from "lucide-react";
import { useAskQuestion, useHistory } from "../../hooks/useDocuments";
import ReactMarkDown from "react-markdown";
import { toast } from "sonner";

interface ChatPanelProps {
  isSidebarOpen: boolean;
  documentId: string;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ isSidebarOpen, documentId }) => {
  const [input, setInput] = useState("");
  const [pendingQuestion, setPendingQuestion] = useState<string | null>(null); // 👈 add this
  const bottomRef = useRef<HTMLDivElement>(null);

  const { data: history = [], isLoading: historyLoading } = useHistory(documentId);
  const { mutate: askQuestion, isPending, isError, error } = useAskQuestion(documentId);

  // handle error with useEffect
  useEffect(() => {
    if (!isError || !error) return;
    const status = (error as any)?.response?.status;
    const message = (error as any)?.response?.data?.message;

    setPendingQuestion(null); // 👈 clear on error too

    if (status === 429) {
      toast.error(message, {
        style: { background: "#1a0a0a", border: "1px solid #ef444430", color: "#f87171" },
        icon: "🚫",
      });
    } else {
      toast.error("Something went wrong.");
    }
  }, [isError, error]);

  // 👇 clear pendingQuestion once history updates with the new answer
  useEffect(() => {
    if (pendingQuestion && history.length > 0) {
      const last = history[history.length - 1];
      if (last.question === pendingQuestion) {
        setPendingQuestion(null);
      }
    }
  }, [history]);

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [history, pendingQuestion, isPending]); // 👈 also scroll on pendingQuestion change

  const handleSend = () => {
    const trimmed = input.trim();
    if (!trimmed || isPending) return;
    setInput("");
    setPendingQuestion(trimmed);
    askQuestion(trimmed);

    // 👇 reset textarea height after send
    const textarea = document.querySelector("textarea");
    if (textarea) textarea.style.height = "auto";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col gap-6 pb-28 mt-5">
      {/* ── History ── */}
      {historyLoading ? (
        <div className="flex items-center gap-2 text-slate-500 text-sm">
          <Loader2 size={14} className="animate-spin" />
          Loading conversation…
        </div>
      ) : history.length === 0 && !pendingQuestion ? (
        <p className="text-slate-600 text-sm italic">
          No questions yet. Ask something below.
        </p>
      ) : (
        <>
          {/* Existing history from DB */}
          {history.map(
            (item: { id: string; question: string; answer: string }, idx: number) => (
              <React.Fragment key={item.id ?? idx}>
                {/* User bubble */}
                <div className="flex gap-2 items-start justify-end animate-in fade-in slide-in-from-right-2">
                  <div className="max-w-[80%]">
                    <p className="text-sm leading-relaxed text-slate-200 bg-cyan-500/10 border-r-[1.7px] border-white/60 p-4 rounded-md">
                      {item.question}
                    </p>
                  </div>
                  <div className="h-8 w-8 rounded-full bg-white/5 border-r-[1.7px] border-white/60 flex items-center justify-center text-slate-400 shrink-0">
                    <User size={16} />
                  </div>
                </div>

                {/* AI bubble */}
                <div className="flex gap-2 items-start animate-in fade-in slide-in-from-left-2">
                  <div className="h-8 w-8 rounded-full border-l-[1.7px] border-white/60 bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
                    <Bot size={18} />
                  </div>
                  <div className="text-sm leading-relaxed text-slate-300 bg-white/5 p-4 rounded-md border-l-[1.7px] border-white/60 shadow-sm prose prose-invert prose-sm max-w-none">
                    <ReactMarkDown
                      components={{
                        h1: ({ children }) => <h1 className="text-white font-bold text-base mb-2">{children}</h1>,
                        h2: ({ children }) => <h2 className="text-white font-semibold text-sm mb-2">{children}</h2>,
                        h3: ({ children }) => <h3 className="text-cyan-400 font-semibold text-sm mb-1">{children}</h3>,
                        strong: ({ children }) => <strong className="text-white font-semibold">{children}</strong>,
                        ul: ({ children }) => <ul className="list-disc list-inside space-y-1 my-2">{children}</ul>,
                        ol: ({ children }) => <ol className="list-decimal list-inside space-y-1 my-2">{children}</ol>,
                        li: ({ children }) => <li className="text-slate-300">{children}</li>,
                        p: ({ children }) => <p className="mb-2 last:mb-0">{children}</p>,
                        code: ({ children }) => <code className="bg-white/10 px-1.5 py-0.5 rounded text-cyan-300 text-xs">{children}</code>,
                      }}
                    >
                      {item.answer}
                    </ReactMarkDown>
                  </div>
                </div>
              </React.Fragment>
            )
          )}

          {/* 👇 Optimistic question bubble — shows instantly */}
          {pendingQuestion && (
            <div className="flex gap-2 items-start justify-end animate-in fade-in slide-in-from-right-2">
              <div className="max-w-[80%]">
                <p className="text-sm leading-relaxed text-slate-200 bg-cyan-500/10 border-r-[1.7px] border-white/60 p-4 rounded-md">
                  {pendingQuestion}
                </p>
              </div>
              <div className="h-8 w-8 rounded-full bg-white/5 border-r-[1.7px] border-white/60 flex items-center justify-center text-slate-400 shrink-0">
                <User size={16} />
              </div>
            </div>
          )}
        </>
      )}

      {/* Pending indicator — answer loading */}
      {isPending && (
        <div className="flex gap-4 items-start animate-in fade-in mb-8">
          <div className="h-8 w-8 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
            <Bot size={18} />
          </div>
          <div className="bg-white/5 border border-white/5 p-4 rounded-2xl">
            <Loader2 size={16} className="animate-spin text-cyan-400" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />

      {/* ── Floating Input ── */}
      <div className={`z-50 fixed bottom-6 right-0 flex justify-center px-7 transition-all duration-300 ${isSidebarOpen ? "left-52" : "left-0 md:left-10"}`}>
        <div className="max-w-3xl w-full relative group">
          <div className="absolute -inset-1 rounded-2xl blur opacity-0 group-focus-within:opacity-100 transition duration-500" />
          <div className="relative">
            <textarea
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                // 👇 auto-expand: reset height then set to scrollHeight
                e.target.style.height = "auto";
                e.target.style.height = `${e.target.scrollHeight}px`;
              }}
              onKeyDown={handleKeyDown}
              disabled={isPending}
              rows={1}
              className="w-full bg-[#16171d] border border-white/10 rounded-2xl py-4 px-6 pr-14 text-white focus:outline-none focus:border-cyan-500/50 placeholder:text-slate-600 disabled:opacity-50 transition-colors resize-none overflow-hidden leading-relaxed"
              placeholder="Ask a question about the document…"
            />
            <button
              onClick={handleSend}
              disabled={!input.trim() || isPending}
              className="absolute right-3 bottom-[15px] p-3 bg-cyan-500 rounded-xl text-black hover:bg-cyan-400 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isPending ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;