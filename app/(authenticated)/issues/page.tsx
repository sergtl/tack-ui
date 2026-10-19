"use client";

import Link from "next/link";
import { useIssues } from "@/lib/hooks/issues";

export default function IssuesPage() {
  const { data, isPending, error } = useIssues();

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 p-6 md:p-10">
      <h1 className="text-2xl font-semibold tracking-tight">Issues</h1>
      {isPending && (
        <p role="status" className="text-sm text-muted-foreground">
          Loading issues…
        </p>
      )}
      {error && (
        <p role="alert" className="text-sm text-destructive">
          {error.message}
        </p>
      )}
      {!isPending && !error && data?.length === 0 && (
        <p className="text-sm text-muted-foreground">
          No issues yet. Create your first issue from the sidebar.
        </p>
      )}
      {data && !error && data.length > 0 && (
        <ul className="divide-y rounded-lg border">
          {data.map((issue) => (
            <li key={issue.id}>
              <Link
                href={`/issues/${issue.id}`}
                className="flex items-center gap-4 p-4 transition-colors hover:bg-muted focus-visible:outline-ring"
              >
                <span className="text-sm text-muted-foreground">
                  #{issue.id}
                </span>
                <span className="min-w-0 flex-1 break-words font-medium">
                  {issue.title}
                </span>
                <span className="text-sm capitalize text-muted-foreground">
                  {issue.status}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
