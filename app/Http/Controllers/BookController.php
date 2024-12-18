<?php

namespace App\Http\Controllers;

use App\Models\Book;
use App\Models\Category;
use App\Models\Publisher;
use App\Models\User;
use App\Services\Book\BookService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookController extends Controller
{
    protected BookService $bookService;

    public function __construct(BookService $bookService)
    {
        $this->bookService = $bookService;
    }

    public function index(Request $request)
    {
        $books = $this->bookService->getAllBooks($request->only(['search', 'category_id']));
        $categories = Category::all();
        $publishers = Publisher::all();
        $authors = User::role('author')->get();

        return Inertia::render('Books/Index', [
            'books' => $books,
            'publishers' => $publishers,
            'categories' => $categories,
            'authors' => $authors,
            'filters' => $request->only(['search', 'category_id'])
        ]);
    }

    public function store(Request $request)
    {
        try {
            $book = $this->bookService->createNewBook($request->all());
            return response()->json($book);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 403);
        }
    }

    public function update(Request $request, Book $book)
    {
        try {
            $book = $this->bookService->updateExistingBook($book, $request->all());
            return response()->json($book);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 403);
        }
    }

    public function destroy(Book $book)
    {
        try {
            $this->bookService->deleteExistingBook($book);
            return response()->json(['message' => 'Book deleted successfully']);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 403);
        }
    }

    public function reports()
    {
        try {
            $reports = $this->bookService->getBookReports();
            return Inertia::render('Books/Reports', $reports);
        } catch (\Exception $e) {
            return redirect()->back()->with('error', $e->getMessage());
        }
    }
}
