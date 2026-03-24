import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vite-plus/test";
import { TopCommandBar } from "./top-command-bar";

describe("TopCommandBar", () => {
  it("renders the brand, search, new-post action, and custom actions slot", () => {
    const onNewPost = vi.fn();

    render(() => (
      <TopCommandBar actions={<button type="button">Custom action</button>} onNewPost={onNewPost} />
    ));

    expect(screen.getByRole("link", { name: "draft" }).getAttribute("href")).toBe("/");
    expect(screen.getByRole("searchbox")).toBeTruthy();
    expect(document.querySelector("[data-app-icon]")).toBeNull();
    expect(screen.getByRole("button", { name: "Custom action" })).toBeTruthy();
    fireEvent.click(screen.getByRole("button", { name: "New post" }));
    expect(onNewPost).toHaveBeenCalled();
  });

  it("renders without injected actions when none are provided", () => {
    render(() => <TopCommandBar onNewPost={vi.fn()} />);

    expect(screen.queryByRole("button", { name: "Custom action" })).toBeNull();
    expect(screen.getByRole("button", { name: "New post" })).toBeTruthy();
  });
});
