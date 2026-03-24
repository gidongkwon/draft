import type { IEnvironment } from "relay-runtime";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

const fetchQueryMock = vi.fn();

vi.mock("./relay/runtime", () => ({
  fetchRelayQuery: fetchQueryMock,
}));

describe("relay-backed server queries", () => {
  beforeEach(() => {
    fetchQueryMock.mockReset();
  });

  it("loads the personal home timeline through relay query documents", async () => {
    const relayEnvironment = {} as IEnvironment;
    const expected = { personalTimeline: { edges: [] } };
    fetchQueryMock.mockReturnValue({
      toPromise: vi.fn().mockResolvedValue(expected),
    });
    const { readHomeFeedWithEnvironment } = await import("./server-queries");

    const result = await readHomeFeedWithEnvironment(relayEnvironment, "personal");

    expect(fetchQueryMock).toHaveBeenCalledWith(relayEnvironment, expect.anything(), {
      after: null,
      first: 20,
      isPersonal: true,
      isPublic: false,
      local: false,
    });
    expect(result).toEqual(expected);
  });

  it("loads the public home timeline through relay query documents", async () => {
    const relayEnvironment = {} as IEnvironment;
    const expected = { publicTimeline: { edges: [] } };
    fetchQueryMock.mockReturnValue({
      toPromise: vi.fn().mockResolvedValue(expected),
    });
    const { readHomeFeedWithEnvironment } = await import("./server-queries");

    const result = await readHomeFeedWithEnvironment(relayEnvironment, "public");

    expect(fetchQueryMock).toHaveBeenCalledWith(relayEnvironment, expect.anything(), {
      after: null,
      first: 20,
      isPersonal: false,
      isPublic: true,
      local: false,
    });
    expect(result).toEqual(expected);
  });

  it("loads the Hackers' Pub local timeline through relay query documents", async () => {
    const relayEnvironment = {} as IEnvironment;
    const expected = { publicTimeline: { edges: [] } };
    fetchQueryMock.mockReturnValue({
      toPromise: vi.fn().mockResolvedValue(expected),
    });
    const { readHomeFeedWithEnvironment } = await import("./server-queries");

    const result = await readHomeFeedWithEnvironment(relayEnvironment, "hackersPub");

    expect(fetchQueryMock).toHaveBeenCalledWith(relayEnvironment, expect.anything(), {
      after: null,
      first: 20,
      isPersonal: false,
      isPublic: true,
      local: true,
    });
    expect(result).toEqual(expected);
  });

  it("loads additional personal timeline pages through relay query documents", async () => {
    const relayEnvironment = {} as IEnvironment;
    const expected = { personalTimeline: { edges: [] } };
    fetchQueryMock.mockReturnValue({
      toPromise: vi.fn().mockResolvedValue(expected),
    });
    const { readPersonalTimelinePageWithEnvironment } = await import("./server-queries");

    const result = await readPersonalTimelinePageWithEnvironment(relayEnvironment, "cursor-20");

    expect(fetchQueryMock).toHaveBeenCalledWith(relayEnvironment, expect.anything(), {
      after: "cursor-20",
      first: 20,
      isPersonal: true,
      isPublic: false,
      local: false,
    });
    expect(result).toEqual(expected);
  });

  it("loads additional public timeline pages through relay query documents", async () => {
    const relayEnvironment = {} as IEnvironment;
    const expected = { publicTimeline: { edges: [] } };
    fetchQueryMock.mockReturnValue({
      toPromise: vi.fn().mockResolvedValue(expected),
    });
    const { readPublicTimelinePageWithEnvironment } = await import("./server-queries");

    const result = await readPublicTimelinePageWithEnvironment(
      relayEnvironment,
      "cursor-20",
      false,
    );

    expect(fetchQueryMock).toHaveBeenCalledWith(relayEnvironment, expect.anything(), {
      after: "cursor-20",
      first: 20,
      isPersonal: false,
      isPublic: true,
      local: false,
    });
    expect(result).toEqual(expected);
  });

  it("loads additional Hackers' Pub local timeline pages through relay query documents", async () => {
    const relayEnvironment = {} as IEnvironment;
    const expected = { publicTimeline: { edges: [] } };
    fetchQueryMock.mockReturnValue({
      toPromise: vi.fn().mockResolvedValue(expected),
    });
    const { readPublicTimelinePageWithEnvironment } = await import("./server-queries");

    const result = await readPublicTimelinePageWithEnvironment(relayEnvironment, "cursor-20", true);

    expect(fetchQueryMock).toHaveBeenCalledWith(relayEnvironment, expect.anything(), {
      after: "cursor-20",
      first: 20,
      isPersonal: false,
      isPublic: true,
      local: true,
    });
    expect(result).toEqual(expected);
  });

  it("loads the post detail through relay query documents", async () => {
    const relayEnvironment = {} as IEnvironment;
    const expected = { node: null };
    fetchQueryMock.mockReturnValue({
      toPromise: vi.fn().mockResolvedValue(expected),
    });
    const { readPostDetailWithEnvironment } = await import("./server-queries");

    const result = await readPostDetailWithEnvironment(relayEnvironment, "post-123");

    expect(fetchQueryMock).toHaveBeenCalledWith(relayEnvironment, expect.anything(), {
      id: "post-123",
    });
    expect(result).toEqual(expected);
  });

  it("loads the profile through relay query documents", async () => {
    const relayEnvironment = {} as IEnvironment;
    const expected = { actorByHandle: null };
    fetchQueryMock.mockReturnValue({
      toPromise: vi.fn().mockResolvedValue(expected),
    });
    const { readProfileWithEnvironment } = await import("./server-queries");

    const result = await readProfileWithEnvironment(relayEnvironment, "@lucid");

    expect(fetchQueryMock).toHaveBeenCalledWith(relayEnvironment, expect.anything(), {
      first: 20,
      handle: "@lucid",
    });
    expect(result).toEqual(expected);
  });
});
