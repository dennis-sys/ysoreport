import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import logoDesign from '../assets/logo design.png';
import { Settings, LogOut } from 'lucide-react';
import { supabase } from '../lib/supabase';

export function AdminAccess() {
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/');
  };

  if (!user) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <header className="bg-white border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <img src={logoDesign} alt="YSO" className="h-16 w-auto" />
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Admin Access Portal</h1>
                <p className="text-sm text-slate-600 mt-1">YSO Registration Report System</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors shadow-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div
            onClick={() => navigate('/admin')}
            className="bg-white rounded-lg shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-shadow cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-4 rounded-lg group-hover:bg-blue-200 transition-colors">
                <Settings className="w-8 h-8 text-blue-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Admin Dashboard</h2>
                <p className="text-slate-600 mb-4">Manage and update registration data across all categories. Edit weekly registrations, monthly data, county details, sector information, and growth metrics.</p>
                <div className="inline-block px-4 py-2 bg-blue-600 text-white rounded-lg group-hover:bg-blue-700 transition-colors font-medium">
                  Access Dashboard →
                </div>
              </div>
            </div>
          </div>

          <div
            onClick={() => navigate('/')}
            className="bg-white rounded-lg shadow-lg border border-slate-200 p-8 hover:shadow-xl transition-shadow cursor-pointer group"
          >
            <div className="flex items-start gap-4">
              <div className="bg-emerald-100 p-4 rounded-lg group-hover:bg-emerald-200 transition-colors">
                <Settings className="w-8 h-8 text-emerald-600" />
              </div>
              <div className="flex-1">
                <h2 className="text-2xl font-bold text-slate-900 mb-2">Public Dashboard</h2>
                <p className="text-slate-600 mb-4">View the public-facing registration report dashboard. This is the view shared with the public and stakeholders.</p>
                <div className="inline-block px-4 py-2 bg-emerald-600 text-white rounded-lg group-hover:bg-emerald-700 transition-colors font-medium">
                  View Public Dashboard →
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 bg-white rounded-lg shadow-sm border border-slate-200 p-8">
          <h3 className="text-lg font-bold text-slate-900 mb-4">Admin Information</h3>
          <p className="text-slate-600 mb-2">
            <span className="font-medium">Logged in as:</span> {user.email}
          </p>
          <p className="text-slate-600">
            This admin portal is for authorized users only. All changes made are logged and tracked in the system.
          </p>
        </div>
      </main>
    </div>
  );
}
