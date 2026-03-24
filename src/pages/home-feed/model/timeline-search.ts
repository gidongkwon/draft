import { z } from "zod";

const homeFeedSearchSchema = z.object({
  timeline: z.enum(["personal", "public", "hackersPub"]).default("personal"),
});

export type HomeFeedSearch = z.infer<typeof homeFeedSearchSchema>;
export type HomeFeedTimeline = HomeFeedSearch["timeline"];

export function parseHomeFeedSearch(input: unknown): HomeFeedSearch {
  return homeFeedSearchSchema.parse(input ?? {});
}
