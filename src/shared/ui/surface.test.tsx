import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vite-plus/test";
import { Surface } from "./surface";

describe("Surface", () => {
  it("renders variant and padding metadata", () => {
    render(() => (
      <Surface padding="lg" variant="floating">
        Tokenized surface
      </Surface>
    ));

    const surface = screen.getByText("Tokenized surface");

    expect(surface.getAttribute("data-padding")).toBe("lg");
    expect(surface.getAttribute("data-variant")).toBe("floating");
  });
});
