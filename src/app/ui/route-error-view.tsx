import type { ErrorComponentProps } from "@tanstack/solid-router";

type RouteErrorViewProps = Pick<ErrorComponentProps, "error">;

export function RouteErrorView(props: RouteErrorViewProps) {
  const message =
    props.error instanceof Error
      ? props.error.message
      : "Refresh the page or return to the feed and try again.";

  return (
    <section class="mx-auto flex min-h-[60vh] max-w-2xl flex-col justify-center px-6 py-16 text-center">
      <p class="text-sm tracking-[0.24em] text-red-600">Something went wrong</p>
      <h1 class="mt-4 font-code text-4xl">This view could not be loaded.</h1>
      <p class="mt-4 text-sm text-stone-600">{message}</p>
      <a
        class="mt-6 inline-flex justify-center text-sm font-medium text-amber-700 underline"
        href="/"
      >
        Return to the feed
      </a>
    </section>
  );
}
