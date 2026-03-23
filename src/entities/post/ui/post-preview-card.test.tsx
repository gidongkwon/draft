import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vite-plus/test";
import { PostPreviewCard } from "./post-preview-card";

describe("PostPreviewCard", () => {
  it("renders an article card with a headline and summary", () => {
    render(() => (
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
    expect(screen.getByText("8")).toBeTruthy();
    expect(document.querySelector('[data-app-icon="reaction"]')).toBeTruthy();
    expect(document.querySelector('[data-app-icon="reply"]')).toBeTruthy();
    expect(document.querySelector('[data-app-icon="share"]')).toBeTruthy();
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
        }}
      />
    ));

    expect(
      screen.queryByRole("heading", { name: /a note body rendered as the main content block/i }),
    ).toBeNull();
    expect(screen.getByText("A note body rendered as the main content block")).toBeTruthy();
  });
});
