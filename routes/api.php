<?php

use App\Http\Controllers\ParticipantController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;



/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});



Route::post('/save_submission', 'Service\Submission@createSubmission');
Route::get('/get_submissions', 'Service\Submission@getSubmissions');

Route::get('/get_admin_users', 'QC\QCAdminUsersController@getAdminUsers');
Route::post('create_admin', 'AdminAuthController@create');


Route::get('/get_participants',[ParticipantController::class, 'getParticipants'])->name('get_participants')->middleware('auth:admin');
Route::post('/create_participant',[ParticipantController::class, 'createParticipant'])->name('create_participant')->middleware('auth:admin');

Route::get('/get_lab_personel',[ParticipantController::class, 'getLabPersonel'])->name('get_lab_personel')->middleware('auth:admin');
Route::post('/create_lab_personel',[ParticipantController::class, 'createLabPersonel'])->name('create_lab_personel')->middleware('auth:admin');