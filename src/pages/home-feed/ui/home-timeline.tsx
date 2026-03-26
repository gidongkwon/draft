import { useServerFn } from "@tanstack/solid-start";
import { createEffect, createMemo, createSignal, For, onCleanup, Show } from "solid-js";
import {
  PostPreviewCard,
  type PostCardModel,
  type ReactionGroupModel,
} from "../../../entities/post";
import { fetchHomeTimelinePage } from "../../../shared/api/server-queries";
import { stripHtmlTags } from "../../../shared/lib/html";
import { Button } from "../../../shared/ui/button";
import { Surface } from "../../../shared/ui/surface";
import type { HomeFeedTimeline } from "../model/timeline-search";
import type { homeFeedQuery } from "./__generated__/homeFeedQuery.graphql";
import { HomeTimelineThreadRun, type HomeTimelineThreadRunPost } from "./home-timeline-thread-run";

type HomeTimelineConnection =
  | NonNullable<homeFeedQuery["response"]["personalTimeline"]>
  | NonNullable<homeFeedQuery["response"]["publicTimeline"]>;
type HomeTimelineEdge = HomeTimelineConnection["edges"][number];

type HomeTimelineProps = {
  connection: HomeTimelineConnection;
  timeline: HomeFeedTimeline;
};

export type HomeTimelinePost = PostCardModel & {
  publishedAtUnix: number;
  shareSummary?: NonNullable<PostCardModel["shareSummary"]>;
  threadKey: string;
};

export type DisplayHomeTimelinePost = HomeTimelinePost & {
  threadPosition: "single" | "start" | "middle" | "end";
};

type HomeTimelineRenderItem =
  | { posts: HomeTimelineThreadRunPost[]; type: "run" }
  | { post: DisplayHomeTimelinePost; type: "single" };

function mapReactionGroupsToModel(
  reactionGroups: ReadonlyArray<{
    readonly emoji?: string | null | undefined;
    readonly reactors?: { readonly totalCount: number } | null | undefined;
  }>,
): ReactionGroupModel[] {
  return reactionGroups.flatMap((group) =>
    group.emoji && group.reactors?.totalCount != null
      ? [{ count: group.reactors.totalCount, emoji: group.emoji }]
      : [],
  );
}

type TimelinePostNode = HomeTimelineEdge["node"];
type TimelineDisplayNode = NonNullable<TimelinePostNode["sharedPost"]> | TimelinePostNode;

function getDisplayNode(node: TimelinePostNode): TimelineDisplayNode {
  return node.sharedPost ?? node;
}

function getReplyChainIds(
  replyTarget:
    | {
        readonly id: string;
        readonly replyTarget?:
          | {
              readonly id: string;
              readonly replyTarget?:
                | {
                    readonly id: string;
                    readonly replyTarget?: { readonly id: string } | null | undefined;
                  }
                | null
                | undefined;
            }
          | null
          | undefined;
      }
    | null
    | undefined,
) {
  const ids: string[] = [];
  let current = replyTarget;

  while (current) {
    ids.push(current.id);
    current = current.replyTarget ?? null;
  }

  return ids;
}

function mapTimelineEdgeToPost(edge: HomeTimelineEdge): HomeTimelinePost {
  const { node } = edge;
  const displayNode = getDisplayNode(node);
  const sharer = edge.lastSharer ?? (node.sharedPost ? node.actor : null);
  const sharerName = sharer?.rawName ?? sharer?.username;
  const replyChainIds = getReplyChainIds(displayNode.replyTarget);
  const publishedAtUnix = Date.parse(displayNode.published);

  return {
    id: displayNode.id,
    kind:
      displayNode.__typename === "Article" || (displayNode.name ?? "").trim() !== ""
        ? "article"
        : "note",
    title: displayNode.name?.trim() ? displayNode.name : null,
    excerpt: stripHtmlTags(displayNode.excerpt),
    publishedAt: displayNode.published,
    href: `/posts/${displayNode.id}`,
    author: {
      handle: displayNode.actor.handle,
      name: displayNode.actor.rawName ?? displayNode.actor.username,
      avatarUrl: displayNode.actor.avatarUrl ?? null,
    },
    stats: {
      reactions: displayNode.engagementStats.reactions,
      replies: displayNode.engagementStats.replies,
      shares: displayNode.engagementStats.shares,
    },
    publishedAtUnix,
    reactionGroups: mapReactionGroupsToModel(displayNode.reactionGroups),
    shareSummary:
      sharer && sharerName
        ? {
            sharer: {
              handle: sharer.handle,
              name: sharerName,
            },
            sharersCount: Math.max(edge.sharersCount, 1),
          }
        : undefined,
    threadKey: replyChainIds.at(-1) ?? displayNode.id,
  };
}

function hasBetterShareSummary(
  nextSummary: HomeTimelinePost["shareSummary"] | undefined,
  currentSummary: HomeTimelinePost["shareSummary"] | undefined,
) {
  return nextSummary != null && currentSummary == null;
}

