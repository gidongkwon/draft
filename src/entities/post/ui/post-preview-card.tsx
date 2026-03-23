import type { PostCardModel } from "../model/post-card";
import { formatPublishedDate } from "../../../shared/lib/date";
import { AppIcon } from "../../../shared/ui/app-icon";
import { Avatar } from "../../../shared/ui/avatar";

type PostPreviewCardProps = {
  post: PostCardModel;
};

export function PostPreviewCard(props: PostPreviewCardProps) {
  const isArticle = () => props.post.kind === "article" && props.post.title != null;

  return (
    <article class="group px-5 py-5 transition duration-200 hover:bg-[var(--surface-muted)] sm:px-6">
      <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--text-secondary)]">
        <div class="flex min-w-0 items-center gap-3">
          <Avatar name={props.post.author.name} size="md" src={props.post.author.avatarUrl} />
          <div class="flex flex-col min-w-0 flex-wrap gap-y-1">
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
      <div class="pl-14">
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
            <AppIcon class="text-md" name="reaction" />
            {props.post.stats.reactions}
            <span class="sr-only"> reactions</span>
          </li>
          <li class="inline-flex items-center gap-1.5">
            <AppIcon class="text-md" name="reply" />
            {props.post.stats.replies}
            <span class="sr-only"> replies</span>
          </li>
          <li class="inline-flex items-center gap-1.5">
            <AppIcon class="text-md" name="share" />
            {props.post.stats.shares}
            <span class="sr-only"> shares</span>
          </li>
        </ul>
      </div>
    </article>
  );
}
