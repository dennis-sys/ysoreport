import { SectorRegistration } from '../types';

interface SectorChartProps {
  data: SectorRegistration[];
}

export function SectorChart({ data }: SectorChartProps) {
  const sortedData = [...data].sort((a, b) => b.count - a.count);
  const maxValue = Math.max(...sortedData.map(d => d.count));

  const colors = [
    '#10b981',
    '#eab308',
    '#ec4899',
    '#f97316',
    '#dc2626',
    '#6366f1',
    '#8b5cf6',
    '#06b6d4',
  ];

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 min-w-full">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 sm:mb-6">YSOs by Sector Working Group</h3>
      <div className="space-y-2 sm:space-y-3">
        {sortedData.map((sector, index) => (
          <div key={sector.id} className="flex items-center gap-2 sm:gap-4 flex-wrap">
            <div className="min-w-fit max-w-xs sm:max-w-sm lg:max-w-md text-xs sm:text-sm font-medium text-slate-700">{sector.sector_name}</div>
            <div className="flex-1 flex items-center gap-2 sm:gap-3 min-w-20">
              <div className="flex-1 bg-slate-100 rounded-full h-6 sm:h-8 overflow-hidden min-w-12">
                <div
                  className="h-full rounded-full flex items-center justify-end pr-2 sm:pr-3 transition-all duration-500"
                  style={{
                    width: `${(sector.count / maxValue) * 100}%`,
                    backgroundColor: colors[index % colors.length],
                  }}
                >
                  <span className="text-white text-xs font-semibold">{sector.count}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
