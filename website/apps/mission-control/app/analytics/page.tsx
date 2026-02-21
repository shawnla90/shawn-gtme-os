import { resolveDataRoot, getCostAnalytics } from '@shawnos/shared/lib'
import Link from 'next/link'
import CostAnalyticsDashboard from '../components/CostAnalyticsDashboard'
import CostHeatmap from '../components/CostHeatmap'

const DATA_ROOT = resolveDataRoot()

export default async function AnalyticsPage() {
  const analytics = getCostAnalytics(DATA_ROOT)

  return (
    <div className="space-y-6">
      {/* Nav */}
      <div className="flex items-center justify-between">
        <Link href="/" className="text-sm text-green-600 hover:text-green-400 transition-colors">
          &larr; Dashboard
        </Link>
        <Link href="/progression" className="text-sm text-green-600 hover:text-green-400 transition-colors">
          Progression &rarr;
        </Link>
      </div>

      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-green-300 mb-1">ANALYTICS</h1>
        <p className="text-sm text-gray-500">Token costs, model breakdown & efficiency trends</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-400">${analytics.total_spend.toFixed(2)}</div>
          <div className="text-[11px] text-gray-500 uppercase mt-1">Total Spend</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-400">${analytics.avg_daily.toFixed(2)}</div>
          <div className="text-[11px] text-gray-500 uppercase mt-1">Avg / Day</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-400">{analytics.days.length}</div>
          <div className="text-[11px] text-gray-500 uppercase mt-1">Days Tracked</div>
        </div>
        <div className="card text-center">
          <div className="text-2xl font-bold text-green-400">
            {Object.keys(analytics.model_totals).length}
          </div>
          <div className="text-[11px] text-gray-500 uppercase mt-1">Models Used</div>
        </div>
      </div>

      {/* Charts */}
      <CostAnalyticsDashboard analytics={analytics} />

      {/* Heatmap */}
      <CostHeatmap days={analytics.days} />
    </div>
  )
}
