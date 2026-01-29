"use client";

import Button from "@/components/ui/Button";
import Input from "@/components/ui/Input";
import SearchableSelect from "@/components/ui/SearchableSelect";

import {
  BaseFilterProps,
  FilterFieldConfig,
} from "./types";

type Props<T> = BaseFilterProps<T> & {
  fields: FilterFieldConfig<T>[];
};

export default function BaseFilter<
  T extends Record<string, string | undefined>
>(props: Props<T>) {
  const {
    value,
    onChange,
    onSearch,
    onReset,
    fields,
  } = props;

  function setValue<K extends keyof T>(
    key: K,
    val?: string
  ) {
    onChange({
      ...value,
      [key]: val,
    });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      {/* FILTER FIELDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {fields.map((field) => (
          <div
            key={String(field.key)}
            className="space-y-1"
          >
            {/* ===================== */}
            {/* TEXT INPUT */}
            {/* ===================== */}
            {field.type === "text" && (
              <Input
                label={field.label}
                placeholder={field.placeholder || ""}
                value={value[field.key] ?? ""}
                onChange={(val) => setValue(field.key, val)}
                disabled={false}
              />
            )}

            {/* ===================== */}
            {/* SEARCHABLE SELECT */}
            {/* ===================== */}
            {field.type === "select" && (
              <div className="space-y-1">
                <label className="text-xs text-gray-600">
                  {field.label}
                </label>

                <SearchableSelect
                  value={value[field.key]}
                  options={[
                    "",
                    ...(field.options
                      ? field.options.map(
                          (o) => o.value
                        )
                      : []),
                  ]}
                  placeholder={`Ketik / pilih ${field.label}`} // ✅ DESCRIPTIVE PLACEHOLDER
                  onChange={(val) =>
                    setValue(
                      field.key,
                      val === ""
                        ? undefined
                        : val
                    )
                  }
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* ACTIONS */}
      <div className="flex gap-2">
        <Button
          variant="primary"
          onClick={onSearch}
        >
          Search
        </Button>

        <Button
          variant="secondary"
          onClick={onReset}
        >
          Reset
        </Button>
      </div>
    </div>
  );
}