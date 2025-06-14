import { trpc } from "@/app/api/trpc/_trpc/client";
import { Task } from "@/interfaces/task";
import { create } from "zustand";

const RELOAD_PER_PAGE = 4;

export interface TaskListState {
  tasks: Task[];
  nextPage: number;
  totalCount: number;
  reloadPerPage: number;
  hasMore: boolean;
  initializeStore: (initialTasks: Task[], totalCount: number) => void;
  insertTasks: (newTasks: Task[]) => void;
  incrementNextPage: () => void;
  optimisticDelete: (id: string) => void;
  verifyIfTaskIsLoaded: (id: string) => boolean;
}

export const useStore = create<TaskListState>((set, get) => {
  return {
    tasks: [],
    nextPage: 0,
    totalCount: 0,
    reloadPerPage: RELOAD_PER_PAGE,
    hasMore: false,
    initializeStore: (initialTasks: Task[], totalCount: number) => {
      set(() => ({
        tasks: initialTasks,
        totalCount,
        nextPage: Math.floor(initialTasks.length / RELOAD_PER_PAGE) + 1,
        hasMore: initialTasks.length < totalCount,
      }));
    },
    insertTasks: (newTasks: Task[]) => {
      set((state) => {
        const updatedTasks = [...state.tasks, ...newTasks];
        return {
          tasks: updatedTasks,
          hasMore: updatedTasks.length < state.totalCount,
        };
      });
    },
    incrementNextPage: () => {
      set((state) => ({ nextPage: state.nextPage + 1 }));
    },
    optimisticDelete: (id: string) => {
      set((state) => {
        const updatedTasks = state.tasks.filter((task) => task.id !== id);
        const newTotal = state.totalCount - 1;
        return {
          tasks: updatedTasks,
          totalCount: newTotal,
          hasMore: updatedTasks.length < newTotal,
        };
      });
    },
    verifyIfTaskIsLoaded: (id) => {
      const { tasks } = get();

      const task = tasks.find((task) => task.id === id);

      return !!task;
    },
  };
});
