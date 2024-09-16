"use client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
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
import { cn } from "@/lib/utils";
import { categorySchema, CreateCategorySchemaType } from "@/schema/categories";
import { TransactionType } from "@/types/transaction";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  QueryClient,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { CircleOff, Loader, PlusCircle } from "lucide-react";
import { useTheme } from "next-themes";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { CreateCategory } from "../_actions/categories";
import { toast } from "sonner";
import { Category } from "@prisma/client";
import { useTranslations } from "next-intl";

interface Props {
  type: TransactionType;
  successCallback: (category: Category) => void;
  trigger?: React.ReactNode;
}

export default function CreateCategoryDialog({
  type,
  successCallback,
  trigger,
}: Props) {
  const theme = useTheme();
  const [open, setOpen] = useState(false);
  const form = useForm<CreateCategorySchemaType>({
    resolver: zodResolver(categorySchema),
    defaultValues: {
      type,
    },
  });

  const t = useTranslations("Dialog");

  const queryClient = useQueryClient();

  const { mutate, isPending } = useMutation({
    mutationFn: CreateCategory,
    onSuccess: async (data: Category) => {
      form.reset({
        name: "",
        icon: "",
        type,
      });

      toast.success(t("toast_create_category_success"), {
        id: "create-category",
      });

      successCallback(data);

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });

      setOpen(false);
    },
    onError: () => {
      toast.error(t("toast_create_category_error"), {
        id: "create-category",
      });
    },
  });

  const onSubmit = useCallback(
    (data: CreateCategorySchemaType) => {
      toast.loading(t("toast_create_category_loading"), {
        id: "create-category",
      });
      mutate(data);
    },
    [mutate]
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ? (
          trigger
        ) : (
          <Button variant={"ghost"} className="rounded-none">
            <PlusCircle className="shrink-0 mr-2 h-4 w-4" />
            {t("add_category_button")}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {t("category_title")}
            <span
              className={cn(
                "m-1",
                type === "income" ? "text-blue-income" : "text-blue-expense"
              )}
            >
              {type === "income" ? t("income_title") : t("expense_title")}
            </span>
            {t("category_title_span")}
          </DialogTitle>
        </DialogHeader>
        <DialogDescription>{t("category_description")}</DialogDescription>
        <Form {...form}>
          <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("category_name_label")}</FormLabel>
                  <FormControl>
                    <Input defaultValue={""} {...field} />
                  </FormControl>
                  <FormDescription>
                    {t("category_name_description")}
                  </FormDescription>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{t("category_icon_label")}</FormLabel>
                  <FormControl>
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="h-[100px] w-full">
                          {form.watch("icon") ? (
                            <div className="flex flex-col items-center gap-2">
                              <span className="text-5xl">{field.value}</span>
                              <p className="text-xs text-foreground">
                                {t("category_icon_change")}
                              </p>
                            </div>
                          ) : (
                            <div className="flex flex-col items-center gap-2">
                              <CircleOff className="shrink-0 h-[48px] w-[48px] mx-auto" />
                              <p className="text-xs text-foreground">
                                {t("category_icon_select")}
                              </p>
                            </div>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-full p-0">
                        <Picker
                          data={data}
                          onEmojiSelect={(emoji: { native: string }) => {
                            field.onChange(emoji.native);
                          }}
                          theme={theme.resolvedTheme}
                        />
                      </PopoverContent>
                    </Popover>
                  </FormControl>
                  <FormDescription>
                    {t("category_icon_description")}
                  </FormDescription>
                </FormItem>
              )}
            />
          </form>
        </Form>
        <DialogFooter>
          <DialogClose>
            <Button
              type="button"
              variant="outline"
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
