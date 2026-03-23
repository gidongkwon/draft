import { useServerFn } from "@tanstack/solid-start";
import { createEffect, createMemo, createSignal, For, onCleanup, Show } from "solid-js";
import { PostPreviewCard, type PostCardModel } from "../../../entities/post";
import { fetchPersonalTimelinePage } from "../../../shared/api/server-queries";
import { stripHtmlTags } from "../../../shared/lib/html";
import type { homeFeedQuery } from "./__generated__/homeFeedQuery.graphql";

type PersonalTimelineConnection = homeFeedQuery["response"]["personalTimeline"];
type PersonalTimelineEdge = PersonalTimelineConnection["edges"][number];

type PersonalTimelineProps = {
  connection: PersonalTimelineConnection;
};

function mapTimelineEdgeToPost(edge: PersonalTimelineEdge): PostCardModel {
  const { node } = edge;

  return {
    id: node.id,
    kind: node.__typename === "Article" || (node.name ?? "").trim() !== "" ? "article" : "note",
    title: node.name?.trim() ? node.name : null,
    excerpt: stripHtmlTags(node.excerpt),
    publishedAt: node.published,
    href: `/posts/${node.id}`,
    author: {
      handle: node.actor.handle,
      name: node.actor.rawName ?? node.actor.username,
      avatarUrl: node.actor.avatarUrl ?? null,
    },
    stats: {
      reactions: node.engagementStats.reactions,
      replies: node.engagementStats.replies,
      shares: node.engagementStats.shares,
    },
  };
}

function mergeTimelineEdges(
  currentEdges: PersonalTimelineEdge[],
  nextEdges: PersonalTimelineEdge[],
): PersonalTimelineEdge[] {
  const seenIds = new Set(currentEdges.map((edge) => edge.node.id));
  const mergedEdges = [...currentEdges];

  for (const edge of nextEdges) {
    if (seenIds.has(edge.node.id)) {
      continue;
    }

    seenIds.add(edge.node.id);
    mergedEdges.push(edge);
  }

  return mergedEdges;
}

export function PersonalTimeline(props: PersonalTimelineProps) {
  const fetchPersonalTimelinePageFn = useServerFn(fetchPersonalTimelinePage);
  const [edges, setEdges] = createSignal(props.connection.edges);
  const [endCursor, setEndCursor] = createSignal(props.connection.pageInfo.endCursor);
  const [hasNextPage, setHasNextPage] = createSignal(props.connection.pageInfo.hasNextPage);
  const [isLoadingNextPage, setIsLoadingNextPage] = createSignal(false);
  const [loadError, setLoadError] = createSignal<string | null>(null);
  let sentinelRef: HTMLDivElement | undefined;

  const posts = createMemo(() => edges().map(mapTimelineEdgeToPost));

  async function loadNextPage() {
    if (!hasNextPage() || isLoadingNextPage() || endCursor() == null) {
      return;
    }

    setIsLoadingNextPage(true);
    setLoadError(null);

    try {
      const nextPage = await fetchPersonalTimelinePageFn({
        data: {
          after: endCursor(),
        },
      });

      const nextConnection = nextPage?.personalTimeline;

      if (!nextConnection) {
        throw new Error("Could not load more posts.");
      }

      setEdges((currentEdges) => mergeTimelineEdges(currentEdges, nextConnection.edges));
      setEndCursor(nextConnection.pageInfo.endCursor);
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
      when={posts().length > 0}
      fallback={
        <section class="shell-surface rounded-[1.5rem] px-6 py-12 text-center text-sm text-[var(--text-secondary)]">
          Nothing in your personal timeline yet.
        </section>
      }
    >
      <section
        aria-label="Personal timeline"
        class="shell-surface feed-divider overflow-hidden rounded-[1.5rem]"
        role="feed"
      >
        <For each={posts()}>{(post) => <PostPreviewCard post={post} />}</For>
        <Show when={hasNextPage()}>
          <div
            ref={(element) => {
              sentinelRef = element;
            }}
            aria-hidden="true"
            class="h-px w-full"
            data-testid="personal-timeline-sentinel"
          />
        </Show>
        <Show when={isLoadingNextPage()}>
          <div class="border-t border-[var(--border-subtle)] px-6 py-4 text-sm text-[var(--text-secondary)]">
            Loading more posts...
          </div>
        </Show>
        <Show when={loadError()}>
          {(message) => (
            <div class="border-t border-[var(--border-subtle)] px-6 py-4">
              <div class="flex flex-wrap items-center justify-between gap-3">
                <p class="text-sm text-[var(--text-secondary)]">{message()}</p>
                <button
                  class="focus-ring inline-flex items-center rounded-full border border-[var(--border-subtle)] px-3 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-muted)]"
                  onClick={() => void loadNextPage()}
                  type="button"
                >
                  Retry loading posts
                </button>
              </div>
            </div>
          )}
        </Show>
      </section>
    </Show>
  );
}
