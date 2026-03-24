import { fireEvent, render, screen, waitFor } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { HomeFeedFeed } from "./home-feed-page";
import type { homeFeedQuery } from "./__generated__/homeFeedQuery.graphql";

const { fetchHomeTimelinePageMock, useServerFnMock } = vi.hoisted(() => ({
  fetchHomeTimelinePageMock: vi.fn(),
  useServerFnMock: vi.fn(),
}));

vi.mock("@tanstack/solid-start", async () => {
  const actual =
    await vi.importActual<typeof import("@tanstack/solid-start")>("@tanstack/solid-start");

  return {
    ...actual,
    useServerFn: useServerFnMock,
  };
});

vi.mock("../../../shared/api/server-queries", async () => {
  const actual = await vi.importActual<typeof import("../../../shared/api/server-queries")>(
    "../../../shared/api/server-queries",
  );

  return {
    ...actual,
    fetchHomeTimelinePage: vi.fn(),
  };
});

type HomeFeedData = homeFeedQuery["response"];
type TestTimeline = "personal" | "public" | "hackersPub";
type TestEdge =
  | NonNullable<HomeFeedData["personalTimeline"]>["edges"][number]
  | NonNullable<HomeFeedData["publicTimeline"]>["edges"][number];
type ReplyTargetFixture = {
  id: string;
  replyTarget: ReplyTargetFixture | null;
};

function createReplyTargetChain(replyTargetIds: string[]) {
  return replyTargetIds.reduceRight<ReplyTargetFixture | null>(
    (current, id) => ({
      id,
      replyTarget: current,
    }),
    null,
  );
}

function createTimelineEdge(
  id: string,
  title: string,
  cursor: string,
  options?: {
    published?: string;
    replyTargetIds?: string[];
  },
): TestEdge {
  return {
    lastSharer: null,
    sharersCount: 0,
    cursor,
    node: {
      __typename: "Article",
      actor: {
        avatarUrl: `https://example.com/${id}.png`,
        handle: `@${id}`,
        rawName: `${title} Author`,
        username: id,
      },
      engagementStats: {
        reactions: 8,
        replies: 3,
        shares: 2,
      },
      reactionGroups: [
        { emoji: "🔥", reactors: { totalCount: 4 } },
        { emoji: "👏", reactors: { totalCount: 3 } },
      ],
      excerpt: `${title} excerpt`,
      id,
      name: title,
      published: options?.published ?? "2026-03-23T05:00:00.000Z",
      replyTarget: createReplyTargetChain(options?.replyTargetIds ?? []),
    },
  } as unknown as TestEdge;
}

function createRepostedTimelineEdge(
  id: string,
  title: string,
  cursor: string,
  sharersCount = 1,
): TestEdge {
  return {
    ...createTimelineEdge(id, title, cursor),
    lastSharer: {
      handle: "@bob",
      rawName: "Bob Smith",
      username: "bob",
    },
    sharersCount,
  };
}

function createHomeFeedData(
  edges = [createTimelineEdge("post-1", "First post", "cursor-1")],
  timeline: TestTimeline = "personal",
): HomeFeedData {
  const connection = {
    edges,
    pageInfo: {
      endCursor: edges.at(-1)?.cursor ?? null,
      hasNextPage: true,
    },
  };

  return (
    timeline === "personal" ? { personalTimeline: connection } : { publicTimeline: connection }
  ) as HomeFeedData;
}

let intersectionObserverCallback: IntersectionObserverCallback | null = null;

class MockIntersectionObserver {
  readonly root = null;
  readonly rootMargin = "";
  readonly thresholds = [];

  disconnect = vi.fn();
  observe = vi.fn();
  takeRecords = vi.fn(() => []);
  unobserve = vi.fn();

  constructor(callback: IntersectionObserverCallback) {
    intersectionObserverCallback = callback;
  }
}

class MockResizeObserver {
  disconnect = vi.fn();
  observe = vi.fn();
  unobserve = vi.fn();

  constructor(_callback: ResizeObserverCallback) {}
}

