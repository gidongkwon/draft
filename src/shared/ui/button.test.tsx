import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vite-plus/test";
import { Button } from "./button";

describe("Button", () => {
  it("renders semantic variant and size metadata", () => {
    render(() => (
      <Button size="sm" variant="secondary">
        Secondary action
      </Button>
    ));

    const button = screen.getByRole("button", { name: "Secondary action" });

    expect(button.getAttribute("data-size")).toBe("sm");
    expect(button.getAttribute("data-variant")).toBe("secondary");
  });

  it("defaults to button type and forwards click handlers", () => {
    const onClick = vi.fn();

    render(() => <Button onClick={onClick}>Launch</Button>);

    const button = screen.getByRole("button", { name: "Launch" });

    expect(button.getAttribute("type")).toBe("button");
    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});
