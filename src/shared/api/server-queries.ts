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

export async function readHomeFeedWithEnvironment(
  environment: IEnvironment,
  timeline: HomeFeedTimeline,
) {
  if (timeline === "public") {
    // Temporarily disabled while the public timeline backend is out of service.
    // return await fetchRelayQuery(environment, publicTimelineDocument, { first: 20 }).toPromise();
    return {
      unavailableReason: "Public timeline is temporarily unavailable.",
    };
  }

  return await readPersonalTimelinePageWithEnvironment(environment, null);
}

export async function readPersonalTimelinePageWithEnvironment(
  environment: IEnvironment,
  after: string | null,
) {
  return await fetchRelayQuery<homeFeedQuery>(environment, homeFeedQueryDocument, {
    after,
    first: 20,
  }).toPromise();
}

export async function readPostDetailWithEnvironment(environment: IEnvironment, postId: string) {
  return await fetchRelayQuery<postDetailPageQuery>(environment, postDetailPageDocument, {
    id: postId,
  }).toPromise();
}

export async function readProfileWithEnvironment(environment: IEnvironment, handle: string) {
  return await fetchRelayQuery<profilePageQuery>(environment, profilePageDocument, {
    handle,
    first: 20,
  }).toPromise();
}

export const fetchHomeFeed = createServerFn({
  method: "GET",
})
  .inputValidator((input: { timeline: HomeFeedTimeline }) => input)
  .handler(async ({ data }) => {
    const result = await readHomeFeedWithEnvironment(getRelayEnvironment(), data.timeline);

    if ("unavailableReason" in result) {
      return {
        data: null,
        timeline: data.timeline,
        unavailableReason: result.unavailableReason,
      };
    }

    return {
      data: result,
      timeline: data.timeline,
    };
  });

export const fetchPersonalTimelinePage = createServerFn({
  method: "GET",
})
  .inputValidator((input: { after: string | null }) => input)
  .handler(async ({ data }) => {
    return await readPersonalTimelinePageWithEnvironment(getRelayEnvironment(), data.after);
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
