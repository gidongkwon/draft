import { cva } from "class-variance-authority";
import type { Component, JSX } from "solid-js";

const iconVariants = cva("shrink-0 fill-current", {
  defaultVariants: {
    size: "md",
  },
  variants: {
    size: {
      xs: "size-3.5",
      sm: "size-4",
      md: "size-5",
      lg: "size-6",
    },
  },
});

export type AppIconSize = "xs" | "sm" | "md" | "lg";

type AppIconComponent = Component<JSX.SvgSVGAttributes<SVGSVGElement>>;

type AppIconProps = {
  class?: string;
  icon: AppIconComponent;
  label?: string;
  size?: AppIconSize;
};

export function AppIcon(props: AppIconProps) {
  const Icon = props.icon;

  return (
    <span class={`inline-flex shrink-0 align-middle ${props.class ?? ""}`}>
      <Icon
        aria-hidden={props.label ? undefined : true}
        aria-label={props.label}
        class={iconVariants({ size: props.size })}
        role={props.label ? "img" : undefined}
      />
    </span>
  );
}
