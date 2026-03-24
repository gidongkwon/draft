import { graphql } from "relay-runtime";

export const homeFeedQueryDocument = graphql`
  query homeFeedQuery(
    $first: Int!
    $after: String
    $isPersonal: Boolean!
    $isPublic: Boolean!
    $local: Boolean!
  ) {
    personalTimeline(first: $first, after: $after) @include(if: $isPersonal) {
      edges {
        cursor
        sharersCount
        lastSharer {
          handle
          rawName
          username
        }
        node {
          __typename
          id
          name
          excerpt
          published
          replyTarget {
            id
            replyTarget {
              id
              replyTarget {
                id
                replyTarget {
                  id
                }
              }
            }
          }
          reactionGroups {
            ... on EmojiReactionGroup {
              emoji
              reactors {
                totalCount
              }
            }
          }
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
    publicTimeline(first: $first, after: $after, local: $local) @include(if: $isPublic) {
      edges {
        cursor
        sharersCount
        lastSharer {
          handle
          rawName
          username
        }
        node {
          __typename
          id
          name
          excerpt
          published
          replyTarget {
            id
            replyTarget {
              id
              replyTarget {
                id
                replyTarget {
                  id
                }
              }
            }
          }
          reactionGroups {
            ... on EmojiReactionGroup {
              emoji
              reactors {
                totalCount
              }
            }
          }
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
