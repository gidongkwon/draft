import type { ParentProps } from "solid-js";
import Alert20Regular from "~icons/fluent/alert-20-regular";
import Home24Regular from "~icons/fluent/home-24-regular";
import PersonArrowLeft20Regular from "~icons/fluent/person-arrow-left-20-regular";
import PersonArrowRight20Regular from "~icons/fluent/person-arrow-right-20-regular";
import type { ViewerSummary } from "../../shared/auth/types";
import { AppIcon } from "../../shared/ui/app-icon";
import { Button } from "../../shared/ui/button";
import { Dropdown } from "../../shared/ui/dropdown";
import { Avatar } from "../../shared/ui/avatar";
import { Logo } from "../../shared/ui/logo";

const navigation = [
  { href: "/", label: "Timeline", icon: Home24Regular, iconName: "home" },
  {
    href: "/notifications",
    label: "Notifications",
    icon: Alert20Regular,
    iconName: "notification",
  },
] as const;

type AppShellProps = ParentProps<{
  onNewPost?: () => void;
  onSignInClick?: () => void;
  onSignOut?: () => void;
  viewer?: ViewerSummary | null;
}>;

export function AppShell(props: AppShellProps) {
  return (
    <div class="min-h-screen px-3 py-3 text-fg-primary sm:px-5 sm:py-5">
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
                  class="focus-ring inline-flex grow-1 items-center gap-3 rounded-full border border-stroke-subtle bg-surface-subtle px-2 py-2 transition hover:border-stroke-strong hover:bg-surface-raised"
                >
                  <Avatar name={props.viewer.name} size="sm" src={props.viewer.avatarUrl} />
                  <div class="text-left">
                    <p class="text-sm font-medium text-fg-primary">{props.viewer.name}</p>
                    <p class="font-code text-xs text-fg-muted">{props.viewer.handle}</p>
                  </div>
                </Dropdown.Trigger>
                <Dropdown.Content>
                  <Dropdown.Item onSelect={() => props.onSignOut?.()}>
                    <AppIcon icon={PersonArrowRight20Regular} size="lg" />
                    Log out
                  </Dropdown.Item>
                </Dropdown.Content>
              </Dropdown.Root>
            ) : (
              <Button variant="secondary" onClick={() => props.onSignInClick?.()}>
                <AppIcon icon={PersonArrowLeft20Regular} size="lg" />
                Sign in
              </Button>
            )}
            <nav class="flex flex-col gap-1" aria-label="App navigation">
              {navigation.map((item) => (
                <a
                  class="focus-ring inline-flex items-center gap-2 rounded-xl border border-transparent px-4 py-2 font-medium text-fg-secondary transition hover:border-stroke-subtle hover:bg-surface-subtle hover:text-fg-primary"
                  href={item.href}
                >
                  <AppIcon icon={item.icon} />
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
