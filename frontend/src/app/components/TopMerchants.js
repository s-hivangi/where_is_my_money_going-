"use client";
import { useEffect, useState } from "react";

export default function TopMerchants() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics/top-merchants")
      .then((res) => res.json())
      .then((json) => {
        setData(json.data);
        setLoading(false);
      });
  }, []);

  if (loading) return (
    <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
      <h2 className="text-sm font-semibold text-white/70 mb-4">Top Merchants</h2>
      <div className="h-48 flex items-center justify-center text-white/20 text-sm">Loading...</div>
    </div>
  );

  const max = data[0]?.total || 1;

  return (
    <div className="bg-[#12121a] rounded-xl border border-white/10 p-5">
      <h2 className="text-sm font-semibold text-white/70 mb-4">Top Merchants</h2>
      <div className="flex flex-col gap-3">
        {data.map((merchant, index) => (
          <div key={index}>
            <div className="flex justify-between items-center mb-1">
              <div className="flex items-center gap-2">
                <span className="text-white/30 text-xs w-4">{index + 1}</span>
                <span className="text-white text-sm">{merchant.merchant}</span>
              </div>
              <div className="text-right">
                <span className="text-white text-sm font-medium">${merchant.total.toLocaleString()}</span>
                <span className="text-white/30 text-xs ml-2">{merchant.count} txns</span>
              </div>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1">
              <div
                className="h-1 rounded-full bg-purple-500"
                style={{ width: `${(merchant.total / max) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
