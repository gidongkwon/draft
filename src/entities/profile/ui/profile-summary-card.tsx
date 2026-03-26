import Calendar20Regular from "~icons/fluent/calendar-20-regular";
import type { ProfileSummaryModel } from "../model/profile-summary";
import { formatPublishedDate } from "../../../shared/lib/date";
import { AppIcon } from "../../../shared/ui/app-icon";
import { Avatar } from "../../../shared/ui/avatar";
import { Surface } from "../../../shared/ui/surface";

type ProfileSummaryCardProps = {
  profile: ProfileSummaryModel;
};

export function ProfileSummaryCard(props: ProfileSummaryCardProps) {
  return (
    <Surface as="section" padding="md" variant="floating">
      <div class="flex flex-col gap-5 sm:flex-row sm:items-start">
        <Avatar name={props.profile.name} size="lg" src={props.profile.avatarUrl} />
        <div class="min-w-0 flex-1">
          <p class="text-[11px] font-semibold tracking-[0.22em] text-fg-muted">Profile</p>
          <div class="mt-2 flex flex-wrap items-end gap-x-3 gap-y-2">
            <a
              class="text-[2rem] font-semibold leading-none tracking-[-0.05em] text-fg-primary transition hover:text-accent-strong"
              href={props.profile.profileHref}
            >
              {props.profile.name}
            </a>
            <span class="font-code pb-1 text-sm text-accent-strong">{props.profile.handle}</span>
          </div>
          {props.profile.publishedAt ? (
            <p class="mt-3 inline-flex items-center gap-2 text-[11px] font-medium tracking-[0.18em] text-fg-muted">
              <AppIcon icon={Calendar20Regular} size="xs" />
              Joined {formatPublishedDate(props.profile.publishedAt)}
            </p>
          ) : null}
          {props.profile.bio ? (
            <div
              class="mt-4 max-w-3xl text-sm leading-7 text-fg-secondary"
              innerHTML={props.profile.bio}
            />
          ) : null}
        </div>
      </div>
    </Surface>
  );
}
