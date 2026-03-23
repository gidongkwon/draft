import type { IEnvironment } from "relay-runtime";
import type { operationsCompleteLoginChallengeMutation as CompleteLoginChallengeMutation } from "./__generated__/operationsCompleteLoginChallengeMutation.graphql";
import type { currentViewerQuery as CurrentViewerQuery } from "./__generated__/currentViewerQuery.graphql";
import type { operationsLoginByEmailMutation as LoginByEmailMutation } from "./__generated__/operationsLoginByEmailMutation.graphql";
import type { operationsLoginByUsernameMutation as LoginByUsernameMutation } from "./__generated__/operationsLoginByUsernameMutation.graphql";
import type { operationsRevokeSessionMutation as RevokeSessionMutation } from "./__generated__/operationsRevokeSessionMutation.graphql";
import {
  completeLoginChallengeMutation,
  loginByEmailMutation,
  loginByUsernameMutation,
  revokeSessionMutation,
} from "./operations";
import { commitRelayMutation, fetchRelayQuery } from "../api/relay/runtime";
import { toViewerSummary, viewerQuery } from "./viewer-query";

export type ChallengeInput = {
  identifier: string;
  locale: string;
  verifyUrl: string;
};

export type CompleteInput = {
  token: string;
  code: string;
  setSessionCookie: (sessionToken: string) => void;
};

export type SignOutInput = {
  sessionToken: string | null;
  clearSessionCookie: () => void;
};

export type CurrentViewerInput = {
  sessionToken: string | null;
};

export type ChallengeResult =
  | {
      ok: true;
      token: string;
    }
  | {
      ok: false;
      reason: "account-not-found" | "unknown";
    };

export type CompleteResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      reason: "invalid-code" | "unknown";
    };

export type AuthSnapshot = {
  sessionToken: string | null;
  viewer: ViewerSummary | null;
};

async function commitMutationPromise<TResponse>(
  environment: IEnvironment,
  options: {
    mutation: unknown;
    variables: Record<string, unknown>;
  },
) {
  return await new Promise<TResponse>((resolve, reject) =>
    commitRelayMutation(environment, {
      mutation: options.mutation as never,
      variables: options.variables,
      onCompleted: (response, errors) => {
        if (errors?.length) {
          reject(new AggregateError(errors));
          return;
        }

        resolve(response as TResponse);
      },
      onError: reject,
    }),
  );
}

function isEmailIdentifier(identifier: string) {
  return /^[^@\s]+@[^@\s]+$/.test(identifier);
}

export async function requestSignInChallengeWithEnvironment(
  environment: IEnvironment,
  input: ChallengeInput,
): Promise<ChallengeResult> {
  const identifier = input.identifier.trim();
  const useEmailMutation = isEmailIdentifier(identifier);
  const result = useEmailMutation
    ? await commitMutationPromise<LoginByEmailMutation["response"]>(environment, {
        mutation: loginByEmailMutation,
        variables: {
          email: identifier,
          locale: input.locale,
          verifyUrl: input.verifyUrl,
        },
      })
    : await commitMutationPromise<LoginByUsernameMutation["response"]>(environment, {
        mutation: loginByUsernameMutation,
        variables: {
          locale: input.locale,
          username: identifier,
          verifyUrl: input.verifyUrl,
        },
      });

  const payload = useEmailMutation ? result.loginByEmail : result.loginByUsername;

  if (payload?.__typename === "LoginChallenge" && payload.token) {
    return {
      ok: true,
      token: payload.token,
    };
  }

  if (payload?.__typename === "AccountNotFoundError") {
    return {
      ok: false,
      reason: "account-not-found",
    };
  }

  return {
    ok: false,
    reason: "unknown",
  };
}

export async function completeSignInWithEnvironment(
  environment: IEnvironment,
  input: CompleteInput,
): Promise<CompleteResult> {
  const result = await commitMutationPromise<CompleteLoginChallengeMutation["response"]>(
    environment,
    {
      mutation: completeLoginChallengeMutation,
      variables: {
        code: input.code,
        token: input.token,
      },
    },
  );

  const session = result.completeLoginChallenge;

  if (!session?.id) {
    return {
      ok: false,
      reason: "invalid-code",
    };
  }

  input.setSessionCookie(session.id);

  return {
    ok: true,
  };
}

export async function signOutWithEnvironment(
  environment: IEnvironment,
  input: SignOutInput,
): Promise<{ ok: true }> {
  if (input.sessionToken) {
    await commitMutationPromise<RevokeSessionMutation["response"]>(environment, {
      mutation: revokeSessionMutation,
      variables: {
        sessionId: input.sessionToken,
      },
    });
  }

  input.clearSessionCookie();

  return { ok: true };
}

export async function readCurrentViewerWithEnvironment(
  environment: IEnvironment,
  input: CurrentViewerInput,
): Promise<AuthSnapshot> {
  if (!input.sessionToken) {
    return {
      sessionToken: null,
      viewer: null,
    };
  }

  const result = await fetchRelayQuery<CurrentViewerQuery>(
    environment,
    viewerQuery,
    {},
  ).toPromise();
  const viewer = result?.viewer;

  return {
    sessionToken: input.sessionToken,
    viewer: viewer ? toViewerSummary(viewer) : null,
  };
}
