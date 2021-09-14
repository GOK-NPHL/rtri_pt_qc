<?php

namespace App\Http\Controllers\Service;

use App\qcsubmission as SubmissionModel;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DissagrationOverallByMotnh extends Controller
{


    function getDissagrations()
    {

        $correntRecents = $this->getCorrectRecentsByMonthFacility();
        $correntLongterm = $this->getCorrectLontermByMonthFacility();
        $correntNegative = $this->getCorrectNegativeByMonthFacility();
        $invalids = $this->getInvalidsByMonthFacility();

        return [
            'recent' => $correntRecents,
            'longterm' => $correntLongterm,
            'negative' => $correntNegative,
            'invalids' => $invalids
        ];
    }

    // dissagrgation by month, kitlot
    function getCorrectRecentsByMonthFacility()
    {

        $correctCounts = SubmissionModel::selectRaw(

            'qcsubmissions.qc_lot_no,
                count(*) as correct_count,
                CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date
            '
        )
            ->join('qc_submission_results', 'qc_submission_results.qcsubmission_id', '=', 'qcsubmissions.id')
            ->where('qc_submission_results.control_line', 1)
            ->where('qc_submission_results.longterm_line', 0)
            ->where('qc_submission_results.verification_line', 1)
            ->where('qc_submission_results.type', 'recent')

            ->groupBy('testing_date', 'qcsubmissions.qc_lot_no');

        $results = $this->joinToTotalTested($correctCounts, 'recent');

        return $results;
    }

    function getCorrectLontermByMonthFacility()
    {

        $correctCounts = SubmissionModel::selectRaw(
            '
                    qcsubmissions.qc_lot_no,
                    count(*) as correct_count,
                    CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date
                    '
        )
            ->join('qc_submission_results', 'qc_submission_results.qcsubmission_id', '=', 'qcsubmissions.id')
            ->where('qc_submission_results.control_line', 1)
            ->where('qc_submission_results.longterm_line', 1)
            ->where('qc_submission_results.verification_line', 1)
            ->where('qc_submission_results.type', 'longterm')
            ->groupBy('testing_date', 'qcsubmissions.qc_lot_no');

        $results = $this->joinToTotalTested($correctCounts, 'longterm');

        return $results;
    }

    function getCorrectNegativeByMonthFacility()
    {

        $correctCounts = SubmissionModel::selectRaw(
            '
                        qcsubmissions.qc_lot_no,
                        count(*) as correct_count,
                        CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date
                        '
        )
            ->join('qc_submission_results', 'qc_submission_results.qcsubmission_id', '=', 'qcsubmissions.id')
            ->where('qc_submission_results.control_line', 1)
            ->where('qc_submission_results.longterm_line', 0)
            ->where('qc_submission_results.verification_line', 0)
            ->where('qc_submission_results.type', 'negative')
            ->groupBy('testing_date', 'qcsubmissions.qc_lot_no');

        $results = $this->joinToTotalTested($correctCounts, 'negative');

        return $results;
    }


    function getInvalidsByMonthFacility()
    {

        $correctCounts = SubmissionModel::selectRaw(
            '
                        qcsubmissions.qc_lot_no,
                        count(*) as correct_count,
                        CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date
                        '
        )
            ->join('qc_submission_results', 'qc_submission_results.qcsubmission_id', '=', 'qcsubmissions.id')
            ->where(function ($q) {
                $q->where('qc_submission_results.control_line', 0)
                    ->orWhere(function ($q) {
                        $q->where('qc_submission_results.control_line', 1)
                            ->where('qc_submission_results.longterm_line', 1)
                            ->where('qc_submission_results.verification_line', 0)
                            ->where('qc_submission_results.type', 'longterm');
                    });
            })
            ->groupBy('testing_date', 'qcsubmissions.qc_lot_no');
        $results = $this->joinToTotalTested($correctCounts, 'invalids');

        return $results;
    }

    function joinToTotalTested($recentsCount, $type)
    {
        $results = null;
        if ($type != 'invalids') {
            $results =
                DB::table('qcsubmissions')->selectRaw('count(*) as total_tests,
            CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date, 
            qcsubmissions.qc_lot_no, COALESCE(recentsCount.correct_count,0) as correct_count')
                ->join('qc_submission_results', 'qc_submission_results.qcsubmission_id', '=', 'qcsubmissions.id')
                ->leftjoinSub($recentsCount, 'recentsCount', function ($join) {
                    $join->on('qcsubmissions.qc_lot_no', '=', 'recentsCount.qc_lot_no');
                    $join->on(
                        DB::raw('CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR))'),
                        '=',
                        'recentsCount.testing_date'
                    );
                }, 'left')->where('qc_submission_results.type', $type)
                ->groupBy('testing_date', 'qcsubmissions.qc_lot_no', 'correct_count')
                ->orderBy('testing_date')
                ->get();
            return $results;
        } else {
            $results =
                DB::table('qcsubmissions')->selectRaw('count(*) as total_tests,
            CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date, 
            qcsubmissions.qc_lot_no, COALESCE(recentsCount.correct_count,0) as correct_count')
                ->join('qc_submission_results', 'qc_submission_results.qcsubmission_id', '=', 'qcsubmissions.id')
                ->leftjoinSub($recentsCount, 'recentsCount', function ($join) {
                    $join->on('qcsubmissions.qc_lot_no', '=', 'recentsCount.qc_lot_no');
                    $join->on(
                        DB::raw('CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR))'),
                        '=',
                        'recentsCount.testing_date'
                    );
                }, 'left')
                ->groupBy('testing_date', 'qcsubmissions.qc_lot_no', 'correct_count')
                ->orderBy('testing_date')
                ->get();
            return $results;
        }
    }
    //end of dissagrgation by month, kitlot
}
