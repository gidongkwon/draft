import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vite-plus/test";
import { Avatar } from "./avatar";

describe("Avatar", () => {
  it("renders a circular image avatar when src is available", () => {
    render(() => <Avatar name="Alice Doe" size="md" src="https://example.com/avatar.png" />);

    const image = screen.getByRole("img", { name: "Alice Doe avatar" });

    expect(image.getAttribute("src")).toBe("https://example.com/avatar.png");
    expect(image.className).toContain("rounded-full");
  });

  it("falls back to initials when src is missing", () => {
    render(() => <Avatar name="Alice Doe" size="md" src={null} />);

    expect(screen.getByText("AD")).toBeTruthy();
    expect(screen.queryByRole("img", { name: "Alice Doe avatar" })).toBeNull();
  });

  it("falls back to initials after an image error event", () => {
    render(() => <Avatar name="Alice Doe" size="md" src="https://example.com/broken.png" />);

    const image = screen.getByRole("img", { name: "Alice Doe avatar" });
    image.dispatchEvent(new Event("error"));

    expect(screen.getByText("AD")).toBeTruthy();
    expect(screen.queryByRole("img", { name: "Alice Doe avatar" })).toBeNull();
  });
});
