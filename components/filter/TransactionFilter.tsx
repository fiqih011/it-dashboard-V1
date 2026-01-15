// components/filter/TransactionFilter.tsx
"use client";

import BaseFilter from "./BaseFilter";
import {
  TransactionFilterValue,
  BaseFilterProps,
} from "./types";
import { transactionFilterConfig } from "./transaction.config";

type Props = BaseFilterProps<TransactionFilterValue>;

export default function TransactionFilter(props: Props) {
  return (
    <BaseFilter<TransactionFilterValue>
      {...props}
      fields={transactionFilterConfig}
    />
  );
}
