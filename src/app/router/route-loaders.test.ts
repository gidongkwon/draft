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
  params = {},
  search = {},
}: {
  context?: { viewer: { id: string } | null };
  params?: Record<string, string>;
  search?: Record<string, unknown>;
}) {
  return {
    abortController: new AbortController(),
    cause: "enter",
    context,
    deps: {},
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

    expect(Route.options.loader).toBeTypeOf("function");

    const result = await Route.options.loader?.(
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

    const result = await Route.options.loader?.(
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

  it("surfaces home timeline failures to the feed route error boundary", async () => {
    fetchHomeFeedMock.mockRejectedValue(new Error("GraphQL request failed (503)"));
    const { Route } = await import("../../routes/_feed.index");

    expect(Route.options.loader).toBeTypeOf("function");
    expect(Route.options.errorComponent).toBeTypeOf("function");

    await expect(
      Route.options.loader?.(
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

    expect(Route.options.loader).toBeTypeOf("function");

    const result = await Route.options.loader?.(
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

    expect(Route.options.loader).toBeTypeOf("function");

    const result = await Route.options.loader?.(
      createLoaderContext({
        params: { handle: "@lucid" },
      }),
    );

    expect(fetchProfileMock).toHaveBeenCalledWith({ data: "@lucid" });
    expect(result).toEqual(profile);
  });
});
