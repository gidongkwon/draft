import type { ViewerSummary } from "../../shared/auth/types";

export function createAppRouterContext(input: { viewer: ViewerSummary | null }) {
  return {
    viewer: input.viewer,
  };
}
