import { cva, type VariantProps } from "class-variance-authority";
import { splitProps, type JSX } from "solid-js";
import { cx } from "./styles";

const textFieldVariants = cva(
  "focus-ring w-full rounded-2xl border bg-surface-subtle text-fg-primary placeholder:text-fg-muted transition",
  {
    defaultVariants: {
      invalid: false,
      size: "md",
    },
    variants: {
      invalid: {
        false: "border-stroke-subtle hover:border-stroke-strong",
        true: "border-danger-border text-fg-primary",
      },
      size: {
        sm: "h-10 px-3 text-sm",
        md: "h-11 px-4 text-sm",
        lg: "h-12 px-4 text-base",
      },
    },
  },
);

type TextFieldProps = Omit<JSX.InputHTMLAttributes<HTMLInputElement>, "size"> &
  VariantProps<typeof textFieldVariants>;

export function TextField(props: TextFieldProps) {
  const [local, others] = splitProps(props, ["class", "invalid", "size"]);

  return (
    <input
      class={cx(textFieldVariants({ invalid: local.invalid, size: local.size }), local.class)}
      data-invalid={local.invalid ? "true" : "false"}
      data-size={local.size ?? "md"}
      {...others}
    />
  );
}
