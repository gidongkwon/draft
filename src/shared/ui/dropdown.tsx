import {
  Show,
  createContext,
  createEffect,
  createSignal,
  createUniqueId,
  onCleanup,
  splitProps,
  useContext,
  type Accessor,
  type JSX,
  type ParentProps,
} from "solid-js";

type DropdownContextValue = {
  contentId: string;
  open: Accessor<boolean>;
  rootRef: () => HTMLDivElement | undefined;
  setOpen: (value: boolean) => void;
  setRootRef: (element: HTMLDivElement) => void;
  toggle: () => void;
};

const DropdownContext = createContext<DropdownContextValue>();

function useDropdownContext() {
  const context = useContext(DropdownContext);

  if (!context) {
    throw new Error("Dropdown components must be used within Dropdown.Root");
  }

  return context;
}

function Root(props: ParentProps<{ class?: string }>) {
  const [open, setOpen] = createSignal(false);
  let rootElement: HTMLDivElement | undefined;
  const contentId = createUniqueId();

  createEffect(() => {
    if (!open()) {
      return;
    }

    const handleClick = (event: MouseEvent) => {
      const target = event.target;

      if (!(target instanceof Node)) {
        return;
      }

      if (rootElement?.contains(target)) {
        return;
      }

      setOpen(false);
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("click", handleClick);
    document.addEventListener("keydown", handleKeyDown);

    onCleanup(() => {
      document.removeEventListener("click", handleClick);
      document.removeEventListener("keydown", handleKeyDown);
    });
  });

  return (
    <DropdownContext.Provider
      value={{
        contentId,
        open,
        rootRef: () => rootElement,
        setOpen,
        setRootRef: (element) => {
          rootElement = element;
        },
        toggle: () => setOpen(!open()),
      }}
    >
      <div
        class={`relative inline-flex ${props.class ?? ""}`.trim()}
        ref={(element) => {
          rootElement = element;
        }}
      >
        {props.children}
      </div>
    </DropdownContext.Provider>
  );
}

function Trigger(props: ParentProps<JSX.ButtonHTMLAttributes<HTMLButtonElement>>) {
  const context = useDropdownContext();
  const [local, buttonProps] = splitProps(props, ["children", "class", "onClick"]);
  const onClick = local.onClick as JSX.EventHandler<HTMLButtonElement, MouseEvent> | undefined;

  return (
    <button
      aria-controls={context.open() ? context.contentId : undefined}
      aria-expanded={context.open()}
      aria-haspopup="menu"
      class={local.class}
      type="button"
      {...buttonProps}
      onClick={(event) => {
        onClick?.(event);

        if (!event.defaultPrevented) {
          context.toggle();
        }
      }}
    >
      {local.children}
    </button>
  );
}

function Content(props: ParentProps<{ class?: string }>) {
  const context = useDropdownContext();

  return (
    <Show when={context.open()}>
      <div
        class={
          props.class ??
          "absolute right-0 top-full z-30 mt-2 min-w-48 rounded-3xl border border-stroke-subtle bg-surface-panel p-2 shadow-panel backdrop-blur-[18px]"
        }
        id={context.contentId}
        role="menu"
      >
        {props.children}
      </div>
    </Show>
  );
}

function Item(props: ParentProps<{ class?: string; onSelect?: () => void }>) {
  const context = useDropdownContext();

  return (
    <button
      class={
        props.class ??
        "focus-ring inline-flex w-full items-center gap-2 rounded-2xl px-3 py-2 text-left text-sm font-medium text-fg-primary transition hover:bg-surface-subtle"
      }
      role="menuitem"
      type="button"
      onClick={() => {
        props.onSelect?.();
        context.setOpen(false);
      }}
    >
      {props.children}
    </button>
  );
}

export const Dropdown = {
  Root,
  Trigger,
  Content,
  Item,
};
