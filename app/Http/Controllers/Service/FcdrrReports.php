<?php

namespace App\Http\Controllers\Service;

use App\FcdrrSubmission;
use App\Http\Controllers\Controller;
use App\Laboratory;
use App\Service\FcdrrSetting;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

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
                'fcdrr_submissions.report_date',
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



    public function saveFcdrrSetting(Request $request)
    {
        try {
            $fcdrrSetting = FcdrrSetting::updateOrCreate(
                [
                    'name' => $request->name,
                ],
                [
                    "name" =>  $request->name,
                    "value" =>  $request->value,
                ]

            );

            return response()->json(['Message' => 'Saved successfully'], 200);
        } catch (Exception $ex) {
            Log::error($ex);
            return response()->json(['Message' => 'Could not save setting: ' . $ex->getMessage()], 500);
        }
    }

    public function getAllFcdrrSettings()
    {
        try {
            return  FcdrrSetting::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting Settings: ' . $ex->getMessage()], 500);
        }
    }

    public function getFcdrrReportingRates(Request $request)
    {
        try {
            $prevMonth = null;
            $month = null;
            $year = null;

            if (empty($request->period) || !isset($request->period) || $request->period == 'null') {
                $prevMonth = date('Y-m-d', strtotime(date('Y-m') . " -1 month"));
                $month = date("m", strtotime($prevMonth));
                $year = date("Y", strtotime($prevMonth));
            } else {
                $prevMonth = date('Y-m-d', strtotime($request->period));
                $month = date("m", strtotime($prevMonth));
                $year = date("Y", strtotime($prevMonth));
            }

            $submissions = FcdrrSubmission::select(
                DB::raw('count(*) as report_rates')
            )
                ->whereYear('report_date', '=', $year)
                ->whereMonth('report_date', '=', $month);

            $submissions = $submissions->get();

            $totalLabs = Laboratory::select(
                DB::raw('count(*) as total_labs')
            )
                ->get();

            $period = $year . "-" . $month;
            return [
                "report_rates" => ($submissions[0]['report_rates'] / $totalLabs[0]['total_labs']) * 100,
                "period" => $period,
                "total_labs" => $totalLabs[0]['total_labs']
            ];
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting Settings: ' . $ex->getMessage()], 500);
        }
    }
}
