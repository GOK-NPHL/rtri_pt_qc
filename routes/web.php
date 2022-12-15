<?php

use App\Http\Controllers\AdminAuthController;
use App\Http\Controllers\CustomAuthController;
use App\Http\Controllers\PT\PTAdminController;
use App\Http\Controllers\QC\QCAdminController;
use App\Http\Controllers\AuthAccessController;
use App\Http\Controllers\QC\QCParticipantController;
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
Auth::routes();


Route::get('/',  [CustomAuthController::class, 'index'])->name('home');
Route::get('index', [CustomAuthController::class, 'index'])->name('index');
Route::get('participant-login', [CustomAuthController::class, 'getParticipantLoginPage'])->name('participant-login');
Route::get('participant-signup', [CustomAuthController::class, 'getParticipantSignupPage'])->name('participant-signup');
Route::get('login', [CustomAuthController::class, 'index'])->name('login');
Route::post('participant-login', [CustomAuthController::class, 'doLogin'])->name('participant-login');
Route::post('participant-signup', [CustomAuthController::class, 'doSignup'])->name('participant-signup');
Route::get('registration', [CustomAuthController::class, 'registration'])->name('register-user');
Route::post('custom-registration', [CustomAuthController::class, 'customRegistration'])->name('register.custom');
Route::get('logout', [CustomAuthController::class, 'signOut'])->name('logout');

Route::get('participant-home', [QCParticipantController::class, 'participantHome'])->name('participant-home');
Route::get('participant-pt-home', [QCParticipantController::class, 'participantPTHome'])->name('participant-pt-home');
Route::get('participant-qc-demographics', [QCParticipantController::class, 'participantDemographicsPage'])->name('participant-qc-demographics');

Route::get('admin-logout', [AdminAuthController::class, 'signOut'])->name('admin-logout');
Route::post('admin-login', [AdminAuthController::class, 'doLogin'])->name('admin-login');
Route::get('admin-login', [AdminAuthController::class, 'adminLogin'])->name('admin-login');

Route::get('admin-home', 'QC\QCAdminController@adminHome')->name('admin-home');

Route::get('add-admin-user', 'QC\QCAdminController@addUser')->name('add-admin-user');
Route::get('edit-admin-user/{userId}', 'QC\QCAdminController@editUser')->name('edit-admin-user');
Route::get('list-admin-user', 'QC\QCAdminController@listUser')->name('list-admin-user');

Route::get('add-personel', 'QC\QCAdminController@addPersonel')->name('add-personel');
Route::get('list-personel', 'QC\QCAdminController@listPersonel')->name('list-personel');
Route::get('edit-personel/{personelId}', [QCAdminController::class, 'editPersonel'])->name('edit-personel');

Route::get('add-lab', 'QC\QCAdminController@addLab')->name('add-lab');
Route::get('edit-lab/{labId}', [QCAdminController::class, 'editLab'])->name('edit-lab');
Route::get('list-lab', 'QC\QCAdminController@listLab')->name('list-lab');

Route::get('pt-shipment', 'PT\PTAdminController@ptShipment')->name('pt-shipment');
Route::get('edit-shipment/{shipmentId}', [PTAdminController::class, 'editShipment'])->name('edit-shipment');


Route::get('list-readiness', [PTAdminController::class, 'listReadiness'])->name('list-readiness');
Route::get('edit-readiness/{readinessId}', [PTAdminController::class, 'editReadiness'])->name('edit-readiness');
Route::get('add-readiness', [PTAdminController::class, 'addReadiness'])->name('add-readiness');

// Route::get('fcdrr-dashboard', [QCParticipantController::class, 'fcdrrDashboard'])->name('fcdrr-dashboard');
// Route::get('fcdrr-submissions', [QCParticipantController::class, 'fcdrrSubmissions'])->name('fcdrr-submissions');

// Route::get('fcdrr-report', 'QC\QCAdminController@listFcdrrReports')->name('fcdrr-report');
// Route::get('get-fcdrr-report/{id}', 'QC\QCAdminController@fcdrrReport')->name('get-fcdrr-report');

// Route::get('fcdrr-indicators', 'QC\QCAdminController@fcdrrIndicators')->name('fcdrr-indicators');

// Route::get('fcdrr-settings', 'QC\QCAdminController@fcdrrSettings')->name('fcdrr-settings');

Route::prefix('access-management')->group(function () {
    Route::redirect('/', '/access-management/roles');
    Route::prefix('roles')->group(function () {
        Route::get('/', [AuthAccessController::class, 'manageRoles'])->name('manage-roles');
        Route::get('/new', [AuthAccessController::class, 'newRole'])->name('new-role');
        Route::get('/edit/{roleId}', [AuthAccessController::class, 'editRole'])->name('edit-role');
    });
    
    Route::get('permissions', [AuthAccessController::class, 'managePermissions'])->name('manage-permissions');
    
    Route::prefix('groups')->group(function () {
        Route::get('/', [AuthAccessController::class, 'manageGroups'])->name('manage-groups');
        Route::get('/new', [AuthAccessController::class, 'newGroup'])->name('new-group');
        Route::get('/edit/{groupId}', [AuthAccessController::class, 'editGroup'])->name('edit-group');
    });
});
