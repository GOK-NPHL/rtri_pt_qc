<?php

namespace App\Http\Controllers\Service;

use App\FcdrrSubmission;
use App\FcdrrSubmissionResults;
use App\Http\Controllers\Controller;
use App\Laboratory;
use App\County;
use App\Service\FcdrrSetting;
use Exception;
use App\FcdrrCommodity;
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
            return response()->json(['Message' => 'Error getting submissions: ' . $ex->getMessage()], 500);
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
                'fcdrr_submissions.submitted',
                'laboratories.lab_name',
                'laboratories.mfl_code as mfl',
                'laboratories.commodities as commodities',
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
            if ($payload == null) {
                return response()->json(['error' => 404, 'message' => 'No submission found'], 404);
            }
            return $payload;
            // return SubmissionModel::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting settings: ' . $ex->getMessage()], 500);
        }
    }

    
    public function submitFcdrr(Request $request)
    {
        $user = Auth::user();
        try {
            $fcdrr = FcdrrSubmission::find($request->id);
            //$fcdrr=DB::table('qcsubmissions')->where('id', $request->id);
            if ($fcdrr) {
                $fcdrr->submitted = 1;
                $fcdrr->save();
                return response()->json(['Message' => 'Submitted Successfully'], 200);
            } else {
                return response()->json(['Message' => 'Submission not found'], 404);
            }
            return response()->json(['Message' => 'Submitted Successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error submitting FCDRR: ' . $ex->getMessage()], 500);
        }
    }


    public function getFcdrrReports(Request $request)
    {
        try {
            // $reports = FcdrrSubmissionResults::all();
            $reports = DB::table('fcdrr_submission_results')
                ->join('fcdrr_submissions', 'fcdrr_submissions.id', '=', 'fcdrr_submission_results.submission_id')
                ->join('laboratories', 'laboratories.id', '=', 'fcdrr_submissions.lab_id')
                ->join('fcdrr_commodities', 'fcdrr_commodities.commodity_name', '=', 'fcdrr_commodities.commodity_name')
                ->join('counties', 'laboratories.county', '=', 'counties.id')
                ->select('fcdrr_submission_results.*', 'counties.name as county_name', 'counties.id as county_id', 'laboratories.lab_name', 'laboratories.mfl_code as lab_mfl', 'fcdrr_submissions.report_date as report_date' , 'fcdrr_submissions.user_id', 'fcdrr_commodities.id as commodity_id')
                ->get();

            if ($request->has('county') || $request->has('county_name')) {
                $cn = $request->has('county') ? $request->county : $request->county_name;
                $reports = $reports->whereIn('county_name', $cn);
                if ($reports->count() == 0) {
                    $reports = $reports->where('county_name', $cn);
                    if ($reports->count() == 0) {
                        // return response()->json(['Message' => 'No reports found for the given county'], 404);
                    }
                }
            }
            if ($request->has('county_id')) {
                $reports = $reports->whereIn('county_id', $request->county_id);
                if ($reports->count() == 0) {
                    $reports = $reports->where('county_id', $request->county_id);
                    if ($reports->count() == 0) {
                        // return response()->json(['Message' => 'No reports found for the given county'], 404);
                    }
                }
            }
            if ($request->has('commodity')) {
                $reports = $reports->where('commodity_id', $request->commodity);
                if ($reports->count() == 0) {
                    // $reports = $reports->where('commodity_id', $request->commodity_id);
                    // return response()->json(['Message' => 'No reports found for the given commodity'], 404);
                }
            }
            if ($request->has('lab')) {
                $reports = $reports->whereIn('laboratories.id', $request->lab);
                if ($reports->count() == 0) {
                    $reports = $reports->where('laboratories.id', $request->lab);
                    if ($reports->count() == 0) {
                        // return response()->json(['Message' => 'No reports found for the given lab'], 404);
                    }
                }
                if ($reports->count() == 0) {
                    $reports = $reports->where('lab_mfl', $request->lab);
                    if ($reports->count() == 0) {
                        // return response()->json(['Message' => 'No reports found for the given lab'], 404);
                    }
                }
            }
            if ($request->has('date')) {
                if (strlen($request->date) == 6) {
                    $query_year = substr($request->date, 0, 4);
                    $query_month = substr($request->date, 4, 6);
                    $reports = $reports
                        ->whereBetween('report_date', [$query_year . '-' . $query_month . '-01', $query_year . '-' . $query_month . '-31']);
                }else if (strlen($request->date) == 7 && strpos($request->date, '-') !== false) {
                    $reports = $reports
                        ->whereBetween('report_date', [$request->date . '-01', $request->date . '-31']);
                        // ->where('report_date', '>=', date('Y-m-d', strtotime($request->date)));
                    $reports = $reports->toArray();
                } else {
                    //if date includes -
                    if(strpos($request->date, '-') !== false) {
                        $reports = $reports->whereIn('report_date', date('Y-m-d', strtotime($request->date)));
                        if ($reports->count() == 0) {
                            $reports = $reports->where('report_date', date('Y-m-d', strtotime($request->date)));
                        }
                    } else {
                        $reports = $reports->where('report_date', $request->date);
                    }
                }

            }

            if ($reports == null) {
                // return response()->json(['error' => 404, 'message' => 'No reports found'], 404);
                return [];
            }
            return $reports;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting reports: ' . $ex->getMessage()], 500);
        }
    }

    public function getFcdrrReportById(Request $request)
    {
        try {
            $report = FcdrrSubmissionResults::find($request->id);
            if ($report == null) {
                return response()->json(['error' => 404, 'Message' => 'Report not found'], 404);
            }
            return $report;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting report: ' . $ex->getMessage()], 500);
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
            return response()->json(['Message' => 'Could not save changes: ' . $ex->getMessage()], 500);
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

    public function getFcdrrSettingByName(Request $request)
    {
        try {
            return FcdrrSetting::where('name', $request->name)->first();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting Settings: ' . $ex->getMessage()], 500);
        }
    }

    // @method GET
    // @url /api/reports/fcdrr/reportingrates
    // @params [county, period]
    // @return [
    //     {
    //         "period": "2019-03",
    //         "county": "Nairobi",
    //         "expected": "90", // number of labs
    //         "reported": "10", // fcdrr submissions
    //         "reporting_rate": "11.11" // percentage
    //     }
    //]
    public function getFcdrrReportingRates(Request $request)
    {
        try {
            $county_name = $request->has('county_name') ? $request->county_name : null;
            $county_id = $request->has('county_id') ? $request->county_id : null;
            $period = $request->has('period') ? $request->period : null;
            // $period = $request->has('date') ? $request->date : null;
            $year = $request->has('year') ? $request->year : null;
            $month = $request->has('month') ? $request->month : null;
            if($period == null) {
                return response()->json(['error' => 400, 'message' => 'Please provide a period'], 400);
            }else{
                $prd = explode('-', $period);
                $year = $prd[0];
                $month = $prd[1];
            }
            $expected = Laboratory::select(
                DB::raw('count(*) as expected')
            )->get();

            // $actual = FcdrrSubmission::select(
            //         DB::raw('count(*) as report_rates')
            //     )
            //         ->whereYear('report_date', '=', $year)
            //         ->whereMonth('report_date', '=', $month)
            //         ->get();

            $actual = DB::table('fcdrr_submission_results')
                ->join('fcdrr_submissions', 'fcdrr_submissions.id', '=', 'fcdrr_submission_results.submission_id')
                ->join('laboratories', 'laboratories.id', '=', 'fcdrr_submissions.lab_id')
                ->join('fcdrr_commodities', 'fcdrr_commodities.commodity_name', '=', 'fcdrr_commodities.commodity_name')
                ->join('counties', 'laboratories.county', '=', 'counties.id')
                ->select(
                    DB::raw('submission_id, county, report_date') //, fcdrr_commodities.commodity_name')
                )
                ->distinct()
                ->get();

            if($county_name != null) {
                $county = County::where('name', $county_name)->get('id')->get(0)->id;
                $expected = $expected->where('county', $county);
                $actual = $actual->where('county', $county);
            }
            if($county_id != null) {
                $expected = $expected->where('county', $county_id);
                $actual = $actual->where('county', $county_id);
            }
            if($period != null) {
                $prd = explode('-', $period);
                $year = $prd[0];
                $month = $prd[1];
                // todo: get only labs that were registered on or before the period DONE
                $expected = $expected->where('created_at', '<=', $year.'-'.$month.'-31');
                $actual = $actual
                    ->whereBetween('report_date', [$year . '-' . $month . '-01', $year . '-' . $month . '-31']);
            }



            // $prevMonth = null;
            // $month = null;
            // $year = null;

            // if (empty($request->period) || !isset($request->period) || $request->period == 'null') {
            //     $prevMonth = date('Y-m-d', strtotime(date('Y-m') . " -1 month"));
            //     $month = date("m", strtotime($prevMonth));
            //     $year = date("Y", strtotime($prevMonth));
            // } else {
            //     $prevMonth = date('Y-m-d', strtotime($request->period));
            //     $month = date("m", strtotime($prevMonth));
            //     $year = date("Y", strtotime($prevMonth));
            // }

            // $submissions = FcdrrSubmission::select(
            //     DB::raw('count(*) as report_rates')
            // )
            //     ->whereYear('report_date', '=', $year)
            //     ->whereMonth('report_date', '=', $month);

            // $submissions = $submissions->get();

            // $totalLabs = Laboratory::select(
            //     DB::raw('count(*) as total_labs')
            // )
            //     ->get();

            // $period = $year . "-" . $month;
            return [
                // "report_rates" => ($submissions[0]['report_rates'] / $totalLabs[0]['total_labs']) * 100,
                // "period" => $period,
                // "total_labs" => $totalLabs[0]['total_labs']
                "expected" => $expected[0]['expected'] ?? 0,
                "actual" => $actual,//[0]['report_rates'] ?? 0,
                "request" => [
                    "county_name" => $county_name,
                    "county_id" => $county_id,
                    "period" => $period
                ]
            ];
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting reporting rate: ' . $ex->getMessage()], 500);
        }
    }
}
