import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { GrowthMetric } from '../../types';

export function GrowthEditor() {
  const [data, setData] = useState<GrowthMetric[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    date_range: '',
    previous_number: 0,
    current_number: 0,
    weekly_growth: 0,
    weekly_growth_percentage: 0
  });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const { data: records } = await supabase
      .from('growth_metrics')
      .select('*')
      .order('created_at', { ascending: false });
    if (records) setData(records);
    setLoading(false);
  }

  const calculateGrowth = (previous: number, current: number) => {
    const growth = current - previous;
    const percentage = previous > 0 ? ((growth / previous) * 100).toFixed(3) : '0.000';
    return { growth, percentage: parseFloat(percentage) };
  };

  const handleAdd = async () => {
    const { growth, percentage } = calculateGrowth(formData.previous_number, formData.current_number);
    const dataToInsert = {
      ...formData,
      weekly_growth: growth,
      weekly_growth_percentage: percentage
    };

    const { error } = await supabase
      .from('growth_metrics')
      .insert([dataToInsert]);

    if (!error) {
      await fetchData();
      setIsAdding(false);
      setFormData({
        date_range: '',
        previous_number: 0,
        current_number: 0,
        weekly_growth: 0,
        weekly_growth_percentage: 0
      });
    }
  };

  const handleUpdate = async (id: string) => {
    const { growth, percentage } = calculateGrowth(formData.previous_number, formData.current_number);
    const dataToUpdate = {
      ...formData,
      weekly_growth: growth,
      weekly_growth_percentage: percentage
    };

    const { error } = await supabase
      .from('growth_metrics')
      .update(dataToUpdate)
      .eq('id', id);

    if (!error) {
      await fetchData();
      setEditingId(null);
      setFormData({
        date_range: '',
        previous_number: 0,
        current_number: 0,
        weekly_growth: 0,
        weekly_growth_percentage: 0
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      const { error } = await supabase
        .from('growth_metrics')
        .delete()
        .eq('id', id);

      if (!error) await fetchData();
    }
  };

  const startEdit = (record: GrowthMetric) => {
    setEditingId(record.id);
    setFormData({
      date_range: record.date_range,
      previous_number: record.previous_number,
      current_number: record.current_number,
      weekly_growth: record.weekly_growth,
      weekly_growth_percentage: record.weekly_growth_percentage,
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({
      date_range: '',
      previous_number: 0,
      current_number: 0,
      weekly_growth: 0,
      weekly_growth_percentage: 0
    });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">Growth Metrics</h2>
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
          <h3 className="font-medium text-slate-900 mb-4">Add New Growth Metric</h3>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Date Range</label>
              <input
                type="text"
                value={formData.date_range}
                onChange={(e) => setFormData({ ...formData, date_range: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="e.g., 23/9/2025-29/9/2025"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Previous Number</label>
              <input
                type="number"
                value={formData.previous_number}
                onChange={(e) => setFormData({ ...formData, previous_number: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">Current Number</label>
              <input
                type="number"
                value={formData.current_number}
                onChange={(e) => setFormData({ ...formData, current_number: parseInt(e.target.value) })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
              />
            </div>
          </div>
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <p className="text-sm text-slate-600">
              Growth will be calculated automatically:
              <span className="font-medium text-slate-900 ml-2">
                {formData.current_number - formData.previous_number}
                ({((formData.current_number - formData.previous_number) / (formData.previous_number || 1) * 100).toFixed(3)}%)
              </span>
            </p>
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
                <div className="grid grid-cols-3 gap-4 mb-4">
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
                    <label className="block text-sm font-medium text-slate-700 mb-2">Previous Number</label>
                    <input
                      type="number"
                      value={formData.previous_number}
                      onChange={(e) => setFormData({ ...formData, previous_number: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Current Number</label>
                    <input
                      type="number"
                      value={formData.current_number}
                      onChange={(e) => setFormData({ ...formData, current_number: parseInt(e.target.value) })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                    />
                  </div>
                </div>
                <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm text-slate-600">
                    Growth will be calculated automatically:
                    <span className="font-medium text-slate-900 ml-2">
                      {formData.current_number - formData.previous_number}
                      ({((formData.current_number - formData.previous_number) / (formData.previous_number || 1) * 100).toFixed(3)}%)
                    </span>
                  </p>
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
                <div className="flex-1">
                  <p className="font-medium text-slate-900">{record.date_range}</p>
                  <div className="flex gap-6 mt-2 text-sm text-slate-600">
                    <span>Previous: {record.previous_number}</span>
                    <span>Current: {record.current_number}</span>
                    <span className="text-emerald-600 font-medium">
                      Growth: +{record.weekly_growth} ({record.weekly_growth_percentage}%)
                    </span>
                  </div>
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
