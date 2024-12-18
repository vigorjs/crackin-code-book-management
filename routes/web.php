<?php

use App\Http\Controllers\BookController;
use App\Http\Controllers\ProfileController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

// Route::get('/', function () {
//     return Inertia::render('Welcome', [
//         'canLogin' => Route::has('login'),
//         'canRegister' => Route::has('register'),
//         'laravelVersion' => Application::VERSION,
//         'phpVersion' => PHP_VERSION,
//     ]);
// });

Route::get('/', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');

Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');
});

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/books', [BookController::class, 'index'])
        ->middleware('permission:view books')
        ->name('books.index');

    Route::post('/books', [BookController::class, 'store'])
        ->middleware('permission:create books')
        ->name('books.store');

    Route::put('/books/{book}', [BookController::class, 'update'])
        ->middleware('permission:edit books')
        ->name('books.update');

    Route::delete('/books/{book}', [BookController::class, 'destroy'])
        ->middleware('permission:delete books')
        ->name('books.destroy');

    Route::get('/books/reports', [BookController::class, 'reports'])
        ->middleware('permission:view reports')
        ->name('books.reports');
});

require __DIR__.'/auth.php';
