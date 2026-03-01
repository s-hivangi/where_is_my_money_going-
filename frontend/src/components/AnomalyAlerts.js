const alerts = [
  {
    title: "Spending spike detected",
    desc: "₹5,200 debit on Feb 13 — 126% above your daily average of ₹2,300.",
    severity: "high",
    time: "2d ago",
  },
  {
    title: "Possible unused subscription",
    desc: "Spotify charged ₹799 — no listening activity detected in 3 weeks.",
    severity: "medium",
    time: "5d ago",
  },
  {
    title: "Unrecognized merchant",
    desc: "First-time charge of ₹380 from 'CloudKitchen' via HDFC.",
    severity: "low",
    time: "6d ago",
  },
];

const severityBorder = {
  high: "border-l-red-500",
  medium: "border-l-amber-500",
  low: "border-l-blue-500",
};

export default function AnomalyAlerts() {
  return (
    <div className="bg-[#0c1017] border rounded-md p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.15em] font-medium">Anomalies</p>
          <span className="text-[9px] text-red-500 bg-red-500/10 border border-red-500/20 px-1.5 py-px rounded-sm tabular-nums">{alerts.length}</span>
        </div>
        <button className="text-[10px] text-gray-600 hover:text-gray-400 transition-colors underline underline-offset-2 decoration-gray-700">
          View all
        </button>
      </div>

      <div className="flex flex-col gap-2">
        {alerts.map((alert, i) => (
          <div
            key={i}
            className={`border border-l-2 ${severityBorder[alert.severity]} rounded-sm p-3 hover:bg-white/1 transition-colors`}
          >
            <div className="flex items-start justify-between gap-2 mb-1">
              <p className="text-[12px] text-gray-300 font-medium leading-tight">{alert.title}</p>
              <span className="text-[9px] text-gray-600 whitespace-nowrap shrink-0">{alert.time}</span>
            </div>
            <p className="text-[11px] text-gray-500 leading-relaxed">{alert.desc}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
