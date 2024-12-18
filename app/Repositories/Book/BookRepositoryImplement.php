<?php

namespace App\Repositories\Book;

use LaravelEasyRepository\Implementations\Eloquent;
use App\Models\Book;
use App\Models\Category;
use App\Models\Publisher;
use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Pagination\LengthAwarePaginator;

class BookRepositoryImplement extends Eloquent implements BookRepository
{
    protected Book $model;

    public function __construct(Book $model)
    {
        $this->model = $model;
    }

    public function getBooks(array $filters)
    {
        // specification
        $query = $this->model->with(['category', 'publisher', 'author']);

        if (!empty($filters['category_id'])) {
            $query->where('category_id', $filters['category_id']);
        }

        if (!empty($filters['search'])) {
            $search = $filters['search'];
            $query->where(function(Builder $q) use ($search) {
                $q->where('title', 'like', "%{$search}%")
                  ->orWhereHas('author', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  })
                  ->orWhereHas('publisher', function($q) use ($search) {
                      $q->where('name', 'like', "%{$search}%");
                  });
            });
        }

        if (Auth::user() && Auth::user()->hasRole('author')) {
            $query->where('user_id', Auth::id());
        }

        return $query->paginate(10)->withQueryString();
    }

    public function createBook(array $data): Book
    {
        if (!empty($data['cover_image'])) {
            $path = $data['cover_image']->store('covers', 'public');
            $data['cover_image'] = $path;
        }

        return $this->model->create($data);
    }

    public function updateBook(Book $book, array $data): Book
    {
        if (!empty($data['cover_image'])) {
            if ($book->cover_image) {
                Storage::disk('public')->delete($book->cover_image);
            }
            $path = $data['cover_image']->store('covers', 'public');
            $data['cover_image'] = $path;
        }

        $book->update($data);

        return $book;
    }

    public function deleteBook(Book $book): bool
    {
        if ($book->cover_image) {
            Storage::disk('public')->delete($book->cover_image);
        }

        return $book->delete();
    }

    public function getReports(): array
    {
        $categoryReport = Category::withCount('books')->get();
        $publisherReport = Publisher::withCount('books')->get();
        $authorReport = User::role('author')
            ->withCount('books')
            ->orderBy('books_count')
            ->get();

        return [
            'categoryReport' => $categoryReport,
            'publisherReport' => $publisherReport,
            'authorReport' => $authorReport
        ];
    }
}
