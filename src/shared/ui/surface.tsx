import { cva, type VariantProps } from "class-variance-authority";
import { splitProps, type JSX, type ParentProps } from "solid-js";
import { Dynamic } from "solid-js/web";
import { cx } from "./styles";

const surfaceVariants = cva("rounded-3xl border text-fg-primary shadow-panel", {
  defaultVariants: {
    padding: "md",
    variant: "panel",
  },
  variants: {
    padding: {
      none: "",
      sm: "p-3",
      md: "p-4 sm:p-5",
      lg: "p-5 sm:p-6",
    },
    variant: {
      panel: "border-stroke-subtle bg-surface-panel",
      floating: "border-stroke-subtle bg-surface-glass backdrop-blur-[22px]",
      quiet: "border-stroke-subtle bg-surface-subtle shadow-none",
    },
  },
});

type SurfaceProps = ParentProps<
  JSX.HTMLAttributes<HTMLElement> &
    VariantProps<typeof surfaceVariants> & {
      as?: keyof JSX.IntrinsicElements;
      interactive?: boolean;
    }
>;

export function Surface(props: SurfaceProps) {
  const [local, others] = splitProps(props, [
    "as",
    "children",
    "class",
    "interactive",
    "padding",
    "variant",
  ]);

  return (
    <Dynamic
      component={local.as ?? "div"}
      class={cx(
        surfaceVariants({ padding: local.padding, variant: local.variant }),
        local.interactive && "transition hover:border-stroke-strong hover:bg-surface-raised",
        local.class,
      )}
      data-padding={local.padding ?? "md"}
      data-variant={local.variant ?? "panel"}
      {...others}
    >
      {local.children}
    </Dynamic>
  );
}
