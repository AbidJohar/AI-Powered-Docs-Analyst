import { Loader2, Sparkles } from "lucide-react";
import ReactMarkDown from "react-markdown"
import { useDocument } from "../../hooks/useDocuments";

// SummaryPanel.tsx
interface SummaryPanelProps {
  documentId: string;

}

const SummaryPanel: React.FC<SummaryPanelProps> = ({ documentId }) => {

  const { data, isLoading } = useDocument(documentId);
  //  console.log("data:",data);


  // data could be { document, summary } or just the document with summary embedded
  // adjust based on your actual API response shape
  const summaryText = data?.summaries[0]?.summaryText;

  return (
    <div className="h-full bg-[#08060d] border border-white/30 rounded-md p-5 flex flex-col">
      <div className="flex items-center gap-2 mb-4 text-cyan-400 font-bold text-xs uppercase tracking-tighter">
        <Sparkles size={14} />
        AI Executive Summary
      </div>
      <div className="overflow-y-auto pr-2 space-y-3">
        {isLoading ? (
          <div className="flex items-center gap-2 text-slate-500 text-sm">
            <Loader2 size={14} className="animate-spin" />
            Loading summary…
          </div>
        ) : summaryText ? (
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
            {summaryText}
          </ReactMarkDown>
        ) : (
          <p className="text-sm text-slate-500 italic">No summary available.</p>
        )}
      </div>
    </div>
  )
};

export default SummaryPanel;