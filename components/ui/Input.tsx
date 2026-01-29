"use client";

type Props = {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: "text" | "number" | "date";
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
};

export default function Input({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
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
        placeholder={placeholder}
        disabled={disabled}
        onChange={(e) => onChange(e.target.value)}
        className="w-full border border-gray-300 rounded-md h-9 px-3 text-sm bg-white disabled:bg-gray-100 outline-none"
      />

      {error && <div className="text-xs text-red-600">{error}</div>}
    </div>
  );
}