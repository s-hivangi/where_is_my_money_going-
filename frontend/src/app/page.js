import SpendingBreakdown from "@/components/SpendingBreakdown";
import AICategorization from "@/components/AICategorization";
import SavingsRate from "@/components/SavingsRate";
import DebitChart from "@/components/DebitChart";
import AnomalyAlerts from "@/components/AnomalyAlerts";
import TopMerchants from "@/components/TopMerchants";

export default function Home() {
  return (
    <div>
      {/* Section 01 — Overview */}
      <div className="flex items-baseline justify-between mb-5">
        <div>
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] mb-1 font-medium">01 — Overview</p>
          <h1 className="font-(family-name:--font-heading) text-[22px] text-white tracking-tight">February 2026</h1>
        </div>
        <p className="text-[11px] text-gray-600">Last updated 2 hours ago</p>
      </div>

      {/* Summary row — intentionally uneven: 1.4fr / 1fr / 0.7fr */}
      <div className="grid grid-cols-[1.4fr_1fr_0.7fr] gap-3 mb-5">
        <div className="bg-[#0c1017] border rounded-md p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] text-gray-600 uppercase tracking-[0.15em] font-medium">Total Spent</p>
            <span className="text-[10px] text-red-400 bg-red-500/10 border border-red-500/20 px-1.5 py-px rounded-xs">+8.4%</span>
          </div>
          <p className="text-[28px] font-(family-name:--font-heading) text-white tracking-tight leading-none">₹69,700</p>
          <div className="mt-3 flex items-center gap-3 text-[10px] text-gray-600">
            <span>142 transactions</span>
            <span className="w-0.75 h-0.75 bg-gray-700 rounded-full" />
            <span>3 banks</span>
          </div>
        </div>
        <div className="bg-[#0c1017] border rounded-md p-4">
          <div className="flex items-center justify-between mb-3">
            <p className="text-[10px] text-gray-600 uppercase tracking-[0.15em] font-medium">Saved</p>
            <span className="text-[10px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-px rounded-xs">18%</span>
          </div>
          <p className="text-[28px] font-(family-name:--font-heading) text-white tracking-tight leading-none">₹15,300</p>
          <div className="mt-3 text-[10px] text-gray-600">of ₹85,000 income</div>
        </div>
        <div className="bg-[#0c1017] border rounded-md p-4">
          <p className="text-[10px] text-gray-600 uppercase tracking-[0.15em] font-medium mb-3">Top Category</p>
          <p className="text-[28px] font-(family-name:--font-heading) text-white tracking-tight leading-none">Rent</p>
          <div className="mt-3 text-[10px] text-gray-600">₹15,000 this month</div>
        </div>
      </div>

      {/* Section 02 — Charts, asymmetric 1.7fr / 1fr */}
      <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] mb-3 font-medium">02 — Spending Analysis</p>
      <div className="grid grid-cols-[1.7fr_1fr] gap-3 mb-3">
        <DebitChart />
        <SpendingBreakdown />
      </div>

      {/* Full width AI categorization */}
      <div className="mb-3">
        <AICategorization />
      </div>

      {/* Section 03 — Bottom row, asymmetric 0.7fr / 1.3fr / 1fr */}
      <p className="text-[10px] text-gray-600 uppercase tracking-[0.2em] mb-3 font-medium">03 — Insights</p>
      <div className="grid grid-cols-[0.7fr_1.3fr_1fr] gap-3">
        <SavingsRate />
        <AnomalyAlerts />
        <TopMerchants />
      </div>
    </div>
  );
}