function mergeTimelinePosts(
  currentPosts: readonly HomeTimelinePost[],
  nextPosts: readonly HomeTimelinePost[],
): { appendedStartIndex: number | null; posts: HomeTimelinePost[] } {
  const postsById = new Map(currentPosts.map((post) => [post.id, post] as const));
  const order = currentPosts.map((post) => post.id);
  let appendedStartIndex: number | null = null;

  for (const nextPost of nextPosts) {
    const existingPost = postsById.get(nextPost.id);

    if (!existingPost) {
      appendedStartIndex ??= order.length;
      postsById.set(nextPost.id, nextPost);
      order.push(nextPost.id);
      continue;
    }

    postsById.set(nextPost.id, {
      ...existingPost,
      shareSummary:
        hasBetterShareSummary(nextPost.shareSummary, existingPost.shareSummary) ||
        (nextPost.shareSummary?.sharersCount ?? 0) > (existingPost.shareSummary?.sharersCount ?? 0)
          ? nextPost.shareSummary
          : existingPost.shareSummary,
    });
  }

  return {
    appendedStartIndex,
    posts: order.flatMap((id) => {
      const post = postsById.get(id);
      return post ? [post] : [];
    }),
  };
}

function findContiguousRunStart(posts: readonly HomeTimelinePost[], index: number) {
  const threadKey = posts[index]?.threadKey;
  let startIndex = index;

  while (startIndex > 0 && posts[startIndex - 1]?.threadKey === threadKey) {
    startIndex -= 1;
  }

  return startIndex;
}

export function normalizeVisibleThreadRuns(
  posts: readonly HomeTimelinePost[],
): DisplayHomeTimelinePost[] {
  const orderedPosts: DisplayHomeTimelinePost[] = [];
  let index = 0;

  while (index < posts.length) {
    const threadKey = posts[index]?.threadKey;
    let runEnd = index + 1;

    while (runEnd < posts.length && posts[runEnd]?.threadKey === threadKey) {
      runEnd += 1;
    }

    const run = posts.slice(index, runEnd).map((post, runIndex) => ({
      post,
      runIndex,
    }));
    const sortedRun =
      run.length > 1
        ? [...run].sort(
            (left, right) =>
              left.post.publishedAtUnix - right.post.publishedAtUnix ||
              left.runIndex - right.runIndex,
          )
        : run;

    for (const [sortedIndex, item] of sortedRun.entries()) {
      const threadPosition =
        sortedRun.length === 1
          ? "single"
          : sortedIndex === 0
            ? "start"
            : sortedIndex === sortedRun.length - 1
              ? "end"
              : "middle";

      orderedPosts.push({
        ...item.post,
        threadPosition,
      });
    }

    index = runEnd;
  }

  return orderedPosts;
}

export function mergeVisibleThreadRuns(
  currentDisplayPosts: readonly DisplayHomeTimelinePost[],
  mergedPosts: readonly HomeTimelinePost[],
  appendedStartIndex: number | null,
): DisplayHomeTimelinePost[] {
  const postsById = new Map(mergedPosts.map((post) => [post.id, post] as const));

  if (appendedStartIndex == null) {
    return currentDisplayPosts.flatMap((displayPost) => {
      const mergedPost = postsById.get(displayPost.id);

      return mergedPost
        ? [
            {
              ...mergedPost,
              threadPosition: displayPost.threadPosition,
            },
          ]
        : [];
    });
  }

  const shouldMergeAtBoundary =
    appendedStartIndex > 0 &&
    appendedStartIndex < mergedPosts.length &&
    mergedPosts[appendedStartIndex - 1]?.threadKey === mergedPosts[appendedStartIndex]?.threadKey;
  const normalizationStartIndex = shouldMergeAtBoundary
    ? findContiguousRunStart(mergedPosts, appendedStartIndex - 1)
    : appendedStartIndex;
  const preservedPrefix = currentDisplayPosts.slice(0, normalizationStartIndex).flatMap((post) => {
    const mergedPost = postsById.get(post.id);

    return mergedPost
      ? [
          {
            ...mergedPost,
            threadPosition: post.threadPosition,
          },
        ]
      : [];
  });

  return preservedPrefix.concat(
    normalizeVisibleThreadRuns(mergedPosts.slice(normalizationStartIndex)),
  );
}

function buildRenderItems(posts: readonly DisplayHomeTimelinePost[]): HomeTimelineRenderItem[] {
  const items: HomeTimelineRenderItem[] = [];
  let index = 0;

  while (index < posts.length) {
    const post = posts[index];

    if (!post || post.threadPosition === "single") {
      if (post) {
        items.push({ post, type: "single" });
      }
      index += 1;
      continue;
    }

    let runEnd = index + 1;

    while (runEnd < posts.length) {
      const runPost = posts[runEnd - 1];
      if (runPost?.threadPosition === "end") {
        break;
      }
      runEnd += 1;
    }

    items.push({
      posts: posts.slice(index, runEnd) as HomeTimelineThreadRunPost[],
      type: "run",
    });
    index = runEnd;
  }

  return items;
}

const TIMELINE_COPY: Record<
  HomeFeedTimeline,
  { emptyMessage: string; label: string; retryLabel: string }
