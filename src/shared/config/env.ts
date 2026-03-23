export const DEFAULT_HACKERSPUB_GRAPHQL_URL = "https://hackers.pub/graphql";

export function resolveApiUrl(value = import.meta.env.VITE_API_URL) {
  return value?.trim() || DEFAULT_HACKERSPUB_GRAPHQL_URL;
}
