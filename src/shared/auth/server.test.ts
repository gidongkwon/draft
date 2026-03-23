import type { IEnvironment } from "relay-runtime";
import { beforeEach, describe, expect, it, vi } from "vite-plus/test";

const commitMutationMock = vi.fn();
const fetchQueryMock = vi.fn();

vi.mock("../api/relay/runtime", () => ({
  commitRelayMutation: commitMutationMock,
  fetchRelayQuery: fetchQueryMock,
}));

describe("auth server helpers", () => {
  beforeEach(() => {
    commitMutationMock.mockReset();
    fetchQueryMock.mockReset();
  });

  it("requests a username login challenge through a relay mutation", async () => {
    const relayEnvironment = {} as IEnvironment;
    commitMutationMock.mockImplementation((_environment, config) => {
      config.onCompleted?.(
        {
          loginByUsername: {
            __typename: "LoginChallenge",
            token: "challenge-1",
          },
        },
        undefined,
      );
      return {};
    });
    const { requestSignInChallengeWithEnvironment } = await import("./server-helpers");

    const result = await requestSignInChallengeWithEnvironment(relayEnvironment, {
      identifier: "lucid",
      locale: "en",
      verifyUrl: "https://example.com/auth/complete/{token}?code={code}",
    });

    expect(commitMutationMock).toHaveBeenCalledWith(
      relayEnvironment,
      expect.objectContaining({
        mutation: expect.anything(),
        variables: expect.objectContaining({
          locale: "en",
          username: "lucid",
        }),
      }),
    );
    expect(result).toEqual({
      ok: true,
      token: "challenge-1",
    });
  });

  it("stores the session cookie after completing a login challenge through relay", async () => {
    const relayEnvironment = {} as IEnvironment;
    commitMutationMock.mockImplementation((_environment, config) => {
      config.onCompleted?.(
        {
          completeLoginChallenge: {
            id: "session-1",
          },
        },
        undefined,
      );
      return {};
    });
    const setSessionCookie = vi.fn();
    const { completeSignInWithEnvironment } = await import("./server-helpers");

    const result = await completeSignInWithEnvironment(relayEnvironment, {
      code: "ABC123",
      token: "challenge-1",
      setSessionCookie,
    });

    expect(setSessionCookie).toHaveBeenCalledWith("session-1");
    expect(result).toEqual({
      ok: true,
    });
  });

  it("revokes the current session and clears the cookie on sign out through relay", async () => {
    const relayEnvironment = {} as IEnvironment;
    commitMutationMock.mockImplementation((_environment, config) => {
      config.onCompleted?.(
        {
          revokeSession: {
            id: "session-1",
          },
        },
        undefined,
      );
      return {};
    });
    const clearSessionCookie = vi.fn();
    const { signOutWithEnvironment } = await import("./server-helpers");

    const result = await signOutWithEnvironment(relayEnvironment, {
      clearSessionCookie,
      sessionToken: "session-1",
    });

    expect(commitMutationMock).toHaveBeenCalledWith(
      relayEnvironment,
      expect.objectContaining({
        mutation: expect.anything(),
        variables: {
          sessionId: "session-1",
        },
      }),
    );
    expect(clearSessionCookie).toHaveBeenCalled();
    expect(result).toEqual({ ok: true });
  });

  it("returns a logged-out auth snapshot when no session token exists", async () => {
    const relayEnvironment = {} as IEnvironment;
    const { readCurrentViewerWithEnvironment } = await import("./server-helpers");

    const result = await readCurrentViewerWithEnvironment(relayEnvironment, {
      sessionToken: null,
    });

    expect(fetchQueryMock).not.toHaveBeenCalled();
    expect(result).toEqual({
      sessionToken: null,
      viewer: null,
    });
  });
});
