import { afterEach, describe, expect, it, vi } from "vite-plus/test";
import { createGraphQLFetch } from "./fetch-graphql";

describe("createGraphQLFetch", () => {
  const originalFetch = globalThis.fetch;

  afterEach(() => {
    globalThis.fetch = originalFetch;
    vi.restoreAllMocks();
  });

  it("posts the GraphQL document and variables to the configured endpoint", async () => {
    const response = { data: { publicTimeline: { edges: [] } } };
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(response),
    });

    globalThis.fetch = fetchMock as typeof fetch;

    const fetchGraphQL = createGraphQLFetch({
      apiUrl: "https://hackers.pub/graphql",
    });

    const result = await fetchGraphQL({
      text: "query FeedQuery { publicTimeline(first: 10) { edges { cursor } } }",
      variables: { first: 10 },
    });

    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0]?.[0]).toBe("https://hackers.pub/graphql");

    const request = fetchMock.mock.calls[0]?.[1];
    expect(request?.method).toBe("POST");
    expect(request?.headers).toEqual({
      Accept: "application/json",
      "Content-Type": "application/json",
    });
    expect(request?.body).toBe(
      JSON.stringify({
        query: "query FeedQuery { publicTimeline(first: 10) { edges { cursor } } }",
        variables: { first: 10 },
      }),
    );
    expect(result).toEqual(response);
  });

  it("adds a bearer token when a session token resolver returns one", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ data: { viewer: null } }),
    });

    globalThis.fetch = fetchMock as typeof fetch;

    const fetchGraphQL = createGraphQLFetch({
      apiUrl: "https://hackers.pub/graphql",
      getSessionToken: () => "session-token",
    });

    await fetchGraphQL({
      text: "query ViewerQuery { viewer { id } }",
      variables: {},
    });

    const request = fetchMock.mock.calls[0]?.[1];
    expect(request?.headers).toEqual({
      Accept: "application/json",
      Authorization: "Bearer session-token",
      "Content-Type": "application/json",
    });
  });

  it("throws a stable error when the upstream API returns an empty non-JSON error response", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: false,
      json: vi.fn().mockRejectedValue(new SyntaxError("Unexpected end of JSON input")),
      status: 503,
    });

    globalThis.fetch = fetchMock as typeof fetch;

    const fetchGraphQL = createGraphQLFetch({
      apiUrl: "https://hackers.pub/graphql",
    });

    await expect(
      fetchGraphQL({
        text: "query FeedQuery { publicTimeline(first: 10) { edges { cursor } } }",
        variables: { first: 10 },
      }),
    ).rejects.toThrow("GraphQL request failed (503)");
  });
});
