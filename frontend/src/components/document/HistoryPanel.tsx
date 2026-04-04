import { FileText, Loader2, LogOut, MessageSquare, Trash2 } from "lucide-react";
import { useDocuments, useDeleteDocument, useUsage } from "../../hooks/useDocuments";
import UsageBar from "../UsageBar";
import { useLogout } from "../../hooks/useAuth";

interface HistoryPanelProps {
  showFull: boolean;
  activeDocumentId?: string;
  onSelectDocument: (id: string) => void;
}


// ─── Main component ───────────────────────────────────────────
const HistoryPanel: React.FC<HistoryPanelProps> = ({
  showFull,
  activeDocumentId,
  onSelectDocument,
}) => {
  const { data, isLoading, isError, fetchNextPage, hasNextPage, isFetchingNextPage } = useDocuments();
  const { mutate: deleteDocument, isPending, variables } = useDeleteDocument();
  const { data: usage } = useUsage();
  const { mutate: logoutApi, isPending: isLoginggout } = useLogout();

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

  return (
    // ← add flex col + h-full so usage badge sticks to bottom
    <div className="flex flex-col h-full">

      {/* ── document list ── */}
      <div className="flex-1 px-3 space-y-1 overflow-y-auto hide-scrollbar">
        {showFull && (
          <p className="px-3 pb-1 text-[10px] uppercase tracking-widest text-slate-600 font-semibold">
            Documents
          </p>
        )}

        {documents.length === 0 && showFull && (
          <p className="px-4 text-xs text-slate-600 italic">No documents yet.</p>
        )}

        {documents.map((doc: { id: string; filename?: string; originalName?: string }) => {
          const label = doc.filename ?? doc.originalName ?? "Untitled";
          const isActive = doc.id === activeDocumentId;
          const isDeleting = isPending && variables === doc.id;

          return (
            <div
              key={doc.id}
              className={`
                group w-full flex items-center gap-3 rounded-lg transition-colors
                ${!showFull ? "justify-center py-4 " : "px-3 py-3 hover:bg-cyan-700/20"}
                  ${isActive
                && "bg-cyan-500/40 text-cyan-400 border border-cyan-500/20"
                }
               
              `}
            >
              <button
                onClick={() => onSelectDocument(doc.id)}
                title={showFull ? undefined : label}
                className="flex items-center gap-3 flex-1 text-left min-w-0"
              >
                {showFull ? <FileText size={16} className="shrink-0" /> : <MessageSquare size={18} />}
                {showFull && <span className="text-sm truncate">{label}</span>}
              </button>

              {showFull && (
                <button
                  onClick={(e) => { e.stopPropagation(); deleteDocument(doc.id); }}
                  disabled={isDeleting}
                  className="shrink-0 opacity-0 group-hover:opacity-100 transition-opacity
                             p-1 rounded hover:bg-red-500/10 hover:text-red-400
                             disabled:opacity-50 disabled:cursor-not-allowed"
                  title="Delete document"
                >
                  {isDeleting ? <Loader2 size={13} className="animate-spin" /> : <Trash2 size={13} />}
                </button>
              )}
            </div>
          );
        })}

        {showFull && hasNextPage && (
          <button
            onClick={() => fetchNextPage()}
            disabled={isFetchingNextPage}
            className="w-full mt-2 py-2 text-xs text-cyan-400 hover:text-cyan-300
                       hover:bg-cyan-500/10 rounded-lg transition-colors flex items-center
                       justify-center gap-2 border border-white/5"
          >
            {isFetchingNextPage ? <Loader2 size={13} className="animate-spin" /> : "show more"}
          </button>
        )}
      </div>

      {/* ── usage badge — only in expanded sidebar ── */}
      {showFull && usage && (
        <div className="px-3 pt-3 pb-2 mt-2 border-t border-white/5 space-y-3">
          <UsageBar
            label="Uploads today"
            used={usage.uploads.used}
            limit={usage.uploads.limit}
          />
          <UsageBar
            label="Questions today"
            used={usage.questions.used}
            limit={usage.questions.limit}
          />
        </div>
      )}

      {showFull ? (
        <button
          onClick={() => logoutApi()}
          disabled={isLoginggout}
          className="mx-3 mb-3 mt-2 w-[calc(100%-24px)] flex items-center justify-center gap-2 px-3 py-2.5 rounded-lg text-white/80 bg-red-700 hover:text-white border border-white/5 hover:border-red-500/20 transition-all text-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoginggout ? (
            <Loader2 size={15} className="animate-spin shrink-0" />
          ) : (
            <LogOut size={15} className="shrink-0" />
          )}
          <span>Logout</span>
        </button>
      ) : (
        // collapsed sidebar — icon only
        <button
          onClick={() => logoutApi()}
          disabled={isLoginggout}
          title="Logout"
          className="mx-auto mb-3 mt-2 flex items-center justify-center p-2.5 rounded-lg text-slate-400 hover:bg-red-500/10 hover:text-red-400 border border-white/5 hover:border-red-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoginggout ? (
            <Loader2 size={15} className="animate-spin" />
          ) : (
            <LogOut size={15} />
          )}
        </button>
      )}

    </div>
  );
};

export default HistoryPanel;

