import { Show, createSignal } from "solid-js";
import Dismiss20Regular from "~icons/fluent/dismiss-20-regular";
import Key20Filled from "~icons/fluent/key-20-filled";
import PersonArrowLeft20Regular from "~icons/fluent/person-arrow-left-20-regular";
import { AppIcon } from "../../../shared/ui/app-icon";
import { Button } from "../../../shared/ui/button";
import { Surface } from "../../../shared/ui/surface";
import { TextField } from "../../../shared/ui/text-field";

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
        <Surface
          as="section"
          aria-label="Sign in"
          class="w-full max-w-md"
          padding="lg"
          variant="floating"
        >
          <div class="flex items-start justify-between gap-4">
            <div>
              <p class="token-eyebrow">Authentication</p>
              <h2 class="token-title mt-2 text-2xl">Sign in</h2>
            </div>
            <Button
              aria-label="Close sign in"
              size="sm"
              variant="subtle"
              onClick={() => props.onClose?.()}
            >
              <AppIcon icon={Dismiss20Regular} size="sm" />
              Close
            </Button>
          </div>

          <Show when={step() === "identifier"}>
            <div class="mt-6 grid gap-4">
              <label class="grid gap-2 text-sm text-fg-secondary">
                <span>Email or username</span>
                <TextField
                  type="text"
                  value={identifier()}
                  onInput={(event) => setIdentifier(event.currentTarget.value)}
                />
              </label>
              <Button
                disabled={loading() || identifier().trim().length === 0}
                onClick={onRequestChallenge}
              >
                <AppIcon icon={PersonArrowLeft20Regular} size="sm" />
                {loading() ? "Requesting..." : "Sign in"}
              </Button>
            </div>
          </Show>

          <Show when={step() === "code"}>
            <div class="mt-6 grid gap-4">
              <label class="grid gap-2 text-sm text-fg-secondary">
                <span>Verification code</span>
                <TextField
                  class="uppercase"
                  type="text"
                  value={code()}
                  onInput={(event) => setCode(event.currentTarget.value.toUpperCase())}
                />
              </label>
              <Button disabled={loading() || code().trim().length === 0} onClick={onCompleteSignIn}>
                <AppIcon icon={Key20Filled} size="sm" />
                {loading() ? "Completing..." : "Complete sign in"}
              </Button>
            </div>
          </Show>

          <Show when={error()}>
            <p class="mt-4 text-sm text-red-700">{error()}</p>
          </Show>
        </Surface>
      </div>
    </Show>
  );
}
