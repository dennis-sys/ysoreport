import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
}

export function StatCard({ title, value, icon: Icon, trend, trendUp }: StatCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-4 sm:p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs sm:text-sm font-medium text-slate-600 mb-1">{title}</p>
          <p className="text-2xl sm:text-3xl font-bold text-slate-900 break-words">{value}</p>
          {trend && (
            <p className={`text-xs sm:text-sm mt-2 font-medium ${trendUp ? 'text-emerald-600' : 'text-red-600'}`}>
              {trend}
            </p>
          )}
        </div>
        <div className="bg-slate-100 p-2 sm:p-3 rounded-lg flex-shrink-0">
          <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-slate-700" />
        </div>
      </div>
    </div>
  );
}
