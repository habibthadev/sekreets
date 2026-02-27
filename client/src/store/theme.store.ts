import { create } from "zustand";

export type Theme = "dark" | "light" | "system";

interface ThemeStore {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  resolvedTheme: "dark" | "light";
}

const getSystemTheme = (): "dark" | "light" =>
  window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";

const applyTheme = (theme: Theme): "dark" | "light" => {
  const resolved = theme === "system" ? getSystemTheme() : theme;
  const root = document.documentElement;
  root.classList.remove("dark", "light");
  root.classList.add(resolved);
  return resolved;
};

const storedTheme = (localStorage.getItem("sekreets-theme") as Theme) ?? "dark";

export const useThemeStore = create<ThemeStore>((set) => ({
  theme: storedTheme,
  resolvedTheme: applyTheme(storedTheme),
  setTheme: (theme) => {
    localStorage.setItem("sekreets-theme", theme);
    const resolved = applyTheme(theme);
    set({ theme, resolvedTheme: resolved });
  },
}));
