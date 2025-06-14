"use client";

import { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

import { Task } from "@/interfaces/task";
import { trpc } from "@/app/api/trpc/_trpc/client";
import { Loader } from "./loader";
import { TaskCard } from "./task-card";
import { useStore } from "@/store";

interface TaskListProps {
  initialTasks: Task[];
  totalCount: number;
}

export function TaskList({ initialTasks, totalCount }: TaskListProps) {
  const [initialLoader, setInitialLoader] = useState(true);

  const {
    tasks,
    nextPage,
    reloadPerPage,
    hasMore,
    initializeStore,
    insertTasks,
    incrementNextPage,
  } = useStore();

  useEffect(() => {
    initializeStore(initialTasks, totalCount);
    setInterval(() => {
      setInitialLoader(false);
    }, 1000);
  }, []);

  const { ref, inView } = useInView({
    threshold: 0,
  });

  const { refetch, isFetching } = trpc.getTasks.useQuery(
    { page: nextPage, perPage: reloadPerPage },
    { enabled: false }
  );

  useEffect(() => {
    if (inView && hasMore && !isFetching) {
      refetch()
        .then((result) => {
          if (result.data) {
            insertTasks(result.data.tasks);
            incrementNextPage();
          }
        })
        .catch((error) => {
          console.log("Failed to fetch more tasks: ", error);
        });
    }
  }, [inView]);

  return (
    <>
      {initialLoader ? (
        <section className="flex w-full items-center justify-center">
          <Loader />
        </section>
      ) : (
        <section className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-4">
          {tasks.map((task) => {
            return <TaskCard task={task} key={task.id} />;
          })}
        </section>
      )}

      {!initialLoader && (
        <section ref={ref} className="flex items-center justify-center">
          {hasMore ? (
            <Loader />
          ) : (
            <span>You have already loaded all tasks.</span>
          )}
        </section>
      )}
    </>
  );
}
