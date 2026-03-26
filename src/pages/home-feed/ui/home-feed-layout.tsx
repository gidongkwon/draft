import type { ParentProps } from "solid-js";
import { Surface } from "../../../shared/ui/surface";
import type { HomeFeedTimeline } from "../model/timeline-search";
import { Tabs } from "../../../shared/ui/tabs";
import { ComposeStrip } from "./compose-strip";

type HomeFeedLayoutProps = ParentProps<{
  onTimelineChange: (timeline: HomeFeedTimeline) => void;
  timeline: HomeFeedTimeline;
}>;

export function HomeFeedLayout(props: HomeFeedLayoutProps) {
  return (
    <section class="grid gap-5 xl:grid-cols-[minmax(0,1fr)_18rem]">
      <div class="min-w-0 space-y-5">
        <ComposeStrip />
        <Tabs.Root
          onValueChange={(value) => props.onTimelineChange(value as HomeFeedTimeline)}
          value={props.timeline}
        >
          <Tabs.List aria-label="Timeline type">
            <Tabs.Trigger value="personal">Personal</Tabs.Trigger>
            <Tabs.Trigger value="public">Public</Tabs.Trigger>
            <Tabs.Trigger value="hackersPub">Hackers' Pub</Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
        {props.children}
      </div>
      <aside class="space-y-4">
        <Surface as="section" padding="md" variant="floating">
          <h2 class="text-sm font-semibold text-fg-muted">Follow Recommendations</h2>
        </Surface>
      </aside>
    </section>
  );
}
