<?php

use App\FcdrrCommodity;
use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\AuthAccessController;
use App\Http\Controllers\ParticipantController;
use App\Http\Controllers\PT\PTReadinessController;
use App\Http\Controllers\PT\PTShipmentController;
use App\Http\Controllers\QC\QCAdminUsersController;
use App\Http\Controllers\QC\QCParticipantController;
use App\Http\Controllers\Service\AggregatorController;
use App\Http\Controllers\Service\CommonsController;
use App\Http\Controllers\Service\FcdrrReports;
use App\Http\Controllers\Service\FcdrrCommodities;
use App\Http\Controllers\Service\Submission;
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
Route::post('/save_fcdrr_submission', 'Service\Submission@createFcdrrSubmission');
Route::get('/get_submissions', 'Service\Submission@getSubmissions');
Route::get('/get_fcdrr_submissions', 'Service\Submission@getFcdrrSubmissions');
Route::get('/get_all_fcdrr_submissions',  [FcdrrReports::class, 'getAllFcdrrSubmissions']);
Route::get('/get_fcdrr_submission_by_id/{id}', [FcdrrReports::class, 'getFcdrrSubmissionById']);
Route::post('/save_fcdrr_setting', [FcdrrReports::class, 'saveFcdrrSetting']);
Route::get('/get_all_fcdrr_settings',  [FcdrrReports::class, 'getAllFcdrrSettings']);

Route::prefix('fcdrr')->group(function () {
    //--SUBMISSION--
    Route::get('/submissions',  [FcdrrReports::class, 'getAllFcdrrSubmissions']);
    Route::get('/submissions/{id}', [FcdrrReports::class, 'getFcdrrSubmissionById']);
    Route::get('/submission/{id}', [FcdrrReports::class, 'getFcdrrSubmissionById']);
    //--SETTINGS--
    Route::get('/settings',  [FcdrrReports::class, 'getAllFcdrrSettings']);
    Route::post('/setting', [FcdrrReports::class, 'saveFcdrrSetting']);
    Route::get('/settings/{name}', [FcdrrReports::class, 'getFcdrrSettingByName']);
    Route::get('/setting/{name}', [FcdrrReports::class, 'getFcdrrSettingByName']);
    //--REPORTS--
    Route::get('/reports', [FcdrrReports::class, 'getFcdrrReports']);
    Route::get('/reports/{id}', [FcdrrReports::class, 'getFcdrrReportById']);
    //reports by county
    // Route::get('/reports/county/{county}', [FcdrrReports::class, 'getReportsByCounty']);
    // //reports by lab
    // Route::get('/reports/lab/{lab}', [FcdrrReports::class, 'getReportsByLab']);
    // //reports by period
    // Route::get('/reports/period/{period}', [FcdrrReports::class, 'getReportsByPeriod']);
    //--COMMODITIES--
    Route::get('/commodities', [FcdrrCommodities::class, 'getAllCommodities']);
    Route::get('/commodities/{id}', [FcdrrCommodities::class, 'getCommodityById']);
    Route::post('/commodities', [FcdrrCommodities::class, 'createCommodity']);
    Route::put('/commodities/{id}', [FcdrrCommodities::class, 'updateCommodity']);
    Route::delete('/commodities/{id}', [FcdrrCommodities::class, 'deleteCommodity']);
});

Route::delete('/delete_submissions/{id}', 'Service\Submission@deleteSubmission');
Route::put('/submit_submissions/{id}', 'Service\Submission@submitSubmission');
Route::get('/get_submission_by_id/{id}', [Submission::class, 'getSubmissionById']);

Route::delete('/delete_fcdrr_submissions/{id}', 'Service\Submission@deleteFcdrrSubmission');
Route::get('/get_admin_users', [QCAdminUsersController::class, 'getAdminUsers']);
Route::get('/get_admin_user/{id}', [AdminAuthController::class, 'getAdminUser']);
Route::post('create_admin', [AdminAuthController::class, 'create']);
Route::post('edit_admin', [AdminAuthController::class, 'edit']);

