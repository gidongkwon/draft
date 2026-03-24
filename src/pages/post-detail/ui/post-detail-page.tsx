import { Match, Switch } from "solid-js";
import { graphql } from "relay-runtime";
import {
  PostDetailView,
  type PostDetailModel,
  type ReactionGroupModel,
} from "../../../entities/post";
import type { postDetailPageQuery } from "./__generated__/postDetailPageQuery.graphql";

export const postDetailPageDocument = graphql`
  query postDetailPageQuery($id: ID!) {
    node(id: $id) {
      __typename
      ... on Post {
        id
        name
        summary
        content
        published
        url
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
          bio
        }
        engagementStats {
          reactions
          replies
          shares
          quotes
        }
      }
    }
  }
`;

type PostDetailPageProps = {
  data: postDetailPageQuery["response"];
};

function mapReactionGroupsToModel(
  reactionGroups:
    | ReadonlyArray<{
        readonly emoji?: string | null | undefined;
        readonly reactors?: { readonly totalCount: number } | null | undefined;
      }>
    | null
    | undefined,
): ReactionGroupModel[] {
  return (
    reactionGroups?.flatMap((group) =>
      group.emoji && group.reactors?.totalCount != null
        ? [{ count: group.reactors.totalCount, emoji: group.emoji }]
        : [],
    ) ?? []
  );
}

export function PostDetailPage(props: PostDetailPageProps) {
  const data = () => props.data;

  const post = (): PostDetailModel | null => {
    const node = data()?.node;

    if (!node || (node.__typename !== "Note" && node.__typename !== "Article")) {
      return null;
    }

    if (!node.id || !node.content || !node.published || !node.actor || !node.engagementStats) {
      return null;
    }

    return {
      id: node.id,
      kind: node.__typename === "Article" || (node.name ?? "").trim() !== "" ? "article" : "note",
      title: node.name?.trim() ? node.name : null,
      summary: node.summary ?? null,
      contentHtml: node.content,
      publishedAt: node.published,
      canonicalUrl: node.url ?? null,
      author: {
        handle: node.actor.handle,
        name: node.actor.rawName ?? node.actor.username,
        avatarUrl: node.actor.avatarUrl,
        bio: node.actor.bio ?? null,
        profileHref: `/profiles/${node.actor.handle}`,
      },
      stats: {
        reactions: node.engagementStats.reactions,
        replies: node.engagementStats.replies,
        shares: node.engagementStats.shares,
        quotes: node.engagementStats.quotes,
      },
      reactionGroups: mapReactionGroupsToModel(node.reactionGroups),
    };
  };

  return (
    <Switch>
      <Match when={post()}>{(resolvedPost) => <PostDetailView post={resolvedPost()} />}</Match>
      <Match when={data()}>
        <section class="shell-surface rounded-[1.5rem] px-6 py-8 text-sm text-[var(--text-secondary)]">
          The requested post could not be found.
        </section>
      </Match>
    </Switch>
  );
}
