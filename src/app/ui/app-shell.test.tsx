import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vite-plus/test";
import { AppShell } from "./app-shell";

describe("AppShell", () => {
  it("renders the shell navigation and page content for signed-out users", () => {
    const onSignInClick = vi.fn();

    render(() => (
      <AppShell onSignInClick={onSignInClick}>
        <div>Page body</div>
      </AppShell>
    ));

    expect(screen.getByRole("link", { name: "draft" }).getAttribute("href")).toBe("/");
    expect(screen.getByRole("link", { name: "Timeline" }).getAttribute("href")).toBe("/");
    expect(document.querySelector('[data-app-icon="home"]')).toBeTruthy();
    expect(document.querySelector('[data-app-icon="notification"]')).toBeTruthy();
    expect(screen.queryByRole("link", { name: "Notifications" })).toBeTruthy();
    expect(screen.getByRole("button", { name: "Sign in" })).toBeTruthy();
    expect(screen.getByText("Page body")).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "Sign in" }));
    expect(onSignInClick).toHaveBeenCalled();
  });

  it("shows account controls for signed-in users", () => {
    const onSignOut = vi.fn();

    render(() => (
      <AppShell
        onSignInClick={vi.fn()}
        onSignOut={onSignOut}
        viewer={{
          avatarUrl: null,
          handle: "@lucid",
          id: "viewer-1",
          name: "Lucid",
        }}
      >
        <div>Page body</div>
      </AppShell>
    ));

    expect(screen.getByText("Lucid")).toBeTruthy();
    expect(screen.queryByRole("menuitem", { name: "Log out" })).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Lucid @lucid" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Log out" }));
    expect(onSignOut).toHaveBeenCalled();
  });
});
