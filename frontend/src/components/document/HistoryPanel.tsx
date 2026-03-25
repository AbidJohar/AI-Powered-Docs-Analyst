import { FileText, Loader2, MessageSquare } from "lucide-react";
import { useDocuments } from "../../hooks/useDocuments";

interface HistoryPanelProps {
  showFull: boolean;
  activeDocumentId?: string;
  onSelectDocument: (id: string) => void;
}

const HistoryPanel: React.FC<HistoryPanelProps> = ({
  showFull,
  activeDocumentId,
  onSelectDocument,
}) => {
  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useDocuments();

  // Flatten all fetched pages into one document array
  const documents = data?.pages.flatMap((page) => page.data) ?? [];

  if (isLoading) {
    return (
      <div className={`px-3 flex ${!showFull ? "justify-center" : ""} py-4`}>
        <Loader2 size={16} className="animate-spin text-slate-500" />
      </div>
    );
  }

  if (isError) {
    return showFull ? (
      <p className="px-4 text-xs text-red-400">Failed to load documents.</p>
    ) : null;
  }

  if (documents.length === 0) {
    return showFull ? (
      <p className="px-4 text-xs text-slate-600 italic">No documents yet.</p>
    ) : null;
  }

  return (
    <div className="px-3 space-y-1">
      {showFull && (
        <p className="px-3 pb-1 text-[10px] uppercase tracking-widest text-slate-600 font-semibold">
          Documents
        </p>
      )}

      {documents.map(
        (doc: { id: string; filename?: string; originalName?: string }) => {
          const label = doc.filename ?? doc.originalName ?? "Untitled";
          const isActive = doc.id === activeDocumentId;

          return (
            <button
              key={doc.id}
              onClick={() => onSelectDocument(doc.id)}
              title={showFull ? undefined : label}
              className={`
                w-full flex items-center gap-3 rounded-lg transition-colors text-left
                ${!showFull ? "justify-center py-4" : "px-3 py-3"}
                ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "hover:bg-white/5 text-slate-400"
                }
              `}
            >
              {showFull ? (
                <FileText size={16} className="shrink-0" />
              ) : (
                <MessageSquare size={18} />
              )}
              {showFull && <span className="text-sm truncate">{label}</span>}
            </button>
          );
        }
      )}

      {/* Load More — only show in expanded sidebar */}
      {showFull && hasNextPage && (
        <button
          onClick={() => fetchNextPage()}
          disabled={isFetchingNextPage}
          className="w-full mt-2 py-2 text-xs text-cyan-400 hover:text-cyan-300
                     hover:bg-cyan-500/10 rounded-lg transition-colors flex items-center
                     justify-center gap-2 border border-white/5"
        >
          {isFetchingNextPage ? (
            <Loader2 size={13} className="animate-spin" />
          ) : (
            "show more"
          )}
        </button>
      )}
    </div>
  );
};

export default HistoryPanel;