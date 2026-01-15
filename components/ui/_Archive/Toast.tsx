"use client";

type ToastType = "success" | "error" | "info";

type Props = {
  type: ToastType;
  message: string;
};

const colorMap: Record<ToastType, string> = {
  success: "bg-green-600",
  error: "bg-red-600",
  info: "bg-blue-600",
};

export default function Toast({ type, message }: Props) {
  return (
    <div
      className={`${colorMap[type]} text-white px-4 py-2 rounded shadow-md text-sm`}
    >
      {message}
    </div>
  );
}
