import InputError from "@/Components/InputError";
import { Button } from "@/Components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { toast, useToast } from "@/hooks/use-toast";
import GuestLayout from "@/Layouts/GuestLayout";
import { RegisterForm } from "@/types";
import { registerSchema } from "@/types/schema";
import { Head, Link, useForm, usePage } from "@inertiajs/react";
import { FormEventHandler, useEffect, useState } from "react";
import { z } from "zod";

export default function Register() {
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
    const { toast } = useToast();

    const { data, setData, post, processing, errors, reset } =
        useForm<RegisterForm>({
            name: "",
            email: "",
            password: "",
            password_confirmation: "",
        });

    const submit: FormEventHandler = async (e) => {
        e.preventDefault();

        try {
            await registerSchema.parseAsync(data);
            post(route("register"), {
                onFinish: () => reset("password", "password_confirmation"),
                onSuccess: () =>
                    toast({
                        title: `Register Success ✅`,
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
            <Head title="Register" />

            <Card className="mx-auto w-96 max-w-lg">
                <CardHeader>
                    <CardTitle className="text-xl">Sign Up</CardTitle>
                    <CardDescription>
                        Enter your information to create an account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit}>
                        <div>
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                name="name"
                                value={data.name}
                                autoComplete="name"
                                autoFocus={true}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                                className={`mt-1 block w-full ${
                                    localErrors.name ? "border-red-500" : ""
                                }`}
                            />

                            {localErrors.name && (
                                <p className="text-red-500 text-sm">
                                    {localErrors.name}
                                </p>
                            )}
                        </div>

                        <div className="mt-4">
                            <Label htmlFor="email">Email</Label>

                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                autoComplete="username"
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                                className={`mt-1 block w-full ${
                                    localErrors.email ? "border-red-500" : ""
                                }`}
                            />

                            {localErrors.email && (
                                <p className="text-red-500 text-sm">
                                    {localErrors.email}
                                </p>
                            )}
                        </div>

                        <div className="mt-4">
                            <Label htmlFor="password">Password</Label>

                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                                className={`mt-1 block w-full ${
                                    localErrors.password ? "border-red-500" : ""
                                }`}
                            />

                            {localErrors.password && (
                                <p className="text-red-500 text-sm">
                                    {localErrors.password}
                                </p>
                            )}
                        </div>

                        <div className="mt-4">
                            <Label htmlFor="password_confirmation">
                                Confirm Password
                            </Label>

                            <Input
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                autoComplete="new-password"
                                onChange={(e) =>
                                    setData(
                                        "password_confirmation",
                                        e.target.value
                                    )
                                }
                                className={`mt-1 block w-full ${
                                    localErrors.password_confirmation
                                        ? "border-red-500"
                                        : ""
                                }`}
                            />

                            {localErrors.password_confirmation && (
                                <p className="text-red-500 text-sm">
                                    {localErrors.password_confirmation}
                                </p>
                            )}
                        </div>

                        <div className="mt-4 flex flex-col justify-center items-center">
                            <Button className="w-full" disabled={processing}>
                                Register
                            </Button>
                        </div>
                    </form>
                    <div className="mt-4 text-center text-sm">
                        Already have an account?{" "}
                        <Link href={route("login")} className="underline">
                            Sign in
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </GuestLayout>
    );
}
