import type { ErrorComponentProps } from "@tanstack/solid-router";
import { AppShell } from "./app-shell";
import { RouteErrorView } from "./route-error-view";

type RootRouteErrorViewProps = Pick<ErrorComponentProps, "error">;

export function RootRouteErrorView(props: RootRouteErrorViewProps) {
  return (
    <AppShell>
      <RouteErrorView error={props.error} />
    </AppShell>
  );
}
