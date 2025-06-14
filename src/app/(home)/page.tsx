import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { PageTitle } from "@/components/page-title";
import { TaskList } from "@/components/task-list";
import { serverClient } from "../api/trpc/_trpc/server-client";

export default async function HomePage() {
  const response = await serverClient.getTasks({ page: 1, perPage: 8 });
  const { tasks, pagination } = response;

  return (
    <>
      <PageTitle
        title="Your tasks"
        navLink="/create"
        button={
          <Button>
            <Plus />
            <span>Create task</span>
          </Button>
        }
      />

      <Separator />

      <TaskList initialTasks={tasks} totalCount={pagination?.totalCount!} />
    </>
  );
}
