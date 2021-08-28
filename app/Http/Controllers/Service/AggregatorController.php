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
        $aggregationByCounty =
            DB::table('qcsubmissions')->selectRaw('count(*) as total_tests, counties.name as county_name,
             qcsubmissions.testing_date, qcsubmissions.kit_lot_no, laboratories.id as lab_id')
            ->join('laboratories', 'laboratories.id', '=', 'qcsubmissions.lab_id')
            ->join('counties', 'counties.id', '=', 'laboratories.county')
            // ->groupBy('qcsubmissions.testing_date', 'counties.name')
            ->groupBy('laboratories.id', 'counties.name', 'qcsubmissions.testing_date', 'qcsubmissions.kit_lot_no')
            ->orderBy('qcsubmissions.testing_date');
        $correntRecents = $this->getCorrectRecentsByMonthCountyFacility($aggregationByCounty);
        $correntLongterm = $this->getCorrectLontermByMonthCountyFacility($aggregationByCounty);
        $correntNegative = $this->getCorrectNegativeByMonthCountyFacility($aggregationByCounty);

        return [
            'recent' => $correntRecents,
            'longterm' => $correntLongterm,
            'negative' => $correntNegative
        ];
    }

    function getCorrectRecentsByMonthCountyFacility($aggregationByCounty)
    {
        $results = SubmissionModel::selectRaw(
            'laboratories.lab_name as lab_name,
            qcsubmissions.kit_lot_no,
            counties.name as county_name,
            count(*) as corrent_count,
            qcsubmissions.testing_date,
            aggregationByCounty.total_tests'
        )
            ->join('laboratories', 'laboratories.id', '=', 'qcsubmissions.lab_id')
            ->join('counties', 'counties.id', '=', 'laboratories.county')
            ->joinSub($aggregationByCounty, 'aggregationByCounty', function ($join) {
                $join->on('counties.name', '=', 'aggregationByCounty.county_name');
                $join->on('laboratories.id', '=', 'aggregationByCounty.lab_id');
                $join->on('qcsubmissions.kit_lot_no', '=', 'aggregationByCounty.kit_lot_no');
                $join->on('qcsubmissions.testing_date', '=', 'aggregationByCounty.testing_date');
            })
            ->where('result_recent_control_line', 1)
            ->where('result_recent_longterm_line', 0)
            ->where('result_recent_verification_line', 1)
            ->groupBy('laboratories.id', 'counties.name', 'qcsubmissions.testing_date', 'qcsubmissions.kit_lot_no')
            ->orderBy('qcsubmissions.testing_date')
            ->get();
        return $results;
    }

    function getCorrectLontermByMonthCountyFacility($aggregationByCounty)
    {
        $results = SubmissionModel::selectRaw(
            'laboratories.lab_name as lab_name,
            qcsubmissions.kit_lot_no,
            counties.name as county_name,
            count(*) as corrent_count,
            qcsubmissions.testing_date,
            aggregationByCounty.total_tests'
        )
            ->join('laboratories', 'laboratories.id', '=', 'qcsubmissions.lab_id')
            ->join('counties', 'counties.id', '=', 'laboratories.county')
            ->joinSub($aggregationByCounty, 'aggregationByCounty', function ($join) {
                $join->on('counties.name', '=', 'aggregationByCounty.county_name');
                $join->on('laboratories.id', '=', 'aggregationByCounty.lab_id');
                $join->on('qcsubmissions.kit_lot_no', '=', 'aggregationByCounty.kit_lot_no');
                $join->on('qcsubmissions.testing_date', '=', 'aggregationByCounty.testing_date');
            })
            ->where('result_lt_control_line', 1)
            ->where('result_lt_longterm_line', 1)
            ->where('result_lt_verification_line', 1)
            ->groupBy('laboratories.id', 'counties.name', 'qcsubmissions.testing_date', 'qcsubmissions.kit_lot_no')
            ->orderBy('qcsubmissions.testing_date')
            ->get();

        return $results;
    }

    function getCorrectNegativeByMonthCountyFacility($aggregationByCounty)
    {
        $results = SubmissionModel::selectRaw(
            'laboratories.lab_name as lab_name,
            qcsubmissions.kit_lot_no,
            counties.name as county_name,
            count(*) as corrent_count,
            qcsubmissions.testing_date,
            aggregationByCounty.total_tests'
        )
            ->join('laboratories', 'laboratories.id', '=', 'qcsubmissions.lab_id')
            ->join('counties', 'counties.id', '=', 'laboratories.county')
            ->joinSub($aggregationByCounty, 'aggregationByCounty', function ($join) {
                $join->on('counties.name', '=', 'aggregationByCounty.county_name');
                $join->on('laboratories.id', '=', 'aggregationByCounty.lab_id');
                $join->on('qcsubmissions.kit_lot_no', '=', 'aggregationByCounty.kit_lot_no');
                $join->on('qcsubmissions.testing_date', '=', 'aggregationByCounty.testing_date');
            })
            ->where('result_negative_control_line', 1)
            ->where('result_negative_longterm_line', 0)
            ->where('result_negative_verification_line', 0)
            ->groupBy('laboratories.id', 'counties.name', 'qcsubmissions.testing_date', 'qcsubmissions.kit_lot_no')
            ->orderBy('qcsubmissions.testing_date')
            ->get();
        return $results;
    }
}
