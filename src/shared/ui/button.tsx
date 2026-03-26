import { cva, type VariantProps } from "class-variance-authority";
import { splitProps, type JSX } from "solid-js";
import { cx } from "./styles";

const buttonVariants = cva(
  "focus-ring inline-flex items-center justify-center gap-2 rounded-full border font-medium transition disabled:pointer-events-none disabled:opacity-45",
  {
    defaultVariants: {
      size: "md",
      variant: "primary",
    },
    variants: {
      size: {
        sm: "h-9 px-3 text-sm",
        md: "h-11 px-4 text-sm",
        lg: "h-12 px-5 text-base",
        icon: "size-11 p-0",
      },
      variant: {
        primary:
          "border-stroke-accent bg-accent-soft text-fg-primary hover:border-accent-solid hover:bg-accent-soft-hover",
        secondary:
          "border-stroke-subtle bg-surface-subtle text-fg-primary hover:border-stroke-strong hover:bg-surface-raised",
        ghost:
          "border-transparent bg-transparent text-fg-secondary hover:border-stroke-subtle hover:bg-surface-subtle hover:text-fg-primary",
        subtle:
          "border-stroke-subtle bg-transparent text-fg-secondary hover:border-stroke-strong hover:text-fg-primary",
        danger:
          "border-danger-border bg-danger-soft text-danger-fg hover:border-danger-border-hover",
      },
    },
  },
);

type ButtonProps = JSX.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants>;

export function Button(props: ButtonProps) {
  const [local, others] = splitProps(props, ["children", "class", "size", "type", "variant"]);

  return (
    <button
      class={cx(buttonVariants({ size: local.size, variant: local.variant }), local.class)}
      data-size={local.size ?? "md"}
      data-variant={local.variant ?? "primary"}
      type={local.type ?? "button"}
      {...others}
    >
      {local.children}
    </button>
  );
}
