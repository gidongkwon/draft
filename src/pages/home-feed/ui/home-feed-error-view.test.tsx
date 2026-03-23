import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vite-plus/test";
import { HomeFeedErrorView } from "./home-feed-error-view";

describe("HomeFeedErrorView", () => {
  it("renders a feed-slot-specific recovery message", () => {
    render(() => <HomeFeedErrorView error={new Error("Feed upstream unavailable")} />);

    expect(screen.getByRole("heading", { name: "The timeline could not be loaded." })).toBeTruthy();
    expect(screen.getByText("Feed upstream unavailable")).toBeTruthy();
    expect(screen.getByRole("link", { name: "Return to the feed" }).getAttribute("href")).toBe("/");
  });
});
