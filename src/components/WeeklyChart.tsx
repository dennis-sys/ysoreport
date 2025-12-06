import { WeeklyRegistration } from '../types';

interface WeeklyChartProps {
  data: WeeklyRegistration[];
}

export function WeeklyChart({ data }: WeeklyChartProps) {
  const maxValue = Math.max(...data.map(d => d.count));
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
  const chartHeight = isMobile ? 200 : 256;
  const chartPadding = isMobile ? 40 : 50;
  const availableHeight = chartHeight - chartPadding;
  const barWidth = isMobile ? 30 : 60;
  const gap = isMobile ? 40 : 80;

  const movingAverage = data.map((_, index) => {
    if (index === 0) return data[0].count;
    const sum = data.slice(0, index + 1).reduce((acc, item) => acc + item.count, 0);
    return sum / (index + 1);
  });

  const totalWidth = (barWidth + gap) * data.length + gap * 2;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 min-w-full print:shadow-none print:border print:p-4">
      <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-4 sm:mb-6 print:text-base print:mb-3">November 2025 Registered YSOs</h3>
      <div className="space-y-4 overflow-x-auto">
        <svg width="100%" height={chartHeight} viewBox={`0 0 ${totalWidth} ${chartHeight}`} className="overflow-visible min-w-max">
          <defs>
            <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="100%" stopColor="#ca8a04" />
            </linearGradient>
          </defs>

          {data.map((item, index) => {
            const x = gap + index * (barWidth + gap);
            const barHeight = (item.count / maxValue) * availableHeight;
            const y = chartHeight - barHeight - 35;

            return (
              <g key={item.id}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  fill="url(#barGradient)"
                  className="transition-all duration-500 hover:opacity-80"
                  rx={3}
                />
                <text
                  x={x + barWidth / 2}
                  y={y - 8}
                  textAnchor="middle"
                  className="font-semibold fill-slate-900"
                  fontSize={isMobile ? '10' : '14'}
                >
                  {item.count}
                </text>
              </g>
            );
          })}

          <polyline
            points={data
              .map((_item, index) => {
                const x = gap + index * (barWidth + gap) + barWidth / 2;
                const maHeight = (movingAverage[index] / maxValue) * availableHeight;
                const y = chartHeight - maHeight - 35;
                return `${x},${y}`;
              })
              .join(' ')}
            fill="none"
            stroke="#3b82f6"
            strokeWidth="3"
            strokeDasharray="5,5"
            className="transition-all duration-500"
          />

          {data.map((item, index) => {
            const x = gap + index * (barWidth + gap) + barWidth / 2;
            const maHeight = (movingAverage[index] / maxValue) * availableHeight;
            const y = chartHeight - maHeight - 35;

            return (
              <circle
                key={`ma-${item.id}`}
                cx={x}
                cy={y}
                r="4"
                fill="#3b82f6"
                stroke="white"
                strokeWidth="2"
                className="transition-all duration-500"
              />
            );
          })}

          {data.map((item, index) => {
            const x = gap + index * (barWidth + gap);
            return (
              <text
                key={`label-${item.id}`}
                x={x + barWidth / 2}
                y={chartHeight - 10}
                textAnchor="middle"
                className="font-medium fill-slate-700"
                fontSize={isMobile ? '9' : '12'}
              >
                {item.date_range.split('-')[0]}
              </text>
            );
          })}
        </svg>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <div className="w-3 h-2 sm:h-3 rounded-sm bg-gradient-to-b from-yellow-500 to-yellow-600" />
            <span className="text-xs sm:text-sm text-slate-600">Registrations</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-0.5 border-t-2 border-dashed border-blue-500" />
            <span className="text-xs sm:text-sm text-slate-600">Moving Average</span>
          </div>
        </div>
      </div>
    </div>
  );
}
