import DashboardOverview from "@/app/components/DashboardOverview";
import SpendingBreakdown from "@/app/components/SpendingBreakdown";
import AICategorization from "@/app/components/AICategorization";
import SavingsRate from "@/app/components/SavingsRate";
import DebitChart from "@/app/components/DebitChart";
import AnomalyAlerts from "@/app/components/AnomalyAlerts";
import TopMerchants from "@/app/components/TopMerchants";

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

      <DashboardOverview />

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
