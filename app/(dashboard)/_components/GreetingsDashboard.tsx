import React from "react";
import CreateTransactionDialog from "./CreateTransactionDialog";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useTranslations } from "next-intl";

interface Props {
  firstName: string;
}

export default function GreetingsDashboard({ firstName }: Props) {
  const t = useTranslations("DashboardPage");
  return (
    <div>
      <div className="container flex flex-wrap items-center justify-between gap-6 py-8">
        <div className="flex flex-col space-y-3 items-start">
          <h1 className="text-2xl font-semibold">Dashboard</h1>
          <p className="text-muted-foreground">
            {t("welcome")} {firstName}. {t("welcome_back")}
          </p>
        </div>

        <div className="md:hidden flex items-center gap-3 overflow-x-auto">
          <CreateTransactionDialog
            type="income"
            trigger={
              <Button>
                <Plus className="shrink-0 mr-2 h-4 w-4" />
                {t("addIncome")}
              </Button>
            }
          />
          <CreateTransactionDialog
            type="expense"
            trigger={
              <Button variant={"destructive"}>
                <Plus className="shrink-0 mr-2 h-4 w-4" />
                {t("addExpense")}
              </Button>
            }
          />
        </div>
      </div>
    </div>
  );
}
