import { Moon, Sun } from "lucide-react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/Components/ui/dropdown-menu";
import { useTheme } from "@/hooks/useTheme";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";
import { ThemeEnum } from "@/types/enum";

export function ThemeToggle() {
    const { setTheme } = useTheme();
    const { toast } = useToast();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Toggle theme</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuItem
                    onClick={() => {
                        setTheme(ThemeEnum.LIGHT);
                        toast({
                            title: "Blinding Headlights! 🌞",
                            variant: "default",
                        });
                    }}
                >
                    Light
                </DropdownMenuItem>
                <DropdownMenuItem
                    onClick={() => {
                        setTheme(ThemeEnum.DARK);
                        toast({
                            title: "Hello Darkness! 👏",
                            variant: "default",
                        });
                    }}
                >
                    Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme(ThemeEnum.SYSTEM)}>
                    System
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
