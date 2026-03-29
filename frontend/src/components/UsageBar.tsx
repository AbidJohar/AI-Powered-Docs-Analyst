
const UsageBar = ({ label, used, limit }: { label: string; used: number; limit: number }) => {
  const remaining = limit - used;
  const pct = Math.min((used / limit) * 100, 100);
  const isMaxed = remaining === 0;
  const isWarning = !isMaxed && remaining <= 2;

  const color = isMaxed
    ? "text-red-400"
    : isWarning
    ? "text-yellow-400"
    : "text-cyan-400";

  const barColor = isMaxed
    ? "bg-red-400"
    : isWarning
    ? "bg-yellow-400"
    : "bg-cyan-400";

  const subtext = isMaxed
    ? "Limit reached"
    : `${remaining} remaining`;

  return (
    <div>
      <div className="flex justify-between items-center mb-1">
        <span className={`text-[11px] ${color}`}>{label}</span>
        <span className={`text-[11px] font-medium ${color}`}>{used} / {limit}</span>
      </div>
      <div className="h-0.75 bg-white/5 rounded-full overflow-hidden">
        <div
          className={`h-full ${barColor} rounded-full transition-all duration-300`}
          style={{ width: `${pct}%` }}
        />
      </div>
      <p className={`text-[10px] mt-1 opacity-60 ${color}`}>{subtext}</p>
    </div>
  );
};

export default UsageBar;
