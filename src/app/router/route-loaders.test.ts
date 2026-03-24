import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

const fetchHomeFeedMock = vi.fn();
const fetchPostDetailMock = vi.fn();
const fetchProfileMock = vi.fn();

vi.mock("../../shared/api/server-queries", () => ({
  fetchHomeFeed: fetchHomeFeedMock,
  fetchPostDetail: fetchPostDetailMock,
  fetchProfile: fetchProfileMock,
}));

function createLoaderContext({
  context = { viewer: null },
  deps,
  params = {},
  search = {},
}: {
  context?: { viewer: { id: string } | null };
  deps?: Record<string, unknown>;
  params?: Record<string, string>;
  search?: Record<string, unknown>;
}) {
  return {
    abortController: new AbortController(),
    cause: "enter",
    context,
    deps: {
      timeline: search.timeline,
      ...deps,
    },
    location: {} as never,
    matches: [],
    navigate: vi.fn(),
    params,
    parentMatchPromise: Promise.resolve({}),
    preload: false,
    route: {} as never,
    search,
  } as any;
}

function expectLoader<TLoader>(loader: TLoader): Extract<TLoader, (...args: any[]) => any> {
  expect(loader).toBeTypeOf("function");

  if (typeof loader !== "function") {
    throw new Error("Expected route loader to be a function.");
  }

  return loader as Extract<TLoader, (...args: any[]) => any>;
}

describe("route loaders", () => {
  beforeEach(() => {
    vi.resetModules();
    fetchHomeFeedMock.mockReset();
    fetchPostDetailMock.mockReset();
    fetchProfileMock.mockReset();
  });

  it("loads the personal timeline on the server as serializable data", async () => {
    const feed = { timeline: "personal", data: { personalTimeline: { edges: [] } } };
    fetchHomeFeedMock.mockResolvedValue(feed);
    const { Route } = await import("../../routes/_feed.index");
    const loader = expectLoader(Route.options.loader);

    const result = await loader(
      createLoaderContext({
        context: { viewer: { id: "viewer-1" } },
        search: { timeline: "personal" },
      }),
    );

    expect(fetchHomeFeedMock).toHaveBeenCalledWith({
      data: { timeline: "personal" },
    });
    expect(result).toEqual(feed);
  });

  it("does not fetch the personal timeline when the viewer is signed out", async () => {
    const { Route } = await import("../../routes/_feed.index");
    const loader = expectLoader(Route.options.loader);

    const result = await loader(
      createLoaderContext({
        search: { timeline: "personal" },
      }),
    );

    expect(fetchHomeFeedMock).not.toHaveBeenCalled();
    expect(result).toEqual({
      data: null,
      timeline: "personal",
    });
  });

  it("loads the public timeline when the viewer is signed out", async () => {
    const feed = { timeline: "public", data: { publicTimeline: { edges: [] } } };
    fetchHomeFeedMock.mockResolvedValue(feed);
    const { Route } = await import("../../routes/_feed.index");
    const loader = expectLoader(Route.options.loader);

    const result = await loader(
      createLoaderContext({
        search: { timeline: "public" },
      }),
    );

    expect(fetchHomeFeedMock).toHaveBeenCalledWith({
      data: { timeline: "public" },
    });
    expect(result).toEqual(feed);
  });

  it("loads the Hackers' Pub local timeline when the viewer is signed out", async () => {
    const feed = { timeline: "hackersPub", data: { publicTimeline: { edges: [] } } };
    fetchHomeFeedMock.mockResolvedValue(feed);
    const { Route } = await import("../../routes/_feed.index");
    const loader = expectLoader(Route.options.loader);

    const result = await loader(
      createLoaderContext({
        search: { timeline: "hackersPub" },
      }),
    );

    expect(fetchHomeFeedMock).toHaveBeenCalledWith({
      data: { timeline: "hackersPub" },
    });
    expect(result).toEqual(feed);
  });

  it("surfaces home timeline failures to the feed route error boundary", async () => {
    fetchHomeFeedMock.mockRejectedValue(new Error("GraphQL request failed (503)"));
    const { Route } = await import("../../routes/_feed.index");
    const loader = expectLoader(Route.options.loader);
    expect(Route.options.errorComponent).toBeTypeOf("function");

    await expect(
      loader(
        createLoaderContext({
          context: { viewer: { id: "viewer-1" } },
        }),
      ),
    ).rejects.toThrow("GraphQL request failed (503)");
    expect(fetchHomeFeedMock).toHaveBeenCalledTimes(1);
  });

  it("loads the post detail on the server as serializable data", async () => {
    const post = { node: null };
    fetchPostDetailMock.mockResolvedValue(post);
    const { Route } = await import("../../routes/posts.$postId");
    const loader = expectLoader(Route.options.loader);

    const result = await loader(
      createLoaderContext({
        params: { postId: "post-123" },
      }),
    );

    expect(fetchPostDetailMock).toHaveBeenCalledWith({ data: "post-123" });
    expect(result).toEqual(post);
  });

  it("loads the profile on the server as serializable data", async () => {
    const profile = { actorByHandle: null };
    fetchProfileMock.mockResolvedValue(profile);
    const { Route } = await import("../../routes/profiles.$handle");
    const loader = expectLoader(Route.options.loader);

    const result = await loader(
      createLoaderContext({
        params: { handle: "@lucid" },
      }),
    );

    expect(fetchProfileMock).toHaveBeenCalledWith({ data: "@lucid" });
    expect(result).toEqual(profile);
  });
});
