import { MonthlyRegistration } from '../types';

interface MonthlyChartProps {
  data: MonthlyRegistration[];
}

export function MonthlyChart({ data }: MonthlyChartProps) {
  const maxValue = Math.max(...data.map(d => d.count));
  const colors = ['#059669', '#dc2626', '#10b981', '#eab308'];

  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const chartHeight = isMobile ? 200 : 256;
  const chartPadding = isMobile ? 30 : 40;
  const availableHeight = chartHeight - chartPadding;
  const barWidth = isMobile ? 40 : 80;
  const gap = isMobile ? 30 : 60;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 min-w-full">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 sm:mb-6">Year 2025/26 YSO Registration Progress</h3>
      <div className="space-y-4 overflow-x-auto">
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${(barWidth + gap) * data.length + gap} ${chartHeight}`} className="overflow-visible min-w-max">
          {data.map((item, index) => {
            const x = gap + index * (barWidth + gap);
            const barHeight = (item.count / maxValue) * availableHeight;
            const y = chartHeight - barHeight - 20;

            return (
              <g key={item.id}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill={colors[index % colors.length]}
                  className="transition-all duration-500 hover:opacity-80"
                  rx={4}
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  className="font-semibold fill-slate-900"
                  fontSize={isMobile ? '11' : '14'}
                >
                  {item.count}
                </text>
                <text
                  x={x + barWidth / 2}
                  y={chartHeight - 2}
                  textAnchor="middle"
                  className="font-medium fill-slate-700"
                  fontSize={isMobile ? '10' : '12'}
                >
                  {item.month}
                </text>
              </g>
            );
          })}
        </svg>
        <div className="flex flex-wrap justify-center gap-2 sm:gap-6 pt-4 border-t border-slate-200">
          {data.map((item, index) => (
            <div key={item.id} className="flex items-center gap-2">
              <div
                className="w-2 sm:w-3 h-2 sm:h-3 rounded-sm"
                style={{ backgroundColor: colors[index % colors.length] }}
              />
              <span className="text-xs sm:text-sm text-slate-600">{item.month}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
