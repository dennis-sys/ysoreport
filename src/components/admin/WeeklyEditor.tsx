import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { WeeklyRegistration } from '../../types';

export function WeeklyEditor() {
  const [data, setData] = useState<WeeklyRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date_range: '',
    count: 0,
    start_date: '',
    end_date: ''
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: records } = await supabase
      .from('weekly_registrations')
      .select('*')
      .order('start_date');
    if (records) setData(records);
    setLoading(false);
  }

  const handleAdd = async () => {
    const { error } = await supabase
      .from('weekly_registrations')
      .insert([formData]);

    if (!error) {
      await fetchData();
      setIsAdding(false);
      setFormData({ date_range: '', count: 0, start_date: '', end_date: '' });
    }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from('weekly_registrations')
      .update(formData)
      .eq('id', id);

    if (!error) {
      await fetchData();
      setEditingId(null);
      setFormData({ date_range: '', count: 0, start_date: '', end_date: '' });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      const { error } = await supabase
        .from('weekly_registrations')
        .delete()
        .eq('id', id);

      if (!error) await fetchData();
    }
  };

  const startEdit = (record: WeeklyRegistration) => {
    setEditingId(record.id);
    setFormData({
      date_range: record.date_range,
      count: record.count,
      start_date: record.start_date,
      end_date: record.end_date,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ date_range: '', count: 0, start_date: '', end_date: '' });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Weekly Registrations</h2>
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          Add Record
        </button>
      </div>

      {isAdding && (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h3 className="font-medium text-slate-900 mb-4">Add New Record</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
              <input
                type="text"
                value={formData.date_range}
                onChange={(e) => setFormData({ ...formData, date_range: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="e.g., 1/9/2025-7/9/2025"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Count</label>
              <input
                type="number"
                value={formData.count}
                onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
              <input
                type="date"
                value={formData.start_date}
                onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
              <input
                type="date"
                value={formData.end_date}
                onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleAdd}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
            >
              <Save className="w-4 h-4" />
              Save
            </button>
            <button
              onClick={cancelEdit}
              className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
            >
              <X className="w-4 h-4" />
              Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-2">
        {data.map((record) => (
          <div key={record.id} className="bg-white border border-slate-200 rounded-lg p-4">
            {editingId === record.id ? (
              <div>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
                    <input
                      type="text"
                      value={formData.date_range}
                      onChange={(e) => setFormData({ ...formData, date_range: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Count</label>
                    <input
                      type="number"
                      value={formData.count}
                      onChange={(e) => setFormData({ ...formData, count: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={formData.start_date}
                      onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={formData.end_date}
                      onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(record.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    <Save className="w-4 h-4" />
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300"
                  >
                    <X className="w-4 h-4" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{record.date_range}</p>
                  <p className="text-sm text-slate-600">Registrations: {record.count}</p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => startEdit(record)}
                    className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg"
                  >
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(record.id)}
                    className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
