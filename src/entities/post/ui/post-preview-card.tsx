import Comment20Regular from "~icons/fluent/comment-20-regular";
import Share20Regular from "~icons/fluent/share-20-regular";
import type { PostCardModel } from "../model/post-card";
import { formatPublishedDate } from "../../../shared/lib/date";
import { AppIcon } from "../../../shared/ui/app-icon";
import { Avatar } from "../../../shared/ui/avatar";
import { ReactionBadge } from "./reaction-badge";

type ThreadPosition = "single" | "start" | "middle" | "end";

type PostPreviewCardProps = {
  post: PostCardModel;
  threadPosition?: ThreadPosition;
};

function formatShareSummary(post: PostCardModel) {
  const summary = post.shareSummary;

  if (!summary) {
    return null;
  }

  const otherSharersCount = Math.max(summary.sharersCount - 1, 0);

  if (otherSharersCount === 0) {
    return `Shared by ${summary.sharer.name}`;
  }

  if (otherSharersCount === 1) {
    return `Shared by ${summary.sharer.name} and 1 other`;
  }

  return `Shared by ${summary.sharer.name} and ${otherSharersCount} others`;
}

export function PostPreviewCard(props: PostPreviewCardProps) {
  const isArticle = () => props.post.kind === "article" && props.post.title != null;
  const shareSummary = () => formatShareSummary(props.post);
  const threadPosition = () => props.threadPosition ?? "single";
  const isThreadGrouped = () => threadPosition() !== "single";

  return (
    <article
      class="group relative px-5 py-5 transition duration-200 hover:bg-[var(--surface-muted)] sm:px-6"
      data-thread-grouped={isThreadGrouped() ? "true" : "false"}
      data-thread-position={threadPosition()}
    >
      <div class="flex gap-x-3">
        <div class="relative flex w-11 shrink-0 justify-center items-start self-stretch">
          <span
            class="relative z-10 shrink-0 inline-flex rounded-full bg-[var(--surface)] p-0.5"
            data-avatar-shell="true"
          >
            <Avatar name={props.post.author.name} size="md" src={props.post.author.avatarUrl} />
          </span>
        </div>
        <div class="min-w-0 flex-1">
          {shareSummary() && (
            <p class="mb-3 text-xs font-medium text-[var(--text-muted)]">{shareSummary()}</p>
          )}
          <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--text-secondary)]">
            <div class="flex min-w-0 items-center gap-3">
              <div class="flex min-w-0 flex-col flex-wrap gap-y-1">
                <div class="flex gap-x-2">
                  <a
                    class="font-semibold text-[var(--text-primary)] transition hover:text-[var(--accent-strong)]"
                    href={`/profiles/${props.post.author.handle}`}
                  >
                    {props.post.author.name}
                  </a>

                  <span class="text-[var(--text-muted)]">•</span>
                  <time dateTime={props.post.publishedAt}>
                    {formatPublishedDate(props.post.publishedAt)}
                  </time>
                </div>
                <span class="text-[var(--text-muted)] text-sm">{props.post.author.handle}</span>
              </div>
            </div>
          </div>
          <div>
            {isArticle() ? (
              <>
                <a
                  class="mt-3 block text-[1.45rem] font-semibold leading-tight tracking-[-0.03em] text-[var(--text-primary)] transition group-hover:text-[var(--accent-strong)]"
                  href={props.post.href}
                >
                  {props.post.title}
                </a>
                <p class="mt-3 max-w-3xl text-sm leading-7 text-[var(--text-secondary)]">
                  {props.post.excerpt}
                </p>
              </>
            ) : (
              <a
                class="mt-3 block max-w-3xl text-base leading-8 text-[var(--text-primary)] transition group-hover:text-[var(--accent-strong)]"
                href={props.post.href}
              >
                {props.post.excerpt}
              </a>
            )}
            <ul class="mt-4 flex flex-wrap gap-4 text-sm font-medium tracking-[0.18em] text-[var(--text-muted)]">
              <li class="inline-flex items-center gap-1.5">
                <ReactionBadge
                  count={props.post.stats.reactions}
                  reactionGroups={props.post.reactionGroups}
                />
                <span class="sr-only"> reactions</span>
              </li>
              <li class="inline-flex items-center gap-1.5">
                <AppIcon icon={Comment20Regular} size="sm" />
                {props.post.stats.replies}
                <span class="sr-only"> replies</span>
              </li>
              <li class="inline-flex items-center gap-1.5">
                <AppIcon icon={Share20Regular} size="sm" />
                {props.post.stats.shares}
                <span class="sr-only"> shares</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </article>
  );
}
