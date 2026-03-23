import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vite-plus/test";
import { PostDetailPage } from "../../../pages/post-detail";
import { PostDetailView } from "./post-detail-view";

let mockPostDetailData: {
  node: {
    __typename: string;
    id: string;
    name: string | null;
    summary: string | null;
    content: string;
    published: string;
    url: string | null;
    actor: {
      handle: string;
      rawName: string | null;
      username: string;
      avatarUrl: string;
      bio: string | null;
    };
    engagementStats: {
      reactions: number;
      replies: number;
      shares: number;
      quotes: number;
    };
  } | null;
};

describe("PostDetailView", () => {
  it("renders the redesigned reading surface with author and canonical links", () => {
    render(() => (
      <PostDetailView
        post={{
          id: "post-1",
          kind: "article",
          title: "Relay in a custom Solid client",
          summary: "A summary for the redesigned detail view.",
          contentHtml: "<p>Hello from the post body.</p>",
          publishedAt: "2026-03-23T05:00:00.000Z",
          canonicalUrl: "https://example.com/posts/post-1",
          author: {
            handle: "@alice",
            name: "Alice Doe",
            avatarUrl: "https://example.com/avatar.png",
            bio: "Shipping a calmer social client.",
            profileHref: "/profiles/@alice",
          },
          stats: {
            reactions: 8,
            replies: 3,
            shares: 2,
            quotes: 1,
          },
        }}
      />
    ));

    expect(screen.getByRole("heading", { name: "Relay in a custom Solid client" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Alice Doe" }).getAttribute("href")).toBe(
      "/profiles/@alice",
    );
    expect(screen.getAllByRole("img", { name: "Alice Doe avatar" })).toHaveLength(2);
    expect(screen.getByText("A summary for the redesigned detail view.")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Open original post" }).getAttribute("href")).toBe(
      "https://example.com/posts/post-1",
    );
    expect(document.querySelector('[data-app-icon="open"]')).toBeTruthy();
    expect(document.querySelector('[data-app-icon="author"]')).toBeTruthy();
  });

  it("renders a note detail without the oversized article headline", () => {
    render(() => (
      <PostDetailView
        post={{
          id: "post-2",
          kind: "note",
          title: null,
          summary: null,
          contentHtml: "<p>Hello from the note body.</p>",
          publishedAt: "2026-03-23T05:00:00.000Z",
          canonicalUrl: null,
          author: {
            handle: "@alice",
            name: "Alice Doe",
            avatarUrl: "https://example.com/avatar.png",
            bio: "Shipping a calmer social client.",
            profileHref: "/profiles/@alice",
          },
          stats: {
            reactions: 8,
            replies: 3,
            shares: 2,
            quotes: 1,
          },
        }}
      />
    ));

    expect(screen.queryByRole("heading", { name: "Relay in a custom Solid client" })).toBeNull();
    expect(screen.getByText("Hello from the note body.")).toBeTruthy();
  });
});

describe("PostDetailPage", () => {
  it("renders the reading mode shell with the engagement list and author context", () => {
    mockPostDetailData = {
      node: {
        __typename: "Article",
        id: "post-1",
        name: "Relay in a custom Solid client",
        summary: "A summary for the redesigned detail view.",
        content: "<p>Hello from the post body.</p>",
        published: "2026-03-23T05:00:00.000Z",
        url: "https://example.com/posts/post-1",
        actor: {
          handle: "@alice",
          rawName: "Alice Doe",
          username: "alice",
          avatarUrl: "https://example.com/avatar.png",
          bio: "Shipping a calmer social client.",
        },
        engagementStats: {
          reactions: 8,
          replies: 3,
          shares: 2,
          quotes: 1,
        },
      },
    };

    render(() => <PostDetailPage data={mockPostDetailData} />);

    expect(screen.getByRole("heading", { name: "Relay in a custom Solid client" })).toBeTruthy();
    expect(screen.getByRole("list", { name: "Engagement" })).toBeTruthy();
    expect(screen.getByRole("link", { name: "Alice Doe" }).getAttribute("href")).toBe(
      "/profiles/@alice",
    );
    expect(screen.getByRole("link", { name: "Open original post" }).getAttribute("href")).toBe(
      "https://example.com/posts/post-1",
    );
  });

  it("maps a Note typename into the note reading surface", () => {
    mockPostDetailData = {
      node: {
        __typename: "Note",
        id: "post-2",
        name: null,
        summary: null,
        content: "<p>Hello from the note body.</p>",
        published: "2026-03-23T05:00:00.000Z",
        url: null,
        actor: {
          handle: "@alice",
          rawName: "Alice Doe",
          username: "alice",
          avatarUrl: "https://example.com/avatar.png",
          bio: "Shipping a calmer social client.",
        },
        engagementStats: {
          reactions: 8,
          replies: 3,
          shares: 2,
          quotes: 1,
        },
      },
    };

    render(() => <PostDetailPage data={mockPostDetailData} />);

    expect(screen.queryByRole("heading", { name: /relay in a custom solid client/i })).toBeNull();
    expect(screen.getByText("Hello from the note body.")).toBeTruthy();
  });
});
