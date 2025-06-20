"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { ChevronLeft } from "lucide-react";
import z from "zod";

import { PageTitle } from "@/components/page-title";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Loader } from "@/components/loader";
import { trpc } from "@/app/api/trpc/_trpc/client";
import { toast } from "sonner";

const schema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});

export default function CreatePage() {
  const router = useRouter();
  const utils = trpc.useUtils();

  const { mutate, isPending } = trpc.addTask.useMutation({
    onSuccess: () => {
      router.push("/");
      utils.getTasks.invalidate();
    },
    onError: (err) => {
      console.error("Failed to create task:", err.message);
    },
  });

  function onSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const title = formData.get("title")?.toString() || "";
    const description = formData.get("description")?.toString() || "";

    const parsed = schema.safeParse({ title, description });
    if (!parsed.success) {
      const formatted = parsed.error.format();
      const error =
        formatted.title?._errors[0] ||
        formatted.description?._errors[0] ||
        "Invalid input";
      toast.error(error);
      return;
    }

    mutate({ title, description });
  }

  return (
    <>
      <PageTitle
        title="Create task"
        subtitle="Fill the form to create a new task"
        navLink="/"
        button={
          <Button variant="outline">
            <ChevronLeft />
            <span>Return</span>
          </Button>
        }
      />

      <Separator />

      <form className="flex flex-col gap-4" onSubmit={onSubmit}>
        <div className="flex flex-col gap-2">
          <Label htmlFor="title" className="text-sm text-muted-foreground">
            Task title
          </Label>
          <Input type="text" name="title" id="title" />
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
          />
        </div>

        <div className="flex items-center justify-end gap-4">
          <Link href="/">
            <Button type="button" variant="outline">
              Cancel
            </Button>
          </Link>
          <Button type="submit" disabled={isPending}>
            {isPending ? <Loader /> : "Create"}
          </Button>
        </div>
      </form>
    </>
  );
}
