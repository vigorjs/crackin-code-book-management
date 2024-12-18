import { Dialog, Transition } from "@headlessui/react";
import { Fragment, useEffect, useState } from "react";
import { Book, Category, Publisher, User } from "@/types";
import { useForm } from "@inertiajs/react";
import { z } from "zod";
import { Label } from "@/Components/ui/label";
import { Input } from "@/Components/ui/input";
import { Button } from "@/Components/ui/button";
import { Check, ChevronsUpDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from "@/Components/ui/command";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Textarea } from "@/Components/ui/textarea";
import { bookSchema } from "@/types/schema";

interface Props {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (formData: FormData) => void;
    book: Book | null;
    categories: Category[];
    publishers: Publisher[];
    authors: User[];
    isSubmitting: boolean;
}

export default function BookForm({
    isOpen,
    onClose,
    onSubmit,
    book,
    categories = [],
    publishers = [],
    authors = [],
    isSubmitting,
}: Props) {
    const [localErrors, setLocalErrors] = useState<Record<string, string>>({});
    const [authorOpen, setAuthorOpen] = useState(false);
    const { toast } = useToast();

    const { data, setData, reset } = useForm({
        title: "",
        description: "",
        category_id: "",
        publisher_id: "",
        user_id: "",
        cover_image: null as File | null,
    });

    useEffect(() => {
        if (book) {
            setData({
                title: book.title,
                description: book.description || "",
                category_id: book.category_id.toString(),
                publisher_id: book.publisher_id.toString(),
                user_id: book.user_id.toString(),
                cover_image: null,
            });
        } else {
            reset();
        }
    }, [book]);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        try {
            await bookSchema.parseAsync(data);
            const formData = new FormData();
            formData.append("title", data.title);
            formData.append("description", data.description || "");
            formData.append("category_id", data.category_id);
            formData.append("publisher_id", data.publisher_id);
            formData.append("user_id", data.user_id);
            if (data.cover_image) {
                formData.append("cover_image", data.cover_image);
            }

            onSubmit(formData);
            setLocalErrors({});
            reset();
        } catch (error) {
            if (error instanceof z.ZodError) {
                const errors: Record<string, string> = {};
                error.errors.forEach((err) => {
                    if (err.path) {
                        errors[err.path[0]] = err.message;
                    }
                });
                setLocalErrors(errors);
                toast({
                    title: "Validation Error",
                    description: "Please check the form for errors.",
                    variant: "destructive",
                });
            }
        }
    };

    return (
        <Transition appear show={isOpen} as={Fragment}>
            <Dialog as="div" className="relative z-10" onClose={onClose}>
                <Transition.Child
                    as={Fragment}
                    enter="ease-out duration-300"
                    enterFrom="opacity-0"
                    enterTo="opacity-100"
                    leave="ease-in duration-200"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                >
                    <div className="fixed inset-0 bg-black/25 dark:bg-black/40" />
                </Transition.Child>

                <div className="fixed inset-0 overflow-y-auto">
                    <div className="flex min-h-full items-center justify-center p-4">
                        <Transition.Child
                            as={Fragment}
                            enter="ease-out duration-300"
                            enterFrom="opacity-0 scale-95"
                            enterTo="opacity-100 scale-100"
                            leave="ease-in duration-200"
                            leaveFrom="opacity-100 scale-100"
                            leaveTo="opacity-0 scale-95"
                        >
                            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-6 shadow-xl transition-all">
                                <Dialog.Title
                                    as="h3"
                                    className="text-2xl font-bold text-center text-gray-900 dark:text-white"
                                >
                                    {book ? "Edit Book" : "Add New Book"}
                                </Dialog.Title>

                                <form
                                    onSubmit={handleSubmit}
                                    className="mt-4 space-y-4"
                                >
                                    {/* Title Field */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="title"
                                            className="text-foreground"
                                        >
                                            Judul
                                        </Label>
                                        <Input
                                            id="title"
                                            value={data.title}
                                            onChange={(e) =>
                                                setData("title", e.target.value)
                                            }
                                            className={`${
                                                localErrors.title
                                                    ? "border-red-500"
                                                    : ""
                                            } bg-background text-foreground`}
                                            placeholder="Enter book title"
                                        />
                                        {localErrors.title && (
                                            <p className="text-red-500 dark:text-red-400 text-sm">
                                                {localErrors.title}
                                            </p>
                                        )}
                                    </div>

                                    {/* Description Field */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="description"
                                            className="text-foreground"
                                        >
                                            Deskripsi
                                        </Label>
                                        <Textarea
                                            id="description"
                                            value={data.description}
                                            onChange={(e) =>
                                                setData(
                                                    "description",
                                                    e.target.value
                                                )
                                            }
                                            className={`${
                                                localErrors.description
                                                    ? "border-red-500"
                                                    : ""
                                            } bg-background text-foreground`}
                                            placeholder="Enter book description"
                                            rows={3}
                                        />
                                        {localErrors.description && (
                                            <p className="text-red-500 dark:text-red-400 text-sm">
                                                {localErrors.description}
                                            </p>
                                        )}
                                    </div>

                                    {/* Category Select */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="category"
                                            className="text-foreground"
                                        >
                                            Kategori
                                        </Label>
                                        <Select
                                            value={data.category_id}
                                            onValueChange={(value) =>
                                                setData("category_id", value)
                                            }
                                        >
                                            <SelectTrigger
                                                className={`${
                                                    localErrors.category_id
                                                        ? "border-red-500"
                                                        : ""
                                                } bg-background text-foreground`}
                                            >
                                                <SelectValue placeholder="Select category" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category.id}
                                                        value={category.id.toString()}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {localErrors.category_id && (
                                            <p className="text-red-500 dark:text-red-400 text-sm">
                                                {localErrors.category_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* Publisher Select */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="publisher"
                                            className="text-foreground"
                                        >
                                            Penerbit
                                        </Label>
                                        <Select
                                            value={data.publisher_id}
                                            onValueChange={(value) =>
                                                setData("publisher_id", value)
                                            }
                                        >
                                            <SelectTrigger
                                                className={`${
                                                    localErrors.publisher_id
                                                        ? "border-red-500"
                                                        : ""
                                                } bg-background text-foreground`}
                                            >
                                                <SelectValue placeholder="Select publisher" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {publishers.map((publisher) => (
                                                    <SelectItem
                                                        key={publisher.id}
                                                        value={publisher.id.toString()}
                                                    >
                                                        {publisher.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {localErrors.publisher_id && (
                                            <p className="text-red-500 dark:text-red-400 text-sm">
                                                {localErrors.publisher_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* Author Combobox */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="author"
                                            className="text-foreground"
                                        >
                                            Penulis
                                        </Label>
                                        <Popover
                                            open={authorOpen}
                                            onOpenChange={setAuthorOpen}
                                        >
                                            <PopoverTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    role="combobox"
                                                    aria-expanded={authorOpen}
                                                    className={`w-full justify-between ${
                                                        localErrors.user_id
                                                            ? "border-red-500"
                                                            : ""
                                                    } bg-background text-foreground`}
                                                >
                                                    {data.user_id
                                                        ? authors.find(
                                                              (author) =>
                                                                  author.id.toString() ===
                                                                  data.user_id
                                                          )?.name
                                                        : "Select author..."}
                                                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                                                </Button>
                                            </PopoverTrigger>
                                            <PopoverContent className="w-full p-0">
                                                <Command>
                                                    <CommandInput
                                                        placeholder="Search author..."
                                                        className="h-9"
                                                    />
                                                    <CommandList>
                                                        <CommandEmpty>
                                                            Penulis Kosong.
                                                        </CommandEmpty>
                                                        <CommandGroup>
                                                            {authors.map(
                                                                (author) => (
                                                                    <CommandItem
                                                                        key={
                                                                            author.id
                                                                        }
                                                                        value={
                                                                            author.name
                                                                        }
                                                                        onSelect={() => {
                                                                            setData(
                                                                                "user_id",
                                                                                author.id.toString()
                                                                            );
                                                                            setAuthorOpen(
                                                                                false
                                                                            );
                                                                        }}
                                                                    >
                                                                        {
                                                                            author.name
                                                                        }
                                                                        <Check
                                                                            className={cn(
                                                                                "ml-auto h-4 w-4",
                                                                                data.user_id ===
                                                                                    author.id.toString()
                                                                                    ? "opacity-100"
                                                                                    : "opacity-0"
                                                                            )}
                                                                        />
                                                                    </CommandItem>
                                                                )
                                                            )}
                                                        </CommandGroup>
                                                    </CommandList>
                                                </Command>
                                            </PopoverContent>
                                        </Popover>
                                        {localErrors.user_id && (
                                            <p className="text-red-500 dark:text-red-400 text-sm">
                                                {localErrors.user_id}
                                            </p>
                                        )}
                                    </div>

                                    {/* Cover Image Field */}
                                    <div className="space-y-2">
                                        <Label
                                            htmlFor="cover"
                                            className="text-foreground"
                                        >
                                            Cover Image
                                        </Label>
                                        <Input
                                            id="cover"
                                            type="file"
                                            onChange={(e) =>
                                                setData(
                                                    "cover_image",
                                                    e.target.files?.[0] || null
                                                )
                                            }
                                            className={`${
                                                localErrors.cover_image
                                                    ? "border-red-500"
                                                    : ""
                                            } bg-background text-foreground`}
                                            accept="image/*"
                                        />
                                        {localErrors.cover_image && (
                                            <p className="text-red-500 dark:text-red-400 text-sm">
                                                {localErrors.cover_image}
                                            </p>
                                        )}
                                    </div>

                                    {/* Form Actions */}
                                    <div className="mt-6 flex justify-end space-x-3">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={onClose}
                                        >
                                            Cancel
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                        >
                                            {isSubmitting
                                                ? "Saving..."
                                                : "Save"}
                                        </Button>
                                    </div>
                                </form>
                            </Dialog.Panel>
                        </Transition.Child>
                    </div>
                </div>
            </Dialog>
        </Transition>
    );
}
