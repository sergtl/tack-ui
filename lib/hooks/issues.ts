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
