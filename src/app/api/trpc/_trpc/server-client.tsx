import { appRouter } from "@/server";
import { httpBatchLink } from "@trpc/client";

const baseURL = process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

export const serverClient = appRouter.createCaller({
  links: [
    httpBatchLink({
      url: `${baseURL}/api/trpc`,
    }),
  ],
});
