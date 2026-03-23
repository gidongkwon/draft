import type { RequestParameters, Variables } from "relay-runtime";

type CreateGraphQLFetchOptions = {
  apiUrl: string;
  getSessionToken?: () => string | null | undefined;
};

type GraphQLRequest = {
  text: RequestParameters["text"];
  variables: Variables;
};

export function createGraphQLFetch(options: CreateGraphQLFetchOptions) {
  return async ({ text, variables }: GraphQLRequest) => {
    if (!text) {
      throw new Error("Operation document must be provided");
    }

    const sessionToken = options.getSessionToken?.();
    const headers: Record<string, string> = {
      Accept: "application/json",
      "Content-Type": "application/json",
    };

    if (sessionToken) {
      headers.Authorization = `Bearer ${sessionToken}`;
    }

    const response = await fetch(options.apiUrl, {
      method: "POST",
      headers,
      body: JSON.stringify({ query: text, variables }),
    });
    let result: { errors?: Array<{ message?: string }> } | undefined;

    try {
      result = await response.json();
    } catch (error) {
      if (!response.ok) {
        throw new Error(`GraphQL request failed (${response.status})`);
      }

      throw error;
    }

    if (!response.ok) {
      throw new Error(
        result?.errors?.[0]?.message ?? `GraphQL request failed (${response.status})`,
      );
    }

    return result;
  };
}
