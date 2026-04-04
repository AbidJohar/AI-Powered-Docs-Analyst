import { useNavigate } from "react-router-dom";
import { useUploadDocument } from "../hooks/useDocuments";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const DocumentPage = () => {
  const navigate = useNavigate();
  const { mutate: upload, isPending: isUploading, isError, error } = useUploadDocument();

  const handleUpload = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".pdf,.txt,.csv,.xls,.xlsx";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      upload(file, {
        onSuccess: (response) => {
          const id = response.data.document.id;
          if (id) navigate(`/chat-panel/${id}`);
        },

        // ─── handle ALL errors inline here, not in useEffect ───
        // onError fires right when mutation fails with full error access
        onError: (err: any) => {
          const data = err?.response?.data;

          // read both fields — works regardless of which one backend sends
          const message = data?.error ?? "Upload failed. Please try again.";

          toast.error(message, {
            style: {
              background: "#1a0a0a",
              border: "1px solid #ef444430",
              color: "#f87171",
            },
            icon: "🚫",
          });
        },
      });
    };
    input.click();
  };

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 text-center px-6">
      {isUploading ? (
        <div className="flex flex-col items-center gap-4 w-full max-w-sm">
          <div className="h-14 w-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
            <Loader2 size={26} className="animate-spin" />
          </div>
          <p className="text-slate-300 font-medium">Uploading & analyzing…</p>
          <p className="text-slate-600 text-sm">This may take a few seconds</p>
          <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full animate-pulse w-3/4" />
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <p className="text-slate-300 font-medium">No document selected</p>
          <p className="text-slate-600 text-sm">Upload a document to get started.</p>

          {/* inline error still useful as persistent UI feedback under the button */}
          {isError && (
            <p className="text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-lg px-4 py-2">
              {(error as any)?.response?.data?.message ?? (error as Error).message}
            </p>
          )}

          <button
            onClick={handleUpload}
            className="mt-2 px-6 py-2.5 bg-cyan-500 text-black rounded-xl text-sm font-bold hover:bg-cyan-400 transition-all"
          >
            Upload Document
          </button>
        </div>
      )}
    </div>
  );
};

export default DocumentPage;
