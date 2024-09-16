"use client";

import SkeletonWrapper from "@/components/SkeletonWrapper";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { TransactionType } from "@/types/transaction";
import { useQuery } from "@tanstack/react-query";
import { Plus, Trash, TrendingDown, TrendingUp } from "lucide-react";
import CreateCategoryDialog from "../_components/CreateCategoryDialog";
import { cn } from "@/lib/utils";
import { Category } from "@prisma/client";
import DeleteCategoryDialog from "../_components/DeleteCategoryDialog";
import { useTranslations } from "next-intl";

export default function ManagePage() {
  const t = useTranslations("ManagePage");
  return (
    <>
      <div className="container flex flex-wrap items-center justify-between md:flex-nowrap gap-6 py-8">
        <div className="space-y-2">
          <h2 className="text-3xl font-bold">{t("title")}</h2>
          <p>{t("subtitle")}</p>
        </div>
      </div>

      <div className="container flex flex-col gap-4 p-4">
        <CategoryList type="income" />
        <CategoryList type="expense" />
      </div>
    </>
  );
}

function CategoryList({ type }: { type: TransactionType }) {
  const categoriesQuery = useQuery({
    queryKey: ["categories", type],
    queryFn: () =>
      fetch(`/api/categories?type=${type}`).then((res) => res.json()),
  });

  const dataAvailable = categoriesQuery.data && categoriesQuery.data.length > 0;
  const t = useTranslations("ManagePage");

  return (
    <SkeletonWrapper isLoading={categoriesQuery.isLoading}>
      <Card>
        <CardHeader>
          <CardTitle className="flex flex-col md:flex-row items-center md:justify-between justify-center gap-2">
            <div className="flex items-center gap-2">
              {type === "expense" ? (
                <TrendingDown className="h-12 w-12 items-center rounded-lg border-[3px] border-[#9080FA] p-2 text-[#9080FA] dark:text-white dark:bg-gradient-to-b dark:from-[#343A3A] dark:to-[#3d3d5f] shadow-sm dark:shadow-[#5F5F93]" />
              ) : (
                <TrendingUp className="h-12 w-12 items-center rounded-lg border-[3px] border-[#11B9FF] p-2 text-[#11B9FF] dark:text-white dark:bg-gradient-to-b dark:from-[#343C3E] dark:to-[#0b445e] shadow-sm dark:shadow-[#1A9AD7] " />
              )}
              <span>
                {type === "income"
                  ? t("income_category_title")
                  : t("expense_category_title")}
              </span>
            </div>

            <CreateCategoryDialog
              type={type}
              successCallback={() => categoriesQuery.refetch()}
              trigger={
                <Button className="gap-2 text-sm">
                  <Plus className="h-6 w-6" />
                  <span>{t("add_category_button")}</span>
                </Button>
              }
            />
          </CardTitle>
        </CardHeader>
        {!dataAvailable && (
          <div className="flex h-40 w-full flex-col items-center justify-center">
            <p>
              {t("p_empty_data")}{" "}
              <span
                className={cn(
                  "m-1",
                  type === "income" ? "text-blue-income" : "text-blue-expense"
                )}
              >
                {type === "income"
                  ? t("income_span_empty_data")
                  : t("expense_span_empty_data")}
              </span>
            </p>
            <p className="text-sm text-muted-foreground">
              {t("entry_new_data")}
            </p>
          </div>
        )}
        {dataAvailable && (
          <div className="grid grid-flow-row gap-2 p-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {categoriesQuery.data.map((category: Category) => (
              <CategoryCard key={category.name} category={category} />
            ))}
          </div>
        )}
      </Card>
    </SkeletonWrapper>
  );
}

function CategoryCard({ category }: { category: Category }) {
  return (
    <div className="flex border-separate flex-col justify-between rounded-lg border shadow-sm shadow-black/[0.1] dark:shadow-white/[0.1]">
      <div className="flex flex-col items-center gap-2 p-4">
        <span className="text-3xl" role="img">
          {category.icon}
        </span>
        <span>{category.name}</span>
      </div>
      <DeleteCategoryDialog
        category={category}
        trigger={
          <Button variant="ghost">
            <Trash color="#FF8080" size={20} />
          </Button>
        }
      />
    </div>
  );
}
