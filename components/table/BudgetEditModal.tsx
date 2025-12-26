"use client";

type Props = {
  id: string;
  type: "opex" | "capex";
  onClose: () => void;
};

export default function BudgetEditModal({ id, type, onClose }: Props) {
  return (
    <div className="fixed inset-0 bg-black/30 flex items-center justify-center">
      <div className="bg-white p-4 w-[400px]">
        <h2 className="font-bold mb-2">
          Edit Budget Plan ({type.toUpperCase()})
        </h2>

        {/* sementara dummy – wiring dulu */}
        <div className="text-sm text-gray-600 mb-4">
          ID: {id}
        </div>

        <div className="flex justify-end gap-2">
          <button onClick={onClose}>Cancel</button>
          <button className="bg-blue-600 text-white px-3 py-1">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}
