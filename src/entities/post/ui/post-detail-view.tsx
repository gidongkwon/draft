import ArrowSquareUpRight20Regular from "~icons/fluent/arrow-square-up-right-20-regular";
import Comment20Regular from "~icons/fluent/comment-20-regular";
import PersonCircle20Regular from "~icons/fluent/person-circle-20-regular";
import Share20Regular from "~icons/fluent/share-20-regular";
import type { PostDetailModel } from "../model/post-detail";
import { formatPublishedDate } from "../../../shared/lib/date";
import { AppIcon } from "../../../shared/ui/app-icon";
import { Avatar } from "../../../shared/ui/avatar";
import { Surface } from "../../../shared/ui/surface";
import { ReactionBadge } from "./reaction-badge";

type PostDetailViewProps = {
  post: PostDetailModel;
};

export function PostDetailView(props: PostDetailViewProps) {
  const isArticle = () => props.post.kind === "article" && props.post.title != null;

  return (
    <article class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_19rem]">
      <Surface as="section" padding="lg" variant="floating">
        <div class="flex flex-wrap items-center gap-x-3 gap-y-2 text-sm text-fg-secondary">
          <div class="flex min-w-0 items-center gap-3">
            <Avatar name={props.post.author.name} size="md" src={props.post.author.avatarUrl} />
            <div class="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
              <a
                class="font-semibold text-fg-primary transition hover:text-accent-strong"
                href={props.post.author.profileHref}
              >
                {props.post.author.name}
              </a>
              <span class="font-code text-fg-muted">{props.post.author.handle}</span>
            </div>
          </div>
          <span class="text-fg-muted">•</span>
          <time dateTime={props.post.publishedAt}>
            {formatPublishedDate(props.post.publishedAt)}
          </time>
        </div>
        {isArticle() ? (
          <h1 class="mt-4 text-[2.5rem] font-semibold leading-[0.95] tracking-[-0.05em] text-fg-primary sm:text-[3.2rem]">
            {props.post.title}
          </h1>
        ) : null}
        {isArticle() && props.post.summary ? (
          <p class="mt-5 max-w-3xl text-base leading-8 text-fg-secondary">{props.post.summary}</p>
        ) : null}
        <div
          class="prose prose-invert mt-10 max-w-none prose-headings:font-semibold prose-headings:tracking-[-0.03em] prose-headings:text-fg-primary prose-p:text-fg-secondary prose-p:leading-8 prose-li:text-fg-secondary prose-strong:text-fg-primary prose-a:text-accent-strong prose-code:text-fg-primary"
          innerHTML={props.post.contentHtml}
        />
      </Surface>
      <aside class="space-y-4">
        <Surface as="section" padding="md" variant="floating">
          <h2 class="text-[11px] font-semibold tracking-[0.22em] text-fg-muted">
            <span class="inline-flex items-center gap-2">
              <AppIcon icon={PersonCircle20Regular} size="xs" />
              Author
            </span>
          </h2>
          <div class="mt-4 flex items-start gap-3">
            <Avatar name={props.post.author.name} size="lg" src={props.post.author.avatarUrl} />
            <div class="min-w-0">
              <a
                aria-label={`Author profile ${props.post.author.name}`}
                class="text-base font-semibold text-fg-primary transition hover:text-accent-strong"
                href={props.post.author.profileHref}
              >
                {props.post.author.name}
              </a>
              <div class="mt-1 font-code text-sm text-fg-secondary">{props.post.author.handle}</div>
            </div>
          </div>
          {props.post.author.bio ? (
            <div
              class="mt-4 text-sm leading-7 text-fg-secondary"
              innerHTML={props.post.author.bio}
            />
          ) : null}
        </Surface>
        <Surface as="section" padding="md" variant="floating">
          <h2 class="text-[11px] font-semibold tracking-[0.22em] text-fg-muted">Engagement</h2>
          <ul aria-label="Engagement" class="mt-4 grid gap-3 text-sm text-fg-secondary">
            <li class="inline-flex items-center gap-2">
              <ReactionBadge
                count={props.post.stats.reactions}
                reactionGroups={props.post.reactionGroups}
              />
              reactions
            </li>
            <li class="inline-flex items-center gap-2">
              <AppIcon icon={Comment20Regular} size="sm" />
              {props.post.stats.replies} replies
            </li>
            <li class="inline-flex items-center gap-2">
              <AppIcon icon={Share20Regular} size="sm" />
              {props.post.stats.shares} shares
            </li>
            <li class="inline-flex items-center gap-2">
              <AppIcon icon={Comment20Regular} size="sm" />
              {props.post.stats.quotes ?? 0} quotes
            </li>
          </ul>
          {props.post.canonicalUrl ? (
            <a
              class="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-accent-strong"
              href={props.post.canonicalUrl}
            >
              <AppIcon icon={ArrowSquareUpRight20Regular} size="sm" />
              Open original post
            </a>
          ) : null}
        </Surface>
      </aside>
    </article>
  );
}
