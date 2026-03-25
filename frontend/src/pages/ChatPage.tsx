import { useParams, useNavigate } from "react-router-dom";
import { useOutletContext } from "react-router-dom";
import SummaryPanel from "../components/document/SummaryPanel";
import ChatPanel from "../components/document/ChatPanel";

const ChatPage = () => {
  const { documentId } = useParams<{ documentId: string }>();
  const { isSidebarOpen } = useOutletContext<{ isSidebarOpen: boolean }>();
  const navigate = useNavigate();

  if (!documentId) {
    navigate("/chat-panel");
    return null;
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 w-full space-y-8">
      <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
        <SummaryPanel documentId={documentId} />
      </div>
      <div className="animate-in fade-in duration-500">
        <ChatPanel isSidebarOpen={isSidebarOpen} documentId={documentId} />
      </div>
    </div>
  );
};

export default ChatPage;