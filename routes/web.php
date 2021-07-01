<?php

use App\Http\Controllers\AdminAuthController;
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


Route::get('/',  [CustomAuthController::class, 'index'])->name('home');
Route::get('index', [CustomAuthController::class, 'index'])->name('index');
Route::get('participant-login', [CustomAuthController::class, 'getParticipantLoginPage'])->name('participant-login');
Route::get('login', [CustomAuthController::class, 'index'])->name('login');
Route::post('participant-login', [CustomAuthController::class, 'doLogin'])->name('participant-login');
Route::get('registration', [CustomAuthController::class, 'registration'])->name('register-user');
Route::post('custom-registration', [CustomAuthController::class, 'customRegistration'])->name('register.custom');
Route::get('logout', [CustomAuthController::class, 'signOut'])->name('logout');



Route::get('participant-home', 'QC\QCParticipantController@participantHome')->name('participant-home');

Route::get('admin-logout', [AdminAuthController::class, 'signOut'])->name('admin-logout');
Route::post('admin-login', [AdminAuthController::class, 'doLogin'])->name('admin-login');
Route::get('admin-login', [AdminAuthController::class, 'adminLogin'])->name('admin-login');

Route::get('admin-home', 'QC\QCAdminController@adminHome')->name('admin-home');
Route::get('add-admin-user', 'QC\QCAdminController@addUser')->name('add-admin-user');
Route::get('list-admin-user', 'QC\QCAdminController@listUser')->name('list-admin-user');
Route::get('add-personel', 'QC\QCAdminController@addPersonel')->name('add-personel');
Route::get('list-personel', 'QC\QCAdminController@listPersonel')->name('list-personel');
Route::get('add-lab', 'QC\QCAdminController@addLab')->name('add-lab');
Route::get('list-lab', 'QC\QCAdminController@listLab')->name('list-lab');