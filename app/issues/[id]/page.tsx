"use client";

import { Suspense } from "react";
import dynamic from "next/dynamic";

const IssueDetails = dynamic(() => import("./issue-details"), {
  ssr: false,
  loading: IssueLoading,
});

function IssueLoading() {
  return (
    <p role="status" className="p-6 text-sm text-muted-foreground">
      Loading issue…
    </p>
  );
}

export default function IssuePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <Suspense fallback={<IssueLoading />}>
      <IssueDetails params={params} />
    </Suspense>
  );
}
