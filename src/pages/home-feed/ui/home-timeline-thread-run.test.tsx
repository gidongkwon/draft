import { render, waitFor } from "@solidjs/testing-library";
import { afterEach, beforeEach, describe, expect, it, vi } from "vite-plus/test";
import { HomeTimelineThreadRun, type HomeTimelineThreadRunPost } from "./home-timeline-thread-run";

let resizeObserverCallback: ResizeObserverCallback | null = null;

class MockResizeObserver {
  disconnect = vi.fn();
  observe = vi.fn();
  unobserve = vi.fn();

  constructor(callback: ResizeObserverCallback) {
    resizeObserverCallback = callback;
  }
}

function triggerResizeObserver() {
  if (!resizeObserverCallback) {
    throw new Error("Expected ResizeObserver to be registered.");
  }

  resizeObserverCallback([], {} as ResizeObserver);
}

function createThreadPost(id: string, threadPosition: "start" | "middle" | "end") {
  return {
    id,
    kind: "note",
    title: null,
    excerpt: `Post ${id}`,
    publishedAt: "2026-03-23T05:00:00.000Z",
    href: `/posts/${id}`,
    author: {
      handle: `@${id}`,
      name: `Author ${id}`,
      avatarUrl: `https://example.com/${id}.png`,
    },
    reactionGroups: [],
    stats: {
      reactions: 0,
      replies: 0,
      shares: 0,
    },
    threadPosition,
  } satisfies HomeTimelineThreadRunPost;
}

describe("HomeTimelineThreadRun", () => {
  beforeEach(() => {
    resizeObserverCallback = null;
    vi.stubGlobal("ResizeObserver", MockResizeObserver);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();
  });

  it("measures the first and last avatar centers to position a single connector", async () => {
    const { container } = render(() => (
      <HomeTimelineThreadRun
        posts={[
          createThreadPost("post-1", "start"),
          createThreadPost("post-2", "middle"),
          createThreadPost("post-3", "end"),
        ]}
      />
    ));

    const run = container.querySelector('[data-thread-run="true"]') as HTMLDivElement;
    const avatars = [...container.querySelectorAll('[data-avatar-shell="true"]')] as HTMLElement[];

    vi.spyOn(run, "getBoundingClientRect").mockReturnValue({
      bottom: 500,
      height: 400,
      left: 0,
      right: 0,
      top: 100,
      width: 0,
      x: 0,
      y: 100,
      toJSON: () => ({}),
    });
    vi.spyOn(avatars[0]!, "getBoundingClientRect").mockReturnValue({
      bottom: 168,
      height: 48,
      left: 0,
      right: 0,
      top: 120,
      width: 48,
      x: 0,
      y: 120,
      toJSON: () => ({}),
    });
    vi.spyOn(avatars[2]!, "getBoundingClientRect").mockReturnValue({
      bottom: 368,
      height: 48,
      left: 0,
      right: 0,
      top: 320,
      width: 48,
      x: 0,
      y: 320,
      toJSON: () => ({}),
    });

    triggerResizeObserver();

    await waitFor(() => {
      const line = container.querySelector('[data-thread-run-line="true"]') as HTMLSpanElement;
      expect(line).toBeTruthy();
      expect(line.style.top).toBe("44px");
      expect(line.style.bottom).toBe("156px");
    });
  });
});
