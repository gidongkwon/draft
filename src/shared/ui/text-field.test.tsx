import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vite-plus/test";
import { TextField } from "./text-field";

describe("TextField", () => {
  it("renders invalid state metadata", () => {
    render(() => <TextField aria-label="Search" invalid placeholder="Search the network" />);

    const input = screen.getByRole("textbox", { name: "Search" });

    expect(input.getAttribute("data-invalid")).toBe("true");
    expect(input.getAttribute("placeholder")).toBe("Search the network");
  });
});
