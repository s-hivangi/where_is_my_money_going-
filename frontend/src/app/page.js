import SpendingBreakdown from "@/components/SpendingBreakdown";
import AICategorization from "@/components/AICategorization";
import SavingsRate from "@/components/SavingsRate";
import DebitChart from "@/components/DebitChart";
import AnomalyAlerts from "@/components/AnomalyAlerts";

export default function Home() {
  return (
    <main className="min-h-screen text-white">
      <div className="grid grid-cols-3 gap-4">
        {/* Left Column */}
        <div className="flex flex-col gap-4">
          <SpendingBreakdown />
          <DebitChart />
        </div>

        {/* Middle Column */}
        <div className="flex flex-col gap-4">
          <AICategorization />
        </div>

        {/* Right Column */}
        <div className="flex flex-col gap-4">
          <SavingsRate />
          <AnomalyAlerts />
        </div>
      </div>
    </main>
  );
}
