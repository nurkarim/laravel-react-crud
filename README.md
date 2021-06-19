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

## Creating Project
    composer create-project --prefer-dist laravel/laravel yourprojectName
    composer require laravel/ui
    php artisan ui react
    php artisan serve
    

If everything goes well, you should be able to serve your application on a development server at http://127.0.0.1:8000.

We should now have an **Example.js** file inside **resources/js/components**, which is a basic React component. Also, **resources/js/app.js** has been updated to make use of the Example component.

Next, run the command below to install our app dependencies:

    $ npm install
    $ npm run dev

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

##Creating the App componnet
The App component will serve as the base for our React components. Let’s rename the default Example component to App and replace it content with the following code:

    // resources/js/components/App.js

    import React, { Component } from 'react'
    import ReactDOM from 'react-dom'
    import { BrowserRouter, Route, Switch } from 'react-router-dom'
    import Header from './Header'

    class App extends Component {
      render () {
        return (
          <BrowserRouter>
            <div>
              <Header />
            </div>
          </BrowserRouter>
        )
      }
    }

    ReactDOM.render(<App />, document.getElementById('app'))
We render a Header component (which we’ll create shortly). The Header component will be rendered for all our app pages. As you can see, we are making use of React Router, so let’s install it:

    $ npm install react-router-dom
While that’s installing, open and update **resources/js/app.js** as below:

    // resources/js/app.js

    require('./bootstrap')
    require('./components/App')
Instead of referencing the Example component, we reference the App component we just created
##Creating the Header component
Let’s create the Header component referenced above. Create a new Header.js file within the **resources/js/components** directory and paste the code below in it:

    // resources/js/components/Header.js

    import React from 'react'
    import { Link } from 'react-router-dom'

    const Header = () => (
      <nav className='navbar navbar-expand-md navbar-light navbar-laravel'>
        <div className='container'>
          <Link className='navbar-brand' to='/'>Tasksman</Link>
        </div>
      </nav>
    )

    export default Header
A basic Bootstrap navbar with a link to the homepage. As you can see, we are making use of the Link component from React Router. This will prevent our page from refreshing whenever we navigate around our app.

