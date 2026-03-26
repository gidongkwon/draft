import {
  createContext,
  createEffect,
  createSignal,
  onMount,
  useContext,
  type Accessor,
  type ParentProps,
} from "solid-js";

export type Theme = "dark" | "light";

type ThemeContextValue = {
  setTheme: (theme: Theme) => void;
  theme: Accessor<Theme>;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue>();

const STORAGE_KEY = "draft-theme";

export function ThemeProvider(props: ParentProps) {
  const [theme, setTheme] = createSignal<Theme>("dark");

  onMount(() => {
    const storedTheme = window.localStorage.getItem(STORAGE_KEY);

    if (storedTheme === "dark" || storedTheme === "light") {
      setTheme(storedTheme);
    }
  });

  createEffect(() => {
    const nextTheme = theme();

    document.documentElement.dataset.theme = nextTheme;
    window.localStorage.setItem(STORAGE_KEY, nextTheme);
  });

  return (
    <ThemeContext.Provider
      value={{
        setTheme,
        theme,
        toggleTheme: () => setTheme((current) => (current === "dark" ? "light" : "dark")),
      }}
    >
      {props.children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error("Theme hooks must be used within ThemeProvider");
  }

  return context;
}
