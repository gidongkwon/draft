import { Match, Switch } from "solid-js";
import { useAuthTrigger } from "../../../features/auth/ui/auth-trigger-context";
import type { HomeFeedTimeline } from "../model/timeline-search";
import { HomeTimeline } from "./home-timeline";
import type { homeFeedQuery } from "./__generated__/homeFeedQuery.graphql";

type HomeFeedFeedProps = {
  data: homeFeedQuery["response"] | null;
  timeline: HomeFeedTimeline;
};

export function HomeFeedFeed(props: HomeFeedFeedProps) {
  const openSignIn = useAuthTrigger();

  return (
    <Switch>
      <Match when={props.timeline === "personal" ? props.data?.personalTimeline : null}>
        {(connection) => <HomeTimeline connection={connection()} timeline="personal" />}
      </Match>
      <Match when={props.timeline !== "personal" ? props.data?.publicTimeline : null}>
        {(connection) => <HomeTimeline connection={connection()} timeline={props.timeline} />}
      </Match>
      <Match when={props.timeline === "personal"}>
        <section class="shell-surface rounded-[1.5rem] px-6 py-12 text-center">
          <p class="text-sm leading-7 text-[var(--text-secondary)]">
            Sign in to view your personal timeline.
          </p>
          <button
            class="focus-ring mt-5 inline-flex items-center rounded-full border border-[var(--border-subtle)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:bg-[var(--surface-muted)]"
            onClick={() => openSignIn()}
            type="button"
          >
            Sign in
          </button>
        </section>
      </Match>
    </Switch>
  );
}
