import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vite-plus/test";

describe("AuthModal", () => {
  it("moves from identifier entry to code entry after a successful challenge", async () => {
    const requestChallenge = vi.fn().mockResolvedValue({
      ok: true,
      token: "challenge-1",
    });
    const completeSignIn = vi.fn();
    const { AuthModal } = await import("./auth-modal");

    render(() => (
      <AuthModal open completeSignIn={completeSignIn} requestChallenge={requestChallenge} />
    ));

    expect(document.querySelector('[data-app-icon="dismiss"]')).toBeTruthy();
    fireEvent.input(screen.getByLabelText(/email or username/i), {
      target: { value: "lucid" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));

    expect(await screen.findByLabelText(/verification code/i)).toBeTruthy();
    expect(document.querySelector('[data-app-icon="password"]')).toBeTruthy();
  });

  it("shows an inline error when completing sign-in throws", async () => {
    const requestChallenge = vi.fn().mockResolvedValue({
      ok: true,
      token: "challenge-1",
    });
    const completeSignIn = vi.fn().mockRejectedValue(new Error("fetch failed"));
    const { AuthModal } = await import("./auth-modal");

    render(() => (
      <AuthModal open completeSignIn={completeSignIn} requestChallenge={requestChallenge} />
    ));

    fireEvent.input(screen.getByLabelText(/email or username/i), {
      target: { value: "lucid" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    await screen.findByLabelText(/verification code/i);

    fireEvent.input(screen.getByLabelText(/verification code/i), {
      target: { value: "ABC123" },
    });
    fireEvent.click(screen.getByRole("button", { name: "Complete sign in" }));

    expect(await screen.findByText("Could not complete sign-in.")).toBeTruthy();
  });
});
