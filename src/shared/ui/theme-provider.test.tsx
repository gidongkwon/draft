import { fireEvent, render, screen } from "@solidjs/testing-library";
import { afterEach, describe, expect, it } from "vite-plus/test";
import { Button } from "./button";
import { ThemeProvider, useTheme } from "./theme-provider";

function ThemeHarness() {
  const theme = useTheme();

  return (
    <div>
      <p>Current theme: {theme.theme()}</p>
      <Button onClick={() => theme.toggleTheme()}>Toggle theme</Button>
    </div>
  );
}

describe("ThemeProvider", () => {
  afterEach(() => {
    localStorage.clear();
    document.documentElement.removeAttribute("data-theme");
  });

  it("defaults to dark and toggles to light", () => {
    render(() => (
      <ThemeProvider>
        <ThemeHarness />
      </ThemeProvider>
    ));

    expect(document.documentElement.getAttribute("data-theme")).toBe("dark");
    expect(screen.getByText("Current theme: dark")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "Toggle theme" }));

    expect(document.documentElement.getAttribute("data-theme")).toBe("light");
    expect(screen.getByText("Current theme: light")).toBeTruthy();
    expect(localStorage.getItem("draft-theme")).toBe("light");
  });
});
