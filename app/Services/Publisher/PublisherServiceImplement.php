<?php

namespace App\Services\Publisher;

use LaravelEasyRepository\ServiceApi;
use App\Repositories\Publisher\PublisherRepository;

class PublisherServiceImplement extends ServiceApi implements PublisherService{

    /**
     * set title message api for CRUD
     * @param string $title
     */
     protected string $title = "";
     /**
     * uncomment this to override the default message
     * protected string $create_message = "";
     * protected string $update_message = "";
     * protected string $delete_message = "";
     */

     /**
     * don't change $this->mainRepository variable name
     * because used in extends service class
     */
     protected PublisherRepository $mainRepository;

    public function __construct(PublisherRepository $mainRepository)
    {
      $this->mainRepository = $mainRepository;
    }

    // Define your custom methods :)
}
