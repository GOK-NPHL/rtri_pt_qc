<?php

namespace App\Http\Controllers\Service;

use App\Http\Controllers\Controller;
use App\qcsubmission as SubmissionModel;
use App\QcSubmissionResult;
use App\RepeatSubmission;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
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
                "sample_type" => $submission["sampleType"],
                "tester_name" => $submission["testerName"],
                "test_justification" => $submission["testJustification"],
                "qc_tested" => $submission["isQCTested"],
                "not_test_reason" => $submission["qcNotTestedReason"],
                "other_not_tested_reason" => $submission["qcNotTestedOtherReason"],

            ]);

            $submissionModel->save();
            $submissionId = $submissionModel->id;

            $qcLtResult = new QcSubmissionResult([
                "control_line" => $submission["resultLongterm"]["c"],
                "verification_line" => $submission["resultLongterm"]["v"],
                "interpretation" => $submission["qcLongtermIntepreation"],
                "longterm_line" => $submission["resultLongterm"]["lt"],
                "qcsubmission_id" => $submissionId,
                "type" => "longterm"
            ]);
            $qcLtResult->save();

            $qcNegativeResult = new QcSubmissionResult([
                "control_line" => $submission["resultNegative"]["c"],
                "verification_line" => $submission["resultNegative"]["v"],
                "interpretation" => $submission["qcNegativeIntepreation"],
                "longterm_line" => $submission["resultNegative"]["lt"],
                "qcsubmission_id" => $submissionId,
                "type" => "negative"

            ]);
            $qcNegativeResult->save();

            $qcRecentResult = new QcSubmissionResult([

                "control_line" => $submission["resultRecent"]["c"],
                "verification_line" => $submission["resultRecent"]["v"],
                "interpretation" => $submission["qcRecentIntepreation"],
                "longterm_line" => $submission["resultRecent"]["lt"],
                "qcsubmission_id" => $submissionId,
                "type" => "recent"
            ]);
            $qcRecentResult->save();

            $this->saveNegativeRepeats($submission, $submissionId);
            $this->saveRecentRepeats($submission, $submissionId);
            $this->saveLongtermRepeats($submission, $submissionId);

            return response()->json(['Message' => 'Saved successfully'], 200);
        } catch (Exception $ex) {
            Log::error($ex);
            return response()->json(['Message' => 'Could not save sumbmission: ' . $ex->getMessage()], 500);
        }
    }

    function saveNegativeRepeats($submission, $submissionId)
    {

        if (count($submission["resultNegativeRepeat"]) > 0) {

            for ($x = 0; $x < count($submission["resultNegativeRepeat"]); $x++) {

                if ($submission["resultNegativeRepeat"][$x]) {
                    $submissionModel = new RepeatSubmission([
                        "qcsubmissions_id" => $submissionId,
                        "result_control_line" => $submission["resultNegativeRepeat"][$x]["c"],
                        "result_verification_line" => $submission["resultNegativeRepeat"][$x]["v"],
                        "result_longterm_line" => $submission["resultNegativeRepeat"][$x]["lt"],
                        "interpretation" => $submission["qcNegativeIntepreationRepeat"][$x],
                        "test_type" => "negative"
                    ]);

                    $submissionModel->save();
                } else {
                    Log::info("empty result === >");
                    Log::info($submission["resultNegativeRepeat"][$x]);
                }
            }
        }
    }

    function saveRecentRepeats($submission, $submissionId)
    {

        if (count($submission["resultRecentRepeat"]) > 0) {

            for ($x = 0; $x < count($submission["resultRecentRepeat"]); $x++) {

                if ($submission["resultRecentRepeat"][$x]) {
                    $submissionModel = new RepeatSubmission([
                        "qcsubmissions_id" => $submissionId,
                        "result_control_line" => $submission["resultRecentRepeat"][$x]["c"],
                        "result_verification_line" => $submission["resultRecentRepeat"][$x]["v"],
                        "result_longterm_line" => $submission["resultRecentRepeat"][$x]["lt"],
                        "interpretation" => $submission["qcRecentIntepreationRepeat"][$x],
                        "test_type" => "recent"
                    ]);

                    $submissionModel->save();
                } else {
                    Log::info("empty result === >");
                    Log::info($submission["resultRecentRepeat"][$x]);
                }
            }
        }
    }

    function saveLongtermRepeats($submission, $submissionId)
    {

        if (count($submission["resultLongtermRepeat"]) > 0) {

            for ($x = 0; $x < count($submission["resultLongtermRepeat"]); $x++) {

                if ($submission["resultLongtermRepeat"][$x]) {
                    $submissionModel = new RepeatSubmission([
                        "qcsubmissions_id" => $submissionId,
                        "result_control_line" => $submission["resultLongtermRepeat"][$x]["c"],
                        "result_verification_line" => $submission["resultLongtermRepeat"][$x]["v"],
                        "result_longterm_line" => $submission["resultLongtermRepeat"][$x]["lt"],
                        "interpretation" => $submission["qcLongtermIntepreationRepeat"][$x],
                        "test_type" => "longterm"
                    ]);

                    $submissionModel->save();
                } else {
                    Log::info("empty result === >");
                    Log::info($submission["resultLongtermRepeat"][$x]);
                }
            }
        }
    }

    public function getSubmissions()
    {
        $user = Auth::user();
        try {
            $submissions = SubmissionModel::select(
                'qcsubmissions.id',
                'qcsubmissions.kit_date_received',
                'qcsubmissions.kit_lot_no',
                'qcsubmissions.testing_date',
                'laboratories.lab_name',
                'laboratories.mfl_code',
            )->join('laboratories', 'laboratories.id', '=', 'qcsubmissions.lab_id')
                ->where('qcsubmissions.lab_id', '=', $user->laboratory_id)
                ->get();
            return $submissions;
            // return SubmissionModel::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting org units: ' . $ex->getMessage()], 500);
        }
    }

    public function getSubmissionById(Request $request)
    {

        $user = Auth::user();
        try {
            $submission = SubmissionModel::select(
                'qcsubmissions.id',
                'qcsubmissions.testing_date',
                'qcsubmissions.name_of_test',
                'qcsubmissions.kit_lot_no',
                'qcsubmissions.kit_date_received',
                'qcsubmissions.kit_expiry_date',
                'qcsubmissions.qc_lot_no',
                'qcsubmissions.lot_date_received',
                'qcsubmissions.sample_reconstituion_date',
                'qcsubmissions.user_id',
                'qcsubmissions.sample_type',
                'qcsubmissions.tester_name',
                'qcsubmissions.test_justification',
                'qcsubmissions.qc_tested',
                'qcsubmissions.not_test_reason',
                'qcsubmissions.other_not_tested_reason',
                'laboratories.email',
                'qcsubmissions.lab_id',
                'laboratories.lab_name',
                'laboratories.mfl_code'

            )->join('laboratories', 'laboratories.id', '=', 'qcsubmissions.lab_id')

                ->where('qcsubmissions.lab_id', '=', $user->laboratory_id)
                ->where('qcsubmissions.id', '=', $request->id)
                ->get();

            $submissionResults = DB::table('qc_submission_results')
                ->select('type', 'control_line', 'verification_line', 'longterm_line', 'interpretation')
                ->where('qcsubmission_id', $request->id)
                ->get();

            $payload = ['data' => $submission[0], 'test_results' => $submissionResults];

            return $payload;
            // return SubmissionModel::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting org units: ' . $ex->getMessage()], 500);
        }
    }

    public function deleteSubmission(Request $request)
    {
        $user = Auth::user();
        try {

            DB::table('qcsubmissions')->where('id', $request->id)->where('user_id', $user->id)->delete();
            DB::table('repeat_submissions')->where('qcsubmissions_id', $request->id)->delete();
            DB::table('qc_submission_results')->where('qcsubmission_id', $request->id)->delete();
            return response()->json(['Message' => 'Deleted Successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error deleting submission: ' . $ex->getMessage()], 500);
        }
    }
}
