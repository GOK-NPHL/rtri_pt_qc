<?php

namespace App\Http\Controllers\Service;

use App\qcsubmission as SubmissionModel;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class DissagrationOverallByQCLot extends Controller
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
            '   qcsubmissions.kit_lot_no,
                count(*) as correct_count
            '

            //     '   qcsubmissions.kit_lot_no,
            //     count(*) as correct_count,
            //     CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date
            // '
        )
            ->where('result_recent_control_line', 1)
            ->where('result_recent_longterm_line', 0)
            ->where('result_recent_verification_line', 1)
            // ->groupBy('testing_date', 'qcsubmissions.kit_lot_no');
            ->groupBy('qcsubmissions.kit_lot_no');

        $results = $this->joinToTotalTested($correctCounts);

        return $results;
    }

    function getCorrectLontermByMonthFacility()
    {

        $correctCounts = SubmissionModel::selectRaw(
            '   qcsubmissions.kit_lot_no,
            count(*) as correct_count
        '

            //     '   qcsubmissions.kit_lot_no,
            //     count(*) as correct_count,
            //     CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date
            // '
        )
            ->where('result_lt_control_line', 1)
            ->where('result_lt_longterm_line', 1)
            ->where('result_lt_verification_line', 1)
            // ->groupBy('testing_date', 'qcsubmissions.kit_lot_no');
            ->groupBy('qcsubmissions.kit_lot_no');

        $results = $this->joinToTotalTested($correctCounts);

        return $results;
    }

    function getCorrectNegativeByMonthFacility()
    {

        $correctCounts = SubmissionModel::selectRaw(
            '   qcsubmissions.kit_lot_no,
            count(*) as correct_count
        '

            //     '   qcsubmissions.kit_lot_no,
            //     count(*) as correct_count,
            //     CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date
            // '
        )
            ->where('result_negative_control_line', 1)
            ->where('result_negative_longterm_line', 0)
            ->where('result_negative_verification_line', 0)
            // ->groupBy('testing_date', 'qcsubmissions.kit_lot_no');
            ->groupBy('qcsubmissions.kit_lot_no');
        $results = $this->joinToTotalTested($correctCounts);

        return $results;
    }


    function getInvalidsByMonthFacility()
    {

        $correctCounts = SubmissionModel::selectRaw(
            '   qcsubmissions.kit_lot_no,
            count(*) as correct_count
        '

            //     '   qcsubmissions.kit_lot_no,
            //     count(*) as correct_count,
            //     CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date
            // '
        )

            ->where(function ($q) {
                $q->where('result_negative_control_line', 0)->orWhere('result_recent_control_line', 0)->orWhere('result_lt_control_line', 0)
                    ->orWhere(function ($q) {
                        $q->where('result_lt_control_line', 1)->where('result_lt_longterm_line', 1)->where('result_lt_verification_line', 0);
                    });
            })
            // ->groupBy('testing_date', 'qcsubmissions.kit_lot_no');
            ->groupBy('qcsubmissions.kit_lot_no');
        $results = $this->joinToTotalTested($correctCounts);

        return $results;
    }

    function joinToTotalTested($recentsCount)
    {
        // CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date, 
        $results =
            DB::table('qcsubmissions')->selectRaw('count(*) as total_tests,
            
            qcsubmissions.kit_lot_no, COALESCE(recentsCount.correct_count,0) as correct_count')
            ->leftjoinSub($recentsCount, 'recentsCount', function ($join) {
                $join->on('qcsubmissions.kit_lot_no', '=', 'recentsCount.kit_lot_no');
            }, 'left')
            // ->groupBy('testing_date', 'qcsubmissions.kit_lot_no', 'correct_count')
            ->groupBy('qcsubmissions.kit_lot_no', 'correct_count')
            ->get();
        return $results;
    }
    //end of dissagrgation by month, kitlot
}
