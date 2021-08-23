<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\qcsubmission as SubmissionModel;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class Submission extends Controller
{



    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth:sanctum');
    }

    public function createSubmission(Request $request)
    {
        try {
            $submission = $request->submission;
            Log::info($request->submission);
            $submissionModel = new SubmissionModel([

                "testing_date" => $submission["testingDate"],
                "kit_date_received" => $submission["kitReceivedDate"],
                "lot_date_received" => $submission["qcLotReceivedDate"],
                "kit_expiry_date" => $submission["kitExpiryDate"],
                "kit_lot_no" => $submission["kitLotNo"],
                "name_of_test" => $submission["nameOfTest"],
                "qc_lot_no" => $submission["kitLotNo"],
                "lab_id" => $submission["labId"],
                "user_id" => $submission["userId"],
                "sample_reconstituion_date" => $submission["qcReconstituionDate"],

                "test_justification" => $submission["testJustification"],
                "qc_tested" => $submission["isQCTested"],
                "not_test_reason" => $submission["qcNotTestedReason"],
                "other_not_tested_reason" => $submission["qcNotTestedOtherReason"],

                "result_lt_control_line" => $submission["resultLongterm"]["c"],
                "result_lt_verification_line" => $submission["resultLongterm"]["v"],
                "result_lt_longterm_line" => $submission["resultLongterm"]["lt"],

                "result_recent_control_line" => $submission["resultRecent"]["c"],
                "result_recent_verification_line" => $submission["resultRecent"]["v"],
                "result_recent_longterm_line" => $submission["resultRecent"]["lt"],

                "result_negative_control_line" => $submission["resultNegative"]["c"],
                "result_negative_verification_line" => $submission["resultNegative"]["v"],
                "result_negative_longterm_line" => $submission["resultNegative"]["lt"],

                "interpretation_longterm" => $submission["qcLongtermIntepreation"],
                "interpretation_recent" => $submission["qcRecentIntepreation"],
                "interpretation_negative" => $submission["qcNegativeIntepreation"],
            ]);

            $submissionModel->save();
            return response()->json(['Message' => 'Saved successfully'], 200);
        } catch (Exception $ex) {
            Log::error($ex);
            return response()->json(['Message' => 'Could not save sumbmission: ' . $ex->getMessage()], 500);
        }
    }

    public function getSubmissions()
    {

        try {
            $submissions = SubmissionModel::select(
                'qcsubmissions.id',
                'qcsubmissions.kit_date_received',
                'qcsubmissions.kit_lot_no',
                'qcsubmissions.testing_date',
                'laboratories.lab_name',
                'laboratories.mfl_code',
            )->join('laboratories', 'laboratories.id', '=', 'qcsubmissions.lab_id')
                ->get();
            return $submissions;
            // return SubmissionModel::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting org units: ' . $ex->getMessage()], 500);
        }
    }

    public function deleteSubmission(Request $request)
    {

        try {
            DB::table('qcsubmissions')->where('id', $request->id)->delete();
            return response()->json(['Message' => 'Deleted Successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error deleting submission: ' . $ex->getMessage()], 500);
        }
    }
}
