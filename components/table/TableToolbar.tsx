"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";

type Props = {
  search: string;
  onSearchChange: (v: string) => void;
  onSearch: () => void;
  onReset: () => void;
};

export default function TableToolbar({
  search,
  onSearchChange,
  onSearch,
  onReset,
}: Props) {
  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6 mb-6">
      <div className="flex flex-wrap items-end gap-4">
        
        <div className="flex-1 min-w-[250px]">
          <Input
            label="Search"
            value={search}
            onChange={onSearchChange}
          />
        </div>

        <Button variant="primary" onClick={onSearch}>
          Search
        </Button>

        <Button variant="secondary" onClick={onReset}>
          Reset
        </Button>
      </div>
    </div>
  );
}
