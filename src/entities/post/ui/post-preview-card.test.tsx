import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vite-plus/test";
import { PostPreviewCard } from "./post-preview-card";

describe("PostPreviewCard", () => {
  it("renders an article card with a headline and summary", () => {
    const { container } = render(() => (
      <PostPreviewCard
        post={{
          id: "post-1",
          kind: "article",
          title: "Relay in a custom Solid client",
          excerpt: "A feed item excerpt",
          publishedAt: "2026-03-23T05:00:00.000Z",
          href: "/posts/post-1",
          author: {
            handle: "@alice",
            name: "Alice Doe",
            avatarUrl: "https://example.com/avatar.png",
          },
          stats: {
            reactions: 8,
            replies: 3,
            shares: 2,
          },
          reactionGroups: [
            { count: 4, emoji: "🔥" },
            { count: 3, emoji: "👏" },
          ],
          shareSummary: {
            sharer: {
              handle: "@bob",
              name: "Bob Smith",
            },
            sharersCount: 2,
          },
        }}
      />
    ));

    expect(screen.getByRole("link", { name: "Alice Doe" }).getAttribute("href")).toBe(
      "/profiles/@alice",
    );
    expect(
      screen.getByRole("link", { name: "Relay in a custom Solid client" }).getAttribute("href"),
    ).toBe("/posts/post-1");
    expect(screen.getByRole("img", { name: "Alice Doe avatar" }).getAttribute("src")).toBe(
      "https://example.com/avatar.png",
    );
    expect(screen.getByText("@alice")).toBeTruthy();
    expect(screen.getByText("Shared by Bob Smith and 1 other")).toBeTruthy();
    expect(screen.getByText("🔥")).toBeTruthy();
    expect(screen.getByText("8")).toBeTruthy();
    expect(
      container.querySelector("[data-share-summary='true'] + div [data-avatar-shell='true']"),
    ).toBeTruthy();
  });

  it("renders a note card without a headline when the post has no title", () => {
    render(() => (
      <PostPreviewCard
        post={{
          id: "post-2",
          kind: "note",
          title: null,
          excerpt: "A note body rendered as the main content block",
          publishedAt: "2026-03-23T05:00:00.000Z",
          href: "/posts/post-2",
          author: {
            handle: "@alice",
            name: "Alice Doe",
            avatarUrl: "https://example.com/avatar.png",
          },
          stats: {
            reactions: 2,
            replies: 1,
            shares: 0,
          },
          reactionGroups: [{ count: 2, emoji: "🔥" }],
        }}
      />
    ));

    expect(
      screen.queryByRole("heading", { name: /a note body rendered as the main content block/i }),
    ).toBeNull();
    expect(screen.getByText("A note body rendered as the main content block")).toBeTruthy();
  });

  it("exposes the thread position when the card belongs to a visible thread run", () => {
    const { container } = render(() => (
      <PostPreviewCard
        post={{
          id: "post-3",
          kind: "note",
          title: null,
          excerpt: "Threaded note",
          publishedAt: "2026-03-23T05:00:00.000Z",
          href: "/posts/post-3",
          author: {
            handle: "@alice",
            name: "Alice Doe",
            avatarUrl: "https://example.com/avatar.png",
          },
          stats: {
            reactions: 1,
            replies: 1,
            shares: 0,
          },
          reactionGroups: [{ count: 1, emoji: "🔥" }],
        }}
        threadPosition="middle"
      />
    ));

    expect(container.querySelector('article[data-thread-position="middle"]')).toBeTruthy();
    expect(container.querySelector('article[data-thread-grouped="true"]')).toBeTruthy();
    expect(container.querySelector('[data-avatar-shell="true"]')).toBeTruthy();
    expect(container.querySelector("[data-thread-line]")).toBeNull();
  });

  it("stops the connector at the avatar center on the last card in a thread", () => {
    const { container } = render(() => (
      <PostPreviewCard
        post={{
          id: "post-4",
          kind: "note",
          title: null,
          excerpt: "Thread tail",
          publishedAt: "2026-03-23T05:00:00.000Z",
          href: "/posts/post-4",
          author: {
            handle: "@alice",
            name: "Alice Doe",
            avatarUrl: "https://example.com/avatar.png",
          },
          stats: {
            reactions: 1,
            replies: 1,
            shares: 0,
          },
          reactionGroups: [{ count: 1, emoji: "🔥" }],
        }}
        threadPosition="end"
      />
    ));

    expect(container.querySelector("[data-thread-line]")).toBeNull();
  });
});
