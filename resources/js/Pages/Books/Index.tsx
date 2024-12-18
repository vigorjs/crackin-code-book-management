import { useEffect, useState } from "react";
import { Head, Link, router } from "@inertiajs/react";
import { Book, Category, Publisher, PageProps, User } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import axios from "axios";
import BookForm from "./Partials/BookForm";
import { toast } from "@/hooks/use-toast";
import DeleteConfirmDialog from "@/Components/DeleteConfirmDialog";
import { useDebounce } from "use-debounce";
import { Card, CardContent, CardHeader, CardTitle } from "@/Components/ui/card";
import { Button } from "@/Components/ui/button";
import { FileText, PlusCircle } from "lucide-react";
import { Input } from "@/Components/ui/input";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";

interface Props extends PageProps {
    books: {
        data: Book[];
        current_page: number;
        last_page: number;
    };
    categories: Category[];
    publishers: Publisher[];
    authors: User[];
    filters: {
        search?: string;
        category_id?: string;
    };
}

export default function Index({
    auth,
    books,
    categories,
    publishers,
    authors,
    filters,
}: Props) {
    const [isFormOpen, setIsFormOpen] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [editingBook, setEditingBook] = useState<Book | null>(null);
    const [bookToDelete, setBookToDelete] = useState<Book | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters.search || "");
    const [debouncedValue] = useDebounce(searchTerm, 500);

    useEffect(() => {
        router.get(
            route("books.index"),
            {
                ...filters,
                search: debouncedValue,
            },
            {
                preserveState: true,
                preserveScroll: true,
            }
        );
    }, [debouncedValue]);

    const handleSearch = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const { name, value } = e.target;

        if (name === "search") {
            setSearchTerm(value);
        } else {
            // Untuk filter kategori tetap langsung
            router.get(
                route("books.index"),
                {
                    ...filters,
                    [name]: value === "all" ? "" : value,
                },
                {
                    preserveState: true,
                    preserveScroll: true,
                }
            );
        }
    };

    const handleSubmit = async (formData: FormData) => {
        setIsSubmitting(true);
        try {
            if (editingBook) {
                formData.append("_method", "PUT");
            }

            const response = await axios({
                method: "post",
                url: editingBook
                    ? route("books.update", editingBook.id)
                    : route("books.store"),
                data: formData,
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            toast({
                title: editingBook
                    ? `Book Updated Successfully ✅`
                    : `Book Created Successfully ✅`,
            });
            router.reload();
            setIsFormOpen(false);
            setEditingBook(null);
        } catch (error) {
            console.error("Error:", error);
            toast({
                title: "Action Failed ⛔",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDelete = async () => {
        if (!bookToDelete) return;

        try {
            await axios.delete(route("books.destroy", bookToDelete.id));
            toast({
                title: `Book Deleted Successfully`,
            });
            router.reload();
            setIsDeleteDialogOpen(false);
            setBookToDelete(null);
        } catch (error) {
            console.error("Error:", error);
            toast({
                title: "Action Failed ⛔",
                variant: "destructive",
            });
        }
    };

    return (
        <AuthenticatedLayout
            header={
                <h2 className="text-xl font-semibold leading-tight text-gray-800 dark:text-gray-200">
                    Buku
                </h2>
            }
        >
            <Head title="Buku" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <div className="flex justify-between items-center">
                                <CardTitle>Daftar Buku</CardTitle>
                                <div className="flex gap-2">
                                    {auth.user.permissions.includes(
                                        "view reports"
                                    ) && (
                                        <Button variant="outline" asChild>
                                            <Link href={route("books.reports")}>
                                                <FileText className="h-4 w-4 mr-2" />
                                                Lihat Laporan
                                            </Link>
                                        </Button>
                                    )}
                                    {auth.user.permissions.includes(
                                        "create books"
                                    ) && (
                                        <Button
                                            onClick={() => setIsFormOpen(true)}
                                        >
                                            <PlusCircle className="h-4 w-4 mr-2" />
                                            Tambah Buku
                                        </Button>
                                    )}
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-4 mb-6">
                                <div className="flex-1">
                                    <Input
                                        type="text"
                                        name="search"
                                        placeholder="Cari buku..."
                                        value={searchTerm}
                                        onChange={handleSearch}
                                    />
                                </div>
                                <Select
                                    name="category_id"
                                    value={filters.category_id || "all"}
                                    onValueChange={(value) =>
                                        handleSearch({
                                            target: {
                                                name: "category_id",
                                                value,
                                            },
                                        } as any)
                                    }
                                >
                                    <SelectTrigger className="w-full md:w-[200px]">
                                        <SelectValue placeholder="Semua Kategori" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">
                                            Semua Kategori
                                        </SelectItem>
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
                            </div>

                            <div className="rounded-md border">
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-20">
                                                Gambar Cover
                                            </TableHead>
                                            <TableHead>Judul</TableHead>
                                            <TableHead>Kategori</TableHead>
                                            <TableHead>Penerbit</TableHead>
                                            <TableHead>Penulis</TableHead>
                                            {(auth.user.permissions.includes(
                                                "edit books"
                                            ) ||
                                                auth.user.permissions.includes(
                                                    "delete books"
                                                )) && (
                                                <TableHead className="text-right">
                                                    Aksi
                                                </TableHead>
                                            )}
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {books.data.map((book) => (
                                            <TableRow key={book.id}>
                                                <TableCell>
                                                    {book.cover_image && (
                                                        <img
                                                            src={`/storage/${book.cover_image}`}
                                                            alt={book.title}
                                                            className="h-20 w-20 object-cover rounded"
                                                        />
                                                    )}
                                                </TableCell>
                                                <TableCell>
                                                    {book.title}
                                                </TableCell>
                                                <TableCell>
                                                    {book.category.name}
                                                </TableCell>
                                                <TableCell>
                                                    {book.publisher.name}
                                                </TableCell>
                                                <TableCell>
                                                    {book.author.name}
                                                </TableCell>
                                                {(auth.user.permissions.includes(
                                                    "edit books"
                                                ) ||
                                                    auth.user.permissions.includes(
                                                        "delete books"
                                                    )) && (
                                                    <TableCell className="text-right space-x-2">
                                                        {auth.user.permissions.includes(
                                                            "edit books"
                                                        ) && (
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    setEditingBook(
                                                                        book
                                                                    );
                                                                    setIsFormOpen(
                                                                        true
                                                                    );
                                                                }}
                                                                className="text-blue-600 dark:text-blue-400"
                                                            >
                                                                Ubah
                                                            </Button>
                                                        )}
                                                        {auth.user.permissions.includes(
                                                            "delete books"
                                                        ) && (
                                                            <Button
                                                                variant="ghost"
                                                                onClick={() => {
                                                                    setBookToDelete(
                                                                        book
                                                                    );
                                                                    setIsDeleteDialogOpen(
                                                                        true
                                                                    );
                                                                }}
                                                                className="text-red-600 dark:text-red-400"
                                                            >
                                                                Hapus
                                                            </Button>
                                                        )}
                                                    </TableCell>
                                                )}
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>

            <BookForm
                isOpen={isFormOpen}
                onClose={() => {
                    setIsFormOpen(false);
                    setEditingBook(null);
                }}
                onSubmit={handleSubmit}
                book={editingBook}
                categories={categories}
                publishers={publishers}
                authors={authors}
                isSubmitting={isSubmitting}
            />

            <DeleteConfirmDialog
                isOpen={isDeleteDialogOpen}
                onClose={() => {
                    setIsDeleteDialogOpen(false);
                    setBookToDelete(null);
                }}
                onConfirm={handleDelete}
                title="Hapus Buku"
                message="Anda yakin ingin menghapus buku ini?"
            />
        </AuthenticatedLayout>
    );
}
