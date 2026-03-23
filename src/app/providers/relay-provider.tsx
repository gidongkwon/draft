import type { IEnvironment } from "relay-runtime";
import type { ParentProps } from "solid-js";
import { RelayEnvironmentProvider } from "solid-relay";

type RelayProviderProps = ParentProps<{
  environment: IEnvironment;
}>;

export function RelayProvider(props: RelayProviderProps) {
  return (
    <RelayEnvironmentProvider environment={props.environment}>
      {props.children}
    </RelayEnvironmentProvider>
  );
}
