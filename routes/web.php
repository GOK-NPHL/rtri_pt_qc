<?php

use App\Http\Controllers\CustomAuthController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('home');
// });

// Auth::routes(['register' => false]);
//Auth::routes();


Route::get('index', [CustomAuthController::class, 'index'])->name('index');
Route::get('login', [CustomAuthController::class, 'index'])->name('login'); 
Route::get('admin-login', [CustomAuthController::class, 'adminLogin'])->name('admin-login'); 
Route::get('participant_login_page', [CustomAuthController::class, 'getParticipantLoginPage'])->name('participant_login_page');
Route::post('part_login', [CustomAuthController::class, 'customLogin'])->name('part_login'); 
Route::get('registration', [CustomAuthController::class, 'registration'])->name('register-user');
Route::post('custom-registration', [CustomAuthController::class, 'customRegistration'])->name('register.custom'); 
Route::get('logout', [CustomAuthController::class, 'signOut'])->name('signout');


Route::get('/home', 'HomeController@index')->name('home');
Route::get('/dashboard', 'Service\Rtri@dashboard')->name('dashboard');
Route::get('/', 'HomeController@index')->name('home');


