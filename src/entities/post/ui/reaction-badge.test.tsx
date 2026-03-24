import { render, screen } from "@solidjs/testing-library";
import { describe, expect, it } from "vite-plus/test";
import { ReactionBadge } from "./reaction-badge";

describe("ReactionBadge", () => {
  it("renders only the heart icon and count when there are no reaction groups", () => {
    render(() => <ReactionBadge count={0} reactionGroups={[]} />);

    expect(screen.queryByText("🔥")).toBeNull();
    expect(screen.getByText("0")).toBeTruthy();
  });

  it("renders the top reaction emojis in count order", () => {
    render(() => (
      <ReactionBadge
        count={8}
        reactionGroups={[
          { count: 4, emoji: "🔥" },
          { count: 3, emoji: "👏" },
          { count: 1, emoji: "💡" },
        ]}
      />
    ));

    expect(screen.getByText("🔥")).toBeTruthy();
    expect(screen.getByText("👏")).toBeTruthy();
    expect(screen.getByText("💡")).toBeTruthy();
  });
});
