import { useEffect, useState } from 'react';
import { TrendingUp, Users, MapPin, Briefcase } from 'lucide-react';
import { supabase } from './lib/supabase';
import { StatCard } from './components/StatCard';
import { MonthlyChart } from './components/MonthlyChart';
import { WeeklyChart } from './components/WeeklyChart';
import { CountyChart } from './components/CountyChart';
import { SectorChart } from './components/SectorChart';
import { GrowthTable } from './components/GrowthTable';
import {
  MonthlyRegistration,
  WeeklyRegistration,
  CountyRegistration,
  SectorRegistration,
  GrowthMetric,
} from './types';

function App() {
  const [monthlyData, setMonthlyData] = useState<MonthlyRegistration[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyRegistration[]>([]);
  const [countyData, setCountyData] = useState<CountyRegistration[]>([]);
  const [sectorData, setSectorData] = useState<SectorRegistration[]>([]);
  const [growthData, setGrowthData] = useState<GrowthMetric[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      const [monthly, weekly, county, sector, growth] = await Promise.all([
        supabase.from('monthly_registrations').select('*').order('created_at'),
        supabase.from('weekly_registrations').select('*').order('start_date'),
        supabase.from('county_registrations').select('*'),
        supabase.from('sector_registrations').select('*'),
        supabase.from('growth_metrics').select('*').order('created_at'),
      ]);

      if (monthly.data) setMonthlyData(monthly.data);
      if (weekly.data) setWeeklyData(weekly.data);
      if (county.data) setCountyData(county.data);
      if (sector.data) setSectorData(sector.data);
      if (growth.data) setGrowthData(growth.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }

  const totalRegistrations = monthlyData.reduce((sum, item) => sum + item.count, 0);
  const latestGrowth = growthData[growthData.length - 1];
  const totalCounties = countyData.filter(c => c.count > 0).length;
  const totalSectors = sectorData.length;

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-slate-600 font-medium">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-slate-900">YSO Registration Analytics</h1>
              <p className="text-slate-600 mt-1">National Youth Council Kenya</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-600">Report Date</p>
              <p className="text-lg font-semibold text-slate-900">29 September 2025</p>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Registrations"
            value={totalRegistrations}
            icon={Users}
            trend={latestGrowth ? `+${latestGrowth.weekly_growth} this week` : undefined}
            trendUp={true}
          />
          <StatCard
            title="Current Total"
            value={latestGrowth?.current_number || 0}
            icon={TrendingUp}
            trend={latestGrowth ? `${latestGrowth.weekly_growth_percentage}% growth` : undefined}
            trendUp={true}
          />
          <StatCard
            title="Active Counties"
            value={totalCounties}
            icon={MapPin}
          />
          <StatCard
            title="Sector Groups"
            value={totalSectors}
            icon={Briefcase}
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <MonthlyChart data={monthlyData} />
          <WeeklyChart data={weeklyData} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <CountyChart data={countyData} />
          <GrowthTable data={growthData} />
        </div>

        <div className="mb-8">
          <SectorChart data={sectorData} />
        </div>

        <footer className="mt-12 py-6 border-t border-slate-200">
          <div className="text-center text-sm text-slate-600">
            <p className="font-medium">National Youth Council Kenya</p>
            <p className="mt-1">Amplifying the Youth Voice</p>
          </div>
        </footer>
      </main>
    </div>
  );
}

export default App;
