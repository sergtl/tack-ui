import {
  useMutation,
  useQuery,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { protectedFetch } from "../protectedFetch";

export type Issue = {
  id: number;
  title: string;
  description: string;
  status: string;
};

export function useUpdateIssue(id: string) {
  const queryClient = useQueryClient();

  return useMutation({
    retry: false,
    mutationFn: async (
      draft: Pick<Issue, "title" | "description">,
    ): Promise<Issue> => {
      const response = await protectedFetch(
        `/issues/${encodeURIComponent(id)}`,
        {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(draft),
        },
      );
      const body: { data: Issue } = await response.json();
      return body.data;
    },
    onSuccess: async (issue) => {
      await queryClient.cancelQueries({ queryKey: ["issues"] });

      queryClient.setQueryData(["issues", id], issue);
      queryClient.setQueryData<Issue[]>(["issues"], (issues) =>
        issues?.map((existing) =>
          existing.id === issue.id ? issue : existing,
        ),
      );

      // The response is authoritative; refresh lists on their next mount.
      void queryClient.invalidateQueries({
        queryKey: ["issues"],
        exact: true,
        refetchType: "none",
      });
    },
  });
}

export function useIssues() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["issues"],
    queryFn: async (): Promise<Issue[]> => {
      const response = await protectedFetch("/issues");

      const body: { data: Issue[] } = await response.json();

      return body.data;
    },
  });

  return { data, isPending, error, isError };
}

export function useIssue(id: string) {
  return useSuspenseQuery({
    queryKey: ["issues", id],
    queryFn: async (): Promise<Issue> => {
      const response = await protectedFetch(
        `/issues/${encodeURIComponent(id)}`,
      );
      const body: { data: Issue } = await response.json();

      return body.data;
    },
  });
}

export function useCreateIssue() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (issue: {
      title: string;
      description: string;
    }): Promise<{ id: number }> => {
      const response = await protectedFetch("/issues", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(issue),
      });

      const body: { data: { id: number } } = await response.json();

      return body.data;
    },
    onSuccess: () => {
      return queryClient.invalidateQueries({ queryKey: ["issues"] });
    },
  });
}
