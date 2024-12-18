import { Head } from "@inertiajs/react";
import { Book, Category, Publisher, PageProps, User } from "@/types";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow,
} from "@/Components/ui/table";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/Components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";

interface Report {
    categoryReport: (Category & { books_count: number })[];
    publisherReport: (Publisher & { books_count: number })[];
    authorReport: (User & { books_count: number })[];
}

interface Props extends PageProps {
    categoryReport: Report["categoryReport"];
    publisherReport: Report["publisherReport"];
    authorReport: Report["authorReport"];
}

export default function Reports({
    auth,
    categoryReport,
    publisherReport,
    authorReport,
}: Props) {
    return (
        <AuthenticatedLayout>
            <Head title="Book Reports" />

            <div className="py-12">
                <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl">
                                Book Reports
                            </CardTitle>
                            <CardDescription>
                                Summary reports of books by category, publisher,
                                and author
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Tabs defaultValue="category" className="w-full">
                                <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="category">
                                        By Category
                                    </TabsTrigger>
                                    <TabsTrigger value="publisher">
                                        By Publisher
                                    </TabsTrigger>
                                    <TabsTrigger value="author">
                                        By Author
                                    </TabsTrigger>
                                </TabsList>

                                {/* Category Report */}
                                <TabsContent value="category">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Books by Category
                                            </CardTitle>
                                            <CardDescription>
                                                Distribution of books across
                                                different categories
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Category Name
                                                        </TableHead>
                                                        <TableHead className="text-right">
                                                            Number of Books
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {categoryReport.map(
                                                        (category) => (
                                                            <TableRow
                                                                key={
                                                                    category.id
                                                                }
                                                            >
                                                                <TableCell>
                                                                    {
                                                                        category.name
                                                                    }
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    {
                                                                        category.books_count
                                                                    }
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )}
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow>
                                                        <TableCell>
                                                            Total
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {categoryReport.reduce(
                                                                (
                                                                    sum,
                                                                    category
                                                                ) =>
                                                                    sum +
                                                                    category.books_count,
                                                                0
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableFooter>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Publisher Report */}
                                <TabsContent value="publisher">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Books by Publisher
                                            </CardTitle>
                                            <CardDescription>
                                                Distribution of books across
                                                different publishers
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Publisher Name
                                                        </TableHead>
                                                        <TableHead className="text-right">
                                                            Number of Books
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {publisherReport.map(
                                                        (publisher) => (
                                                            <TableRow
                                                                key={
                                                                    publisher.id
                                                                }
                                                            >
                                                                <TableCell>
                                                                    {
                                                                        publisher.name
                                                                    }
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    {
                                                                        publisher.books_count
                                                                    }
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )}
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow>
                                                        <TableCell>
                                                            Total
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {publisherReport.reduce(
                                                                (
                                                                    sum,
                                                                    publisher
                                                                ) =>
                                                                    sum +
                                                                    publisher.books_count,
                                                                0
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableFooter>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>

                                {/* Author Report */}
                                <TabsContent value="author">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>
                                                Books by Author
                                            </CardTitle>
                                            <CardDescription>
                                                Distribution of books across
                                                different authors (sorted by
                                                book count)
                                            </CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <Table>
                                                <TableHeader>
                                                    <TableRow>
                                                        <TableHead>
                                                            Author Name
                                                        </TableHead>
                                                        <TableHead className="text-right">
                                                            Number of Books
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {authorReport.map(
                                                        (author) => (
                                                            <TableRow
                                                                key={author.id}
                                                            >
                                                                <TableCell>
                                                                    {
                                                                        author.name
                                                                    }
                                                                </TableCell>
                                                                <TableCell className="text-right">
                                                                    {
                                                                        author.books_count
                                                                    }
                                                                </TableCell>
                                                            </TableRow>
                                                        )
                                                    )}
                                                </TableBody>
                                                <TableFooter>
                                                    <TableRow>
                                                        <TableCell>
                                                            Total
                                                        </TableCell>
                                                        <TableCell className="text-right">
                                                            {authorReport.reduce(
                                                                (sum, author) =>
                                                                    sum +
                                                                    author.books_count,
                                                                0
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                </TableFooter>
                                            </Table>
                                        </CardContent>
                                    </Card>
                                </TabsContent>
                            </Tabs>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AuthenticatedLayout>
    );
}