> = {
  hackersPub: {
    emptyMessage: "Nothing in Hackers' Pub yet.",
    label: "Hackers' Pub timeline",
    retryLabel: "Retry loading Hackers' Pub posts",
  },
  personal: {
    emptyMessage: "Nothing in your personal timeline yet.",
    label: "Personal timeline",
    retryLabel: "Retry loading posts",
  },
  public: {
    emptyMessage: "Nothing in the public timeline yet.",
    label: "Public timeline",
    retryLabel: "Retry loading public posts",
  },
};

function getConnectionFromResponse(
  response: homeFeedQuery["response"] | null | undefined,
  timeline: HomeFeedTimeline,
): HomeTimelineConnection | null {
  if (!response) {
    return null;
  }

  return timeline === "personal"
    ? (response.personalTimeline ?? null)
    : (response.publicTimeline ?? null);
}

export function HomeTimeline(props: HomeTimelineProps) {
  const fetchHomeTimelinePageFn = useServerFn(fetchHomeTimelinePage);
  const initialPosts = mergeTimelinePosts(
    [],
    props.connection.edges.map(mapTimelineEdgeToPost),
  ).posts;
  const [posts, setPosts] = createSignal<readonly HomeTimelinePost[]>(initialPosts);
  const [displayPosts, setDisplayPosts] = createSignal<readonly DisplayHomeTimelinePost[]>(
    normalizeVisibleThreadRuns(initialPosts),
  );
  const [endCursor, setEndCursor] = createSignal<string | null>(
    props.connection.pageInfo.endCursor ?? null,
  );
  const [hasNextPage, setHasNextPage] = createSignal(props.connection.pageInfo.hasNextPage);
  const [isLoadingNextPage, setIsLoadingNextPage] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);
  const copy = createMemo(() => TIMELINE_COPY[props.timeline]);
  const renderItems = createMemo(() => buildRenderItems(displayPosts()));
  let sentinelRef: HTMLDivElement | undefined;

  async function loadNextPage() {
    if (!hasNextPage() || isLoadingNextPage() || endCursor() == null) {
      return;
    }

    setIsLoadingNextPage(true);
    setLoadError(null);

    try {
      const nextPage = await fetchHomeTimelinePageFn({
        data: {
          after: endCursor(),
          timeline: props.timeline,
        },
      });

      const nextConnection = getConnectionFromResponse(nextPage, props.timeline);

      if (!nextConnection) {
        throw new Error("Could not load more posts.");
      }

      const nextPosts = nextConnection.edges.map(mapTimelineEdgeToPost);
      let mergeResult:
        | {
            appendedStartIndex: number | null;
            posts: HomeTimelinePost[];
          }
        | undefined;

      setPosts((currentPosts) => {
        mergeResult = mergeTimelinePosts(currentPosts, nextPosts);
        return mergeResult.posts;
      });
      setDisplayPosts((currentDisplayPosts) =>
        mergeVisibleThreadRuns(
          currentDisplayPosts,
          mergeResult?.posts ?? posts(),
          mergeResult?.appendedStartIndex ?? null,
        ),
      );
      setEndCursor(nextConnection.pageInfo.endCursor ?? null);
      setHasNextPage(nextConnection.pageInfo.hasNextPage);
    } catch {
      setLoadError("Could not load more posts.");
    } finally {
      setIsLoadingNextPage(false);
    }
  }

  createEffect(() => {
    if (!sentinelRef || !hasNextPage()) {
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        void loadNextPage();
      }
    });

    observer.observe(sentinelRef);
    onCleanup(() => observer.disconnect());
  });

  return (
    <Show
      when={displayPosts().length > 0}
      fallback={
        <Surface
          as="section"
          class="text-center text-sm text-fg-secondary"
          padding="lg"
          variant="floating"
        >
          {copy().emptyMessage}
        </Surface>
      }
    >
      <Surface
        as="section"
        aria-label={copy().label}
        class="feed-divider overflow-hidden"
        padding="none"
        role="feed"
        variant="floating"
      >
        <For each={renderItems()}>
          {(item) =>
            item.type === "single" ? (
              <PostPreviewCard post={item.post} threadPosition={item.post.threadPosition} />
            ) : (
              <HomeTimelineThreadRun posts={item.posts} />
            )
          }
        </For>
        <Show when={hasNextPage()}>
          <div
            ref={(element) => {
              sentinelRef = element;
            }}
            aria-hidden="true"
            class="h-px w-full"
            data-testid="home-timeline-sentinel"
          />
        </Show>
        <Show when={isLoadingNextPage()}>
          <div class="border-t border-stroke-subtle px-6 py-4 text-sm text-fg-secondary">
            Loading more posts...
          </div>
        </Show>
        <Show when={loadError()}>
          {(message) => (
            <div class="border-t border-stroke-subtle px-6 py-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <p class="text-sm text-fg-secondary">{message()}</p>
                <Button size="sm" variant="secondary" onClick={() => void loadNextPage()}>
                  {copy().retryLabel}
                </Button>
              </div>
            </div>
          )}
        </Show>
      </Surface>
    </Show>
  );
}
