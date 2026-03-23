import { createFileRoute } from "@tanstack/solid-router";
import { PostDetailPage } from "../pages/post-detail";
import { fetchPostDetail } from "../shared/api/server-queries";

export const Route = createFileRoute("/posts/$postId")({
  loader: ({ params }) => fetchPostDetail({ data: params.postId }),
  component: PostDetailRoute,
});

function PostDetailRoute() {
  const data = Route.useLoaderData();

  return <PostDetailPage data={data()} />;
}
