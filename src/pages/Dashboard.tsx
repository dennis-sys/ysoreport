import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { TrendingUp, Users, MapPin, Briefcase, Settings, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import { StatCard } from '../components/StatCard';
import { MonthlyChart } from '../components/MonthlyChart';
import { WeeklyChart } from '../components/WeeklyChart';
import { CountyChart } from '../components/CountyChart';
import { SectorChart } from '../components/SectorChart';
import { GrowthTable } from '../components/GrowthTable';
import {
  MonthlyRegistration,
  WeeklyRegistration,
  CountyRegistration,
  SectorRegistration,
  GrowthMetric,
} from '../types';
import logoDesign from '../assets/logo design.png';
import { exportReportToPdf } from '../utils/pdfExport';

export function Dashboard() {
  const [monthlyData, setMonthlyData] = useState<MonthlyRegistration[]>([]);
  const [weeklyData, setWeeklyData] = useState<WeeklyRegistration[]>([]);
  const [countyData, setCountyData] = useState<CountyRegistration[]>([]);
  const [sectorData, setSectorData] = useState<SectorRegistration[]>([]);
  const [growthData, setGrowthData] = useState<GrowthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState<string>('');
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  function updateTime() {
    const now = new Date();
    const nairobiTime = new Date(now.toLocaleString('en-US', { timeZone: 'Africa/Nairobi' }));

    const dateFormatter = new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'Africa/Nairobi'
    });

    const timeFormatter = new Intl.DateTimeFormat('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true,
      timeZone: 'Africa/Nairobi'
    });

    const date = dateFormatter.format(nairobiTime);
    const time = timeFormatter.format(nairobiTime);
    setCurrentTime(`${date} • ${time} EAT`);
  }

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
  const latestWeekly = weeklyData[weeklyData.length - 1];
  const weeklyCount = latestWeekly?.count || 0;

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="flex items-center gap-3 sm:gap-4 min-w-0">
              <img src={logoDesign} alt="National Youth Council Kenya" className="h-12 sm:h-16 w-auto flex-shrink-0" />
              <div className="min-w-0">
                <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-slate-900 break-words">YSO REGISTRATION REPORT</h1>
              </div>
            </div>
            <div className="flex items-center gap-2 sm:gap-4 flex-shrink-0">
              <div className="text-right">
                <p className="text-xs sm:text-sm text-slate-600">Report Date & Time</p>
                <p className="text-sm sm:text-lg font-semibold text-slate-900 font-mono whitespace-nowrap">{currentTime || 'Loading...'}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8 relative">
        <div id="dashboard-report" className="bg-white rounded-lg p-4 sm:p-6 lg:p-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6 mb-6 sm:mb-8">
            <StatCard
              title="Weekly Registrations"
              value={weeklyCount}
              icon={Users}
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
              title="Sector Working Groups"
              value={totalSectors}
              icon={Briefcase}
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="overflow-x-auto">
              <MonthlyChart data={monthlyData} />
            </div>
            <div className="overflow-x-auto">
              <WeeklyChart data={weeklyData} />
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="overflow-x-auto">
              <CountyChart data={countyData} />
            </div>
            <div className="overflow-x-auto">
              <GrowthTable data={growthData} />
            </div>
          </div>

          <div className="mb-6 sm:mb-8 overflow-x-auto">
            <SectorChart data={sectorData} />
          </div>

          <footer className="mt-12 py-6 border-t border-slate-200">
            <div className="text-center text-sm text-slate-600">
              <p className="font-medium">National Youth Council Kenya</p>
              <p className="mt-1">Amplifying the Youth Voice</p>
            </div>
          </footer>
        </div>

        <button
          onClick={exportReportToPdf}
          className="fixed bottom-4 left-4 sm:bottom-8 sm:left-8 flex items-center gap-2 px-3 sm:px-4 py-2 sm:py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl z-50"
          title="Download Report as PDF"
        >
          <Download className="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" />
          <span className="font-medium text-sm sm:text-base">Download Report</span>
        </button>
      </main>
    </div>
  );
}
