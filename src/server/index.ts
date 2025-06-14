import { randomUUID } from "node:crypto";

import { z } from "zod";

import { publicProcedure, router } from "./trpc";

import {
  getTasks,
  addTask,
  updateTask,
  deleteTask,
  getTaskById,
} from "@/server/task-store";
import { PaginationInput } from "@/interfaces/pagination";
import { TRPCError } from "@trpc/server";

export const appRouter = router({
  getTasks: publicProcedure
    .input(
      z
        .object({
          page: z.number(),
          perPage: z.number(),
        })
        .optional()
    )
    .query(async (options) => {
      const pagination: PaginationInput | undefined = options.input;
      const { body } = await getTasks(pagination);

      return body!;
    }),
  getTaskById: publicProcedure.input(z.string()).query(async (options) => {
    const { success, body, error } = await getTaskById(options.input);
    if (!success) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: error,
      });
    }
    return body!;
  }),
  addTask: publicProcedure
    .input(
      z.object({
        title: z.string(),
        description: z.string(),
      })
    )
    .mutation(async (options) => {
      const { title, description } = options.input;
      const newTask = {
        id: randomUUID().toString(),
        title,
        description,
        createdAt: new Date().toString(),
      };
      const { body } = await addTask(newTask);

      return body!;
    }),
  updateTask: publicProcedure
    .input(
      z.object({
        id: z.string(),
        title: z.string().optional(),
        description: z.string().optional(),
      })
    )
    .mutation(async (options) => {
      const { id, title, description } = options.input;
      const fieldsToBeUpdated = {
        title,
        description,
      };
      const { success, error, body } = await updateTask(id, fieldsToBeUpdated);
      if (!success) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: error,
        });
      }

      return body!;
    }),
  deleteTask: publicProcedure.input(z.string()).mutation(async (options) => {
    const { success, error, body } = await deleteTask(options.input);
    if (!success) {
      throw new TRPCError({
        code: "NOT_FOUND",
        message: error,
      });
    }

    return body!;
  }),
});

export type AppRouter = typeof appRouter;
