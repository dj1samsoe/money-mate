"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { DateToUTCDate } from "@/lib/helpers";
import { cn } from "@/lib/utils";
import {
  CreateTransactionSchemaType,
  transactionSchema,
} from "@/schema/transaction";
import { TransactionType } from "@/types/transaction";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { enUS, id, Locale } from "date-fns/locale";
import { CalendarIcon, Loader } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { CreateTransaction } from "../_actions/transactions";
import CategoryPicker from "./CategoryPicker";
import { useLocale, useTranslations } from "next-intl";

interface Props {
  trigger: React.ReactNode;
  type: TransactionType;
}

export default function CreateTransactionDialog({ type, trigger }: Props) {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateTransactionSchemaType>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type,
      date: new Date(),
    },
  });

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateTransaction,
    onSuccess: () => {
      toast.success("Transaksi berhasil dibuat 🎉", {
        id: "create-transaction",
      });

      form.reset({
        type,
        description: "",
        amount: 0,
        date: new Date(),
        category: undefined,
      });

      queryClient.invalidateQueries({
        queryKey: ["overview"],
      });

      setOpen((prev) => !prev);
    },
    onError: (error) => {
      toast.error(error.message, {
        id: "create-transaction",
      });

      form.reset({
        type,
        description: "",
        amount: 0,
        date: new Date(),
        category: undefined,
      });

      setOpen((prev) => !prev);
    },
  });

  const handleCategoryChange = useCallback(
    (value: string) => {
      form.setValue("category", value);
    },
    [form]
  );

  const onSubmit = useCallback(
    (data: CreateTransactionSchemaType) => {
      toast.loading("Sedang membuat transaksi...", {
        id: "create-transaction",
      });

      mutate({
        ...data,
        date: DateToUTCDate(data.date),
      });
    },
    [mutate]
  );
  const t = useTranslations("Dialog");
  const locale = useLocale() as string;
  const localeMap: Record<string, Locale> = {
    en: enUS,
    id: id,
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("transaction_title")}
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-blue-income" : "text-blue-expense"
              )}
            >
              {type === "income" ? t("income_title") : t("expense_title")}
            </span>
            {t("transaction_title_span")}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("transaction_description_label")}</FormLabel>
                  <FormControl>
                    <Input defaultValue="" {...field} />
                  </FormControl>
                  <FormDescription>
                    {t("transaction_description_desc")}
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {type === "income"
                      ? t("transaction_income_amount_label")
                      : t("transaction_expense_amount_label")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      inputMode="numeric"
                      defaultValue={0}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    {t("transaction_amount_description")}
                  </FormDescription>
                </FormItem>
              )}
            />
            <div className="flex md:flex-row flex-col space-y-4 md:space-y-0 items-start md:justify-between justify-start gap-2">
              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("transaction_category_label")}</FormLabel>
                    <FormControl>
                      <CategoryPicker
                        type={type}
                        onChange={handleCategoryChange}
                      />
                    </FormControl>
                    <FormDescription>
                      {t("transaction_category_description")}
                    </FormDescription>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="date"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>{t("transaction_date_label")}</FormLabel>
                    <FormControl>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-[200px] pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground"
                            )}
                          >
                            {field.value
                              ? field.value.toLocaleDateString(locale, {
                                day: "2-digit",
                                month: "long",
                                year: "numeric",
                              })
                              : "Pick a date"}
                            <CalendarIcon className="ml-auto h-4 w-4 shrink-0 opacity-50" />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0">
                          <Calendar
                            mode="single"
                            selected={field.value}
                            onSelect={field.onChange}
                            locale={localeMap[locale]}
                            initialFocus
                          />
                        </PopoverContent>
                      </Popover>
                    </FormControl>
                    <FormDescription>
                      {t("transaction_date_description")}
                    </FormDescription>
                  </FormItem>
                )}
              />
            </div>
          </form>
        </Form>
        <DialogFooter>
          <DialogClose>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => form.reset()}
            >
              {t("cancel_button")}
            </Button>
          </DialogClose>
          <Button onClick={form.handleSubmit(onSubmit)} disabled={isPending}>
            {isPending && (
              <Loader className="shrink-0 h-4 w-4 mr-2 animate-spin" />
            )}
            {isPending ? t("create_button_loading") : t("create_button")}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
