import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vite-plus/test";
import { Badge } from "./badge";

describe("Badge", () => {
  it("renders tone and size metadata", () => {
    render(() => (
      <Badge size="sm" tone="accent">
        Warm accent
      </Badge>
    ));

    const badge = screen.getByText("Warm accent");

    expect(badge.getAttribute("data-size")).toBe("sm");
    expect(badge.getAttribute("data-tone")).toBe("accent");
  });
});
