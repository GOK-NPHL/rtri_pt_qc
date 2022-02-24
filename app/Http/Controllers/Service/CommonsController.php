<?php

namespace App\Http\Controllers\Service;

use App\County;
use App\FcdrrSubmission;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class CommonsController extends Controller
{

    public function getCounties()
    {
        try {
            return County::all();
            // return SubmissionModel::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting counties: ' . $ex->getMessage()], 500);
        }
    }

    public function fetchFcdrrSubmissions($isGetAll)
    {
        $user = Auth::user();
        try {
            $submissions = FcdrrSubmission::select(
                'fcdrr_submissions.id',
                'fcdrr_submissions.submitted',
                'fcdrr_submissions.report_date',
                'laboratories.lab_name',
                'laboratories.mfl_code',
                'laboratories.commodities',
                'counties.name as county',
                DB::raw('max(report_date) as latest_date')
            )->join('laboratories', 'laboratories.id', '=', 'fcdrr_submissions.lab_id')
                ->join('counties', 'laboratories.county', '=', 'counties.id');

            if (!$isGetAll) {
                $submissions = $submissions
                    ->where('fcdrr_submissions.lab_id', '=', $user->laboratory_id);
            }
            $submissions = $submissions
                ->groupBy(
                    'fcdrr_submissions.id',
                    'fcdrr_submissions.report_date',
                    'laboratories.lab_name',
                    'laboratories.mfl_code',
                    'counties.name'
                )
                ->orderBy('fcdrr_submissions.id', 'desc')->get();

            return $submissions;
            // return SubmissionModel::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting data: ' . $ex->getMessage()], 500);
        }
    }

    public function fetchFcdrrSubmissionsByCounty(){
        $user = Auth::user();

        try {
            $submissions = FcdrrSubmission::select(
                'fcdrr_submissions.id',
                'fcdrr_submissions.report_date',
                'laboratories.lab_name',
                'laboratories.mfl_code',
                'counties.name as county',
                DB::raw('max(report_date) as latest_date')
            )->join('laboratories', 'laboratories.id', '=', 'fcdrr_submissions.lab_id')
                ->join('counties', 'laboratories.county', '=', 'counties.id');
            return $submissions;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting data: ' . $ex->getMessage()], 500);
        }
    }
}
