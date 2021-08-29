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

    // dissagrgation by month, lab, kitlot
    function getCorrectRecentsByMonthFacility()
    {

        $correctCounts = SubmissionModel::selectRaw(
            'laboratories.lab_name as lab_name,
            laboratories.id as lab_id,
                qcsubmissions.kit_lot_no,
                count(*) as correct_count,
                CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date
            '
        )
            ->join('laboratories', 'laboratories.id', '=', 'qcsubmissions.lab_id')
            ->where('result_recent_control_line', 1)
            ->where('result_recent_longterm_line', 0)
            ->where('result_recent_verification_line', 1)
            ->groupBy('laboratories.id', 'testing_date', 'qcsubmissions.kit_lot_no');

        $results = $this->joinToTotalTested($correctCounts);

        return $results;
    }

    function getCorrectLontermByMonthFacility()
    {

        $correctCounts = SubmissionModel::selectRaw(
            'laboratories.lab_name as lab_name,
                laboratories.id as lab_id,
                    qcsubmissions.kit_lot_no,
                    count(*) as correct_count,
                    CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date
                    '
        )
            ->join('laboratories', 'laboratories.id', '=', 'qcsubmissions.lab_id')
            ->where('result_lt_control_line', 1)
            ->where('result_lt_longterm_line', 1)
            ->where('result_lt_verification_line', 1)
            ->groupBy('laboratories.id', 'testing_date', 'qcsubmissions.kit_lot_no');

        $results = $this->joinToTotalTested($correctCounts);

        return $results;
    }

    function getCorrectNegativeByMonthFacility()
    {

        $correctCounts = SubmissionModel::selectRaw(
            'laboratories.lab_name as lab_name,
                    laboratories.id as lab_id,
                        qcsubmissions.kit_lot_no,
                        count(*) as correct_count,
                        CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date
                        '
        )
            ->join('laboratories', 'laboratories.id', '=', 'qcsubmissions.lab_id')
            ->where('result_negative_control_line', 1)
            ->where('result_negative_longterm_line', 0)
            ->where('result_negative_verification_line', 0)
            ->groupBy('laboratories.id', 'testing_date', 'qcsubmissions.kit_lot_no');

        $results = $this->joinToTotalTested($correctCounts);

        return $results;
    }


    function getInvalidsByMonthFacility()
    {

        $correctCounts = SubmissionModel::selectRaw(
            'laboratories.lab_name as lab_name,
                    laboratories.id as lab_id,
                        qcsubmissions.kit_lot_no,
                        count(*) as correct_count,
                        CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date
                        '
        )
            ->join('laboratories', 'laboratories.id', '=', 'qcsubmissions.lab_id')

            ->where(function ($q) {
                $q->where('result_negative_control_line', 0)->orWhere('result_recent_control_line', 0)->orWhere('result_lt_control_line', 0)
                    ->orWhere(function ($q) {
                        $q->where('result_lt_control_line', 1)->where('result_lt_longterm_line', 1)->where('result_lt_verification_line', 0);
                    });
            })
            ->groupBy('laboratories.id', 'testing_date', 'qcsubmissions.kit_lot_no');
        $results = $this->joinToTotalTested($correctCounts);

        return $results;
    }

    function joinToTotalTested($recentsCount)
    {
        $results =
            DB::table('qcsubmissions')->selectRaw('count(*) as total_tests,laboratories.lab_name as lab_name,
            CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date, 
            qcsubmissions.kit_lot_no, laboratories.id as lab_id, COALESCE(recentsCount.correct_count,0) as correct_count')
            ->join('laboratories', 'laboratories.id', '=', 'qcsubmissions.lab_id')
            ->leftjoinSub($recentsCount, 'recentsCount', function ($join) {
                $join->on('laboratories.id', '=', 'recentsCount.lab_id');
                $join->on('qcsubmissions.kit_lot_no', '=', 'recentsCount.kit_lot_no');
                $join->on(
                    DB::raw('CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR))'),
                    '=',
                    'recentsCount.testing_date'
                );
            }, 'left')
            ->groupBy('laboratories.id', 'testing_date', 'qcsubmissions.kit_lot_no', 'correct_count')
            ->orderBy('testing_date')
            ->get();
        return $results;
    }
    //end of dissagrgation by month, lab, kitlot
}
