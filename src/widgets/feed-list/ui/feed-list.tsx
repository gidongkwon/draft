import { For, Show } from "solid-js";
import { PostPreviewCard, type PostCardModel } from "../../../entities/post";

type FeedListProps = {
  emptyMessage?: string;
  label?: string;
  posts: PostCardModel[];
};

export function FeedList(props: FeedListProps) {
  return (
    <Show
      when={props.posts.length > 0}
      fallback={
        <section class="shell-surface rounded-[1.5rem] px-6 py-12 text-center text-sm text-[var(--text-secondary)]">
          {props.emptyMessage ?? "No posts found."}
        </section>
      }
    >
      <section
        aria-label={props.label ?? "Timeline"}
        class="shell-surface feed-divider overflow-hidden rounded-[1.5rem]"
        role="feed"
      >
        <For each={props.posts}>{(post) => <PostPreviewCard post={post} />}</For>
      </section>
    </Show>
  );
}
