import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Card } from "@/components/ui/card";
import { DateToUTCDate, GetFormattedForCurrency } from "@/lib/helpers";
import { useQuery } from "@tanstack/react-query";
import { TrendingDown, TrendingUp, Wallet } from "lucide-react";
import { useTranslations } from "next-intl";
import React, { useCallback, useMemo } from "react";
import CountUp from "react-countup";

interface StatsCardsProps {
  from: Date;
  to: Date;
}

export default function StatsCards({ from, to }: StatsCardsProps) {
  const statsQuery = useQuery({
    queryKey: ["overview", "stats", from, to],
    queryFn: () =>
      fetch(
        `/api/stats/balance?from=${DateToUTCDate(from)}&to=${DateToUTCDate(to)}`
      ).then((res) => res.json()),
  });

  const income = statsQuery.data?.income || 0;
  const expense = statsQuery.data?.expense || 0;
  const balance = income - expense;
  const t = useTranslations("DashboardPage");

  const formatter = useMemo(() => {
    return GetFormattedForCurrency("IDR");
  }, []);

  return (
    <div className="relative flex w-full flex-wrap gap-2 lg:flex-nowrap">
      <SkeletonWrapper isLoading={statsQuery.isLoading}>
        <StatCard
          formatter={formatter}
          value={income}
          title={t("income_title")}
          icon={
            <TrendingUp className="h-12 w-12 items-center rounded-lg border-[3px] border-[#11B9FF] p-2 text-[#11B9FF] dark:text-white dark:bg-gradient-to-b dark:from-[#343C3E] dark:to-[#0b445e] shadow-sm dark:shadow-[#1A9AD7] " />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isLoading}>
        <StatCard
          formatter={formatter}
          value={expense}
          title={t("expense_title")}
          icon={
            <TrendingDown className="h-12 w-12 items-center rounded-lg border-[3px] border-[#9080FA] p-2 text-[#9080FA] dark:text-white dark:bg-gradient-to-b dark:from-[#343A3A] dark:to-[#3d3d5f] shadow-sm dark:shadow-[#5F5F93]" />
          }
        />
      </SkeletonWrapper>
      <SkeletonWrapper isLoading={statsQuery.isLoading}>
        <StatCard
          formatter={formatter}
          value={balance}
          title={t("balance")}
          icon={
            <Wallet className="h-12 w-12 items-center rounded-lg border-[3px] border-[#447CB9] p-2 text-[#447CB9] dark:text-white dark:bg-gradient-to-b dark:from-[#1B1A2C] dark:to-[#0F2D63] shadow-sm dark:shadow-[#0F2D63]" />
          }
        />
      </SkeletonWrapper>
    </div>
  );
}

function StatCard({
  formatter,
  value,
  title,
  icon,
}: {
  formatter: Intl.NumberFormat;
  value: number;
  title: string;
  icon: React.ReactNode;
}) {
  const formatFn = useCallback(
    (value: number) => formatter.format(value),
    [formatter]
  );

  return (
    <Card className="flex h-24 w-full items-center gap-3 p-4">
      {icon}
      <div className="flex flex-col items-start gap-0">
        <p className="text-muted-foreground">{title}</p>
        <CountUp
          preserveValue
          end={value}
          decimals={2}
          formattingFn={formatFn}
          redraw={false}
          className="text-2xl"
        />
      </div>
    </Card>
  );
}
