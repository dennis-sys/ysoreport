import { GrowthMetric } from '../types';

interface GrowthTableProps {
  data: GrowthMetric[];
}

export function GrowthTable({ data }: GrowthTableProps) {
  const latestGrowth = data[data.length - 1];

  if (!latestGrowth) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 min-w-full">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 sm:mb-6">Weekly Growth Metrics</h3>
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200">
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700">Metric</th>
              <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-slate-600">Date Range</td>
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-900 text-right">{latestGrowth.date_range}</td>
            </tr>
            <tr className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-slate-600">Previous Number</td>
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-900 text-right">{latestGrowth.previous_number}</td>
            </tr>
            <tr className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-slate-600">Current Number</td>
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-900 text-right">{latestGrowth.current_number}</td>
            </tr>
            <tr className="border-b border-slate-100 hover:bg-slate-50">
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-slate-600">Weekly Growth</td>
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-medium text-emerald-600 text-right">+{latestGrowth.weekly_growth}</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-slate-600">Weekly Growth Percentage</td>
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-bold text-emerald-600 text-right">{latestGrowth.weekly_growth_percentage}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
