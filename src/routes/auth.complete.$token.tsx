import { createFileRoute } from "@tanstack/solid-router";
import type { ErrorComponentProps } from "@tanstack/solid-router";
import { parseAuthCompleteSearch, resolvePostSignInRedirect } from "../shared/auth/complete-link";
import { completeSignIn } from "../shared/auth/server";

type AuthCompleteRequest = {
  params: {
    token: string;
  };
  request: Request;
};

export async function handleAuthCompleteRequest(
  input: AuthCompleteRequest,
  completeSignInFn: typeof completeSignIn = completeSignIn,
) {
  const requestUrl = new URL(input.request.url);
  const search = parseAuthCompleteSearch(Object.fromEntries(requestUrl.searchParams.entries()));

  await completeSignInFn({
    data: {
      code: search.code,
      token: input.params.token,
    },
  });

  return new Response(null, {
    status: 307,
    headers: {
      Location: resolvePostSignInRedirect(search.next),
    },
  });
}

export const Route = createFileRoute("/auth/complete/$token")({
  validateSearch: parseAuthCompleteSearch,
  server: {
    handlers: {
      GET: handleAuthCompleteRequest,
    },
  },
  component: AuthCompletePending,
  errorComponent: AuthCompleteError,
});

function AuthCompletePending() {
  return (
    <section class="mx-auto flex min-h-[60vh] max-w-2xl flex-col justify-center px-6 py-16 text-center">
      <p class="text-sm tracking-[0.24em] text-stone-500">Signing in</p>
      <h1 class="mt-4 font-code text-4xl text-stone-900">Completing your sign-in link.</h1>
      <p class="mt-4 text-sm text-stone-600">
        If nothing happens, return to the previous screen and request a new code.
      </p>
    </section>
  );
}

function AuthCompleteError(props: ErrorComponentProps) {
  const message =
    props.error instanceof Error
      ? props.error.message
      : "This sign-in link could not be completed.";

  return (
    <section class="mx-auto flex min-h-[60vh] max-w-2xl flex-col justify-center px-6 py-16 text-center">
      <p class="text-sm tracking-[0.24em] text-red-600">Sign-in failed</p>
      <h1 class="mt-4 font-code text-4xl text-stone-900">This link is no longer valid.</h1>
      <p class="mt-4 text-sm text-stone-600">{message}</p>
      <a
        class="mt-6 inline-flex justify-center text-sm font-medium text-amber-700 underline"
        href="/"
      >
        Return to the feed
      </a>
    </section>
  );
}
