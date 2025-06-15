"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ reset }: ErrorPageProps) {
  const router = useRouter();

  return (
    <section className="flex flex-col min-h-[calc(40vh)] max-w-100 mx-auto mt-20 gap-8">
      <h1 className="text-2xl font-bold">
        Oops! Apparently something went wrong
      </h1>

      <p>
        You can try to reload the page again if you believe that&apos;s an
        error, or you can go back to home page.
      </p>
      <div className="grid grid-cols-2 w-full gap-4">
        <Button onClick={() => router.push("/")} className="w-full">
          Back to home page
        </Button>
        <Button onClick={reset} variant="outline" className="w-full">
          Try again
        </Button>
      </div>
    </section>
  );
}
