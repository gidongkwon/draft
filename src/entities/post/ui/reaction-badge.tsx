import { For, Show } from "solid-js";
import Heart20Regular from "~icons/fluent/heart-20-regular";
import type { ReactionGroupModel } from "../model/reaction-group";
import { AppIcon } from "../../../shared/ui/app-icon";

type ReactionBadgeProps = {
  count: number;
  reactionGroups?: ReactionGroupModel[];
};

function getVisibleReactionGroups(reactionGroups: ReactionGroupModel[] | undefined) {
  return (reactionGroups ?? [])
    .filter((group) => group.count > 0 && group.emoji.trim().length > 0)
    .sort((left, right) => right.count - left.count)
    .slice(0, 3);
}

export function ReactionBadge(props: ReactionBadgeProps) {
  const visibleReactionGroups = () => getVisibleReactionGroups(props.reactionGroups);

  return (
    <span class="inline-flex items-center gap-1.5">
      <AppIcon icon={Heart20Regular} size="sm" />
      <Show when={visibleReactionGroups().length > 0}>
        <span class="-space-x-1 px-2 py-1 rounded-full bg-surface-muted">
          <For each={visibleReactionGroups()}>
            {(group) => (
              <span class="inline-flex size-4 items-center justify-center rounded-full text-sm leading-none">
                {group.emoji}
              </span>
            )}
          </For>
        </span>
      </Show>
      <span>{props.count}</span>
    </span>
  );
}
