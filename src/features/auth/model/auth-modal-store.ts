import { createStore } from "solid-js/store";

export type PendingAuthAction = {
  type: "new-post";
} | null;

export function createAuthModalStore() {
  const [state, setState] = createStore({
    error: null as string | null,
    identifier: "",
    open: false,
    pendingAction: null as PendingAuthAction,
    step: "identifier" as "identifier" | "code",
    token: null as string | null,
  });

  return {
    setState,
    state,
    close() {
      setState({
        error: null,
        open: false,
        pendingAction: null,
      });
    },
    openDirectly() {
      setState({
        error: null,
        open: true,
        pendingAction: null,
        step: "identifier",
        token: null,
      });
    },
    openForAction(action: Exclude<PendingAuthAction, null>) {
      setState({
        error: null,
        open: true,
        pendingAction: action,
        step: "identifier",
        token: null,
      });
    },
  };
}
