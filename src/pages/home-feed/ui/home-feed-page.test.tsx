import { fireEvent, render, screen, waitFor } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { HomeFeedFeed } from "./home-feed-page";

const { fetchPersonalTimelinePageMock, useServerFnMock } = vi.hoisted(() => ({
  fetchPersonalTimelinePageMock: vi.fn(),
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
    fetchPersonalTimelinePage: vi.fn(),
  };
});

function createTimelineEdge(id: string, title: string, cursor: string) {
  return {
    cursor,
    node: {
      __typename: "Article",
      actor: {
        avatarUrl: null,
        handle: `@${id}`,
        rawName: `${title} Author`,
        username: id,
      },
      engagementStats: {
        reactions: 8,
        replies: 3,
        shares: 2,
      },
      excerpt: `${title} excerpt`,
      id,
      name: title,
      published: "2026-03-23T05:00:00.000Z",
    },
  };
}

function createHomeFeedData(edges = [createTimelineEdge("post-1", "First post", "cursor-1")]) {
  return {
    personalTimeline: {
      edges,
      pageInfo: {
        endCursor: edges.at(-1)?.cursor ?? null,
        hasNextPage: true,
      },
    },
  };
}

let intersectionObserverCallback: IntersectionObserverCallback | null = null;

class MockIntersectionObserver implements IntersectionObserver {
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
    fetchPersonalTimelinePageMock.mockReset();
    useServerFnMock.mockReset();
    useServerFnMock.mockReturnValue(fetchPersonalTimelinePageMock);
    vi.stubGlobal("IntersectionObserver", MockIntersectionObserver);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("renders the personal timeline feed from query data", () => {
    render(() => <HomeFeedFeed data={createHomeFeedData()} timeline="personal" />);

    expect(screen.getByRole("feed", { name: "Personal timeline" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "First post" })).toBeTruthy();
  });

  it("renders a sign-in prompt when the personal timeline is unavailable to signed-out viewers", () => {
    render(() => <HomeFeedFeed data={null} timeline="personal" />);

    expect(screen.getByText("Sign in to view your personal timeline.")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeTruthy();
  });

  it("renders an unavailable state for the public timeline", () => {
    render(() => (
      <HomeFeedFeed
        data={null}
        timeline="public"
        unavailableReason="Public timeline is temporarily unavailable."
      />
    ));

    expect(screen.getByText("Public timeline is temporarily unavailable.")).toBeTruthy();
  });

  it("loads the next 20 personal timeline posts when the sentinel intersects", async () => {
    fetchPersonalTimelinePageMock.mockResolvedValue({
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

    expect(fetchPersonalTimelinePageMock).toHaveBeenCalledWith({
      data: {
        after: "cursor-1",
      },
    });
    expect(await screen.findByRole("link", { name: "Second post" })).toBeTruthy();
  });

  it("does not issue a duplicate page load while the next page is already loading", async () => {
    let resolvePage: ((value: unknown) => void) | null = null;
    fetchPersonalTimelinePageMock.mockImplementation(
      () =>
        new Promise((resolve) => {
          resolvePage = resolve;
        }),
    );

    render(() => <HomeFeedFeed data={createHomeFeedData()} timeline="personal" />);

    triggerIntersection();
    triggerIntersection();

    expect(fetchPersonalTimelinePageMock).toHaveBeenCalledTimes(1);
    expect(screen.getByText("Loading more posts...")).toBeTruthy();

    resolvePage?.({
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
    fetchPersonalTimelinePageMock
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

    expect(fetchPersonalTimelinePageMock).toHaveBeenCalledTimes(2);
    expect(await screen.findByRole("link", { name: "Second post" })).toBeTruthy();
  });
});
