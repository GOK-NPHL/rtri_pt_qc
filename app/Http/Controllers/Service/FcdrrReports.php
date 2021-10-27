<?php

namespace App\Http\Controllers\Service;

use App\FcdrrSubmission;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FcdrrReports extends Controller
{
    public function __construct()
    {
        // $this->middleware('guest:admin', ['except' => ['signOut']]);
        // $this->middleware('auth:admin', ['except' => ['signOut', 'adminLogin', 'doLogin']]);
    }

    public function getAllFcdrrSubmissions()
    {
        try {
            $cController  = new CommonsController();
            return $cController->fetchFcdrrSubmissions(true);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting org units: ' . $ex->getMessage()], 500);
        }
    }

    public function getFcdrrSubmissionById(Request $request)
    {

        try {
            $submission = FcdrrSubmission::select(
                'fcdrr_submissions.id',
                'fcdrr_submissions.start_month',
                'fcdrr_submissions.end_month',
                'fcdrr_submissions.lab_id',
                'fcdrr_submissions.user_id',
                'laboratories.lab_name',
                'laboratories.mfl_code as mfl',
                'counties.name as county'
            )->join('laboratories', 'laboratories.id', '=', 'fcdrr_submissions.lab_id')
                ->join('counties', 'laboratories.county', '=', 'counties.id')
                ->where('fcdrr_submissions.id', '=', $request->id)
                ->get();

            $submissionResults = DB::table('fcdrr_submission_results')
                ->select('*')
                ->where('submission_id', $request->id)
                ->get();

            $payload = ['data' => $submission[0], 'results' => $submissionResults];

            return $payload;
            // return SubmissionModel::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting org units: ' . $ex->getMessage()], 500);
        }
    }
}
