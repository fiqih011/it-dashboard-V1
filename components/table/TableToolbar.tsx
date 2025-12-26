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
    <div className="flex items-end gap-2 mb-3">
      <Input
        label="Search"
        value={search}
        onChange={onSearchChange}
      />

      <Button variant="primary" onClick={onSearch}>
        Search
      </Button>

      <Button variant="secondary" onClick={onReset}>
        Reset
      </Button>
    </div>
  );
}
