import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vite-plus/test";
import { FeedList } from "./feed-list";

describe("FeedList", () => {
  it("renders caller-provided empty-state copy", () => {
    render(() => (
      <FeedList
        emptyMessage="Nothing in your personal timeline yet."
        label="Personal timeline"
        posts={[]}
      />
    ));

    expect(screen.getByText("Nothing in your personal timeline yet.")).toBeTruthy();
  });

  it("renders post previews inside the caller-labeled feed", () => {
    render(() => (
      <FeedList
        label="Personal timeline"
        posts={[
          {
            id: "post-1",
            kind: "article",
            title: "Relay in a custom Solid client",
            excerpt: "A feed item excerpt",
            publishedAt: "2026-03-23T05:00:00.000Z",
            href: "/posts/post-1",
            author: {
              handle: "@alice",
              name: "Alice",
              avatarUrl: "https://example.com/avatar.png",
            },
            stats: {
              reactions: 8,
              replies: 3,
              shares: 2,
            },
            reactionGroups: [{ count: 8, emoji: "🔥" }],
          },
        ]}
      />
    ));

    expect(screen.getByRole("feed", { name: "Personal timeline" })).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Relay in a custom Solid client" }).getAttribute("href"),
    ).toBe("/posts/post-1");
    expect(screen.getByText("@alice")).toBeTruthy();
    expect(screen.getByText("8")).toBeTruthy();
  });
});
