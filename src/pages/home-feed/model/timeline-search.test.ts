import { describe, expect, it } from "vite-plus/test";
import { parseHomeFeedSearch } from "./timeline-search";

describe("parseHomeFeedSearch", () => {
  it("defaults to the personal timeline when search is omitted", () => {
    expect(parseHomeFeedSearch(undefined)).toEqual({
      timeline: "personal",
    });
  });
});
