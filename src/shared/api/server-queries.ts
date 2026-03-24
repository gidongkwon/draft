import { createServerFn } from "@tanstack/solid-start";
import type { IEnvironment } from "relay-runtime";
import type { HomeFeedTimeline } from "../../pages/home-feed/model/timeline-search";
import type { homeFeedQuery } from "../../pages/home-feed/ui/__generated__/homeFeedQuery.graphql";
import type { postDetailPageQuery } from "../../pages/post-detail/ui/__generated__/postDetailPageQuery.graphql";
import type { profilePageQuery } from "../../pages/profile/ui/__generated__/profilePageQuery.graphql";
import { homeFeedQueryDocument } from "../../pages/home-feed";
import { postDetailPageDocument } from "../../pages/post-detail";
import { profilePageDocument } from "../../pages/profile";
import { getRelayEnvironment } from "./relay";
import { fetchRelayQuery } from "./relay/runtime";

function requireQueryResult<T>(result: T | undefined, message: string): T {
  if (result === undefined) {
    throw new Error(message);
  }

  return result;
}

function getHomeFeedQueryVariables(timeline: HomeFeedTimeline, after: string | null) {
  return {
    after,
    first: 20,
    isPersonal: timeline === "personal",
    isPublic: timeline !== "personal",
    local: timeline === "hackersPub",
  };
}

export async function readHomeFeedWithEnvironment(
  environment: IEnvironment,
  timeline: HomeFeedTimeline,
) {
  const result = await fetchRelayQuery<homeFeedQuery>(
    environment,
    homeFeedQueryDocument,
    getHomeFeedQueryVariables(timeline, null),
  ).toPromise();

  return requireQueryResult(result, `Could not load the ${timeline} timeline.`);
}

export async function readPersonalTimelinePageWithEnvironment(
  environment: IEnvironment,
  after: string | null,
) {
  const result = await fetchRelayQuery<homeFeedQuery>(environment, homeFeedQueryDocument, {
    ...getHomeFeedQueryVariables("personal", after),
  }).toPromise();

  return requireQueryResult(result, "Could not load the personal timeline.");
}

export async function readPublicTimelinePageWithEnvironment(
  environment: IEnvironment,
  after: string | null,
  local: boolean,
) {
  const result = await fetchRelayQuery<homeFeedQuery>(
    environment,
    homeFeedQueryDocument,
    getHomeFeedQueryVariables(local ? "hackersPub" : "public", after),
  ).toPromise();

  return requireQueryResult(
    result,
    `Could not load the ${local ? "Hackers' Pub" : "public"} timeline.`,
  );
}

export async function readPostDetailWithEnvironment(environment: IEnvironment, postId: string) {
  const result = await fetchRelayQuery<postDetailPageQuery>(environment, postDetailPageDocument, {
    id: postId,
  }).toPromise();

  return requireQueryResult(result, "Could not load the requested post.");
}

export async function readProfileWithEnvironment(environment: IEnvironment, handle: string) {
  const result = await fetchRelayQuery<profilePageQuery>(environment, profilePageDocument, {
    handle,
    first: 20,
  }).toPromise();

  return requireQueryResult(result, "Could not load the requested profile.");
}

export const fetchHomeFeed = createServerFn({
  method: "GET",
})
  .inputValidator((input: { timeline: HomeFeedTimeline }) => input)
  .handler(async ({ data }) => {
    const result = await readHomeFeedWithEnvironment(getRelayEnvironment(), data.timeline);

    return {
      data: result,
      timeline: data.timeline,
    };
  });

export const fetchHomeTimelinePage = createServerFn({
  method: "GET",
})
  .inputValidator((input: { after: string | null; timeline: HomeFeedTimeline }) => input)
  .handler(async ({ data }) => {
    if (data.timeline === "personal") {
      return await readPersonalTimelinePageWithEnvironment(getRelayEnvironment(), data.after);
    }

    return await readPublicTimelinePageWithEnvironment(
      getRelayEnvironment(),
      data.after,
      data.timeline === "hackersPub",
    );
  });

export const fetchPostDetail = createServerFn({
  method: "GET",
})
  .inputValidator((postId: string) => postId)
  .handler(async ({ data }) => {
    return await readPostDetailWithEnvironment(getRelayEnvironment(), data);
  });

export const fetchProfile = createServerFn({
  method: "GET",
})
  .inputValidator((handle: string) => handle)
  .handler(async ({ data }) => {
    return await readProfileWithEnvironment(getRelayEnvironment(), data);
  });
