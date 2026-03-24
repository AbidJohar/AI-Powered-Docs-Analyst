import { MessageSquare } from "lucide-react";

const HistoryPanel: React.FC<{ showFull: boolean }> = ({ showFull }) => {
  return (
    <div className="px-3 space-y-2">
      {/* If showFull is false, only show icons centered */}
      <button className={`flex items-center gap-3 rounded-lg hover:bg-white/5 ${!showFull ? 'justify-center py-4' : 'px-3 py-3'}`}>
        <MessageSquare size={18} />
        {showFull && <span className="text-sm truncate">Previous Document...</span>}
      </button>
    </div>
  );
};

export default HistoryPanel;