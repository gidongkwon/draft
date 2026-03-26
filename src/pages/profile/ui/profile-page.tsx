import { Match, Switch } from "solid-js";
import { graphql } from "relay-runtime";
import type { PostCardModel, ReactionGroupModel } from "../../../entities/post";
import { ProfileSummaryCard } from "../../../entities/profile";
import { Surface } from "../../../shared/ui/surface";
import { FeedList } from "../../../widgets/feed-list";
import { stripHtmlTags } from "../../../shared/lib/html";
import type { profilePageQuery } from "./__generated__/profilePageQuery.graphql";

export const profilePageDocument = graphql`
  query profilePageQuery($handle: String!, $first: Int!) {
    actorByHandle(handle: $handle, allowLocalHandle: true) {
      handle
      rawName
      username
      avatarUrl
      bio
      published
      posts(first: $first) {
        edges {
          node {
            __typename
            id
            name
            excerpt
            published
            reactionGroups {
              ... on EmojiReactionGroup {
                emoji
                reactors {
                  totalCount
                }
              }
            }
            actor {
              handle
              rawName
              username
              avatarUrl
            }
            engagementStats {
              reactions
              replies
              shares
            }
          }
        }
      }
    }
  }
`;

type ProfilePageProps = {
  data: profilePageQuery["response"];
};

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

export function ProfilePage(props: ProfilePageProps) {
  const data = () => props.data;

  const profile = () => {
    const actor = data()?.actorByHandle;

    if (!actor) {
      return null;
    }

    return {
      handle: actor.handle,
      name: actor.rawName ?? actor.username,
      bio: actor.bio ?? null,
      avatarUrl: actor.avatarUrl,
      profileHref: `/profiles/${actor.handle}`,
      publishedAt: actor.published ?? null,
    };
  };

  const posts = (): PostCardModel[] =>
    data()?.actorByHandle?.posts.edges.map(({ node }) => ({
      id: node.id,
      kind: node.__typename === "Article" || (node.name ?? "").trim() !== "" ? "article" : "note",
      title: node.name?.trim() ? node.name : null,
      excerpt: stripHtmlTags(node.excerpt),
      publishedAt: node.published,
      href: `/posts/${node.id}`,
      author: {
        handle: node.actor.handle,
        name: node.actor.rawName ?? node.actor.username,
        avatarUrl: node.actor.avatarUrl,
      },
      stats: {
        reactions: node.engagementStats.reactions,
        replies: node.engagementStats.replies,
        shares: node.engagementStats.shares,
      },
      reactionGroups: mapReactionGroupsToModel(node.reactionGroups),
    })) ?? [];

  return (
    <Switch>
      <Match when={profile()}>
        {(resolvedProfile) => (
          <section class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
            <div class="min-w-0 space-y-4">
              <ProfileSummaryCard profile={resolvedProfile()} />
              <Surface as="div" padding="md" variant="floating">
                <p class="text-[11px] font-semibold tracking-[0.22em] text-fg-muted">
                  Recent posts
                </p>
                <h2 class="mt-3 text-[2rem] font-semibold leading-none tracking-[-0.04em] text-fg-primary">
                  Latest posts from {resolvedProfile().name}
                </h2>
                <p class="mt-3 max-w-2xl text-sm leading-7 text-fg-secondary">
                  Same feed-first surface, narrowed to one publisher and their latest public work.
                </p>
              </Surface>
              <FeedList label="Public timeline" posts={posts()} />
            </div>
            <aside class="space-y-4">
              <Surface as="section" padding="md" variant="floating">
                <h2 class="text-[11px] font-semibold tracking-[0.22em] text-fg-muted">
                  Profile view
                </h2>
                <p class="mt-3 text-sm leading-7 text-fg-secondary">
                  Keep identity in the header, keep the feed below, and avoid letting profile chrome
                  overwhelm the reading surface.
                </p>
              </Surface>
              <Surface as="section" padding="md" variant="floating">
                <h2 class="text-[11px] font-semibold tracking-[0.22em] text-fg-muted">
                  Reading cues
                </h2>
                <ul class="mt-4 grid gap-2 text-sm text-fg-secondary">
                  <li class="rounded-2xl border border-stroke-subtle bg-surface-subtle px-4 py-3">
                    Header carries identity
                  </li>
                  <li class="rounded-2xl border border-stroke-subtle bg-surface-subtle px-4 py-3">
                    Feed rows mirror home
                  </li>
                </ul>
              </Surface>
            </aside>
          </section>
        )}
      </Match>
      <Match when={data()}>
        <Surface as="section" class="text-sm text-fg-secondary" padding="lg" variant="floating">
          The requested profile could not be found.
        </Surface>
      </Match>
    </Switch>
  );
}
