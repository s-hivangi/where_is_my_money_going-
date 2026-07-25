"use client";
import { useEffect, useState } from "react";

export default function AnomalyAlerts() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/anomalies")
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
      <h2 className="text-sm font-semibold text-white/70 mb-4">Anomaly Detection</h2>
      <div className="h-32 flex items-center justify-center text-white/20 text-sm">Loading...</div>
    </div>
  );

  return (
    <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h2 className="text-sm font-semibold text-white/70">Anomaly Detection</h2>
          {data.length > 0 && (
            <span className="text-xs bg-red-500/20 text-red-400 px-2 py-0.5 rounded-full">
              {data.length}
            </span>
          )}
        </div>
      </div>

      {data.length === 0 ? (
        <div className="text-white/20 text-sm text-center py-6">No anomalies detected</div>
      ) : (
        <div className="flex flex-col gap-3">
          {data.map((item, index) => (
            <div key={index} className="bg-red-500/10 border border-red-500/20 rounded-lg p-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-sm font-medium text-white">{item.merchant}</div>
                  <div className="text-xs text-white/40 mt-0.5">
                    {item.category} • avg ${parseFloat(item.avg_amount).toFixed(0)} normally
                  </div>
                </div>
                <div className="text-red-400 font-semibold text-sm">
                  ${item.amount.toLocaleString()}
                </div>
              </div>
              <div className="text-xs text-red-400/70 mt-2">
                {((item.amount / item.avg_amount - 1) * 100).toFixed(0)}% above average for this category
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
