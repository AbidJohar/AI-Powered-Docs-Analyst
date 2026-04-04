import { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import HistoryPanel from "../document/HistoryPanel";
import DocumentHeader from "../document/DocumentHeader";

const MainLayout = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(false);
    const [activeDocumentId, setActiveDocumentId] = useState<string | undefined>();
    const navigate = useNavigate();

    const handleSelectDocument = (id: string) => {
        setActiveDocumentId(id);
        navigate(`/chat-panel/${id}`);
    };

    return (
        <div className="flex h-screen w-full bg-[#08060d] text-slate-300 font-sans overflow-hidden">

            {/* SIDEBAR */}
            <aside className={`
        ${isSidebarOpen ? "w-56" : "w-0 md:w-16"}
        fixed md:relative z-50 h-full shrink-0 border-r border-white/30 bg-[#050508]
        flex flex-col transition-all duration-300 ease-in-out overflow-hidden
      `}>
                <div className={`flex flex-col h-full ${!isSidebarOpen && "md:items-center"}`}>
                    <div className="p-4 flex items-center justify-between">
                        {isSidebarOpen && (
                            <span className="text-white font-bold tracking-tighter text-sm animate-in fade-in">
                                DocAnalyst.ai
                            </span>
                        )}
                        <button
                            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                            className="p-2 hover:bg-white/5 rounded-lg text-slate-400 transition-colors"
                        >
                            {isSidebarOpen ? <PanelLeftClose size={20} /> : <PanelLeftOpen size={20} />}
                        </button>
                    </div>

                    <div className="flex-1  overflow-y-auto  no-scrollbar">
                        <HistoryPanel
                            showFull={isSidebarOpen}
                            onSelectDocument={handleSelectDocument}
                            activeDocumentId={activeDocumentId}    
                        />
                    </div>
                </div>
            </aside>

            {/* MOBILE OVERLAY */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 md:hidden"
                    onClick={() => setIsSidebarOpen(false)}
                />
            )}

            {/* MAIN */}
            <main className="flex-1 flex flex-col relative overflow-hidden bg-[#08060d]">
                <DocumentHeader
                    onMenuClick={!isSidebarOpen ? () => setIsSidebarOpen(true) : undefined}
                    onDocumentUploaded={(id) => navigate(`/chat-panel/${id}`)}
                />

                {/* 👇 Only this part changes per route */}
                <div className="flex-1 overflow-y-auto no-scrollbar">
                    <Outlet context={{ isSidebarOpen }} />
                </div>
            </main>
        </div>
    );
};

export default MainLayout;