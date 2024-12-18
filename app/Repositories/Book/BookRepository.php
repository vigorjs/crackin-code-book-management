<?php

namespace App\Repositories\Book;

use App\Models\Book;
use LaravelEasyRepository\Repository;

interface BookRepository extends Repository{

    public function getBooks(array $filters);
    public function createBook(array $data): Book;
    public function updateBook(Book $book, array $data): Book;
    public function deleteBook(Book $book): bool;
    public function getReports(): array;
}
