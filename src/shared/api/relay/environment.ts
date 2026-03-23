import type { FetchFunction, IEnvironment } from "relay-runtime";
import { Environment, Network, RecordSource, Store } from "relay-runtime";
import { isServer } from "solid-js/web";
import { resolveApiUrl } from "../../config/env";
import { SESSION_COOKIE_NAME } from "../../auth/session-cookie";
import { createGraphQLFetch } from "./fetch-graphql";

const START_EVENT_STORAGE_KEY = Symbol.for("tanstack-start:event-storage");
const requestEnvironmentCache = new WeakMap<Request, IEnvironment>();
let clientEnvironment: IEnvironment | null = null;

function readCookieValue(cookieHeader: string | null, name: string) {
  if (!cookieHeader) {
    return null;
  }

  for (const part of cookieHeader.split(";")) {
    const [cookieName, ...cookieValueParts] = part.trim().split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValueParts.join("="));
    }
  }

  return null;
}

function getCurrentServerRequest() {
  const storage = (
    globalThis as {
      [START_EVENT_STORAGE_KEY]?: {
        getStore?: () => { h3Event?: { req?: Request } } | undefined;
      };
    }
  )[START_EVENT_STORAGE_KEY];

  return storage?.getStore?.()?.h3Event?.req ?? null;
}

function getCurrentRequestSessionToken() {
  const request = getCurrentServerRequest();
  return readCookieValue(request?.headers.get("cookie") ?? null, SESSION_COOKIE_NAME);
}

export function createEnvironment(options?: { sessionToken?: string | null }): IEnvironment {
  const fetchGraphQL = createGraphQLFetch({
    apiUrl: resolveApiUrl(),
    getSessionToken: () => {
      if (options?.sessionToken !== undefined) {
        return options.sessionToken;
      }

      if (!isServer) {
        return null;
      }

      return getCurrentRequestSessionToken();
    },
  });

  const fetchFn: FetchFunction = async (params, variables) => {
    return await fetchGraphQL({
      text: params.text,
      variables,
    });
  };

  return new Environment({
    network: Network.create(fetchFn),
    store: new Store(new RecordSource()),
  });
}

export function getRelayEnvironment(): IEnvironment {
  if (!isServer) {
    if (!clientEnvironment) {
      clientEnvironment = createEnvironment();
    }

    return clientEnvironment;
  }

  const request = getCurrentServerRequest();
  if (!request) {
    return createEnvironment();
  }
  const existingEnvironment = requestEnvironmentCache.get(request);

  if (existingEnvironment) {
    return existingEnvironment;
  }

  const environment = createEnvironment();
  requestEnvironmentCache.set(request, environment);
  return environment;
}

export const relayEnvironment = createEnvironment();
