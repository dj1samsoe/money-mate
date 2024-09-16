"use client";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { TransactionType } from "@/types/transaction";
import { Category } from "@prisma/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";
import { toast } from "sonner";
import { DeleteCategory } from "../_actions/categories";
import { useTranslations } from "next-intl";

interface Props {
  trigger: React.ReactNode;
  category: Category;
}

export default function DeleteCategoryDialog({ trigger, category }: Props) {
  const categoryIndetifier = `${category.name} (${category.type})`;
  const queryClient = useQueryClient();

  const t = useTranslations("ManagePage");

  const deleteMutation = useMutation({
    mutationFn: DeleteCategory,
    onSuccess: async () => {
      toast.success(t("toast_delete_category_success"), {
        id: categoryIndetifier,
      });

      await queryClient.invalidateQueries({
        queryKey: ["categories"],
      });
    },
    onError: () => {
      toast.error(t("toast_delete_category_error"), {
        id: categoryIndetifier,
      });
    },
  });

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>{trigger}</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{t("dialog_title")}</AlertDialogTitle>
          <AlertDialogDescription>
            {t("dialog_description")}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>{t("cancel_button")}</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              toast.loading(t("toast_delete_category_loading"), {
                id: categoryIndetifier,
              });

              deleteMutation.mutate({
                name: category.name,
                type: category.type as TransactionType,
              });
            }}
          >
            {t("delete_button")}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
