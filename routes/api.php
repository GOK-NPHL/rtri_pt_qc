<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\PT\PTReadinessController;
use App\Http\Controllers\PT\PTShipmentController;
use App\Http\Controllers\QC\QCAdminUsersController;
use App\Http\Controllers\QC\QCParticipantController;
use App\Http\Controllers\Service\AggregatorController;
use App\Http\Controllers\Service\CommonsController;
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
Route::delete('/delete_submissions/{id}', 'Service\Submission@deleteSubmission');

Route::get('/get_admin_users', [QCAdminUsersController::class, 'getAdminUsers']);
Route::get('/get_admin_user/{id}', [AdminAuthController::class, 'getAdminUser']);
Route::post('create_admin', [AdminAuthController::class, 'create']);
Route::post('edit_admin', [AdminAuthController::class, 'edit']);

Route::get('/get_participants', [ParticipantController::class, 'getParticipants'])->name('get_participants')->middleware('auth:admin');
Route::get('/get_participant/{id}', [ParticipantController::class, 'getParticipant'])->name('get_participant')->middleware('auth:admin');
Route::post('/create_participant', [ParticipantController::class, 'createParticipant'])->name('create_participant')->middleware('auth:admin');
Route::post('edit_participant', [ParticipantController::class, 'editParticipant'])->name('edit_participant')->middleware('auth:admin');

Route::get('/get_lab_personel', [ParticipantController::class, 'getLabPersonel'])->name('get_lab_personel')->middleware('auth:admin');
Route::get('/get_lab_personel/{id}', [ParticipantController::class, 'getLabPersonelById'])->middleware('auth:admin');
Route::post('/create_lab_personel', [ParticipantController::class, 'createLabPersonel'])->name('create_lab_personel')->middleware('auth:admin');
Route::post('/edit_lab_personel', [ParticipantController::class, 'editPersonel'])->name('edit_lab_personel')->middleware('auth:admin');

Route::get('/get_readiness', [PTReadinessController::class, 'getReadiness'])->name('get_readiness')->middleware('auth:admin');
Route::post('/create_readiness', [PTReadinessController::class, 'saveReadiness'])->name('create_readiness')->middleware('auth:admin');
Route::get('/get_readiness_by_id/{id}', [PTReadinessController::class, 'getReadinessById'])->middleware('auth:admin');
Route::post('/edit_readiness', [PTReadinessController::class, 'editReadiness'])->name('edit_readiness')->middleware('auth:admin');

Route::get('/get_shipments', [PTShipmentController::class, 'getShipments'])->name('get_shipment')->middleware('auth:admin');
Route::post('/create_shipment', [PTShipmentController::class, 'saveShipment'])->name('create_shipment')->middleware('auth:admin');
Route::post('/update_shipment', [PTShipmentController::class, 'updateShipment'])->name('update_shipment')->middleware('auth:admin');
Route::get('/get_shipment_by_id/{id}', [PTShipmentController::class, 'getShipmentById'])->middleware('auth:admin');

Route::get('/get_user_samples', [PTShipmentController::class, 'getUserSamples'])->middleware('auth');

Route::get('/get_participant_demographics', [QCParticipantController::class, 'getParticipantDemographics']);

Route::get('/get_counties', [CommonsController::class, 'getCounties']);

Route::get('/get_qc_by_month_county_facility', [AggregatorController::class, 'getQcByMonthCountyFacility']);
