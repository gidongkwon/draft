import type { PostDetailModel } from "../model/post-detail";
import { formatPublishedDate } from "../../../shared/lib/date";
import { AppIcon } from "../../../shared/ui/app-icon";
import { Avatar } from "../../../shared/ui/avatar";

type PostDetailViewProps = {
  post: PostDetailModel;
};

export function PostDetailView(props: PostDetailViewProps) {
  const isArticle = () => props.post.kind === "article" && props.post.title != null;

  return (
    <article class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
      <section class="shell-surface rounded-[1.5rem] px-6 py-6 sm:px-8 sm:py-8">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-[var(--text-secondary)]">
          <div class="flex min-w-0 items-center gap-3">
            <Avatar name={props.post.author.name} size="md" src={props.post.author.avatarUrl} />
            <div class="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
              <a
                class="font-semibold text-[var(--text-primary)] transition hover:text-[var(--accent-strong)]"
                href={props.post.author.profileHref}
              >
                {props.post.author.name}
              </a>
              <span class="text-[var(--text-muted)]">{props.post.author.handle}</span>
            </div>
          </div>
          <span class="text-[var(--text-muted)]">•</span>
          <time dateTime={props.post.publishedAt}>
            {formatPublishedDate(props.post.publishedAt)}
          </time>
        </div>
        {isArticle() ? (
          <h1 class="mt-4 text-[2.5rem] font-semibold leading-[0.95] tracking-[-0.05em] text-[var(--text-primary)] sm:text-[3.2rem]">
            {props.post.title}
          </h1>
        ) : null}
        {isArticle() && props.post.summary ? (
          <p class="mt-5 max-w-3xl text-base leading-8 text-[var(--text-secondary)]">
            {props.post.summary}
          </p>
        ) : null}
        <div
          class="prose prose-invert mt-10 max-w-none prose-headings:font-semibold prose-headings:tracking-[-0.03em] prose-headings:text-[var(--text-primary)] prose-p:text-[var(--text-secondary)] prose-p:leading-8 prose-li:text-[var(--text-secondary)] prose-strong:text-[var(--text-primary)] prose-a:text-[var(--accent-strong)] prose-code:text-[var(--text-primary)]"
          innerHTML={props.post.contentHtml}
        />
      </section>
      <aside class="space-y-4">
        <section class="shell-surface rounded-[1.5rem] px-5 py-5">
          <h2 class="text-[11px] font-semibold tracking-[0.22em] text-[var(--text-muted)]">
            <span class="inline-flex items-center gap-2">
              <AppIcon class="text-sm" name="author" />
              Author
            </span>
          </h2>
          <div class="mt-4 flex items-start gap-3">
            <Avatar name={props.post.author.name} size="lg" src={props.post.author.avatarUrl} />
            <div class="min-w-0">
              <a
                aria-label={`Author profile ${props.post.author.name}`}
                class="text-base font-semibold text-[var(--text-primary)] transition hover:text-[var(--accent-strong)]"
                href={props.post.author.profileHref}
              >
                {props.post.author.name}
              </a>
              <div class="mt-1 text-sm text-[var(--text-secondary)]">
                {props.post.author.handle}
              </div>
            </div>
          </div>
          {props.post.author.bio ? (
            <div
              class="mt-4 text-sm leading-7 text-[var(--text-secondary)]"
              innerHTML={props.post.author.bio}
            />
          ) : null}
        </section>
        <section class="shell-surface rounded-[1.5rem] px-5 py-5">
          <h2 class="text-[11px] font-semibold tracking-[0.22em] text-[var(--text-muted)]">
            Engagement
          </h2>
          <ul aria-label="Engagement" class="mt-4 grid gap-3 text-sm text-[var(--text-secondary)]">
            <li class="inline-flex items-center gap-2">
              <AppIcon class="text-base" name="reaction" />
              {props.post.stats.reactions} reactions
            </li>
            <li class="inline-flex items-center gap-2">
              <AppIcon class="text-base" name="reply" />
              {props.post.stats.replies} replies
            </li>
            <li class="inline-flex items-center gap-2">
              <AppIcon class="text-base" name="share" />
              {props.post.stats.shares} shares
            </li>
            <li class="inline-flex items-center gap-2">
              <AppIcon class="text-base" name="reply" />
              {props.post.stats.quotes ?? 0} quotes
            </li>
          </ul>
          {props.post.canonicalUrl ? (
            <a
              class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent-strong)]"
              href={props.post.canonicalUrl}
            >
              <AppIcon class="text-base" name="open" />
              Open original post
            </a>
          ) : null}
        </section>
      </aside>
    </article>
  );
}
