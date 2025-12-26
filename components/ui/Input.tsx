"use client";

type Props = {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: "text" | "number" | "date";
  required?: boolean;
  disabled?: boolean;
  error?: string;
};

export default function Input({
  label,
  value,
  onChange,
  type = "text",
  required = false,
  disabled = false,
  error,
}: Props) {
  return (
    <div className="space-y-1">
      <label className="text-xs text-gray-600">
        {label}
        {required && <span className="text-red-500"> *</span>}
      </label>

      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border rounded px-2 py-1 text-sm disabled:bg-gray-100"
      />

      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
}
