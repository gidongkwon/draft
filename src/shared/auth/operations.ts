import { graphql } from "relay-runtime";

export const loginByEmailMutation = graphql`
  mutation operationsLoginByEmailMutation(
    $locale: Locale!
    $email: String!
    $verifyUrl: URITemplate!
  ) {
    loginByEmail(locale: $locale, email: $email, verifyUrl: $verifyUrl) {
      __typename
      ... on LoginChallenge {
        token
      }
      ... on AccountNotFoundError {
        query
      }
    }
  }
`;

export const loginByUsernameMutation = graphql`
  mutation operationsLoginByUsernameMutation(
    $locale: Locale!
    $username: String!
    $verifyUrl: URITemplate!
  ) {
    loginByUsername(locale: $locale, username: $username, verifyUrl: $verifyUrl) {
      __typename
      ... on LoginChallenge {
        token
      }
      ... on AccountNotFoundError {
        query
      }
    }
  }
`;

export const completeLoginChallengeMutation = graphql`
  mutation operationsCompleteLoginChallengeMutation($token: UUID!, $code: String!) {
    completeLoginChallenge(token: $token, code: $code) {
      id
    }
  }
`;

export const revokeSessionMutation = graphql`
  mutation operationsRevokeSessionMutation($sessionId: UUID!) {
    revokeSession(sessionId: $sessionId) {
      id
    }
  }
`;
