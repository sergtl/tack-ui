"use client";

import dynamic from "next/dynamic";

export const MarkdownEditor = dynamic(() => import("./markdown-editor-content"), {
  ssr: false,
  loading: () => <p className="p-4 text-sm text-muted-foreground">Loading editor…</p>,
});
