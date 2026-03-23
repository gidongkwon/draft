import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

const createGraphQLFetchMock = vi.fn(() => vi.fn());

vi.mock("./fetch-graphql", () => {
  return {
    createGraphQLFetch: createGraphQLFetchMock,
  };
});

describe("createEnvironment", () => {
  beforeEach(() => {
    createGraphQLFetchMock.mockClear();
  });

  it("passes the request session token through to the GraphQL fetch factory", async () => {
    const { createEnvironment } = await import("./environment");

    createEnvironment({ sessionToken: "server-session" });

    expect(createGraphQLFetchMock).toHaveBeenCalledWith(
      expect.objectContaining({
        getSessionToken: expect.any(Function),
      }),
    );

    const options = createGraphQLFetchMock.mock.calls.at(-1)?.[0];
    expect(options?.getSessionToken?.()).toBe("server-session");
  });
});
