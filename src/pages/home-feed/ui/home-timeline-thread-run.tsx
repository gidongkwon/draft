import { For, Show, createEffect, createSignal, onCleanup } from "solid-js";
import { PostPreviewCard, type PostCardModel } from "../../../entities/post";

type ThreadPosition = "start" | "middle" | "end";

export type HomeTimelineThreadRunPost = PostCardModel & {
  threadPosition: ThreadPosition;
};

type HomeTimelineThreadRunProps = {
  posts: readonly HomeTimelineThreadRunPost[];
};

type LineOffsets = {
  bottom: number;
  top: number;
};

export function HomeTimelineThreadRun(props: HomeTimelineThreadRunProps) {
  let runRef: HTMLDivElement | undefined;
  const [lineOffsets, setLineOffsets] = createSignal<LineOffsets | null>(null);

  const measureLine = () => {
    if (!runRef) {
      return;
    }

    const avatarShells = runRef.querySelectorAll<HTMLElement>('[data-avatar-shell="true"]');
    const firstAvatar = avatarShells[0];
    const lastAvatar = avatarShells[avatarShells.length - 1];

    if (!firstAvatar || !lastAvatar) {
      setLineOffsets(null);
      return;
    }

    const runRect = runRef.getBoundingClientRect();
    const firstAvatarRect = firstAvatar.getBoundingClientRect();
    const lastAvatarRect = lastAvatar.getBoundingClientRect();

    const top = firstAvatarRect.top - runRect.top + firstAvatarRect.height / 2;
    const bottom = runRect.bottom - (lastAvatarRect.top + lastAvatarRect.height / 2);

    setLineOffsets({
      bottom: Math.max(bottom, 0),
      top: Math.max(top, 0),
    });
  };

  createEffect(() => {
    if (!runRef) {
      return;
    }

    queueMicrotask(measureLine);

    const ResizeObserverConstructor = globalThis.ResizeObserver;
    const resizeObserver =
      typeof ResizeObserverConstructor === "function"
        ? new ResizeObserverConstructor(() => measureLine())
        : null;

    resizeObserver?.observe(runRef);
    window.addEventListener("resize", measureLine);

    onCleanup(() => {
      resizeObserver?.disconnect();
      window.removeEventListener("resize", measureLine);
    });
  });

  return (
    <div
      class="relative"
      data-thread-run="true"
      ref={(element) => {
        runRef = element;
      }}
    >
      <Show when={lineOffsets()}>
        {(offsets) => (
          <span
            aria-hidden="true"
            class="pointer-events-none absolute left-[2.625rem] z-0 w-[2px] -translate-x-1/2 bg-stroke-strong sm:left-[2.875rem]"
            data-thread-run-line="true"
            style={{
              bottom: `${offsets().bottom}px`,
              top: `${offsets().top}px`,
            }}
          />
        )}
      </Show>
      <For each={props.posts}>
        {(post) => <PostPreviewCard post={post} threadPosition={post.threadPosition} />}
      </For>
    </div>
  );
}
