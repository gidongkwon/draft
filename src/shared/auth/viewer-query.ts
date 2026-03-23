import { graphql } from "relay-runtime";
import type { ViewerSummary } from "./types";

export const viewerQuery = graphql`
  query viewerQuery {
    viewer {
      id
      name
      username
      avatarUrl
    }
  }
`;

export function toViewerSummary(viewer: {
  id: string;
  name: string;
  username: string;
  avatarUrl: string | null;
}): ViewerSummary {
  return {
    id: viewer.id,
    name: viewer.name,
    handle: `@${viewer.username}`,
    avatarUrl: viewer.avatarUrl,
  };
}
