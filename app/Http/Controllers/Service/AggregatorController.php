<?php

namespace App\Http\Controllers\Service;

use App\qcsubmission as SubmissionModel;
use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class AggregatorController extends Controller
{
    public function __construct()
    {
        // $this->middleware('guest:admin', ['except' => ['signOut']]);
        $this->middleware('auth:admin', ['except' => ['signOut', 'adminLogin', 'doLogin']]);
    }

    function getQcByMonthCountyFacility()
    {
        $correntRecents = $this->getCorrectRecentsByMonthCountyFacility();
        $correntLongterm = $this->getCorrectLontermByMonthCountyFacility();
        $correntNegative = $this->getCorrectNegativeByMonthCountyFacility();
        $invalids = $this->getInvalidsByMonthCountyFacility();
        $dissagrationOverallByMonthObj = new DissagrationOverallByMotnh();
        $dissagrationOverallByQCLot = new DissagrationOverallByQCLot();
        return [
            'county_lab_kit_date' => [
                'recent' => $correntRecents,
                'longterm' => $correntLongterm,
                'negative' => $correntNegative,
                'invalids' => $invalids
            ],
            'lab_kit_date' => $dissagrationOverallByMonthObj->getDissagrations(),
            'kit_lot' => $dissagrationOverallByQCLot->getDissagrations()
        ];
    }

    // dissagrgation by month, county, lab, kitlot
    function getCorrectRecentsByMonthCountyFacility()
    {

        $correctCounts = SubmissionModel::selectRaw(
            'laboratories.lab_name as lab_name,
            laboratories.id as lab_id,
                qcsubmissions.kit_lot_no,
                counties.name as county_name,
                count(*) as correct_count,
                CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date
            '
        )
            ->join('laboratories', 'laboratories.id', '=', 'qcsubmissions.lab_id')
            ->join('counties', 'counties.id', '=', 'laboratories.county')
            ->join('qc_submission_results', 'qc_submission_results.qcsubmission_id', '=', 'qcsubmissions.id')
            ->where('qc_submission_results.control_line', 1)
            ->where('qc_submission_results.longterm_line', 0)
            ->where('qc_submission_results.verification_line', 1)
            ->where('qc_submission_results.type', 'recent')
            ->groupBy('laboratories.id', 'counties.name', 'testing_date', 'qcsubmissions.kit_lot_no');

        $results = $this->joinToTotalTested($correctCounts, 'recent');

        return $results;
    }

    function getCorrectLontermByMonthCountyFacility()
    {

        $correctCounts = SubmissionModel::selectRaw(
            'laboratories.lab_name as lab_name,
                laboratories.id as lab_id,
                    qcsubmissions.kit_lot_no,
                    counties.name as county_name,
                    count(*) as correct_count,
                    CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date
                    '
        )
            ->join('laboratories', 'laboratories.id', '=', 'qcsubmissions.lab_id')
            ->join('counties', 'counties.id', '=', 'laboratories.county')
            ->join('qc_submission_results', 'qc_submission_results.qcsubmission_id', '=', 'qcsubmissions.id')
            ->where('qc_submission_results.control_line', 1)
            ->where('qc_submission_results.longterm_line', 1)
            ->where('qc_submission_results.verification_line', 1)
            ->where('qc_submission_results.type', 'negative')
            ->groupBy('laboratories.id', 'counties.name', 'testing_date', 'qcsubmissions.kit_lot_no');

        $results = $this->joinToTotalTested($correctCounts, 'longterm');

        return $results;
    }

    function getCorrectNegativeByMonthCountyFacility()
    {

        $correctCounts = SubmissionModel::selectRaw(
            'laboratories.lab_name as lab_name,
                    laboratories.id as lab_id,
                        qcsubmissions.kit_lot_no,
                        counties.name as county_name,
                        count(*) as correct_count,
                        CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date
                        '
        )
            ->join('laboratories', 'laboratories.id', '=', 'qcsubmissions.lab_id')
            ->join('counties', 'counties.id', '=', 'laboratories.county')
            ->join('qc_submission_results', 'qc_submission_results.qcsubmission_id', '=', 'qcsubmissions.id')
            ->where('qc_submission_results.control_line', 1)
            ->where('qc_submission_results.longterm_line', 0)
            ->where('qc_submission_results.verification_line', 0)
            ->where('qc_submission_results.type', 'negative')
            ->groupBy('laboratories.id', 'counties.name', 'testing_date', 'qcsubmissions.kit_lot_no');

        $results = $this->joinToTotalTested($correctCounts, 'negative');

        return $results;
    }


    function getInvalidsByMonthCountyFacility()
    {

        $correctCounts = SubmissionModel::selectRaw(
            'laboratories.lab_name as lab_name,
                    laboratories.id as lab_id,
                        qcsubmissions.kit_lot_no,
                        counties.name as county_name,
                        count(*) as correct_count,
                        CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date
                        '
        )
            ->join('laboratories', 'laboratories.id', '=', 'qcsubmissions.lab_id')
            ->join('counties', 'counties.id', '=', 'laboratories.county')
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
            ->groupBy('laboratories.id', 'counties.name', 'testing_date', 'qcsubmissions.kit_lot_no');
        $results = $this->joinToTotalTested($correctCounts, "invalids");

        return $results;
    }

    function joinToTotalTested($recentsCount, $type)
    {
        $results = null;

        if ($type != 'invalids') {

            $results =
                DB::table('qcsubmissions')->selectRaw('count(*) as total_tests,laboratories.lab_name as lab_name, counties.name as county_name,
            CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date, 
            qcsubmissions.kit_lot_no, laboratories.id as lab_id, COALESCE(recentsCount.correct_count,0) as correct_count')
                ->join('laboratories', 'laboratories.id', '=', 'qcsubmissions.lab_id')
                ->join('counties', 'counties.id', '=', 'laboratories.county')
                ->join('qc_submission_results', 'qc_submission_results.qcsubmission_id', '=', 'qcsubmissions.id')
                ->leftjoinSub($recentsCount, 'recentsCount', function ($join) {
                    $join->on('counties.name', '=', 'recentsCount.county_name');
                    $join->on('laboratories.id', '=', 'recentsCount.lab_id');
                    $join->on('qcsubmissions.kit_lot_no', '=', 'recentsCount.kit_lot_no');
                    $join->on(
                        DB::raw('CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR))'),
                        '=',
                        'recentsCount.testing_date'
                    );
                }, 'left')->where('qc_submission_results.type', $type)
                ->groupBy('laboratories.id', 'counties.name', 'testing_date', 'qcsubmissions.kit_lot_no', 'correct_count')
                ->orderBy('testing_date')
                ->get();
        } else {
            $results =
                DB::table('qcsubmissions')->selectRaw('count(*) as total_tests,laboratories.lab_name as lab_name, counties.name as county_name,
            CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR)) as testing_date, 
            qcsubmissions.kit_lot_no, laboratories.id as lab_id, COALESCE(recentsCount.correct_count,0) as correct_count')
                ->join('laboratories', 'laboratories.id', '=', 'qcsubmissions.lab_id')
                ->join('counties', 'counties.id', '=', 'laboratories.county')
                ->join('qc_submission_results', 'qc_submission_results.qcsubmission_id', '=', 'qcsubmissions.id')
                ->leftjoinSub($recentsCount, 'recentsCount', function ($join) {
                    $join->on('counties.name', '=', 'recentsCount.county_name');
                    $join->on('laboratories.id', '=', 'recentsCount.lab_id');
                    $join->on('qcsubmissions.kit_lot_no', '=', 'recentsCount.kit_lot_no');
                    $join->on(
                        DB::raw('CONCAT(CAST(YEAR(qcsubmissions.testing_date) as CHAR),"-",CAST(MONTH(qcsubmissions.testing_date) as CHAR))'),
                        '=',
                        'recentsCount.testing_date'
                    );
                }, 'left')->groupBy('laboratories.id', 'counties.name', 'testing_date', 'qcsubmissions.kit_lot_no', 'correct_count')
                ->orderBy('testing_date')
                ->get();
        }

        return $results;
    }
    //end of dissagrgation by month, county, lab, kitlot
}
