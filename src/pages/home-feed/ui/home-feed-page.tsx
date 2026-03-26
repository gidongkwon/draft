import { Match, Switch } from "solid-js";
import { useAuthTrigger } from "../../../features/auth/ui/auth-trigger-context";
import { Button } from "../../../shared/ui/button";
import { Surface } from "../../../shared/ui/surface";
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
        <Surface as="section" class="text-center" padding="lg" variant="floating">
          <p class="text-sm leading-7 text-fg-secondary">Sign in to view your personal timeline.</p>
          <Button class="mt-5" variant="secondary" onClick={() => openSignIn()}>
            Sign in
          </Button>
        </Surface>
      </Match>
    </Switch>
  );
}
