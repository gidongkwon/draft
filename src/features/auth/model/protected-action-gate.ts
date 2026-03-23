type ProtectedAction = {
  type: "new-post";
};

export function createProtectedActionGate(options: {
  isAuthenticated: () => boolean;
  openAuth: (action: ProtectedAction) => void;
}) {
  let pendingContinuation: null | (() => void) = null;

  return {
    resume() {
      const continuation = pendingContinuation;
      pendingContinuation = null;
      continuation?.();
    },
    run(action: ProtectedAction, continuation: () => void) {
      if (options.isAuthenticated()) {
        continuation();
        return;
      }

      pendingContinuation = continuation;
      options.openAuth(action);
    },
  };
}
