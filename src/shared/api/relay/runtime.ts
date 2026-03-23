import RelayRuntime, { type IEnvironment, type OperationType } from "relay-runtime";

const { commitMutation, fetchQuery } = RelayRuntime;

export function commitRelayMutation(
  environment: IEnvironment,
  config: Parameters<typeof commitMutation>[1],
) {
  return commitMutation(environment, config);
}

export function fetchRelayQuery<TQuery extends OperationType>(
  environment: IEnvironment,
  query: Parameters<typeof fetchQuery<TQuery>>[1],
  variables: Parameters<typeof fetchQuery<TQuery>>[2],
) {
  return fetchQuery<TQuery>(environment, query, variables);
}
