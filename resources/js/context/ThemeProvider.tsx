import { ThemeContextType, ThemeProviderProps } from "@/types";
import { ThemeEnum } from "@/types/enum";
import { createContext, PropsWithChildren, useEffect, useState } from "react";

export const ThemeProviderContext = createContext<ThemeContextType>({
    theme: ThemeEnum.SYSTEM,
    setTheme: () => null,
});

export function ThemeProvider({
    children,
    defaultTheme = ThemeEnum.SYSTEM,
    storageKey = "vite-ui-theme",
    ...props
}: PropsWithChildren<ThemeProviderProps>) {
    const [theme, setThemeState] = useState<ThemeEnum>(() => {
        const savedTheme = sessionStorage.getItem(storageKey);
        return savedTheme &&
            Object.values(ThemeEnum).includes(savedTheme as ThemeEnum)
            ? (savedTheme as ThemeEnum)
            : defaultTheme;
    });

    useEffect(() => {
        const root = window.document.documentElement;
        root.classList.remove("light", "dark");

        if (theme === ThemeEnum.SYSTEM) {
            const systemTheme = window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches
                ? ThemeEnum.DARK
                : ThemeEnum.LIGHT;
            root.classList.add(systemTheme);
        } else {
            root.classList.add(theme);
        }
    }, [theme]);

    const setTheme = (newTheme: ThemeEnum): void => {
        sessionStorage.setItem(storageKey, newTheme);
        setThemeState(newTheme);
    };

    const value = {
        theme,
        setTheme,
    };

    return (
        <ThemeProviderContext.Provider value={value} {...props}>
            {children}
        </ThemeProviderContext.Provider>
    );
}
