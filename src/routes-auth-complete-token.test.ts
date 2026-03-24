import { describe, expect, it, vi } from "vite-plus/test";

vi.mock("./shared/auth/server", () => ({
  completeSignIn: vi.fn(),
}));

describe("auth completion route", () => {
  it("completes the challenge request and redirects to the requested next path", async () => {
    const { completeSignIn } = await import("./shared/auth/server");
    const completeSignInMock = vi.mocked(completeSignIn);
    completeSignInMock.mockResolvedValue({
      ok: true,
    });

    const { handleAuthCompleteRequest } = await import("./routes/auth.complete.$token");
    const response = await handleAuthCompleteRequest({
      params: { token: "challenge-1" },
      request: new Request(
        "https://example.com/auth/complete/challenge-1?code=ABC123&next=%2Fdrafts",
      ),
    });

    expect(completeSignInMock).toHaveBeenCalledWith({
      data: {
        code: "ABC123",
        token: "challenge-1",
      },
    });
    expect(response).toBeInstanceOf(Response);
    expect(response?.status).toBe(307);
    expect(response?.headers.get("Location")).toBe("/drafts");
  });
});
