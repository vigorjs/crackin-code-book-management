<?php

namespace App\Repositories\Category;

use LaravelEasyRepository\Implementations\Eloquent;
use App\Models\Category;

class CategoryRepositoryImplement extends Eloquent implements CategoryRepository{

    /**
    * Model class to be used in this repository for the common methods inside Eloquent
    * Don't remove or change $this->model variable name
    * @property Model|mixed $model;
    */
    protected Category $model;

    public function __construct(Category $model)
    {
        $this->model = $model;
    }

    // Write something awesome :)
}