Route::prefix('/access-management')->group(function (){
    Route::get('/permissions', [AuthAccessController::class, 'getPermissions']);
    Route::get('/user-permissions', [AuthAccessController::class, 'getUserPermissions']);
    Route::get('/permission/{id}', [AuthAccessController::class, 'getPermission']);
    Route::get('/permission', [AuthAccessController::class, 'getPermission']);
    Route::post('/permission', [AuthAccessController::class, 'createPermission']);
    Route::post('/permissions', [AuthAccessController::class, 'createPermission']);
    Route::put('/permission/{id}', [AuthAccessController::class, 'updatePermission']);
    Route::delete('/permission/{id}', [AuthAccessController::class, 'deletePermission']);

    Route::get('/roles', [AuthAccessController::class, 'getRoles']);
    Route::get('/user-roles', [AuthAccessController::class, 'getUserRoles']);
    Route::get('/user-with-role', [AuthAccessController::class, 'getAllUsersWithRole']);
    Route::get('/role/{id}', [AuthAccessController::class, 'getRole']);
    Route::get('/role', [AuthAccessController::class, 'getRole']);
    Route::post('/role', [AuthAccessController::class, 'createRole']);
    Route::post('/roles', [AuthAccessController::class, 'createRole']);
    Route::put('/role/{id}', [AuthAccessController::class, 'updateRole']);
    Route::delete('/role/{id}', [AuthAccessController::class, 'deleteRole']);

    Route::get('/groups', [AuthAccessController::class, 'getGroups']);
    Route::get('/user-groups', [AuthAccessController::class, 'getUserGroups']);
    Route::get('/group/{id}', [AuthAccessController::class, 'getGroup']);
    Route::get('/group', [AuthAccessController::class, 'getGroup']);
    Route::post('/group', [AuthAccessController::class, 'createGroup']);
    Route::post('/groups', [AuthAccessController::class, 'createGroup']);
    Route::put('/group/{id}', [AuthAccessController::class, 'updateGroup']);
    Route::delete('/group/{id}', [AuthAccessController::class, 'deleteGroup']);

    //users
    Route::get('/users', [AuthAccessController::class, 'getUsers']);
    Route::get('/user/me', [AuthAccessController::class, 'getCurrentUserParams']);
    Route::get('users-by-role', [AuthAccessController::class, 'getUsersByRole']);
    Route::get('/user/{id}', [AuthAccessController::class, 'getUser']);
    Route::get('/user', [AuthAccessController::class, 'getUser']);
    Route::post('/user', [AuthAccessController::class, 'createUser']);
    Route::post('/users', [AuthAccessController::class, 'createUser']);
    Route::put('/user/{id}', [AuthAccessController::class, 'updateUser']);
    Route::delete('/user/{id}', [AuthAccessController::class, 'deleteUser']);

});

Route::get('/get_participants', [ParticipantController::class, 'getParticipants'])->name('get_participants')->middleware('auth:admin');
Route::get('/get_participant/{id}', [ParticipantController::class, 'getParticipant'])->name('get_participant')->middleware('auth:admin');
Route::post('/create_participant', [ParticipantController::class, 'createParticipant'])->name('create_participant')->middleware('auth:admin');
Route::post('edit_participant', [ParticipantController::class, 'editParticipant'])->name('edit_participant')->middleware('auth:admin');

Route::get('/get_lab_personel', [ParticipantController::class, 'getLabPersonel'])->name('get_lab_personel')->middleware('auth:admin');
Route::get('/get_lab_personel/{id}', [ParticipantController::class, 'getLabPersonelById'])->middleware('auth:admin');
Route::post('/create_lab_personel', [ParticipantController::class, 'createLabPersonel'])->name('create_lab_personel')->middleware('auth:admin');
Route::post('/edit_lab_personel', [ParticipantController::class, 'editPersonel'])->name('edit_lab_personel')->middleware('auth:admin');
Route::post('/own_bio_update', [ParticipantController::class, 'editOwnPersonalBio'])->name('own_bio_update')->middleware('auth');

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


Route::get('/get_fcdrr_reporting_rates/{period}', [FcdrrReports::class, 'getFcdrrReportingRates']);
