"use client";

import TableTransaction from "@/app/(dashboard)/transactions/_components/TableTransaction";
import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays, startOfMonth } from "date-fns";
import { useTranslations } from "next-intl";
import { useState } from "react";
import { toast } from "sonner";

export default function TransactionPage() {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });

  const t = useTranslations("TransactionPage");

  return (
    <>
      <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
        <div>
          <h2 className="text-3xl font-bold">{t("title")}</h2>
          <p className="text-sm text-muted-foreground">{t("subtitle")}</p>
        </div>
        <DateRangePicker
          initialDateFrom={dateRange.from}
          initialDateTo={dateRange.to}
          showCompare={false}
          onUpdate={(values) => {
            const { from, to } = values.range;

            if (!from || !to) return;
            if (differenceInDays(from, to) > MAX_DATE_RANGE_DAYS) {
              toast.error(
                `Start date and end date must not exceed ${MAX_DATE_RANGE_DAYS} days`
              );
              return;
            }

            setDateRange({ from, to });
          }}
        />
      </div>

      <div className="container py-10">
        <TableTransaction from={dateRange.from} to={dateRange.to} />
      </div>
    </>
  );
}