##Displaying all projects yet to be completed
To display a list of projects that are yet to be completed, we’ll create a ProjectsList component. Within **resources/js/components**, create a new ProjectsList.js file and paste the code below in it:

    // resources/js/components/ProjectsList.js

    import axios from 'axios'
    import React, { Component } from 'react'
    import { Link } from 'react-router-dom'

    class ProjectsList extends Component {
      constructor () {
        super()
        this.state = {
          projects: []
        }
      }

      componentDidMount () {
        axios.get('/api/projects').then(response => {
          this.setState({
            projects: response.data
          })
        })
      }

      render () {
        const { projects } = this.state
        return (
          <div className='container py-4'>
            <div className='row justify-content-center'>
              <div className='col-md-8'>
                <div className='card'>
                  <div className='card-header'>All projects</div>
                  <div className='card-body'>
                    <Link className='btn btn-primary btn-sm mb-3' to='/create'>
                      Create new project
                    </Link>
                    <ul className='list-group list-group-flush'>
                      {projects.map(project => (
                        <Link
                          className='list-group-item list-group-item-action d-flex justify-content-between align-items-center'
                          to={`/${project.id}`}
                          key={project.id}
                        >
                          {project.name}
                          <span className='badge badge-primary badge-pill'>
                            {project.tasks_count}
                          </span>
                        </Link>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }

    export default ProjectsList

We define a projects state and initialize it to be an empty array. Using React’s **componentDidMount** lifecycle, we make an HTTP request using Axios to our app API endpoint to fetch all the projects that are yet to be marked as completed. Then we update the projects state with the response data gotten from our app API.

Finally, we display a list of the projects by iterating over the projects state.

Before we go on to test this out, let’s update the App component as below:
Before we go on to test this out, let’s update the App component as below:

    // resources/js/components/App.js

    import React, { Component } from 'react'
    import ReactDOM from 'react-dom'
    import { BrowserRouter, Route, Switch } from 'react-router-dom'
    import Header from './Header'
    import ProjectsList from './ProjectsList'

    class App extends Component {
      render () {
        return (
          <BrowserRouter>
            <div>
              <Header />
              <Switch>
                <Route exact path='/' component={ProjectsList} />
              </Switch>
            </div>
          </BrowserRouter>
        )
      }
    }

    ReactDOM.render(<App />, document.getElementById('app'))
Here, we add a new route / (homepage). So whenever the / route is visited, the ProjectsList component will be rendered.

##Creating a new project
From the ProjectsList component, you’ll notice we have a link to create a new project. Let’s implement it. Create a new NewProject.js file within **resources/js/components**, and paste the code below in it:

    // resources/js/components/NewProject.js

    import axios from 'axios'
    import React, { Component } from 'react'

    class NewProject extends Component {
      constructor (props) {
        super(props)
        this.state = {
          name: '',
          description: '',
          errors: []
        }
        this.handleFieldChange = this.handleFieldChange.bind(this)
        this.handleCreateNewProject = this.handleCreateNewProject.bind(this)
        this.hasErrorFor = this.hasErrorFor.bind(this)
        this.renderErrorFor = this.renderErrorFor.bind(this)
      }

      handleFieldChange (event) {
        this.setState({
          [event.target.name]: event.target.value
        })
      }

      handleCreateNewProject (event) {
        event.preventDefault()

        const { history } = this.props

        const project = {
          name: this.state.name,
          description: this.state.description
        }

        axios.post('/api/projects', project)
          .then(response => {
            // redirect to the homepage
            history.push('/')
          })
          .catch(error => {
            this.setState({
              errors: error.response.data.errors
            })
          })
      }

      hasErrorFor (field) {
        return !!this.state.errors[field]
      }

      renderErrorFor (field) {
        if (this.hasErrorFor(field)) {
          return (
            <span className='invalid-feedback'>
              <strong>{this.state.errors[field][0]}</strong>
            </span>
          )
        }
      }

      render () {
        return (
          <div className='container py-4'>
            <div className='row justify-content-center'>
              <div className='col-md-6'>
                <div className='card'>
                  <div className='card-header'>Create new project</div>
                  <div className='card-body'>
                    <form onSubmit={this.handleCreateNewProject}>
                      <div className='form-group'>
                        <label htmlFor='name'>Project name</label>
                        <input
                          id='name'
                          type='text'
                          className={`form-control ${this.hasErrorFor('name') ? 'is-invalid' : ''}`}
                          name='name'
                          value={this.state.name}
                          onChange={this.handleFieldChange}
                        />
                        {this.renderErrorFor('name')}
                      </div>
                      <div className='form-group'>
                        <label htmlFor='description'>Project description</label>
                        <textarea
                          id='description'
                          className={`form-control ${this.hasErrorFor('description') ? 'is-invalid' : ''}`}
                          name='description'
                          rows='10'
                          value={this.state.description}
                          onChange={this.handleFieldChange}
                        />
                        {this.renderErrorFor('description')}
                      </div>
                      <button className='btn btn-primary'>Create</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }

    export default NewProject


This component renders a form for creating a new project. We define some states: name, description and errors. Then we define a handleFieldChange method that gets called whenever the create a new project form input fields changes. Base on these changes, we update the states (name and description) accordingly. For this to work, we add an onChange event to each of the field.

Once the form is submitted, a handleCreateNewProject method is called, which first prevents the default behavior of form submission. Then it makes an HTTP request to our app API endpoint passing along the form data. If everything went well, we simply redirect the user to the homepage. otherwise, we update the errors state with the response error gotten from our app API.

The hasErrorFor method checks if the specified field has an error or not, and will either return true or false. The renderErrorFor method renders the error message for the specified field, if the field has error.

Just as we did with the ProjectsList component, let’s add the NewProject component to the App component. Update the App component as below:

    // resources/js/components/App.js

    import React, { Component } from 'react'
    import ReactDOM from 'react-dom'
    import { BrowserRouter, Route, Switch } from 'react-router-dom'
    import Header from './Header'
    import NewProject from './NewProject'
    import ProjectsList from './ProjectsList'

    class App extends Component {
      render () {
        return (
          <BrowserRouter>
            <div>
              <Header />
              <Switch>
                <Route exact path='/' component={ProjectsList} />
                <Route path='/create' component={NewProject} />
              </Switch>
            </div>
          </BrowserRouter>
        )
      }
    }

    ReactDOM.render(<App />, document.getElementById('app'))
We define the route **/create** for creating a new project, and the **NewProject** component will be rendered whenever the route is visited.

###Display a single project
Now let’s display a single project. You’ll notice from the ProjectsList component that each project is listed with an anchor (to the project ID) to view the project. Create a new **SingleProject** component within **resources/js/components** and paste the code below in it:

    // resources/js/components/SingleProject.js

    import axios from 'axios'
    import React, { Component } from 'react'

    class SingleProject extends Component {
      constructor (props) {
        super(props)
        this.state = {
          project: {},
          tasks: []
        }
      }

      componentDidMount () {
        const projectId = this.props.match.params.id

        axios.get(`/api/projects/${projectId}`).then(response => {
          this.setState({
            project: response.data,
            tasks: response.data.tasks
          })
        })
      }

      render () {
        const { project, tasks } = this.state

        return (
          <div className='container py-4'>
            <div className='row justify-content-center'>
              <div className='col-md-8'>
                <div className='card'>
                  <div className='card-header'>{project.name}</div>
                  <div className='card-body'>
                    <p>{project.description}</p>

                    <button className='btn btn-primary btn-sm'>
                      Mark as completed
                    </button>

                    <hr />

                    <ul className='list-group mt-3'>
                      {tasks.map(task => (
                        <li
                          className='list-group-item d-flex justify-content-between align-items-center'
                          key={task.id}
                        >
                          {task.title}

                          <button className='btn btn-primary btn-sm'>
                            Mark as completed
                          </button>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      }
    }

    export default SingleProject
We define two state properties: project and tasks. The project state will hold the details of the specified project, while the tasks state will hold the tasks for the project. Inside the **componentDidMount** lifecycle method, we make an HTTP request to our app API to fetch the project with the specified project ID. The project ID is passed to the URL, so we can get it using this.props.match.params.id. Then we update the state (project and tasks) with the response data gotten from our app API.

Finally, we display the details about the project as well as the project’s tasks. Also, we display buttons to mark the project and its tasks as completed.

Next, let’s add the **SingleProject** component to the App component. Update the App component as below:

    // resources/js/components/App.js

    import React, { Component } from 'react'
    import ReactDOM from 'react-dom'
    import { BrowserRouter, Route, Switch } from 'react-router-dom'
    import Header from './Header'
    import NewProject from './NewProject'
    import ProjectsList from './ProjectsList'
    import SingleProject from './SingleProject'
    class App extends Component {
      render () {
        return (
          <BrowserRouter>
            <div>
              <Header />
              <Switch>
                <Route exact path='/' component={ProjectsList} />
                <Route path='/create' component={NewProject} />
                <Route path='/:id' component={SingleProject} />
              </Switch>
            </div>
          </BrowserRouter>
        )
      }
    }

    ReactDOM.render(<App />, document.getElementById('app'))
Now we can view a particular project.

###Marking a project as completed
Now, let’s add the ability to mark a project as completed. Add the following code to the **SingleProject** component:

    // resources/js/components/SingleProject.js

    // add this inside the `constructor`
    this.handleMarkProjectAsCompleted = this.handleMarkProjectAsCompleted.bind(this)

    // add these outside the `constructor`, as a standalone method
    handleMarkProjectAsCompleted () {
      const { history } = this.props

      axios.put(`/api/projects/${this.state.project.id}`)
        .then(response => history.push('/'))
    }
Once the mark as completed button is clicked, the **handleMarkProjectAsCompleted** method will be called. This method makes an HTTP request to our app API passing along the ID of the project we want to mark as completed. Once the request is successful, we simply redirect the user to the homepage.

Next, update the first Mark as completed ****button, which is below the project’s description as below:

    // resources/js/components/SingleProject.js

    <button
      className='btn btn-primary btn-sm'
      onClick={this.handleMarkProjectAsCompleted}
    >
      Mark as completed
    </button>
###Adding a task to project

Let’s the ability to add new tasks to a project. Add the following code to the **SingleProject** component:

    // resources/js/components/SingleProject.js

    this.state = {
      ...,
      title: '',
      errors: []
    }

    // add these inside the `constructor`
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.handleAddNewTask = this.handleAddNewTask.bind(this)
    this.hasErrorFor = this.hasErrorFor.bind(this)
    this.renderErrorFor = this.renderErrorFor.bind(this)

    // add these outside the `constructor`, as a standalone methods
    handleFieldChange (event) {
      this.setState({
        title: event.target.value
      })
    }

    handleAddNewTask (event) {
      event.preventDefault()

      const task = {
        title: this.state.title,
        project_id: this.state.project.id
      }

      axios.post('/api/tasks', task)
        .then(response => {
          // clear form input
          this.setState({
            title: ''
          })
          // add new task to list of tasks
          this.setState(prevState => ({
            tasks: prevState.tasks.concat(response.data)
          }))
        })
        .catch(error => {
          this.setState({
            errors: error.response.data.errors
          })
        })
    }

    hasErrorFor (field) {
      return !!this.state.errors[field]
    }

    renderErrorFor (field) {
      if (this.hasErrorFor(field)) {
        return (
          <span className='invalid-feedback'>
            <strong>{this.state.errors[field][0]}</strong>
          </span>
        )
      }
    }
**handleFieldChange**, **hasErrorFor** and **renderErrorFor** are the same from the **NewProject** component, so we won’t be going over them again. The **handleAddNewTask** method is also similar to the **handleCreateNewProject** method from the **NewProject** component, so we’ll go over only the new part. If the HTTP request is successful, we first clear out the form input, then we update the tasks state by adding the new task to list of tasks.

Next, add the code below inside the render method just below <hr />:

    // resources/js/components/SingleProject.js

    <form onSubmit={this.handleAddNewTask}>
      <div className='input-group'>
        <input
          type='text'
          name='title'
          className={`form-control ${this.hasErrorFor('title') ? 'is-invalid' : ''}`}
          placeholder='Task title'
          value={this.state.title}
          onChange={this.handleFieldChange}
        />
        <div className='input-group-append'>
          <button className='btn btn-primary'>Add</button>
        </div>
        {this.renderErrorFor('title')}
      </div>
    </form>
This renders the form for adding new tasks.

Marking a task as completed
For the last feature of our task management app, we’ll add the ability to mark a task as completed. This will be very much similar to what we did with marking a project as completed. Add the following code to the **SingleProject** component:

    // resources/js/components/SingleProject.js

    handleMarkTaskAsCompleted (taskId) {
      axios.put(`/api/tasks/${taskId}`).then(response => {
        this.setState(prevState => ({
          tasks: prevState.tasks.filter(task => {
            return task.id !== taskId
          })
        }))
      })
    }
Unlike the **handleMarkProjectAsCompleted** method, the **handleMarkTaskAsCompleted** accepts the ID of the task to be marked as completed as an argument. Then with the task ID, it makes an HTTP request to our app API. Once the request is successful, we update the tasks state by filtering out the task with the ID passed to the method.

Lastly, update the Mark as completed button next to each task as below:

    // resources/js/components/SingleProject.js

    <button
      className='btn btn-primary btn-sm'
      onClick={this.handleMarkTaskAsCompleted.bind(this,task.id)}
    >
      Mark as completed
    </button>
Once the button is clicked, we called the **handleMarkTaskAsCompleted** method passing to it the task ID.

Testing out the app
Before testing out our app, we need to compile the JavaScript files using Laravel Mix using:

    $ npm run dev
Then we need to start the app:

    $ php artisan serve
The app should be running on http://127.0.0.1:8000. Then we can start to test it out.
