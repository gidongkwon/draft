import { createFileRoute } from "@tanstack/solid-router";
import { ProfilePage } from "../pages/profile";
import { fetchProfile } from "../shared/api/server-queries";

export const Route = createFileRoute("/profiles/$handle")({
  loader: ({ params }) => fetchProfile({ data: params.handle }),
  component: ProfileRoute,
});

function ProfileRoute() {
  const data = Route.useLoaderData();

  return <ProfilePage data={data()} />;
}
