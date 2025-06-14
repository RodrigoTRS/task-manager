"use client";

import { useEffect } from "react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useRouter } from "next/navigation";

export interface ErrorPageProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorPageProps) {
  const router = useRouter();

  useEffect(() => {
    console.log(error);
  }, [error]);

  return (
    <section className="flex flex-col min-h-[calc(40vh)] max-w-100 mx-auto mt-20 gap-8">
      <h1 className="text-2xl font-bold">
        Oops! Apparently something went wrong
      </h1>
      <Card className="flex flex-col gap-1 px-4 py-3 border-destructive bg-destructive/10">
        <h2 className="text-lg font-bold text-destructive">Error message</h2>
        <span>{error.message}</span>
      </Card>
      <p>
        You can try to reload the page again if you believe that's an error, or
        you can go back to home page.
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
