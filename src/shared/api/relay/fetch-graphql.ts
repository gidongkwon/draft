import type { GraphQLResponse, RequestParameters, Variables } from "relay-runtime";

type CreateGraphQLFetchOptions = {
  apiUrl: string;
  getSessionToken?: () => string | null | undefined;
};

type GraphQLRequest = {
  text: RequestParameters["text"];
  variables: Variables;
};

export function createGraphQLFetch(options: CreateGraphQLFetchOptions) {
  return async ({ text, variables }: GraphQLRequest): Promise<GraphQLResponse> => {
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
    let result: GraphQLResponse;

    try {
      result = (await response.json()) as GraphQLResponse;
    } catch (error) {
      if (!response.ok) {
        throw new Error(`GraphQL request failed (${response.status})`);
      }

      throw error;
    }

    if (!response.ok) {
      const message =
        "errors" in result && Array.isArray(result.errors) ? result.errors[0]?.message : undefined;

      throw new Error(message ?? `GraphQL request failed (${response.status})`);
    }

    return result;
  };
}
