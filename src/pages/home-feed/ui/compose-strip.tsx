import Image20Regular from "~icons/fluent/image-20-regular";
import Send20Filled from "~icons/fluent/send-20-filled";
import { AppIcon } from "../../../shared/ui/app-icon";

export function ComposeStrip() {
  return (
    <section>
      <div class="flex flex-col gap-4  border border-[var(--border-subtle)] bg-[var(--surface-muted)] rounded-[1.25rem] p-4">
        <label class="sr-only" for="compose-entry">
          Share your thoughts
        </label>
        <textarea
          id="compose-entry"
          rows={3}
          class="focus-ring min-h-28 grow-1 resize-none rounded-[1.25rem] -m-4 px-6 py-4 text-sm leading-7 text-[var(--text-primary)] placeholder:text-[var(--text-muted)]"
          placeholder="Share your thoughts"
        />
        <div class="flex items-center justify-between gap-3">
          <div>
            <button aria-label="Add image" class="p-2" type="button">
              <AppIcon icon={Image20Regular} size="lg" />
            </button>
          </div>
          <button
            aria-label="Publish"
            class="focus-ring inline-flex items-center gap-2 rounded-full border border-[var(--border-subtle)] bg-[var(--accent-soft)] px-4 py-2 text-sm font-medium text-[var(--text-primary)] transition hover:border-[var(--border-strong)]"
            type="button"
          >
            <AppIcon icon={Send20Filled} size="sm" />
          </button>
        </div>
      </div>
    </section>
  );
}
