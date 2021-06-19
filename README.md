<p align="center"><a href="https://laravel.com" target="_blank"><img src="https://res.cloudinary.com/practicaldev/image/fetch/s--BYPcBrp0--/c_imagga_scale,f_auto,fl_progressive,h_900,q_auto,w_1600/https://thepracticaldev.s3.amazonaws.com/i/l2vicl71wmxtcgob0gu2.png" width="400"></a></p>

<p align="center">
<a href="https://travis-ci.org/laravel/framework"><img src="https://travis-ci.org/laravel/framework.svg" alt="Build Status"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/d/total.svg" alt="Total Downloads"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/v/stable.svg" alt="Latest Stable Version"></a>
<a href="https://packagist.org/packages/laravel/framework"><img src="https://poser.pugx.org/laravel/framework/license.svg" alt="License"></a>
</p>

## About My Crud
This crud will be help to you learn basic how to integrate react js in laravel application.
## Laravel

Laravel is a web application framework with expressive, elegant syntax. We believe development must be an enjoyable and creative experience to be truly fulfilling.


## React
React is an open-source front-end JavaScript library for building user interfaces or UI components. It is maintained by Facebook and a community of individual developers and companies. React can be used as a base in the development of single-page or mobile applications

## Prerequisites

- Basic knowledge of PHP and Laravel
- Basic knowledge of JavaScript and React
- PHP installed on your computer
- Composer installed on your computer
- Laravel installer installed on your computer

## What I will be building
For the purpose of demonstrating how to use React in a Laravel application, I will  build a task management app
##Planning the application
- **Tasks:**   a task is an item that needs to be done by a user and usually consists of a brief and concise title of what needs to be done to complete that task. Tasks also need to indicate whether they have been completed or not. Finally, a task is usually associated with a project that contains similar or related tasks.
- **Projects:** projects group related tasks together and usually have a descriptive name, and a description associated with them. We also need to be able to indicate whether or not a project is completed.

###Creating the app models and migrations

     $ php artisan make:model Task -m 
     $ php artisan make:model Project -m

Adding the -m flag to the make:model command will generate the accompanying migration for the model.

Let’s update the  migrations.

    // database/migrations/create_tasks_table.php

    public function up()
    {
      Schema::create('tasks', function (Blueprint $table) {
        $table->increments('id');
        $table->string('title');
        $table->unsignedInteger('project_id');
        $table->boolean('is_completed')->default(0);
        $table->timestamps();
      });
    }


    // database/migrations/create_projects_table.php

    public function up()
    {
      Schema::create('projects', function (Blueprint $table) {
        $table->increments('id');
        $table->string('name');
        $table->text('description');
        $table->boolean('is_completed')->default(0);
        $table->timestamps();
      });
    }

Next, open **app/Task.php** and update it content as below:


    // app/Task.php

    <?php

    namespace App;

    use Illuminate\Database\Eloquent\Model;

    class Task extends Model
    {
      protected $fillable = ['title', 'project_id'];
    }

We specify the fields we want to be mass assignable.

Similarly, open **app/Project.php** and update as below:

// app/Project.php

    <?php

    namespace App;

    use Illuminate\Database\Eloquent\Model;

    class Project extends Model
    {
      protected $fillable = ['name', 'description'];

      public function tasks()
      {
        return $this->hasMany(Task::class);
      }
    }

Before  run the migrations, let’s set up  database  directory then update the .env file as below:

    // .env

    DB_CONNECTION=mysql
    DB_HOST=127.0.0.1
    DB_PORT=3306
    DB_DATABASE=connect_react
    DB_USERNAME=root
    DB_PASSWORD=

Run the migrations:

    $ php artisan migrate

##Creating the app API

Open routes/api.php and replace it content with the code below:

    // routes/api.php

    Route::get('projects', 'ProjectController@index');
    Route::post('projects', 'ProjectController@store');
    Route::get('projects/{id}', 'ProjectController@show');
    Route::put('projects/{project}', 'ProjectController@markAsCompleted');
    Route::post('tasks', 'TaskController@store');
    Route::put('tasks/{task}', 'TaskController@markAsCompleted');

Next, let’s move on to create the controllers:

    $ php artisan make:controller ProjectController
    $ php artisan make:controller TaskController
Open **app/Http/Controllers/ProjectController.php** and update it as below:

    // app/Http/Controllers/ProjectController.php

    <?php

    namespace App\Http\Controllers;

    use App\Project;
    use Illuminate\Http\Request;

    class ProjectController extends Controller
    {
      public function index()
      {
        $projects = Project::where('is_completed', false)
                            ->orderBy('created_at', 'desc')
                            ->withCount(['tasks' => function ($query) {
                              $query->where('is_completed', false);
                            }])
                            ->get();

        return $projects->toJson();
      }

      public function store(Request $request)
      {
        $validatedData = $request->validate([
          'name' => 'required',
          'description' => 'required',
        ]);

        $project = Project::create([
          'name' => $validatedData['name'],
          'description' => $validatedData['description'],
        ]);

        return response()->json('Project created!');
      }

      public function show($id)
      {
        $project = Project::with(['tasks' => function ($query) {
          $query->where('is_completed', false);
        }])->find($id);

        return $project->toJson();
      }

      public function markAsCompleted(Project $project)
      {
        $project->is_completed = true;
        $project->update();

        return response()->json('Project updated!');
      }
    }

Next, let’s open **app/Http/Controllers/TaskController.php** and update it as below:

    // app/Http/Controllers/TaskController.php

    <?php

    namespace App\Http\Controllers;

    use App\Task;
    use Illuminate\Http\Request;

    class TaskController extends Controller
    {
      public function store(Request $request)
      {
        $validatedData = $request->validate(['title' => 'required']);

        $task = Task::create([
          'title' => $validatedData['title'],
          'project_id' => $request->project_id,
        ]);

        return $task->toJson();
      }

      public function markAsCompleted(Task $task)
      {
        $task->is_completed = true;
        $task->update();

        return response()->json('Task updated!');
      }
    }

###Creating a wildcard route

We’ll be using React Router to handle routing in our application. For this, we need to render a single view file for all our application routes. Open routes/web.php and replace it content with the code below:

    // routes/web.php

    Route::get('/{path?}', [
    'uses' => 'HomeController@mainIndex',
    'as' => 'react',
    'where' => ['path' => '.*']
    ]);

Next, let’s create the app.blade.php view file. We’ll create this file directly within the resources/views directory, then paste the following code in it:

    // resources/views/app.blade.php

    <!DOCTYPE html>
    <html lang="{{ app()->getLocale() }}">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <!-- CSRF Token -->
        <meta name="csrf-token" content="{{ csrf_token() }}">
        <title>Tasksman</title>
        <!-- Styles -->
        <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    </head>
    <body>
        <div id="app"></div>

        <script src="{{ asset('js/app.js') }}"></script>
    </body>
    </html>
