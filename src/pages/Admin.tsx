import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Calendar, TrendingUp, MapPin, Briefcase, BarChart3, Eye } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { MonthlyEditor } from '../components/admin/MonthlyEditor';
import { WeeklyEditor } from '../components/admin/WeeklyEditor';
import { CountyEditor } from '../components/admin/CountyEditor';
import { SectorEditor } from '../components/admin/SectorEditor';
import { GrowthEditor } from '../components/admin/GrowthEditor';

type Tab = 'monthly' | 'weekly' | 'county' | 'sector' | 'growth';

export function Admin() {
  const [activeTab, setActiveTab] = useState<Tab>('monthly');
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate('/login');
  };

  const tabs = [
    { id: 'monthly' as Tab, label: 'Monthly Data', icon: Calendar },
    { id: 'weekly' as Tab, label: 'Weekly Data', icon: BarChart3 },
    { id: 'county' as Tab, label: 'Counties', icon: MapPin },
    { id: 'sector' as Tab, label: 'Sectors', icon: Briefcase },
    { id: 'growth' as Tab, label: 'Growth Metrics', icon: TrendingUp },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Admin Dashboard</h1>
              <p className="text-sm text-slate-600 mt-1">Manage YSO Registration Data</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm text-slate-600">Logged in as</p>
                <p className="text-sm font-medium text-slate-900">{user?.email}</p>
              </div>
              <button
                onClick={() => navigate('/')}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                <Eye className="w-4 h-4" />
                <span>View Dashboard</span>
              </button>
              <button
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden">
          <div className="border-b border-slate-200">
            <nav className="flex">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center gap-2 px-6 py-4 font-medium transition-colors ${
                      activeTab === tab.id
                        ? 'text-blue-600 border-b-2 border-blue-600'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'monthly' && <MonthlyEditor />}
            {activeTab === 'weekly' && <WeeklyEditor />}
            {activeTab === 'county' && <CountyEditor />}
            {activeTab === 'sector' && <SectorEditor />}
            {activeTab === 'growth' && <GrowthEditor />}
          </div>
        </div>
      </div>
    </div>
  );
}
