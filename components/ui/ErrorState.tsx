"use client";

type Props = {
  message?: string;
  onRetry?: () => void;
};

export default function ErrorState({
  message = "Terjadi kesalahan. Silakan coba lagi.",
  onRetry,
}: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center text-sm text-red-600">
      <div>{message}</div>

      {onRetry && (
        <button
          onClick={onRetry}
          className="mt-3 rounded border border-red-300 px-3 py-1 text-sm text-red-700 hover:bg-red-50"
        >
          Coba lagi
        </button>
      )}
    </div>
  );
}
