import {
  createContext,
  createUniqueId,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
  type ParentProps,
} from "solid-js";

type TabsContextValue = {
  baseId: string;
  onValueChange: (value: string) => void;
  value: Accessor<string>;
};

const TabsContext = createContext<TabsContextValue>();

function useTabsContext() {
  const context = useContext(TabsContext);

  if (!context) {
    throw new Error("Tabs components must be used within Tabs.Root");
  }

  return context;
}

function Root(props: ParentProps<{ onValueChange: (value: string) => void; value: string }>) {
  const baseId = createUniqueId();

  return (
    <TabsContext.Provider
      value={{
        baseId,
        onValueChange: props.onValueChange,
        value: () => props.value,
      }}
    >
      {props.children}
    </TabsContext.Provider>
  );
}

function List(props: ParentProps<JSX.HTMLAttributes<HTMLDivElement>>) {
  const [local, others] = splitProps(props, ["children", "class", "onKeyDown"]);
  const onKeyDown = local.onKeyDown as JSX.EventHandler<HTMLDivElement, KeyboardEvent> | undefined;

  return (
    <div
      class={
        local.class ??
        "inline-flex items-center gap-1 rounded-full border border-stroke-subtle bg-surface-subtle p-1"
      }
      role="tablist"
      {...others}
      onKeyDown={(event) => {
        onKeyDown?.(event);

        if (event.defaultPrevented) {
          return;
        }

        const tabs = Array.from(
          event.currentTarget.querySelectorAll<HTMLButtonElement>('[role="tab"]:not(:disabled)'),
        );

        if (tabs.length === 0) {
          return;
        }

        const currentIndex = tabs.findIndex((tab) => tab === document.activeElement);

        if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
          event.preventDefault();
          const direction = event.key === "ArrowRight" ? 1 : -1;
          const nextIndex =
            currentIndex === -1 ? 0 : (currentIndex + direction + tabs.length) % tabs.length;
          tabs[nextIndex]?.focus();
          tabs[nextIndex]?.click();
        }

        if (event.key === "Home") {
          event.preventDefault();
          tabs[0]?.focus();
          tabs[0]?.click();
        }

        if (event.key === "End") {
          event.preventDefault();
          tabs.at(-1)?.focus();
          tabs.at(-1)?.click();
        }
      }}
    >
      {local.children}
    </div>
  );
}

type TriggerProps = ParentProps<
  Omit<JSX.ButtonHTMLAttributes<HTMLButtonElement>, "value"> & {
    value: string;
  }
>;

function Trigger(props: TriggerProps) {
  const context = useTabsContext();
  const [local, buttonProps] = splitProps(props, [
    "children",
    "class",
    "disabled",
    "onClick",
    "value",
  ]);
  const onClick = local.onClick as JSX.EventHandler<HTMLButtonElement, MouseEvent> | undefined;

  const isSelected = () => context.value() === local.value;
  const tabId = () => `${context.baseId}-${local.value}-tab`;

  return (
    <button
      aria-selected={isSelected()}
      class={
        local.class ??
        "focus-ring inline-flex h-10 items-center justify-center rounded-full px-4 text-sm font-medium text-fg-secondary transition disabled:cursor-not-allowed disabled:opacity-45 data-[selected=true]:border data-[selected=true]:border-stroke-subtle data-[selected=true]:bg-surface-panel data-[selected=true]:text-fg-primary"
      }
      data-selected={isSelected()}
      disabled={local.disabled}
      id={tabId()}
      role="tab"
      tabIndex={isSelected() ? 0 : -1}
      type="button"
      {...buttonProps}
      onClick={(event) => {
        onClick?.(event);

        if (event.defaultPrevented || local.disabled) {
          return;
        }

        context.onValueChange(local.value);
      }}
    >
      {local.children}
    </button>
  );
}

export const Tabs = {
  Root,
  List,
  Trigger,
};