function triggerIntersection(isIntersecting = true) {
  if (!intersectionObserverCallback) {
    throw new Error("Expected an observer callback to be registered.");
  }

  intersectionObserverCallback(
    [
      {
        boundingClientRect: {} as DOMRectReadOnly,
        intersectionRatio: isIntersecting ? 1 : 0,
        intersectionRect: {} as DOMRectReadOnly,
        isIntersecting,
        rootBounds: null,
        target: document.createElement("div"),
        time: Date.now(),
      },
    ],
    {} as IntersectionObserver,
  );
}

describe("HomeFeedFeed", () => {
  beforeEach(() => {
    intersectionObserverCallback = null;
    fetchHomeTimelinePageMock.mockReset();
    useServerFnMock.mockReset();
    useServerFnMock.mockReturnValue(fetchHomeTimelinePageMock);
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
    vi.stubGlobal("ResizeObserver", MockResizeObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the personal timeline feed from query data", () => {
    render(() => <HomeFeedFeed data={createHomeFeedData()} timeline="personal" />);

    expect(screen.getByRole("feed", { name: "Personal timeline" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "First post" })).toBeTruthy();
    expect(screen.getByText("🔥")).toBeTruthy();
  });

  it("renders a contiguous same-thread run in chronological order with connector states", () => {
    const { container } = render(() => (
      <HomeFeedFeed
        data={createHomeFeedData(
          [
            createTimelineEdge("reply-2", "Third post", "cursor-1", {
              published: "2026-03-23T07:00:00.000Z",
              replyTargetIds: ["reply-1", "root-post"],
            }),
            createTimelineEdge("reply-1", "Second post", "cursor-2", {
              published: "2026-03-23T06:00:00.000Z",
              replyTargetIds: ["root-post"],
            }),
            createTimelineEdge("root-post", "First post", "cursor-3", {
              published: "2026-03-23T05:00:00.000Z",
            }),
          ],
          "public",
        )}
        timeline="public"
      />
    ));

    const postLinks = [...container.querySelectorAll('a[href^="/posts/"]')].map((link) =>
      link.textContent?.trim(),
    );
    const threadPositions = [...container.querySelectorAll("article")].map((article) =>
      article.getAttribute("data-thread-position"),
    );
    const threadGrouped = [...container.querySelectorAll("article")].map((article) =>
      article.getAttribute("data-thread-grouped"),
    );
    const threadRuns = [...container.querySelectorAll("[data-thread-run]")].map((run) =>
      run.getAttribute("data-thread-run"),
    );

    expect(postLinks).toEqual(["First post", "Second post", "Third post"]);
    expect(threadPositions).toEqual(["start", "middle", "end"]);
    expect(threadGrouped).toEqual(["true", "true", "true"]);
    expect(threadRuns).toEqual(["true"]);
  });

  it("merges duplicate edges for the same post into one card and keeps repost attribution", () => {
    render(() => (
      <HomeFeedFeed
        data={createHomeFeedData(
          [
            createTimelineEdge("post-1", "First post", "cursor-1"),
            createRepostedTimelineEdge("post-1", "First post", "cursor-1b", 2),
          ],
          "public",
        )}
        timeline="public"
      />
    ));

    expect(screen.getAllByRole("link", { name: "First post" })).toHaveLength(1);
    expect(screen.getByText("Shared by Bob Smith and 1 other")).toBeTruthy();
  });

  it("renders the public timeline feed from query data", () => {
    render(() => <HomeFeedFeed data={createHomeFeedData(undefined, "public")} timeline="public" />);

    expect(screen.getByRole("feed", { name: "Public timeline" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "First post" })).toBeTruthy();
  });

  it("renders the Hackers' Pub local timeline feed from query data", () => {
    render(() => (
      <HomeFeedFeed data={createHomeFeedData(undefined, "hackersPub")} timeline="hackersPub" />
    ));

    expect(screen.getByRole("feed", { name: "Hackers' Pub timeline" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "First post" })).toBeTruthy();
  });

  it("renders a sign-in prompt when the personal timeline is unavailable to signed-out viewers", () => {
    render(() => <HomeFeedFeed data={null} timeline="personal" />);

    expect(screen.getByText("Sign in to view your personal timeline.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeTruthy();
  });

  it("loads the next 20 personal timeline posts when the sentinel intersects", async () => {
    fetchHomeTimelinePageMock.mockResolvedValue({
      personalTimeline: {
        edges: [createTimelineEdge("post-2", "Second post", "cursor-2")],
        pageInfo: {
          endCursor: "cursor-2",
          hasNextPage: false,
        },
      },
    });

    render(() => <HomeFeedFeed data={createHomeFeedData()} timeline="personal" />);

    triggerIntersection();

    expect(fetchHomeTimelinePageMock).toHaveBeenCalledWith({
      data: {
        after: "cursor-1",
        timeline: "personal",
      },
    });
    expect(await screen.findByRole("link", { name: "Second post" })).toBeTruthy();
  });

  it("does not append a duplicate card when the next page repeats the same post as a repost", async () => {
    fetchHomeTimelinePageMock.mockResolvedValue({
      publicTimeline: {
        edges: [createRepostedTimelineEdge("post-1", "First post", "cursor-2", 3)],
        pageInfo: {
          endCursor: "cursor-2",
          hasNextPage: false,
        },
      },
    });

    render(() => <HomeFeedFeed data={createHomeFeedData(undefined, "public")} timeline="public" />);

    triggerIntersection();

    await screen.findByText("Shared by Bob Smith and 2 others");
    expect(screen.getAllByRole("link", { name: "First post" })).toHaveLength(1);
  });

  it("does not merge a later page post into an earlier non-adjacent thread run", async () => {
    fetchHomeTimelinePageMock.mockResolvedValue({
      publicTimeline: {
        edges: [
          createTimelineEdge("reply-1", "Third post", "cursor-3", {
            published: "2026-03-23T07:00:00.000Z",
            replyTargetIds: ["root-post"],
          }),
        ],
        pageInfo: {
          endCursor: "cursor-3",
          hasNextPage: false,
        },
      },
    });

    const { container } = render(() => (
      <HomeFeedFeed
        data={createHomeFeedData(
          [
            createTimelineEdge("root-post", "First post", "cursor-1", {
              published: "2026-03-23T05:00:00.000Z",
            }),
            createTimelineEdge("other-post", "Second post", "cursor-2", {
              published: "2026-03-23T06:00:00.000Z",
            }),
          ],
          "public",
        )}
        timeline="public"
      />
    ));

    triggerIntersection();
    await screen.findByRole("link", { name: "Third post" });

    const postLinks = [...container.querySelectorAll('a[href^="/posts/"]')].map((link) =>
      link.textContent?.trim(),
    );
    const threadPositions = [...container.querySelectorAll("article")].map((article) =>
      article.getAttribute("data-thread-position"),
    );

    expect(postLinks).toEqual(["First post", "Second post", "Third post"]);
    expect(threadPositions).toEqual(["single", "single", "single"]);
  });

  it("does not issue a duplicate page load while the next page is already loading", async () => {
    let resolvePage!: (value: HomeFeedData) => void;
    fetchHomeTimelinePageMock.mockImplementation(
      () =>
        new Promise<HomeFeedData>((resolve) => {
          resolvePage = resolve;
        }),
    );

    render(() => <HomeFeedFeed data={createHomeFeedData()} timeline="personal" />);

    triggerIntersection();
    triggerIntersection();

    expect(fetchHomeTimelinePageMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Loading more posts...")).toBeTruthy();

    resolvePage({
      personalTimeline: {
        edges: [createTimelineEdge("post-2", "Second post", "cursor-2")],
        pageInfo: {
          endCursor: "cursor-2",
          hasNextPage: false,
        },
      },
    });

    await waitFor(() => {
      expect(screen.queryByText("Loading more posts...")).toBeNull();
    });
  });

  it("offers a retry action when loading the next page fails", async () => {
    fetchHomeTimelinePageMock
      .mockRejectedValueOnce(new Error("request failed"))
      .mockResolvedValueOnce({
        personalTimeline: {
          edges: [createTimelineEdge("post-2", "Second post", "cursor-2")],
          pageInfo: {
            endCursor: "cursor-2",
            hasNextPage: false,
          },
        },
      });

    render(() => <HomeFeedFeed data={createHomeFeedData()} timeline="personal" />);

    triggerIntersection();

    const retryButton = await screen.findByRole("button", { name: "Retry loading posts" });

    fireEvent.click(retryButton);

    expect(fetchHomeTimelinePageMock).toHaveBeenCalledTimes(2);
    expect(await screen.findByRole("link", { name: "Second post" })).toBeTruthy();
  });
});
