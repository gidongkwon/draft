import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vite-plus/test";
import { RootRouteErrorView } from "./root-route-error-view";

describe("RootRouteErrorView", () => {
  it("keeps the shell visible while rendering the route error content", () => {
    render(() => <RootRouteErrorView error={new Error("GraphQL request failed (503)")} />);

    expect(screen.getByRole("link", { name: "draft" })).toBeTruthy();
    expect(screen.getByRole("navigation", { name: "App navigation" })).toBeTruthy();
    expect(screen.getByText("Something went wrong")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "This view could not be loaded." })).toBeTruthy();
  });
});
