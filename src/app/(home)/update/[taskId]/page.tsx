"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

import { toast } from "sonner";
import { ChevronLeft } from "lucide-react";

import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/loader";
import { trpc } from "@/app/api/trpc/_trpc/client";

export default function UpdatePage() {
  const params = useParams<{ taskId: string }>();
  const router = useRouter();
  const utils = trpc.useUtils();

  const { taskId } = params;

  const { data, isLoading } = trpc.getTaskById.useQuery(taskId);
  const { mutate, isPending } = trpc.updateTask.useMutation({
    onSuccess: () => {
      utils.getTasks.invalidate();
      router.push("/");
    },
    onError: (error) => {
      if (error.message === "NOT_FOUND")
        toast.error("The task you've tryed to update doesn't exist", {
          position: "bottom-right",
        });
      console.log("Failed to update task:", error.message);
    },
  });

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";

    mutate({ id: taskId, title, description });
  }

  return (
    <>
      <PageTitle
        title="Update task"
        navLink="/"
        subtitle={`Task ID: ${taskId}`}
        button={
          <Button variant="outline">
            <ChevronLeft />
            <span>Return</span>
          </Button>
        }
      />

      <Separator />

      {isLoading ? (
        <section className="flex w-full items-center justify-center">
          <Loader />
        </section>
      ) : (
        <form className="flex flex-col gap-4" onSubmit={onSubmit}>
          <input
            type="text"
            value={taskId}
            name="id"
            id="id"
            className="hidden"
            readOnly
          />
          <div className="flex flex-col gap-2">
            <Label htmlFor="title" className="text-sm text-muted-foreground">
              Task title
            </Label>
            <Input
              type="text"
              name="title"
              id="title"
              defaultValue={data?.title ?? ""}
            />
          </div>

          <div className="flex flex-col gap-2">
            <Label
              htmlFor="description"
              className="text-sm text-muted-foreground"
            >
              Task description
            </Label>
            <Textarea
              name="description"
              id="description"
              className="h-40 resize-none"
              defaultValue={data?.description ?? ""}
            />
          </div>

          <div className="flex items-center justify-end gap-4">
            <Link href="/">
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </Link>
            <Button type="submit" disabled={isPending}>
              {isPending ? <Loader /> : "Update"}
            </Button>{" "}
          </div>
        </form>
      )}
    </>
  );
}
