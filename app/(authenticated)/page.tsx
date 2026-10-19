"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { useIssues } from "@/lib/hooks/issues";

export default function Home() {
  const { data, isPending, error } = useIssues();

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6 p-6 md:p-10">
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
      {!error && data && data.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {data.map((issue) => (
            <li key={issue.id} className="min-w-0">
              <Link
                href={`/issues/${issue.id}`}
                className="block h-full rounded-xl transition-shadow hover:ring-2 hover:ring-ring/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <Card className="h-full">
                  <CardHeader className="gap-3">
                    <div className="flex items-center justify-between gap-3 text-sm text-muted-foreground">
                      <span>#{issue.id}</span>
                      <span className="rounded-md bg-muted px-2 py-1 capitalize">
                        {issue.status}
                      </span>
                    </div>
                    <CardTitle>
                      <h2 className="break-words">{issue.title}</h2>
                    </CardTitle>
                  </CardHeader>
                </Card>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
