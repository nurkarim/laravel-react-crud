<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post("user-signup", "UserController@userSignUp");
Route::post("user-login", "UserController@userLogin");
Route::get("user/{email}", "UserController@userDetail");
Route::get("users", "UserController@users");
Route::get('projects', 'ProjectController@index');
Route::post('projects', 'ProjectController@store');
Route::get('projects/{id}', 'ProjectController@show');
Route::put('projects/{project}', 'ProjectController@markAsCompleted');
Route::post('tasks', 'TaskController@store');
Route::put('tasks/{task}', 'TaskController@markAsCompleted');

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});
