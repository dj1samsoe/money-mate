"use client";

import { DateRangePicker } from "@/components/ui/date-range-picker";
import { MAX_DATE_RANGE_DAYS } from "@/lib/constants";
import { differenceInDays, startOfMonth } from "date-fns";
import { useState } from "react";
import { toast } from "sonner";
import StatsCards from "./StatsCards";
import CategoriesStats from "./CategoriesStats";
import { useTranslations } from "next-intl";

interface Props {
  firstName: string;
}

export default function Overview({ firstName }: Props) {
  const [dateRange, setDateRange] = useState<{ from: Date; to: Date }>({
    from: startOfMonth(new Date()),
    to: new Date(),
  });
  const t = useTranslations("DashboardPage");

  return (
    <>
      <div className="container flex flex-wrap items-end justify-between gap-2 py-6">
        <div className="flex flex-col space-y-3 items-start">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground text-md">
            {t("welcome")} <span className="capitalize">{firstName}</span>.{" "}
            {t("welcome_back")}
          </p>
        </div>
        <div className="flex items-center gap-3">
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
      </div>
      <div className="container flex w-full flex-col gap-6">
        <StatsCards from={dateRange.from} to={dateRange.to} />

        <CategoriesStats from={dateRange.from} to={dateRange.to} />
      </div>
    </>
  );
}
