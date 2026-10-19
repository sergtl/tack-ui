"use client";

import { use } from "react";
import Link from "next/link";
import { MarkdownEditor } from "@/components/issues/markdown-editor";
import { useIssue } from "@/lib/hooks/issues";

export default function IssueDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: issue, error } = useIssue(id);

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 p-6 md:p-10">
      <Link
        href="/issues"
        className="text-sm text-muted-foreground hover:text-foreground"
      >
        ← All issues
      </Link>
      {error && (
        <p role="alert" className="text-sm text-destructive">
          Could not refresh this issue: {error.message}
        </p>
      )}
      <header className="space-y-3">
        <div className="flex items-center gap-3 text-sm">
          <span className="text-muted-foreground">Issue #{issue.id}</span>
          <span className="rounded-md border px-2 py-1 capitalize">
            {issue.status}
          </span>
        </div>
        <h1 className="break-words text-3xl font-semibold tracking-tight">
          {issue.title}
        </h1>
      </header>
      <section
        className="space-y-3 border-t pt-6"
        aria-labelledby="description-heading"
      >
        <h2 id="description-heading" className="text-sm font-medium">
          Description
        </h2>
        {issue.description ? (
          <MarkdownEditor
            key={`${issue.id}:${issue.description}`}
            markdown={issue.description}
            readOnly
          />
        ) : (
          <p className="text-sm text-muted-foreground">
            No description provided.
          </p>
        )}
      </section>
    </main>
  );
}
