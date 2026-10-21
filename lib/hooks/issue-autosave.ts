"use client";

import { useCallback, useEffect, useState } from "react";
import { type Issue, useUpdateIssue } from "./issues";

type IssueDraft = Pick<Issue, "title" | "description">;

export function useIssueAutosave(issue: Issue) {
  const [draft, setDraft] = useState<IssueDraft>(() => ({
    title: issue.title,
    description: issue.description,
  }));
  const [saved, setSaved] = useState(draft);
  const { mutate, isPending, error } = useUpdateIssue(String(issue.id));
  const dirty = draft.title !== saved.title || draft.description !== saved.description;

  const save = useCallback(() => {
    if (!dirty || !draft.title.trim() || isPending) return;
    mutate(
      { ...draft, title: draft.title.trim() },
      // Record what was submitted without replacing newer text in the editor.
      { onSuccess: () => setSaved(draft) },
    );
  }, [dirty, draft, isPending, mutate]);

  useEffect(() => {
    if (!dirty || !draft.title.trim() || isPending || error) return;
    const timer = setTimeout(save, 800);
    return () => clearTimeout(timer);
  }, [dirty, draft.title, isPending, error, save]);

  function update(patch: Partial<IssueDraft>) {
    setDraft((current) => ({ ...current, ...patch }));
  }

  return { draft, dirty, saving: isPending, error, update, retry: save };
}
