import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vite-plus/test";
import { Tabs } from "./tabs";

describe("Tabs", () => {
  it("marks the selected tab and changes selection when another enabled tab is chosen", () => {
    const onValueChange = vi.fn();

    render(() => (
      <Tabs.Root value="personal" onValueChange={onValueChange}>
        <Tabs.List aria-label="Timeline type">
          <Tabs.Trigger value="personal">Personal</Tabs.Trigger>
          <Tabs.Trigger value="public">Public</Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    ));

    expect(screen.getByRole("tab", { name: "Personal" }).getAttribute("aria-selected")).toBe(
      "true",
    );

    fireEvent.click(screen.getByRole("tab", { name: "Public" }));
    expect(onValueChange).toHaveBeenCalledWith("public");
  });

  it("does not emit changes for disabled tabs", () => {
    const onValueChange = vi.fn();

    render(() => (
      <Tabs.Root value="personal" onValueChange={onValueChange}>
        <Tabs.List aria-label="Timeline type">
          <Tabs.Trigger value="personal">Personal</Tabs.Trigger>
          <Tabs.Trigger disabled value="public">
            Public
          </Tabs.Trigger>
        </Tabs.List>
      </Tabs.Root>
    ));

    fireEvent.click(screen.getByRole("tab", { name: "Public" }));
    expect(onValueChange).not.toHaveBeenCalled();
  });
});
