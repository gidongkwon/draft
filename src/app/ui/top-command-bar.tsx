import type { JSX } from "solid-js";
import Search20Regular from "~icons/fluent/search-20-regular";
import Add24Filled from "~icons/fluent/add-24-filled";
import { AppIcon } from "../../shared/ui/app-icon";
import { Logo } from "../../shared/ui/logo";

type TopCommandBarProps = {
  actions?: JSX.Element;
  onNewPost?: () => void;
  onSignInClick?: () => void;
  onSignOut?: () => void;
};

export function TopCommandBar(props: TopCommandBarProps) {
  return (
    <header class="top-3 z-20 rounded-[1.5rem] sm:px-5">
      <div class="flex flex-col gap-4 lg:flex-row lg:items-center lg:gap-5">
        <a href="/">
          <Logo />
        </a>
        <div class="flex min-w-0 flex-1 items-center gap-3">
          <div class="relative min-w-0 flex-1">
            <label class="sr-only" for="global-search">
              Search the network
            </label>
            <AppIcon
              class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-[var(--text-muted)]"
              icon={Search20Regular}
              size="lg"
            />
            <input
              id="global-search"
              type="search"
              placeholder="Search"
              class="focus-ring h-11 min-w-0 w-full rounded-full border border-[var(--border-subtle)] bg-[var(--surface-muted)] pl-11 pr-4 text-sm text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
            />
          </div>
          <button
            class="focus-ring inline-flex h-11 items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--accent-soft)] px-4 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--border-strong)] hover:bg-[var(--accent-soft)]"
            type="button"
            onClick={() => props.onNewPost?.()}
          >
            <AppIcon icon={Add24Filled} size="lg" />
            New post
          </button>
        </div>

        {props.actions}
      </div>
    </header>
  );
}
