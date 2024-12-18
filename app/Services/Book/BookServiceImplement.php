<?php

namespace App\Services\Book;

use LaravelEasyRepository\ServiceApi;
use App\Repositories\Book\BookRepository;
use App\Models\Book;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;

class BookServiceImplement extends ServiceApi implements BookService
{
    protected string $title = "Book";
    protected BookRepository $mainRepository;

    public function __construct(BookRepository $mainRepository)
    {
        $this->mainRepository = $mainRepository;
    }

    public function getAllBooks(array $filters)
    {
        try {
            return $this->mainRepository->getBooks($filters);
        } catch (\Exception $e) {
            throw new \Exception("Error getting books: " . $e->getMessage());
        }
    }

    public function createNewBook(array $data)
    {
        try {
            if (!Gate::allows('create', Book::class)) {
                throw new \Exception('Unauthorized action.');
            }

            $validator = Validator::make($data, [
                'title' => 'required|string|max:255',
                'category_id' => 'required|exists:categories,id',
                'publisher_id' => 'required|exists:publishers,id',
                'user_id' => 'required|exists:users,id',
                'description' => 'nullable|string',
                'cover_image' => 'nullable|image|max:2048'
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            $book = $this->mainRepository->createBook($validator->validated());
            return $book->load(['category', 'publisher', 'author']);

        } catch (\Exception $e) {
            throw new \Exception("Error creating book: " . $e->getMessage());
        }
    }

    public function updateExistingBook(Book $book, array $data)
    {
        try {
            if (!Gate::allows('update', $book)) {
                throw new \Exception('Unauthorized action.');
            }

            $validator = Validator::make($data, [
                'title' => 'required|string|max:255',
                'category_id' => 'required|exists:categories,id',
                'publisher_id' => 'required|exists:publishers,id',
                'description' => 'nullable|string',
                'cover_image' => 'nullable|image|max:2048'
            ]);

            if ($validator->fails()) {
                throw new ValidationException($validator);
            }

            $book = $this->mainRepository->updateBook($book, $validator->validated());
            return $book->load(['category', 'publisher', 'author']);

        } catch (\Exception $e) {
            throw new \Exception("Error updating book: " . $e->getMessage());
        }
    }

    public function deleteExistingBook(Book $book)
    {
        try {
            if (!Gate::allows('delete', $book)) {
                throw new \Exception('Unauthorized action.');
            }

            return $this->mainRepository->deleteBook($book);

        } catch (\Exception $e) {
            throw new \Exception("Error deleting book: " . $e->getMessage());
        }
    }

    public function getBookReports()
    {
        try {
            return $this->mainRepository->getReports();
        } catch (\Exception $e) {
            throw new \Exception("Error getting reports: " . $e->getMessage());
        }
    }
}
