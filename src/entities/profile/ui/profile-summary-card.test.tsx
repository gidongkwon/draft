import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vite-plus/test";
import { ProfilePage } from "../../../pages/profile";
import { ProfileSummaryCard } from "./profile-summary-card";

let mockProfileData: {
  actorByHandle: {
    handle: string;
    rawName: string | null;
    username: string;
    avatarUrl: string;
    bio: string | null;
    published: string | null;
    posts: {
      edges: Array<{
        node: {
          id: string;
          name: string | null;
          excerpt: string;
          published: string;
          actor: {
            handle: string;
            rawName: string | null;
            username: string;
          };
          engagementStats: {
            reactions: number;
            replies: number;
            shares: number;
          };
        };
      }>;
    };
  } | null;
};

describe("ProfileSummaryCard", () => {
  it("renders actor identity inside the redesigned profile header", () => {
    render(() => (
      <ProfileSummaryCard
        profile={{
          handle: "@alice",
          name: "Alice Doe",
          bio: "Building a Relay-first client.",
          avatarUrl: "https://example.com/avatar.png",
          profileHref: "/profiles/@alice",
          publishedAt: "2026-03-22T00:00:00.000Z",
        }}
      />
    ));

    expect(screen.getByRole("img", { name: "Alice Doe avatar" }).getAttribute("src")).toBe(
      "https://example.com/avatar.png",
    );
    expect(screen.getByRole("link", { name: "Alice Doe" }).getAttribute("href")).toBe(
      "/profiles/@alice",
    );
    expect(screen.getByText("@alice")).toBeTruthy();
    expect(document.querySelector('[data-app-icon="calendar"]')).toBeTruthy();
  });

  it("shows an initials placeholder when the profile avatar is unavailable", () => {
    render(() => (
      <ProfileSummaryCard
        profile={{
          handle: "@alice",
          name: "Alice Doe",
          bio: "Building a Relay-first client.",
          avatarUrl: "",
          profileHref: "/profiles/@alice",
          publishedAt: "2026-03-22T00:00:00.000Z",
        }}
      />
    ));

    expect(screen.getByText("AD")).toBeTruthy();
    expect(screen.queryByRole("img", { name: "Alice Doe avatar" })).toBeNull();
  });
});

describe("ProfilePage", () => {
  it("renders the profile summary above the feed and keeps the page in the command surface", () => {
    mockProfileData = {
      actorByHandle: {
        handle: "@alice",
        rawName: "Alice Doe",
        username: "alice",
        avatarUrl: "https://example.com/avatar.png",
        bio: "Building a Relay-first client.",
        published: "2026-03-22T00:00:00.000Z",
        posts: {
          edges: [
            {
              node: {
                id: "post-1",
                name: "Relay in a custom Solid client",
                excerpt: "A feed item excerpt",
                published: "2026-03-23T05:00:00.000Z",
                actor: {
                  handle: "@alice",
                  rawName: "Alice Doe",
                  username: "alice",
                },
                engagementStats: {
                  reactions: 8,
                  replies: 3,
                  shares: 2,
                },
              },
            },
          ],
        },
      },
    };

    render(() => <ProfilePage data={mockProfileData} />);

    expect(screen.getByRole("img", { name: "Alice Doe avatar" }).getAttribute("src")).toBe(
      "https://example.com/avatar.png",
    );
    expect(screen.getByRole("heading", { name: "Latest posts from Alice Doe" })).toBeTruthy();
    expect(screen.getByRole("feed", { name: "Public timeline" })).toBeTruthy();
    expect(screen.getByText("Profile view")).toBeTruthy();
  });
});
