import { createServerFn } from "@tanstack/solid-start";
import {
  deleteCookie,
  getCookie,
  getRequestProtocol,
  getRequestUrl,
  setCookie,
} from "@tanstack/solid-start/server";
import { createEnvironment } from "../api/relay";
import { SESSION_COOKIE_MAX_AGE_SECONDS, SESSION_COOKIE_NAME } from "./session-cookie";
import {
  completeSignInWithEnvironment,
  readCurrentViewerWithEnvironment,
  requestSignInChallengeWithEnvironment,
  signOutWithEnvironment,
} from "./server-helpers";

function setSessionTokenCookie(sessionToken: string) {
  setCookie(SESSION_COOKIE_NAME, sessionToken, {
    httpOnly: true,
    maxAge: SESSION_COOKIE_MAX_AGE_SECONDS,
    path: "/",
    sameSite: "lax",
    secure: getRequestProtocol({ xForwardedProto: true }) === "https",
  });
}

function clearSessionTokenCookie() {
  deleteCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: true,
  });
  deleteCookie(SESSION_COOKIE_NAME, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: false,
  });
}

function currentVerifyUrl() {
  const requestUrl = getRequestUrl({
    xForwardedHost: true,
    xForwardedProto: true,
  });
  return `${requestUrl.origin}/auth/complete/{token}?code={code}`;
}

export const requestSignInChallenge = createServerFn({
  method: "POST",
})
  .inputValidator((input: { identifier: string; locale?: string }) => input)
  .handler(async ({ data }) => {
    const relayEnvironment = createEnvironment();
    return await requestSignInChallengeWithEnvironment(relayEnvironment, {
      identifier: data.identifier,
      locale: data.locale ?? "en",
      verifyUrl: currentVerifyUrl(),
    });
  });

export const completeSignIn = createServerFn({
  method: "POST",
})
  .inputValidator((input: { token: string; code: string }) => input)
  .handler(async ({ data }) => {
    const relayEnvironment = createEnvironment();
    return await completeSignInWithEnvironment(relayEnvironment, {
      code: data.code,
      token: data.token,
      setSessionCookie: setSessionTokenCookie,
    });
  });

export const signOut = createServerFn({
  method: "POST",
}).handler(async () => {
  const sessionToken = getCookie(SESSION_COOKIE_NAME) ?? null;
  const relayEnvironment = createEnvironment({ sessionToken });

  return await signOutWithEnvironment(relayEnvironment, {
    clearSessionCookie: clearSessionTokenCookie,
    sessionToken,
  });
});

export const getCurrentViewer = createServerFn({
  method: "GET",
}).handler(async () => {
  const sessionToken = getCookie(SESSION_COOKIE_NAME) ?? null;
  const relayEnvironment = createEnvironment({ sessionToken });

  return await readCurrentViewerWithEnvironment(relayEnvironment, {
    sessionToken,
  });
});
