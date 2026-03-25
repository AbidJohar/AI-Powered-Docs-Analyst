import React, { useRef, useState, useEffect } from "react";
import { Menu, Share2, Copy, Check, X, Home } from "lucide-react";
import { useUploadDocument } from "../../hooks/useDocuments";
import { useNavigate } from "react-router-dom";

interface DocumentHeaderProps {
  onMenuClick?: () => void;
  onDocumentUploaded?: (id: string) => void;
  shareUrl?: string; // pass the current doc URL or fallback to window.location.href
}

const DocumentHeader: React.FC<DocumentHeaderProps> = ({
  onMenuClick,
  onDocumentUploaded,
  shareUrl,
}) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { mutate: upload } = useUploadDocument();
  const navigate = useNavigate();

  const [showShare, setShowShare] = useState(false);
  const [copied, setCopied] = useState(false);

  const url = shareUrl ?? window.location.href;
  const encodedUrl = encodeURIComponent(url);
  const shareText = encodeURIComponent("Check out this document!");

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowShare(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    upload(file, {
      onSuccess: (data) => {
        const newId = data._id ?? data.id ?? data.documentId;
        if (newId) onDocumentUploaded?.(newId);
      },
    });
    e.target.value = "";
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${shareText}%20${encodedUrl}`, "_blank");
    setShowShare(false);
  };

  const handleTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?text=${shareText}&url=${encodedUrl}`,
      "_blank"
    );
    setShowShare(false);
  };

  return (
    <header className="h-14 border-b border-white/30 px-6 flex items-center justify-between bg-[#08060d]/50 backdrop-blur-md shrink-0 z-10">
      <div className="flex items-center gap-4">
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
       
         <button
  onClick={() => navigate("/")}
  className="flex items-center gap-2 px-4 py-2 cursor-pointer bg-black rounded-lg text-white text-xs font-bold  border border-white/50 transition-all"
>
  <Home size={14} />
  <span className="hidden sm:inline">HomePage</span>
</button>

        {/* Share button + dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => { setShowShare((p) => !p)}}
            className="flex items-center gap-2 px-4 py-2 bg-cyan-500 rounded-lg text-black text-xs font-bold hover:bg-cyan-400 transition-all"
          >
            <Share2 size={14} />
            <span className="hidden sm:inline">Share</span>
          </button>

          {showShare && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl border border-white/10 bg-[#0e0b1a] shadow-2xl shadow-black/60 overflow-hidden z-50">
              {/* Header */}
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-white/10">
                <span className="text-[11px] font-semibold text-white/40 uppercase tracking-widest">
                  Share via
                </span>
                <button
                  onClick={() => setShowShare(false)}
                  className="text-white/30 hover:text-white/70 transition-colors"
                >
                  <X size={13} />
                </button>
              </div>

              {/* WhatsApp */}
              <button
                onClick={handleWhatsApp}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group"
              >
                {/* WhatsApp SVG icon */}
                <span className="w-7 h-7 rounded-lg bg-[#25D366]/15 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-[#25D366]">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </span>
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                  WhatsApp
                </span>
              </button>

              {/* Twitter / X */}
              <button
                onClick={handleTwitter}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group"
              >
                <span className="w-7 h-7 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 24 24" className="w-4 h-4 fill-white">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.748l7.73-8.835L1.254 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </span>
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                  Twitter / X
                </span>
              </button>

              {/* Copy link */}
              <button
                onClick={handleCopy}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-white/5 transition-colors group"
              >
                <span className="w-7 h-7 rounded-lg bg-cyan-500/15 flex items-center justify-center shrink-0">
                  {copied ? (
                    <Check size={14} className="text-cyan-400" />
                  ) : (
                    <Copy size={14} className="text-cyan-400" />
                  )}
                </span>
                <span className="text-sm text-white/80 group-hover:text-white transition-colors">
                  {copied ? "Copied!" : "Copy link"}
                </span>
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default DocumentHeader;