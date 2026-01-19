"use client";

import { ChangeEvent } from "react";
import Button from "@/components/ui/Button";
import {
  BaseFilterProps,
  FilterFieldConfig,
} from "./types";

type Props<T> = BaseFilterProps<T> & {
  fields: FilterFieldConfig<T>[];
};

export default function BaseFilter<
  T extends Record<string, any>
>(props: Props<T>) {
  const {
    value,
    onChange,
    onSearch,
    onReset,
    fields,
  } = props;

  function handleChange<K extends keyof T>(
    key: K,
    e: ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    onChange({
      ...value,
      [key]: e.target.value,
    });
  }

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      {/* FILTER FIELDS */}
      <div
        className="
          grid
          grid-cols-1
          sm:grid-cols-2
          lg:grid-cols-3
          xl:grid-cols-6
          gap-4
        "
      >
        {fields.map((field) => (
          <div
            key={String(field.key)}
            className="space-y-1"
          >
            <label className="text-sm font-medium text-gray-700">
              {field.label}
            </label>

            {field.type === "text" && (
              <input
                type="text"
                placeholder={field.placeholder}
                value={
                  (value[field.key] as string) ?? ""
                }
                onChange={(e) =>
                  handleChange(field.key, e)
                }
                className="
                  w-full
                  rounded-md
                  border
                  border-gray-300
                  px-3
                  py-2
                  text-sm
                  text-gray-900
                  placeholder-gray-400
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              />
            )}

            {field.type === "select" && (
              <select
                value={
                  (value[field.key] as string) ?? ""
                }
                onChange={(e) =>
                  handleChange(field.key, e)
                }
                className="
                  w-full
                  rounded-md
                  border
                  border-gray-300
                  px-3
                  py-2
                  text-sm
                  text-gray-900
                  focus:outline-none
                  focus:ring-2
                  focus:ring-blue-500
                "
              >
                <option value="">
                  All
                </option>
                {field.options?.map((opt) => (
                  <option
                    key={opt.value}
                    value={opt.value}
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
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
