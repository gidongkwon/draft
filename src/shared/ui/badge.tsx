import { cva, type VariantProps } from "class-variance-authority";
import { splitProps, type JSX, type ParentProps } from "solid-js";
import { cx } from "./styles";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border font-medium tracking-[0.02em]",
  {
    defaultVariants: {
      size: "md",
      tone: "neutral",
    },
    variants: {
      size: {
        sm: "h-6 px-2.5 text-[11px]",
        md: "h-7 px-3 text-xs",
      },
      tone: {
        neutral: "border-stroke-subtle bg-surface-subtle text-fg-secondary",
        accent: "border-stroke-accent bg-accent-soft text-accent-strong",
        success: "border-success-border bg-success-soft text-success-fg",
      },
    },
  },
);

type BadgeProps = ParentProps<
  JSX.HTMLAttributes<HTMLSpanElement> & VariantProps<typeof badgeVariants>
>;

export function Badge(props: BadgeProps) {
  const [local, others] = splitProps(props, ["children", "class", "size", "tone"]);

  return (
    <span
      class={cx(badgeVariants({ size: local.size, tone: local.tone }), local.class)}
      data-size={local.size ?? "md"}
      data-tone={local.tone ?? "neutral"}
      {...others}
    >
      {local.children}
    </span>
  );
}
