import Checkbox from "@/Components/Checkbox";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, useState } from "react";
import { z } from "zod";
import { Label } from "../../Components/ui/label";
import { Button } from "../../Components/ui/button";
import { Input } from "../../Components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import logoGoogleIcon from "@/assets/icons/logoGoogleIcon.svg";
import { LoginForm } from "@/types";
import { loginSchema } from "@/types/schema";
import { useToast } from "@/hooks/use-toast";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
    const { toast } = useToast();

    const { data, setData, post, processing, errors, reset } =
        useForm<LoginForm>({
            email: "",
            password: "",
            remember: false,
        });

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        try {
            await loginSchema.parseAsync(data);
            post(route("login"), {
                onFinish: () => reset("password"),
                onSuccess: () =>
                    toast({
                        title: `Login Success ✅`,
                        description: `Welcome ${data.email}`,
                    }),
                onError: () => {
                    Object.entries(errors).forEach(([key, message]) => {
                        toast({
                            title: "Registration Failed ⛔",
                            description: message,
                            variant: "destructive",
                        });
                    });
                },
            });
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    errors[err.path[0]] = err.message;
                });
                setLocalErrors(errors);
            } else {
                toast({
                    title: "Unexpected Error",
                    description:
                        "Something went wrong. Please try again later.",
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {status}
                </div>
            )}

            <div className="grid gap-6">
                <div className="grid gap-2 text-center">
                    <h1
                        className="text-3xl font-bold"
                        data-testid="login-title"
                    >
                        Login
                    </h1>
                    <p className="text-balance text-muted-foreground">
                        Enter your email below to login to your account
                    </p>
                </div>
                <form onSubmit={submit}>
                    <div className="grid gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="text"
                                name="email"
                                value={data.email}
                                autoComplete="email"
                                placeholder={"fauzan@gmail.com"}
                                autoFocus={true}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className={
                                    localErrors.email ? "border-red-500" : ""
                                }
                            />
                            {localErrors.email && (
                                <p className="text-red-500 text-sm">
                                    {localErrors.email}
                                </p>
                            )}
                        </div>
                        <div className="grid gap-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password">Password</Label>
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff className="h-[1.2rem] w-[1.2rem]" />
                                    ) : (
                                        <Eye className="h-[1.2rem] w-[1.2rem]" />
                                    )}
                                </Button>
                            </div>
                            <Input
                                id="password"
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={data.password}
                                autoComplete="current-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className={
                                    localErrors.password ? "border-red-500" : ""
                                }
                                // required
                            />
                            {localErrors.password && (
                                <p className="text-red-500 text-sm">
                                    {localErrors.password}
                                </p>
                            )}

                            <div className="flex items-center justify-between mt-1">
                                {canResetPassword && (
                                    <Link
                                        href={route("password.request")}
                                        className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:text-gray-400 dark:hover:text-gray-100 dark:focus:ring-offset-gray-800"
                                    >
                                        Forgot your password?
                                    </Link>
                                )}
                                <label>
                                    <Checkbox
                                        name="remember"
                                        checked={data.remember}
                                        onChange={(e) =>
                                            setData(
                                                "remember",
                                                e.target.checked
                                            )
                                        }
                                    />
                                    <span className="ms-2 text-sm text-gray-600 dark:text-gray-400">
                                        Remember me
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="flex flex-col justify-center items-center gap-1">
                            <Button
                                disabled={processing}
                                type="submit"
                                className="w-full"
                                data-testid="login-button"
                            >
                                Login
                            </Button>
                            {/* <p className="text-sm text-foreground">or</p>
                            <Button
                                disabled={processing}
                                variant={"secondary"}
                                className="w-full"
                            >
                                <img
                                    src={logoGoogleIcon}
                                    className="ml-1 h-auto max-h-6"
                                ></img>
                            </Button> */}
                        </div>
                    </div>
                </form>

                <div className="text-center text-sm">
                    Don&apos;t have an account?{" "}
                    <Link href={route("register")} className="underline">
                        Sign up
                    </Link>
                </div>
            </div>
        </GuestLayout>
    );
}
