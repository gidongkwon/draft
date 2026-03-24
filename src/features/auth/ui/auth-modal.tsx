import { Show, createSignal } from "solid-js";
import Dismiss20Regular from "~icons/fluent/dismiss-20-regular";
import Key20Filled from "~icons/fluent/key-20-filled";
import PersonArrowLeft20Regular from "~icons/fluent/person-arrow-left-20-regular";
import { AppIcon } from "../../../shared/ui/app-icon";

type ChallengeResult =
  | {
      ok: true;
      token: string;
    }
  | {
      ok: false;
      reason: string;
    };

type CompleteResult =
  | {
      ok: true;
    }
  | {
      ok: false;
      reason: string;
    };

type AuthModalProps = {
  open: boolean;
  onClose?: () => void;
  onSignedIn?: () => void;
  requestChallenge: (input: { identifier: string }) => Promise<ChallengeResult>;
  completeSignIn: (input: { code: string; token: string }) => Promise<CompleteResult | void>;
};

export function AuthModal(props: AuthModalProps) {
  const [identifier, setIdentifier] = createSignal("");
  const [code, setCode] = createSignal("");
  const [error, setError] = createSignal<string | null>(null);
  const [loading, setLoading] = createSignal(false);
  const [step, setStep] = createSignal<"identifier" | "code">("identifier");
  const [token, setToken] = createSignal<string | null>(null);

  async function onRequestChallenge() {
    if (!identifier().trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await props.requestChallenge({
        identifier: identifier().trim(),
      });

      if (!result.ok) {
        setError("Could not start sign-in.");
        return;
      }

      setToken(result.token);
      setStep("code");
    } catch {
      setError("Could not start sign-in.");
    } finally {
      setLoading(false);
    }
  }

  async function onCompleteSignIn() {
    const currentToken = token();
    if (!currentToken || !code().trim()) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await props.completeSignIn({
        code: code().trim(),
        token: currentToken,
      });

      if (result && !result.ok) {
        setError("Could not complete sign-in.");
        return;
      }

      props.onSignedIn?.();
      props.onClose?.();
    } catch {
      setError("Could not complete sign-in.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Show when={props.open}>
      <div class="fixed inset-0 z-50 flex items-center justify-center bg-black/55 px-4 py-6">
        <section
          aria-label="Sign in"
          class="shell-surface w-full max-w-md rounded-[1.75rem] px-5 py-5 sm:px-6"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="text-[11px] font-semibold tracking-[0.24em] text-[var(--text-muted)]">
                Authentication
              </p>
              <h2 class="mt-2 text-2xl font-semibold tracking-[-0.04em] text-[var(--text-primary)]">
                Sign in
              </h2>
            </div>
            <button
              aria-label="Close sign in"
              class="focus-ring inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] px-3 py-2 text-sm text-[var(--text-secondary)]"
              type="button"
              onClick={() => props.onClose?.()}
            >
              <AppIcon icon={Dismiss20Regular} size="sm" />
              Close
            </button>
          </div>

          <Show when={step() === "identifier"}>
            <div class="mt-6 grid gap-4">
              <label class="grid gap-2 text-sm text-[var(--text-secondary)]">
                <span>Email or username</span>
                <input
                  class="focus-ring h-12 rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 text-[var(--text-primary)]"
                  type="text"
                  value={identifier()}
                  onInput={(event) => setIdentifier(event.currentTarget.value)}
                />
              </label>
              <button
                class="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--accent-soft)] px-4 text-sm font-medium text-[var(--text-primary)]"
                disabled={loading() || identifier().trim().length === 0}
                type="button"
                onClick={onRequestChallenge}
              >
                <AppIcon icon={PersonArrowLeft20Regular} size="sm" />
                {loading() ? "Requesting..." : "Sign in"}
              </button>
            </div>
          </Show>

          <Show when={step() === "code"}>
            <div class="mt-6 grid gap-4">
              <label class="grid gap-2 text-sm text-[var(--text-secondary)]">
                <span>Verification code</span>
                <input
                  class="focus-ring h-12 rounded-[1rem] border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-4 uppercase text-[var(--text-primary)]"
                  type="text"
                  value={code()}
                  onInput={(event) => setCode(event.currentTarget.value.toUpperCase())}
                />
              </label>
              <button
                class="focus-ring inline-flex h-11 items-center justify-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--accent-soft)] px-4 text-sm font-medium text-[var(--text-primary)]"
                disabled={loading() || code().trim().length === 0}
                type="button"
                onClick={onCompleteSignIn}
              >
                <AppIcon icon={Key20Filled} size="sm" />
                {loading() ? "Completing..." : "Complete sign in"}
              </button>
            </div>
          </Show>

          <Show when={error()}>
            <p class="mt-4 text-sm text-red-700">{error()}</p>
          </Show>
        </section>
      </div>
    </Show>
  );
}
