import { Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";

type AvatarSize = "sm" | "md" | "lg";

type AvatarProps = {
  alt?: string;
  class?: string;
  name: string;
  size: AvatarSize;
  src?: string | null;
};

const sizeClassMap: Record<AvatarSize, string> = {
  sm: "h-9 w-9 text-xs",
  md: "h-11 w-11 text-sm",
  lg: "h-18 w-18 text-lg sm:h-20 sm:w-20",
};

function toInitials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);

  if (parts.length === 0) {
    return "?";
  }

  if (parts.length === 1) {
    return parts[0].slice(0, 1).toUpperCase();
  }

  return `${parts[0].slice(0, 1)}${parts[1].slice(0, 1)}`.toUpperCase();
}

export function Avatar(props: AvatarProps) {
  let imageRef: HTMLImageElement | undefined;
  const [failed, setFailed] = createSignal(false);
  const hasImage = createMemo(() => Boolean(props.src) && !failed());
  const initials = createMemo(() => toInitials(props.name));
  const alt = () => props.alt ?? `${props.name} avatar`;
  const sizeClass = () => sizeClassMap[props.size];

  createEffect(() => {
    const src = props.src;

    setFailed(false);

    if (!src) {
      return;
    }

    if (imageRef && imageRef.complete && imageRef.naturalWidth === 0) {
      setFailed(true);
      return;
    }

    let active = true;
    const probe = new Image();

    probe.onload = () => {
      if (active) {
        setFailed(false);
      }
    };

    probe.onerror = () => {
      if (active) {
        setFailed(true);
      }
    };

    probe.src = src;

    onCleanup(() => {
      active = false;
      probe.onload = null;
      probe.onerror = null;
    });
  });

  return (
    <Show
      when={hasImage()}
      fallback={
        <span
          aria-hidden="true"
          class={`inline-flex shrink-0 items-center justify-center rounded-full bg-[var(--accent-soft)] font-semibold tracking-[0.08em] text-[var(--text-primary)] ${sizeClass()} ${props.class ?? ""}`}
        >
          {initials()}
        </span>
      }
    >
      <img
        alt={alt()}
        class={`shrink-0 rounded-full object-cover ${sizeClass()} ${props.class ?? ""}`}
        ref={(element) => {
          imageRef = element;
        }}
        src={props.src!}
        on:error={() => setFailed(true)}
      />
    </Show>
  );
}
