import { Show, createEffect, createMemo, createSignal, onCleanup } from "solid-js";
import { cva } from "class-variance-authority";
import { cx } from "./styles";

type AvatarSize = "sm" | "md" | "lg";

type AvatarProps = {
  alt?: string;
  class?: string;
  name: string;
  size: AvatarSize;
  src?: string | null;
};

const avatarVariants = cva("shrink-0 rounded-full border border-stroke-subtle object-cover", {
  variants: {
    size: {
      sm: "size-9 text-xs",
      md: "size-11 text-sm",
      lg: "size-18 text-lg sm:size-20",
    },
  },
});

const fallbackVariants = cva(
  "inline-flex shrink-0 items-center justify-center rounded-full border border-stroke-subtle bg-accent-soft font-semibold tracking-[0.08em] text-fg-primary",
  {
    variants: {
      size: {
        sm: "size-9 text-xs",
        md: "size-11 text-sm",
        lg: "size-18 text-lg sm:size-20",
      },
    },
  },
);

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
        <span aria-hidden="true" class={cx(fallbackVariants({ size: props.size }), props.class)}>
          {initials()}
        </span>
      }
    >
      <img
        alt={alt()}
        class={cx(avatarVariants({ size: props.size }), props.class)}
        ref={(element) => {
          imageRef = element;
        }}
        src={props.src!}
        on:error={() => setFailed(true)}
      />
    </Show>
  );
}
