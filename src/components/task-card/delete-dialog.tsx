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
import { trpc } from "@/app/api/trpc/_trpc/client";

interface DeleteDialogProps {
  taskId: string;
}

export function DeleteDialog({ taskId }: DeleteDialogProps) {
  const utils = trpc.useUtils();

  const { mutate, isPending } = trpc.deleteTask.useMutation({
    onSuccess: async () => {
      window.location.reload();
      toast.success("Task deleted successfully", {
        position: "bottom-right",
      });
      utils.getTasks.invalidate();
    },
    onError: (error) => {
      if (error.message === "NOT_FOUND")
        toast.error("The task you've tryed to delete doesn't exist");
      console.log("Failed to delete task:", error.message);
    },
  });

  async function onClickToDelete() {
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
          {isPending ? <Loader /> : <Trash2 size={16} />}
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
            onClick={onClickToDelete}
            className="bg-destructive hover:bg-destructive hover:brightness-90"
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
