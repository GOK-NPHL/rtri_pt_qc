<?php

namespace App\Http\Controllers\Service;

use App\County;
use App\FcdrrSubmission;
use App\Http\Controllers\Controller;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
                'fcdrr_submissions.start_month',
                'fcdrr_submissions.end_month',
                'laboratories.lab_name',
                'laboratories.mfl_code',
                'counties.name as county'
            )->join('laboratories', 'laboratories.id', '=', 'fcdrr_submissions.lab_id')
                ->join('counties', 'laboratories.county', '=', 'counties.id');

            if (!$isGetAll) {
                $submissions = $submissions
                    ->where('fcdrr_submissions.lab_id', '=', $user->laboratory_id);
            }
            $submissions = $submissions->orderBy('fcdrr_submissions.id', 'desc')->get();

            return $submissions;
            // return SubmissionModel::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting org units: ' . $ex->getMessage()], 500);
        }
    }
}
