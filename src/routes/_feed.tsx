import { Outlet, createFileRoute, useNavigate } from "@tanstack/solid-router";
import { HomeFeedLayout } from "../pages/home-feed";
import {
  parseHomeFeedSearch,
  type HomeFeedTimeline,
} from "../pages/home-feed/model/timeline-search";

export const Route = createFileRoute("/_feed")({
  validateSearch: parseHomeFeedSearch,
  component: FeedLayoutRoute,
});

function FeedLayoutRoute() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/" });

  return (
    <HomeFeedLayout
      onTimelineChange={(timeline: HomeFeedTimeline) =>
        navigate({
          to: "/",
          search: {
            timeline,
          },
        })
      }
      timeline={search().timeline}
    >
      <Outlet />
    </HomeFeedLayout>
  );
}
