import { CountyRegistration } from '../types';

interface CountyChartProps {
  data: CountyRegistration[];
}

export function CountyChart({ data }: CountyChartProps) {
  const sortedData = [...data].sort((a, b) => b.count - a.count);
  const topCounties = sortedData.slice(0, 10);
  const maxValue = Math.max(...topCounties.map(d => d.count));

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 min-w-full">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 sm:mb-6">Top 10 Counties by YSO Registration</h3>
      <div className="space-y-2 sm:space-y-3">
        {topCounties.map((county) => (
          <div key={county.id} className="flex items-center gap-2 sm:gap-4">
            <div className="w-24 sm:w-32 text-xs sm:text-sm font-medium text-slate-700 truncate">{county.county_name}</div>
            <div className="flex-1 flex items-center gap-2 sm:gap-3 min-w-0">
              <div className="flex-1 bg-slate-100 rounded-full h-6 sm:h-8 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-blue-600 to-blue-500 h-full rounded-full flex items-center justify-end pr-2 sm:pr-3 transition-all duration-500"
                  style={{
                    width: `${(county.count / maxValue) * 100}%`,
                  }}
                >
                  <span className="text-white text-xs font-semibold">{county.count}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
