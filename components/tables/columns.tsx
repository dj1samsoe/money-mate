"use client";

import { getTransactionHistoryType } from "@/app/api/transactions-history/route";
import { ColumnDef } from "@tanstack/react-table";
import { DataTableColumnHeader } from "./ColumnHeader";
import { cn } from "@/lib/utils";
import RowAction from "./RowAction";
import { useTranslations } from "next-intl";

export type TransactionHistoryRow = getTransactionHistoryType[0];

export const columns: ColumnDef<TransactionHistoryRow>[] = [
  {
    accessorKey: "category",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="column_category" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => (
      <div className="flex gap-2 capitalize">
        {row.original.categoryIcon}
        <div>{row.original.category}</div>
      </div>
    ),
  },
  {
    accessorKey: "description",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="column_description" />
    ),
    cell: ({ row }) => <div>{row.original.description}</div>,
  },
  {
    accessorKey: "date",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="column_date" />
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.date);
      const formattedDate = date.toLocaleDateString("default", {
        timeZone: "UTC",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      });

      return <div className="capitalize">{formattedDate}</div>;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="column_transaction_type" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
    cell: ({ row }) => {
      // eslint-disable-next-line react-hooks/rules-of-hooks
      const t = useTranslations("TransactionPage");
      return (
        <div
          className={cn(
            "capitalize rounded-lg text-center font-semibold p-2",
            row.original.type === "expense" &&
              "bg-blue-expense/10 text-blue-expense",
            row.original.type === "income" &&
              "bg-blue-income/10 text-blue-income"
          )}
        >
          {row.original.type === "expense"
            ? t("expense_title")
            : t("income_title")}
        </div>
      );
    },
  },
  {
    accessorKey: "amount",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="column_amount" />
    ),
    cell: ({ row }) => (
      <p className="text-sm rounded-lg bg-gray-400/5 p-2 text-center font-medium">
        {row.original.amount}
      </p>
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => <RowAction transaction={row.original} />,
  },
];
