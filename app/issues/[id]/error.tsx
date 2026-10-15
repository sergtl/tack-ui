"use client";

import Link from "next/link";
import { useQueryErrorResetBoundary } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";

export default function IssueError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  const { reset } = useQueryErrorResetBoundary();

  return (
    <main className="mx-auto w-full max-w-4xl space-y-4 p-6 md:p-10">
      <h1 className="text-2xl font-semibold">Could not load issue</h1>
      <p role="alert" className="text-sm text-destructive">{error.message}</p>
      <div className="flex items-center gap-4">
        <Button onClick={() => {
          reset();
          retry();
        }}>
          Try again
        </Button>
        <Link href="/issues" className="text-sm text-muted-foreground hover:text-foreground">
          All issues
        </Link>
      </div>
    </main>
  );
}
