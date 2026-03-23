/// <reference types="vite/client" />

import "../styles.css";

import { MetaProvider } from "@solidjs/meta";
import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
  useRouter,
} from "@tanstack/solid-router";
import { TanStackRouterDevtools } from "@tanstack/solid-router-devtools";
import { useServerFn } from "@tanstack/solid-start";
import { Suspense } from "solid-js";
import { HydrationScript } from "solid-js/web";
import { RelayProvider } from "../app/providers/relay-provider";
import { createAuthModalStore } from "../features/auth/model/auth-modal-store";
import { createProtectedActionGate } from "../features/auth/model/protected-action-gate";
import { AuthTriggerProvider } from "../features/auth/ui/auth-trigger-context";
import { AuthModal } from "../features/auth/ui/auth-modal";
import type { AppRouterContext } from "../app/router/context";
import { createAppRouterContext } from "../app/router/current-request";
import { AppShell } from "../app/ui/app-shell";
import { RootRouteErrorView } from "../app/ui/root-route-error-view";
import { getRelayEnvironment } from "../shared/api/relay";
import {
  completeSignIn,
  getCurrentViewer,
  requestSignInChallenge,
  signOut,
} from "../shared/auth/server";

export const Route = createRootRouteWithContext<AppRouterContext>()({
  beforeLoad: async () => {
    const auth = await getCurrentViewer();
    return createAppRouterContext({
      viewer: auth.viewer,
    });
  },
  head: () => ({
    meta: [
      {
        charSet: "utf-8",
      },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1",
      },
      {
        title: "Draft",
      },
    ],
  }),
  shellComponent: RootDocument,
  component: RootComponent,
  errorComponent: RootRouteErrorView,
  notFoundComponent: () => {
    return (
      <section class="mx-auto max-w-3xl px-6 py-16">
        <p class="text-sm tracking-[0.24em] text-stone-500">Not found</p>
        <h1 class="mt-4 font-code text-4xl">This page does not exist.</h1>
        <a class="mt-6 inline-flex text-sm font-medium text-amber-700 underline" href="/">
          Return to the latest feed
        </a>
      </section>
    );
  },
});

function RootDocument(props: { children: import("solid-js").JSX.Element }) {
  return (
    <html lang="en">
      <head>
        <HydrationScript />
      </head>
      <body>
        <MetaProvider>
          <HeadContent />
          <Suspense>{props.children}</Suspense>
          <Scripts />
        </MetaProvider>
      </body>
    </html>
  );
}

function RootComponent() {
  const router = useRouter();
  const routeContext = Route.useRouteContext();
  const authModal = createAuthModalStore();
  const requestSignInChallengeFn = useServerFn(requestSignInChallenge);
  const completeSignInFn = useServerFn(completeSignIn);
  const signOutFn = useServerFn(signOut);
  const protectedActionGate = createProtectedActionGate({
    isAuthenticated: () => Boolean(routeContext().viewer),
    openAuth: (action) => authModal.openForAction(action),
  });

  async function onSignOut() {
    await signOutFn();
    await router.invalidate();
  }

  function onNewPost() {
    protectedActionGate.run({ type: "new-post" }, () => {
      window.location.assign("/#compose-entry");
    });
  }

  async function onSignedIn() {
    await router.invalidate();
    protectedActionGate.resume();
  }

  return (
    <RelayProvider environment={getRelayEnvironment()}>
      <AuthTriggerProvider onSignInClick={() => authModal.openDirectly()}>
        <AppShell
          onNewPost={onNewPost}
          onSignInClick={() => authModal.openDirectly()}
          onSignOut={onSignOut}
          viewer={routeContext().viewer}
        >
          <Outlet />
          <AuthModal
            open={authModal.state.open}
            onClose={() => authModal.close()}
            onSignedIn={onSignedIn}
            completeSignIn={({ code, token }) => completeSignInFn({ data: { code, token } })}
            requestChallenge={({ identifier }) =>
              requestSignInChallengeFn({
                data: {
                  identifier,
                  locale: "en",
                },
              })
            }
          />
          <TanStackRouterDevtools position="bottom-right" />
        </AppShell>
      </AuthTriggerProvider>
    </RelayProvider>
  );
}
