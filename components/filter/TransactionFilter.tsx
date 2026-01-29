"use client";

import BaseFilter from "./BaseFilter";
import {
  TransactionFilterValue,
  BaseFilterProps,
  FilterFieldConfig,
} from "./types";
import { transactionFilterConfig } from "./transaction.config";

type Props = BaseFilterProps<TransactionFilterValue> & {
  /**
   * OPTIONAL
   * Kalau tidak dikirim → pakai config default (LOCKED)
   */
  fields?: FilterFieldConfig<TransactionFilterValue>[];
};

export default function TransactionFilter({
  fields,
  ...props
}: Props) {
  return (
    <BaseFilter<TransactionFilterValue>
      {...props}
      fields={fields ?? transactionFilterConfig}
    />
  );
}
