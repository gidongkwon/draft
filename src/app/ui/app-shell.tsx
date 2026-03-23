import type { ParentProps } from "solid-js";
import type { ViewerSummary } from "../../shared/auth/types";
import { AppIcon } from "../../shared/ui/app-icon";
import { Dropdown } from "../../shared/ui/dropdown";
import { Avatar } from "../../shared/ui/avatar";
import { Logo } from "../../shared/ui/logo";

const navigation = [
  { href: "/", label: "Timeline", icon: "home" },
  { href: "/notifications", label: "Notifications", icon: "notification" },
] as const;

type AppShellProps = ParentProps<{
  onNewPost?: () => void;
  onSignInClick?: () => void;
  onSignOut?: () => void;
  viewer?: ViewerSummary | null;
}>;

export function AppShell(props: AppShellProps) {
  return (
    <div class="min-h-screen px-3 py-3 text-[var(--text-primary)] sm:px-5 sm:py-5">
      <div class="mx-auto flex w-full max-w-[1440px] flex-col gap-4">
        <div class="grid gap-4 lg:grid-cols-[14rem_minmax(0,1fr)]">
          <aside class="flex flex-col gap-3">
            <a href="/" class="mb-3">
              <Logo />
            </a>
            {props.viewer ? (
              <Dropdown.Root class="flex">
                <Dropdown.Trigger
                  aria-label={`${props.viewer.name} ${props.viewer.handle}`}
                  class="focus-ring inline-flex grow-1 items-center gap-3 rounded-full border border-[var(--border-subtle)] bg-[var(--surface-muted)] px-2 py-2 transition hover:border-[var(--border-strong)] hover:bg-[rgb(255_255_255_/_0.06)]"
                >
                  <Avatar name={props.viewer.name} size="sm" src={props.viewer.avatarUrl} />
                  <div class="text-left">
                    <p class="text-sm font-medium text-[var(--text-primary)]">
                      {props.viewer.name}
                    </p>
                    <p class="text-xs text-[var(--text-muted)]">{props.viewer.handle}</p>
                  </div>
                </Dropdown.Trigger>
                <Dropdown.Content>
                  <Dropdown.Item onSelect={() => props.onSignOut?.()}>
                    <AppIcon class="text-lg" name="signOut" />
                    Log out
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown.Root>
            ) : (
              <button
                class="focus-ring inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border-subtle)] px-4 text-sm font-medium text-[var(--text-primary)]"
                type="button"
                onClick={() => props.onSignInClick?.()}
              >
                <AppIcon class="text-lg" name="signIn" />
                Sign in
              </button>
            )}
            <nav class="flex flex-col gap-1" aria-label="App navigation">
              {navigation.map((item) => (
                <a
                  class="focus-ring inline-flex items-center gap-2 rounded-lg border border-transparent hover:bg-surface-muted px-4 py-2 font-medium text-[var(--text-secondary)] transition hover:border-[var(--border-subtle)] hover:text-[var(--text-primary)]"
                  href={item.href}
                >
                  <AppIcon name={item.icon} />
                  {item.label}
                </a>
              ))}
            </nav>
          </aside>
          <main class="min-w-0">{props.children}</main>
        </div>
      </div>
    </div>
  );
}
