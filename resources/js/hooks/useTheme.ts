import { ThemeProviderContext } from "@/context/ThemeProvider";
import { ThemeContextType } from "@/types";
import { useContext } from "react";

export const useTheme = (): ThemeContextType => {
    const context = useContext<ThemeContextType>(ThemeProviderContext);
    if (context === undefined) {
        throw new Error("useTheme must be used within a ThemeProvider");
    }
    return context;
};
