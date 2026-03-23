import { graphql } from "relay-runtime";

export const homeFeedQueryDocument = graphql`
  query homeFeedQuery($first: Int!, $after: String) {
    personalTimeline(first: $first, after: $after) {
      edges {
        cursor
        node {
          __typename
          id
          name
          excerpt
          published
          actor {
            handle
            rawName
            username
            avatarUrl
          }
          engagementStats {
            reactions
            replies
            shares
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
    }
  }
`;
