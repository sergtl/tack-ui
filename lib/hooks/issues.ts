import { useQuery } from "@tanstack/react-query";
import { protectedFetch } from "../protectedFetch";

export function useIssues() {
  const { data, isPending, error, isError } = useQuery({
    queryKey: ["issues"],
    queryFn: async () => {
      const response = await protectedFetch("/issues");

      return response.json();
    },
  });

  return { data, isPending, error, isError };
}
