import { Config } from "ziggy-js";

export interface User {
    id: number;
    name: string;
    email: string;
    permissions: string[];
    roles: string[];
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
    ziggy: Config & { location: string };
};

export type LoginForm = {
    email: string;
    password: string;
    remember: boolean;
};

export type RegisterForm = {
    name: string;
    email: string;
    password: string;
    password_confirmation: string;
};

export interface ThemeContextType {
    theme: ThemeEnum;
    setTheme: (theme: ThemeEnum) => void;
}

export interface ThemeProviderProps {
    defaultTheme?: ThemeEnum;
    storageKey?: string;
}

// resources/js/types/index.ts
export interface User {
    id: number;
    name: string;
    email: string;
    permissions: string[];
    roles: string[];
}

export interface Book {
    id: number;
    title: string;
    description: string | null;
    cover_image: string | null;
    category_id: number;
    publisher_id: number;
    user_id: number;
    category: Category;
    publisher: Publisher;
    author: User;
    created_at: string;
    updated_at: string;
}

export interface Category {
    id: number;
    name: string;
}

export interface Publisher {
    id: number;
    name: string;
}

export interface PaginatedData<T> {
    data: T[];
    current_page: number;
    last_page: number;
    per_page: number;
    total: number;
}

export interface BookFilters {
    search?: string;
    category_id?: string;
}

export interface Report {
    id: number;
    name: string;
    books_count: number;
}

export type PageProps<
    T extends Record<string, unknown> = Record<string, unknown>
> = T & {
    auth: {
        user: User;
    };
};
