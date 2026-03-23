import type { ViewerSummary } from "../../shared/auth/types";

export type AppRouterContext = {
  viewer: ViewerSummary | null;
};
