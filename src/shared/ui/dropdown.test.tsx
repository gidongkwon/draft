import { fireEvent, render, screen } from "@solidjs/testing-library";
import { describe, expect, it, vi } from "vite-plus/test";
import { Dropdown } from "./dropdown";

describe("Dropdown", () => {
  it("opens, closes on outside click, and closes on Escape", () => {
    render(() => (
      <div>
        <button type="button">Outside</button>
        <Dropdown.Root>
          <Dropdown.Trigger>Open menu</Dropdown.Trigger>
          <Dropdown.Content>
            <Dropdown.Item onSelect={vi.fn()}>Log out</Dropdown.Item>
          </Dropdown.Content>
        </Dropdown.Root>
      </div>
    ));

    expect(screen.queryByRole("menu")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("menu")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Outside" }));
    expect(screen.queryByRole("menu")).toBeNull();

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    expect(screen.getByRole("menu")).toBeTruthy();

    fireEvent.keyDown(document, { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("runs item handlers and closes after selection", () => {
    const onSelect = vi.fn();

    render(() => (
      <Dropdown.Root>
        <Dropdown.Trigger>Open menu</Dropdown.Trigger>
        <Dropdown.Content>
          <Dropdown.Item onSelect={onSelect}>Log out</Dropdown.Item>
        </Dropdown.Content>
      </Dropdown.Root>
    ));

    fireEvent.click(screen.getByRole("button", { name: "Open menu" }));
    fireEvent.click(screen.getByRole("menuitem", { name: "Log out" }));

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(screen.queryByRole("menu")).toBeNull();
  });
});
