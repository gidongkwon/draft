import { Surface } from "../../shared/ui/surface";

type RouteErrorViewProps = {
  error: unknown;
};

export function RouteErrorView(props: RouteErrorViewProps) {
  const message =
    props.error instanceof Error
      ? props.error.message
      : "Refresh the page or return to the feed and try again.";

  return (
    <Surface
      as="section"
      class="mx-auto mt-12 flex min-h-[40vh] max-w-2xl flex-col justify-center text-center"
      padding="lg"
      variant="floating"
    >
      <p class="text-sm tracking-[0.24em] text-danger-fg">Something went wrong</p>
      <h1 class="mt-4 font-code text-4xl text-fg-primary">This view could not be loaded.</h1>
      <p class="mt-4 text-sm text-fg-secondary">{message}</p>
      <a
        class="mt-6 inline-flex justify-center text-sm font-medium text-accent-strong underline"
        href="/"
      >
        Return to the feed
      </a>
    </Surface>
  );
}
