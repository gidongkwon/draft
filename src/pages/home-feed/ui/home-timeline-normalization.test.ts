import { describe, expect, it } from "vite-plus/test";
import type { PostCardModel } from "../../../entities/post";
import {
  mergeVisibleThreadRuns,
  normalizeVisibleThreadRuns,
  type HomeTimelinePost,
} from "./home-timeline";

function createHomeTimelinePost(
  id: string,
  publishedAtUnix: number,
  threadKey: string,
): HomeTimelinePost {
  return {
    id,
    kind: "note",
    title: null,
    excerpt: id,
    publishedAt: new Date(publishedAtUnix).toISOString(),
    href: `/posts/${id}`,
    author: {
      handle: `@${id}`,
      name: id,
      avatarUrl: null,
    },
    publishedAtUnix,
    reactionGroups: [],
    stats: {
      reactions: 0,
      replies: 0,
      shares: 0,
    },
    threadKey,
  } satisfies PostCardModel & HomeTimelinePost;
}

describe("home timeline normalization", () => {
  it("keeps a later non-adjacent same-thread page append as a single post", () => {
    const currentDisplay = normalizeVisibleThreadRuns([
      createHomeTimelinePost("root-post", Date.parse("2026-03-23T05:00:00.000Z"), "root-post"),
      createHomeTimelinePost("other-post", Date.parse("2026-03-23T06:00:00.000Z"), "other-post"),
    ]);

    const mergedPosts = [
      createHomeTimelinePost("root-post", Date.parse("2026-03-23T05:00:00.000Z"), "root-post"),
      createHomeTimelinePost("other-post", Date.parse("2026-03-23T06:00:00.000Z"), "other-post"),
      createHomeTimelinePost("reply-1", Date.parse("2026-03-23T07:00:00.000Z"), "root-post"),
    ];

    const mergedDisplay = mergeVisibleThreadRuns(currentDisplay, mergedPosts, 2);

    expect(mergedDisplay.map((post) => post.id)).toEqual(["root-post", "other-post", "reply-1"]);
    expect(mergedDisplay.map((post) => post.threadPosition)).toEqual([
      "single",
      "single",
      "single",
    ]);
  });

  it("merges the appended page into the trailing boundary run when the next page continues it", () => {
    const currentDisplay = normalizeVisibleThreadRuns([
      createHomeTimelinePost("reply-1", Date.parse("2026-03-23T06:00:00.000Z"), "root-post"),
      createHomeTimelinePost("root-post", Date.parse("2026-03-23T05:00:00.000Z"), "root-post"),
    ]);

    const mergedPosts = [
      createHomeTimelinePost("reply-1", Date.parse("2026-03-23T06:00:00.000Z"), "root-post"),
      createHomeTimelinePost("root-post", Date.parse("2026-03-23T05:00:00.000Z"), "root-post"),
      createHomeTimelinePost("reply-2", Date.parse("2026-03-23T07:00:00.000Z"), "root-post"),
    ];

    const mergedDisplay = mergeVisibleThreadRuns(currentDisplay, mergedPosts, 2);

    expect(mergedDisplay.map((post) => post.id)).toEqual(["root-post", "reply-1", "reply-2"]);
    expect(mergedDisplay.map((post) => post.threadPosition)).toEqual(["start", "middle", "end"]);
  });
});
