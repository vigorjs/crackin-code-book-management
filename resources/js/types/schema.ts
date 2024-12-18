import { z } from "zod";

export const loginSchema = z.object({
    email: z
        .string()
        .email("Must be type of email")
        .min(1, { message: "Email is required" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters long" }),
});

export const registerSchema = z
    .object({
        name: z.string().min(3, "Name must be at least 3 characters long"),
        email: z
            .string()
            .email("Must be type of email")
            .min(1, { message: "Email is required" }),
        password: z
            .string()
            .min(8, { message: "Password must be at least 8 characters long" }),
        password_confirmation: z.string(),
    })
    .refine((data) => data.password === data.password_confirmation, {
        message: "Passwords do not match",
        path: ["password_confirmation"],
    });

export const bookSchema = z.object({
    title: z.string().min(1, "Title is required"),
    description: z.string().optional(),
    category_id: z.string().min(1, "Category is required"),
    publisher_id: z.string().min(1, "Publisher is required"),
    user_id: z.string().min(1, "Author is required"),
    cover_image: z.any().optional(),
});
