<?php

namespace App\Services\Book;

use App\Models\Book;
use LaravelEasyRepository\BaseService;

interface BookService extends BaseService{

    public function getAllBooks(array $filters);
    public function createNewBook(array $data);
    public function updateExistingBook(Book $book, array $data);
    public function deleteExistingBook(Book $book);
    public function getBookReports();
}
