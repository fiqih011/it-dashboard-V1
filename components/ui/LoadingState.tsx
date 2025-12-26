"use client";

type Props = {
  text?: string;
  full?: boolean; // full = center layar, false = inline
};

export default function LoadingState({
  text = "Loading...",
  full = false,
}: Props) {
  if (full) {
    return (
      <div className="flex h-[60vh] items-center justify-center text-sm text-gray-600">
        {text}
      </div>
    );
  }

  return (
    <div className="py-4 text-center text-sm text-gray-600">
      {text}
    </div>
  );
}
