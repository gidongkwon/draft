import type { JSX } from "solid-js";
import Search20Regular from "~icons/fluent/search-20-regular";
import Add24Filled from "~icons/fluent/add-24-filled";
import { AppIcon } from "../../shared/ui/app-icon";
import { Button } from "../../shared/ui/button";
import { Logo } from "../../shared/ui/logo";
import { TextField } from "../../shared/ui/text-field";

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
              class="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-lg text-fg-muted"
              icon={Search20Regular}
              size="lg"
            />
            <TextField
              id="global-search"
              class="min-w-0 rounded-full pl-11 pr-4"
              placeholder="Search"
              type="search"
            />
          </div>
          <Button onClick={() => props.onNewPost?.()}>
            <AppIcon icon={Add24Filled} size="lg" />
            New post
          </Button>
        </div>

        {props.actions}
      </div>
    </header>
  );
}
