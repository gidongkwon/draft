import { For, Show } from "solid-js";
import { PostPreviewCard, type PostCardModel } from "../../../entities/post";
import { Surface } from "../../../shared/ui/surface";

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
        <Surface
          as="section"
          class="text-center text-sm text-fg-secondary"
          padding="lg"
          variant="floating"
        >
          {props.emptyMessage ?? "No posts found."}
        </Surface>
      }
    >
      <Surface
        as="section"
        aria-label={props.label ?? "Timeline"}
        class="feed-divider overflow-hidden"
        padding="none"
        role="feed"
        variant="floating"
      >
        <For each={props.posts}>{(post) => <PostPreviewCard post={post} />}</For>
      </Surface>
    </Show>
  );
}
