import { useState } from 'react';
import { LucideIcon, Edit2, Check, X } from 'lucide-react';
import { supabase } from '../lib/supabase';

interface EditableStatCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  dataTable: string;
  dataId: string | number;
  dataField: string;
  isAdmin: boolean;
  onUpdate: () => void;
}

export function EditableStatCard({
  title,
  value,
  icon: Icon,
  dataTable,
  dataId,
  dataField,
  isAdmin,
  onUpdate,
}: EditableStatCardProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editValue, setEditValue] = useState(value.toString());
  const [isSaving, setIsSaving] = useState(false);

  async function handleSave() {
    setIsSaving(true);
    try {
      const newValue = parseInt(editValue);
      if (isNaN(newValue)) {
        alert('Please enter a valid number');
        return;
      }

      const { error } = await supabase
        .from(dataTable)
        .update({ [dataField]: newValue })
        .eq('id', dataId);

      if (error) throw error;

      setIsEditing(false);
      onUpdate();
    } catch (error) {
      console.error('Error updating value:', error);
      alert('Failed to update value');
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-slate-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-slate-600 mb-1">{title}</p>
          {isEditing ? (
            <input
              type="number"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              className="text-3xl font-bold text-slate-900 border-2 border-blue-500 rounded px-2 py-1 w-full"
              autoFocus
            />
          ) : (
            <p className="text-3xl font-bold text-slate-900">{value}</p>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <div className="bg-slate-100 p-3 rounded-lg">
            <Icon className="w-6 h-6 text-slate-700" />
          </div>
          {isAdmin && (
            <div className="flex gap-1">
              {isEditing ? (
                <>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="p-2 text-emerald-600 hover:bg-emerald-50 rounded transition-colors disabled:opacity-50"
                    title="Save"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      setIsEditing(false);
                      setEditValue(value.toString());
                    }}
                    disabled={isSaving}
                    className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setIsEditing(true)}
                  className="p-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors"
                  title="Edit"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
