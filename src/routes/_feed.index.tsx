import { createFileRoute } from "@tanstack/solid-router";
import { HomeFeedErrorView, HomeFeedFeed } from "../pages/home-feed";
import { parseHomeFeedSearch } from "../pages/home-feed/model/timeline-search";
import { fetchHomeFeed } from "../shared/api/server-queries";

export const Route = createFileRoute("/_feed/")({
  loaderDeps: ({ search }) => ({
    timeline: parseHomeFeedSearch(search).timeline,
  }),
  loader: ({ context, deps }) => {
    const { timeline } = deps;

    if (timeline === "personal" && !context.viewer) {
      return {
        data: null,
        timeline,
      };
    }

    return fetchHomeFeed({
      data: {
        timeline,
      },
    });
  },
  errorComponent: HomeFeedErrorView,
  component: HomeFeedRoute,
});

function HomeFeedRoute() {
  const data = Route.useLoaderData();

  return <HomeFeedFeed {...data()} />;
}
