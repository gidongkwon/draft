import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vite-plus/test";
import { RouteErrorView } from "./route-error-view";

describe("RouteErrorView", () => {
  it("renders the route error message and recovery link", () => {
    render(() => <RouteErrorView error={new Error("Upstream unavailable")} />);

    expect(screen.getByText("Something went wrong")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "This view could not be loaded." })).toBeTruthy();
    expect(screen.getByText("Upstream unavailable")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Return to the feed" }).getAttribute("href")).toBe("/");
  });

  it("falls back to a default message for unknown errors", () => {
    render(() => <RouteErrorView error="unexpected" />);

    expect(screen.getByText("Refresh the page or return to the feed and try again.")).toBeTruthy();
  });
});
