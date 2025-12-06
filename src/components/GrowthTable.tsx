import { GrowthMetric } from '../types';

interface GrowthTableProps {
  data: GrowthMetric[];
}

export function GrowthTable({ data }: GrowthTableProps) {
  const latestGrowth = data[data.length - 1];

  if (!latestGrowth) return null;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 min-w-full print:shadow-none print:border print:p-4">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 sm:mb-6 print:text-base print:mb-3">Weekly Growth Metrics</h3>
      <div className="overflow-x-auto print:overflow-visible">
        <table className="w-full print:w-full">
          <thead>
            <tr className="border-b border-slate-200 print:border-b print:border-slate-300">
              <th className="text-left py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 print:py-2 print:px-2 print:text-xs">Metric</th>
              <th className="text-right py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm font-semibold text-slate-700 print:py-2 print:px-2 print:text-xs">Value</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-slate-100 hover:bg-slate-50 print:border-b print:border-slate-200">
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-slate-600 print:py-2 print:px-2 print:text-xs">Date Range</td>
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-900 text-right print:py-2 print:px-2 print:text-xs">{latestGrowth.date_range}</td>
            </tr>
            <tr className="border-b border-slate-100 hover:bg-slate-50 print:border-b print:border-slate-200">
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-slate-600 print:py-2 print:px-2 print:text-xs">Previous Number</td>
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-900 text-right print:py-2 print:px-2 print:text-xs">{latestGrowth.previous_number}</td>
            </tr>
            <tr className="border-b border-slate-100 hover:bg-slate-50 print:border-b print:border-slate-200">
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-slate-600 print:py-2 print:px-2 print:text-xs">Current Number</td>
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-medium text-slate-900 text-right print:py-2 print:px-2 print:text-xs">{latestGrowth.current_number}</td>
            </tr>
            <tr className="border-b border-slate-100 hover:bg-slate-50 print:border-b print:border-slate-200">
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-slate-600 print:py-2 print:px-2 print:text-xs">Weekly Growth</td>
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-medium text-emerald-600 text-right print:py-2 print:px-2 print:text-xs">+{latestGrowth.weekly_growth}</td>
            </tr>
            <tr className="hover:bg-slate-50">
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm text-slate-600 print:py-2 print:px-2 print:text-xs">Weekly Growth Percentage</td>
              <td className="py-3 sm:py-4 px-2 sm:px-4 text-xs sm:text-sm font-bold text-emerald-600 text-right print:py-2 print:px-2 print:text-xs">{latestGrowth.weekly_growth_percentage}%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}
