import fs from "node:fs/promises";
import path from "node:path";

import { Pagination, PaginationInput } from "@/interfaces/pagination";
import { Task } from "@/interfaces/task";

const API_DELAY_IN_MS = 1000;

const tasksFile = path.resolve(process.cwd(), "tasks.json");

interface FetchTasksReturn {
  tasks: Task[];
  pagination?: Pagination;
}

interface DBResponse<T> {
  success: boolean;
  error?: string;
  body?: T;
}

// All this functions receives a delay to simulate the delay of a real server communication

export async function getTasks(
  pagination?: PaginationInput
): Promise<DBResponse<FetchTasksReturn>> {
  await sleep();

  const tasks = await fetchTasks(pagination);

  return {
    success: true,
    body: tasks,
  };
}

export async function getTaskById(id: Task["id"]): Promise<DBResponse<Task>> {
  await sleep();

  const response = await fetchTasks();
  const { tasks } = response;

  const task = tasks.find((task) => task.id === id);

  if (!task) {
    return {
      success: false,
      error: "The task you were looking for doesn't exists.",
    };
  }

  return {
    success: true,
    body: task,
  };
}

export async function addTask(newTask: Task): Promise<DBResponse<string>> {
  await sleep();

  const response = await fetchTasks();
  const { tasks } = response;
  tasks.push(newTask);
  await fs.writeFile(tasksFile, JSON.stringify(tasks));

  return {
    success: true,
    body: newTask.id,
  };
}

export async function updateTask(
  id: string,
  fieldsToBeUpdated: Partial<Omit<Task, "id" | "createdAt">>
): Promise<DBResponse<string>> {
  await sleep();

  const taskExist = await getTaskById(id);
  if (!taskExist.success) {
    return {
      success: false,
      error: "The task you were trying to update doesn't exists.",
    };
  }

  const response = await fetchTasks();
  const { tasks } = response;
  const updatedTasks = tasks.map((task) => {
    if (task.id !== id) {
      return task;
    }
    return {
      ...task,
      title: fieldsToBeUpdated.title || task.title,
      description: fieldsToBeUpdated.description || task.description,
    };
  });
  await fs.writeFile(tasksFile, JSON.stringify(updatedTasks));

  return {
    success: true,
    body: id,
  };
}

export async function deleteTask(id: Task["id"]): Promise<DBResponse<string>> {
  await sleep();

  const taskExist = await getTaskById(id);
  if (!taskExist.success) {
    return {
      success: false,
      error: "The task you were trying to delete doesn't exists.",
    };
  }

  const response = await fetchTasks();
  const { tasks } = response;
  const updatedTasks = tasks.filter((task) => task.id !== id);
  await fs.writeFile(tasksFile, JSON.stringify(updatedTasks));
  return {
    success: true,
    body: id,
  };
}

async function fetchTasks(
  pagination?: PaginationInput
): Promise<FetchTasksReturn> {
  try {
    const data = await fs.readFile(tasksFile, "utf-8");
    const tasks = JSON.parse(data) as Task[];

    if (!pagination) {
      return {
        tasks,
      };
    } else {
      const { page, perPage } = pagination;

      const sortedTasks = [...tasks].sort((a, b) => {
        return (
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      });

      const start = (page - 1) * perPage;
      const end = start + perPage;
      const paginatedTasks = sortedTasks.slice(start, end);

      return {
        tasks: paginatedTasks,
        pagination: {
          page,
          perPage,
          totalCount: tasks.length,
        },
      };
    }
  } catch {
    return {
      tasks: [],
    };
  }
}

function sleep() {
  return new Promise((resolve) => setTimeout(resolve, API_DELAY_IN_MS));
}
