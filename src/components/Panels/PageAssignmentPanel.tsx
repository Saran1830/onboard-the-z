"use client";
import { useMemo, useState } from "react";
import { useToast } from "../../components/Toast";
import type { CustomComponent } from"../../types/components";

type Props = {
  page: number;
  available: CustomComponent[];
  builtInNames: string[];
  initialSelection: string[];
  onSave: (components: string[]) => Promise<void>;
};

export default function PageAssignmentPanel({
  page, available, builtInNames, initialSelection, onSave
}: Props) {
  const [selection, setSelection] = useState<string[]>(initialSelection);
  const [saving, setSaving] = useState(false);
  const { success, error } = useToast();

  const hasComponents = selection.length > 0;
  const sorted = useMemo(
    () => [...available].sort((a, b) => a.label.localeCompare(b.label)),
    [available]
  );

  const toggle = (name: string) =>
    setSelection(prev => prev.includes(name) ? prev.filter(n => n !== name) : [...prev, name]);

  return (
    <div className="flex-1 bg-white/70 rounded-xl shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-bold text-base">Page {page}</h3>
        <div className="flex items-center space-x-2">
          <div className={`w-3 h-3 rounded-full ${hasComponents ? "bg-green-500" : "bg-gray-300"}`} />
          <span className="text-xs text-gray-600">{hasComponents ? `${selection.length} components` : "No components"}</span>
        </div>
      </div>

      <ul className="mb-4 space-y-2">
        {sorted.map(comp => (
          <li key={comp.name}>
            <label className="flex items-center gap-3 p-2 hover:bg-gray-50 rounded-md cursor-pointer">
              <input
                type="checkbox" className="accent-blue-500 w-4 h-4"
                checked={selection.includes(comp.name)} onChange={() => toggle(comp.name)}
              />
              <div className="flex-1">
                <div className="flex items-center space-x-2">
                  <span className="font-semibold text-gray-800">{comp.label}</span>
                  {builtInNames.includes(comp.name) && (
                    <span className="px-2 py-0.5 bg-gray-100 text-gray-600 text-xs rounded-full">built-in</span>
                  )}
                </div>
                <div className="flex items-center space-x-3 mt-1 text-xs text-gray-500">
                  <span>Type: {comp.type}</span>
                  {comp.required && <span className="text-red-600 font-medium">Required</span>}
                  {comp.placeholder && <span className="text-gray-400">&quot;{comp.placeholder}&quot;</span>}
                </div>
              </div>
            </label>
          </li>
        ))}
      </ul>

      <div className="flex items-center justify-between">
        <button
          onClick={async () => {
            setSaving(true);
            try { 
              await onSave(selection); 
              success('Configuration Saved', `Page ${page} configuration has been updated successfully.`);
            } catch (err) {
              error('Save Failed', `Failed to save Page ${page} configuration: ${err instanceof Error ? err.message : 'Unknown error'}`);
            } finally { 
              setSaving(false); 
            }
          }}
          disabled={!hasComponents || saving}
          className={`px-6 py-3 rounded-lg font-medium transition-all flex items-center
            ${hasComponents ? " bg-pink-200 btn-primary hover:-translate-y-0.5 hover:shadow-lg" : "bg-gray-200 text-gray-500 cursor-not-allowed opacity-50"}`}
        >
          {saving ? "Saving..." : "Save Configuration"}
        </button>

        {!hasComponents && (
          <span className="text-xs text-red-600 bg-red-50 px-3 py-2 rounded-lg border border-red-200 flex items-center">
            Page must have at least 1 component
          </span>
        )}
      </div>
    </div>
  );
}
