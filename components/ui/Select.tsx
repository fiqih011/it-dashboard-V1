"use client";

type Props = {
  label: string;
  value: string;
  options: string[];
  onChange: (v: string) => void;
  required?: boolean;
  error?: string;
};

export default function Select({
  label,
  value,
  options,
  onChange,
  required = false,
  error,
}: Props) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-600">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-2 py-1 text-sm"
      >
        {options.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>

      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
}
