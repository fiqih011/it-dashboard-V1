"use client";

import BaseFilter from "./BaseFilter";
import {
  BaseFilterProps,
  FilterFieldConfig,
} from "./types";
import {
  TransactionCapexFilterValue,
  transactionCapexFilterConfig,
} from "./transaction-capex.config";

type Props = BaseFilterProps<TransactionCapexFilterValue> & {
  /**
   * OPTIONAL
   * If not provided → use default CAPEX filter config
   */
  fields?: FilterFieldConfig<TransactionCapexFilterValue>[];
};

export default function TransactionCapexFilter({
  fields,
  ...props
}: Props) {
  return (
    <BaseFilter<TransactionCapexFilterValue>
      {...props}
      fields={fields ?? transactionCapexFilterConfig}
    />
  );
}
