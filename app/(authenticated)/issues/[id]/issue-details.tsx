"use client";

import { use } from "react";
import Link from "next/link";
import { MarkdownEditor } from "@/components/issues/markdown-editor";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { type Issue, useIssue } from "@/lib/hooks/issues";
import { useIssueAutosave } from "@/lib/hooks/issue-autosave";

export default function IssueDetails({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const { data: issue, error } = useIssue(id);

  return (
    <main className="mx-auto w-full max-w-4xl space-y-6 p-6 md:p-10">
      <Link href="/issues" className="text-sm text-muted-foreground hover:text-foreground">
        ← All issues
      </Link>
      {error && <p role="alert" className="text-sm text-destructive">Could not refresh this issue: {error.message}</p>}
      <IssueEditor key={issue.id} issue={issue} />
    </main>
  );
}

function IssueEditor({ issue }: { issue: Issue }) {
  const { draft, dirty, saving, error, update, retry } = useIssueAutosave(issue);
  const invalidTitle = !draft.title.trim();

  return (
    <section
      aria-label="Edit issue"
      className="space-y-6"
    >
      <header className="space-y-3">
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <h1 className="text-muted-foreground">Issue #{issue.id}</h1>
          <span className="rounded-md border px-2 py-1 capitalize">{issue.status}</span>
          <span role="status" className="ml-auto text-muted-foreground">
            {saving ? "Saving…" : error ? "Couldn’t save" : dirty ? "Unsaved changes" : "Saved"}
          </span>
        </div>
        <label htmlFor="issue-edit-title" className="text-sm font-medium">Title</label>
        <Input
          id="issue-edit-title"
          value={draft.title}
          onChange={(event) => update({ title: event.target.value })}
          aria-invalid={invalidTitle}
          aria-describedby={invalidTitle ? "issue-title-error" : undefined}
          className="h-auto py-2 text-xl font-semibold md:text-2xl"
        />
        {invalidTitle && <p id="issue-title-error" role="alert" className="text-sm text-destructive">Enter an issue title to save your changes.</p>}
      </header>
      <div className="space-y-3 border-t pt-6">
        <h2 id="description-heading" className="text-sm font-medium">Description</h2>
        <div role="group" aria-labelledby="description-heading" className="min-w-0 rounded-md border">
          <MarkdownEditor markdown={draft.description} onChange={(description) => update({ description })} />
        </div>
      </div>
      {error && (
        <div className="flex items-center gap-3">
          <p role="alert" className="text-sm text-destructive">Couldn’t save your changes: {error.message}</p>
          <Button type="button" variant="outline" disabled={saving || invalidTitle} onClick={retry}>Retry</Button>
        </div>
      )}
      <p className="text-xs text-muted-foreground">Changes save automatically after you stop typing.</p>
    </section>
  );
}
