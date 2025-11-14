import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Save, X, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { CountyRegistration } from '../../types';

export function CountyEditor() {
  const [data, setData] = useState<CountyRegistration[]>([]);
  const [filteredData, setFilteredData] = useState<CountyRegistration[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({ county_name: '', count: 0 });
  const [isAdding, setIsAdding] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  useEffect(() => {
    if (searchTerm) {
      setFilteredData(
        data.filter((county) =>
          county.county_name.toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    } else {
      setFilteredData(data);
    }
  }, [searchTerm, data]);

  async function fetchData() {
    const { data: records } = await supabase
      .from('county_registrations')
      .select('*')
      .order('county_name');
    if (records) {
      setData(records);
      setFilteredData(records);
    }
    setLoading(false);
  }

  const handleAdd = async () => {
    const { error } = await supabase
      .from('county_registrations')
      .insert([formData]);

    if (!error) {
      await fetchData();
      setIsAdding(false);
      setFormData({ county_name: '', count: 0 });
    }
  };

  const handleUpdate = async (id: string) => {
    const { error } = await supabase
      .from('county_registrations')
      .update(formData)
      .eq('id', id);

    if (!error) {
      await fetchData();
      setEditingId(null);
      setFormData({ county_name: '', count: 0 });
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this record?')) {
      const { error } = await supabase
        .from('county_registrations')
        .delete()
        .eq('id', id);

      if (!error) await fetchData();
    }
  };

  const startEdit = (record: CountyRegistration) => {
    setEditingId(record.id);
    setFormData({ county_name: record.county_name, count: record.count });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsAdding(false);
    setFormData({ county_name: '', count: 0 });
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">County Registrations</h2>
        <div className="flex gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search counties..."
              className="pl-10 pr-4 py-2 border border-slate-300 rounded-lg"
            />
          </div>
          <button
            onClick={() => setIsAdding(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            Add County
          </button>
        </div>
      </div>

      {isAdding && (
        <div className="bg-slate-50 p-4 rounded-lg border border-slate-200">
          <h3 className="font-medium text-slate-900 mb-4">Add New County</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">County Name</label>
              <input
                type="text"
                value={formData.county_name}
                onChange={(e) => setFormData({ ...formData, county_name: e.target.value })}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                placeholder="e.g., Nairobi City"
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
        {filteredData.map((record) => (
          <div key={record.id} className="bg-white border border-slate-200 rounded-lg p-4">
            {editingId === record.id ? (
              <div>
                <div className="space-y-3 mb-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">County Name</label>
                    <input
                      type="text"
                      value={formData.county_name}
                      onChange={(e) => setFormData({ ...formData, county_name: e.target.value })}
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
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleUpdate(record.id)}
                    className="flex items-center gap-2 px-3 py-1.5 bg-green-600 text-white text-sm rounded-lg hover:bg-green-700"
                  >
                    <Save className="w-3 h-3" />
                    Save
                  </button>
                  <button
                    onClick={cancelEdit}
                    className="flex items-center gap-2 px-3 py-1.5 bg-slate-200 text-slate-700 text-sm rounded-lg hover:bg-slate-300"
                  >
                    <X className="w-3 h-3" />
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-slate-900">{record.county_name}</p>
                  <p className="text-sm text-slate-600">YSOs: {record.count}</p>
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
