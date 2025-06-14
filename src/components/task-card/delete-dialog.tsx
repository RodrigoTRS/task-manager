"use client";

import { toast } from "sonner";
import { Trash2 } from "lucide-react";

import { Button } from "../ui/button";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogCancel,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogAction,
} from "../ui/alert-dialog";
import { Loader } from "../loader";
import { useStore } from "@/store";
import { trpc } from "@/app/api/trpc/_trpc/client";

interface DeleteDialogProps {
  taskId: string;
}

export function DeleteDialog({ taskId }: DeleteDialogProps) {
  const { optimisticDelete, verifyIfTaskIsLoaded } = useStore();
  const utils = trpc.useUtils();

  const { mutate, isPending } = trpc.deleteTask.useMutation({
    onSuccess: async () => {
      toast.success("Task deleted successfully", {
        position: "bottom-right",
      });
      utils.getTasks.invalidate();
      await utils.getTasks.fetch();
    },
    onError: (error) => {
      if (error.message === "NOT_FOUND")
        toast.error("The task you've tryed to delete doesn't exist", {
          position: "bottom-right",
        });
      console.log("Failed to delete task:", error.message);
    },
  });

  async function onClickToDelete() {
    const taskIsLoaded = verifyIfTaskIsLoaded(taskId);
    if (taskIsLoaded) {
      optimisticDelete(taskId);
    }

    mutate(taskId);
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="hover:text-destructive"
        >
          <Trash2 size={16} />
        </Button>
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>
            Are you sure that you want to delete this task?
          </AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete your
            Task.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            disabled={isPending}
            onClick={onClickToDelete}
            className="bg-destructive hover:bg-destructive hover:brightness-90"
          >
            {isPending ? <Loader /> : "Delete"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
