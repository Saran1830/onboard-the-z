// CreateComponentModal.tsx
"use client";
import { useState } from "react";
import { COMPONENT_TYPES, type ComponentType } from "@/types/components";

// unify the payload shape the modal emits
type CreatePayload = {
  name: string;
  label: string;
  type: ComponentType;        // <-- use the union, not string
  required: boolean;
  placeholder: string;
  options: string[] | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  onCreate: (data: CreatePayload) => Promise<void>; // <-- return Promise<void>
};

export default function CreateComponentModal({ open, onClose, onCreate }: Props) {
  const [form, setForm] = useState<CreatePayload>({
    name: "",
    label: "",
    type: "text",             // valid default from ComponentType
    required: false,
    placeholder: "",
    options: null,
  });
  const [submitting, setSubmitting] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20">
      <div className="bg-white/80 py-4 rounded-xl shadow-xl p-8 min-w-[380px] max-w-[420px] relative backdrop-blur">
        <button onClick={onClose} className="absolute top-4 right-4 text-2xl text-gray-400 hover:text-gray-600" aria-label="Close">×</button>
        <h2 className="mb-4 text-lg font-semibold">Create New Component</h2>

        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setSubmitting(true);
            setErr(null);
            try {
              await onCreate(form);  // emits the union-typed payload
              onClose();
            } catch (e: unknown) {
              if (e instanceof Error) {
                setErr(e.message);
              } else {
                setErr("Failed to create component");
              }
            } finally {
              setSubmitting(false);
            }
          }}
          className="flex flex-col gap-4"
        >
          <label className="font-medium">
            Component Name
            <input
              className="w-full mt-1 p-3 rounded-lg border border-gray-200 bg-gray-50"
              value={form.name}
              onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
              required
            />
          </label>

          <label className="font-medium">
            Display Label
            <input
              className="w-full mt-1 p-3 rounded-lg border border-gray-200 bg-gray-50"
              value={form.label}
              onChange={(e) => setForm(f => ({ ...f, label: e.target.value }))}
              required
            />
          </label>

          <label className="font-medium">
            Field Type
            <select
              className="w-full mt-1 p-3 rounded-lg border border-blue-300 bg-gray-50"
              value={form.type}
              onChange={(e) =>
                setForm(f => ({ ...f, type: e.target.value as ComponentType })) // cast select value to union
              }
            >
              {COMPONENT_TYPES.map(t => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </label>

          <label className="font-medium">
            Placeholder (optional)
            <input
              className="w-full mt-1 p-3 rounded-lg border border-gray-200 bg-gray-50"
              value={form.placeholder}
              onChange={(e) => setForm(f => ({ ...f, placeholder: e.target.value }))}
            />
          </label>

          <label className="flex items-center gap-2 font-medium">
            <input
              type="checkbox"
              className="accent-blue-500"
              checked={form.required}
              onChange={(e) => setForm(f => ({ ...f, required: e.target.checked }))}
            />
            Required field
          </label>

          <div className="flex gap-4 mt-2">
            <button disabled={submitting} className="flex-1 py-3 rounded-xl bg-blue-200 text-blue-900 font-semibold hover:bg-blue-300 transition">
              {submitting ? "Creating…" : "Create Component"}
            </button>
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-xl bg-gray-100 text-gray-700 font-semibold hover:bg-gray-200 transition">
              Cancel
            </button>
          </div>

          {err && <div className="text-red-600 mt-2">{err}</div>}
        </form>
      </div>
    </div>
  );
}
