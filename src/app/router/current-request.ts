import type { ViewerSummary } from "./context";

export function createAppRouterContext(input: { viewer: ViewerSummary | null }) {
  return {
    viewer: input.viewer,
  };
}
