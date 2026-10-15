import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiError, protectedFetch } from "../protectedFetch";

export function useLogin() {
  const { data, mutate, error, isPending } = useMutation({
    mutationFn: async ({
      email,
      password,
    }: {
      email: string;
      password: string;
    }) => {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/login`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error ?? "Login failed");
      }

      const result = await response.json();

      return result;
    },
  });

  function login(email: string, password: string) {
    mutate({
      email,
      password,
    });
  }

  return { login, data, error, isPending };
}

export function useSignup() {
  const { data, mutate, error, isPending } = useMutation({
    mutationFn: async ({
      name,
      email,
      password,
      workspace,
    }: {
      name: string;
      email: string;
      password: string;
      workspace: string;
    }) => {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/register`,
        {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
            password,
            workspace,
          }),
        },
      );

      if (!response.ok) {
        const body = await response.json();
        throw new Error(body.error ?? "Signup failed");
      }

      const result = await response.json();

      return result;
    },
  });

  function signup(
    name: string,
    email: string,
    password: string,
    workspace: string,
  ) {
    mutate({
      name,
      email,
      password,
      workspace,
    });
  }

  return { signup, data, error, isPending };
}

type MeResponse = {
  id: number;
  name: string;
  email: string;
  workspace_name: string;
  workspace_slug: string;
};

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async (): Promise<MeResponse> => {
      const response = await protectedFetch("/me");
      const body = await response.json();

      return body.me;
    },
    retry(failureCount, error) {
      // don't retry if it's authentication error
      if (error instanceof ApiError && error.status === 401) {
        return false;
      }

      return failureCount < 2;
    },
  });
}
