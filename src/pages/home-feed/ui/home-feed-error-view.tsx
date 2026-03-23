import type { ErrorComponentProps } from "@tanstack/solid-router";

type HomeFeedErrorViewProps = Pick<ErrorComponentProps, "error">;

export function HomeFeedErrorView(props: HomeFeedErrorViewProps) {
  const message =
    props.error instanceof Error
      ? props.error.message
      : "Refresh the page or return to the feed and try again.";

  return (
    <section class="mt-12">
      <h1 class="font-code italic text-3xl text-[var(--text-primary)]">
        The timeline could not be loaded.
      </h1>
      <p class="mt-4 text-sm leading-7 text-[var(--text-secondary)]">{message}</p>
      <a
        class="mt-6 inline-flex justify-center text-sm font-medium text-[var(--accent-strong)] underline"
        href="/"
      >
        Return to the feed
      </a>
    </section>
  );
}
