import { cva, type VariantProps } from "class-variance-authority";
import { splitProps, type JSX } from "solid-js";
import { cx } from "./styles";

const textAreaVariants = cva(
  "focus-ring w-full resize-none rounded-3xl border bg-surface-subtle text-fg-primary placeholder:text-fg-muted transition",
  {
    defaultVariants: {
      invalid: false,
      size: "md",
    },
    variants: {
      invalid: {
        false: "border-stroke-subtle hover:border-stroke-strong",
        true: "border-danger-border",
      },
      size: {
        sm: "min-h-24 px-4 py-3 text-sm leading-6",
        md: "min-h-28 px-5 py-4 text-sm leading-7",
        lg: "min-h-32 px-5 py-4 text-base leading-7",
      },
    },
  },
);

type TextAreaProps = Omit<JSX.TextareaHTMLAttributes<HTMLTextAreaElement>, "size"> &
  VariantProps<typeof textAreaVariants>;

export function TextArea(props: TextAreaProps) {
  const [local, others] = splitProps(props, ["class", "invalid", "size"]);

  return (
    <textarea
      class={cx(textAreaVariants({ invalid: local.invalid, size: local.size }), local.class)}
      data-invalid={local.invalid ? "true" : "false"}
      data-size={local.size ?? "md"}
      {...others}
    />
  );
}
