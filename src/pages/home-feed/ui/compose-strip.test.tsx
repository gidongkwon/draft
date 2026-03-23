import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vite-plus/test";
import { ComposeStrip } from "./compose-strip";
import { HomeFeedLayout } from "./home-feed-layout";

describe("ComposeStrip", () => {
  it("renders a developer-oriented compose surface", () => {
    render(() => <ComposeStrip />);

    expect(screen.getByRole("textbox")).toBeTruthy();
    expect(screen.getByPlaceholderText("Share your thoughts")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Publish" })).toBeTruthy();
    expect(document.querySelector('[data-app-icon="send"]')).toBeTruthy();
  });
});

describe("HomeFeedLayout", () => {
  it("renders the compose strip, child feed slot, and supporting context together", () => {
    render(() => (
      <HomeFeedLayout onTimelineChange={() => {}} timeline="personal">
        <div>Feed slot</div>
      </HomeFeedLayout>
    ));

    expect(screen.getByRole("textbox")).toBeTruthy();
    expect(screen.getByRole("button", { name: "Publish" })).toBeTruthy();
    expect(screen.getByRole("tablist", { name: "Timeline type" })).toBeTruthy();
    expect(screen.getByRole("tab", { name: "Personal" }).getAttribute("aria-selected")).toBe(
      "true",
    );
    expect(screen.getByRole("tab", { name: "Public" })).toBeTruthy();
    expect(screen.getByText("Feed slot")).toBeTruthy();
  });
});
