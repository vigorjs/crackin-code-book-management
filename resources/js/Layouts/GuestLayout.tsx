import ApplicationLogo from "@/Components/ApplicationLogo";
import { ThemeToggle } from "@/Components/ThemeToggle";
import { PropsWithChildren } from "react";

export default function Guest({
    children,
    imageBackground,
}: PropsWithChildren<{ imageBackground?: string }>) {
    return (
        <div className="w-full h-screen lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-[800px]">
            <div className="flex items-center justify-center">
                <div className="mx-auto grid w-[350px] gap-3">
                    <div className="flex flex-col justify-center items-center">
                        <ApplicationLogo className="h-20 w-20 fill-current text-gray-500" />
                        <ThemeToggle />
                    </div>
                    {children}
                </div>
            </div>
            <div className="hidden bg-muted lg:block">
                <img
                    src={
                        imageBackground
                            ? imageBackground
                            : "https://placehold.co/1920x1080?text=Your+Brand+Here"
                    }
                    alt="Image"
                    width="1920"
                    height="1080"
                    className="h-full w-full object-cover dark:brightness-[0.2] dark:grayscale"
                />
            </div>
        </div>
    );
}
