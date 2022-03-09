<?php

namespace App\Http\Controllers\Service;

use App\FcdrrSubmission;
use App\Http\Controllers\Controller;
use App\Laboratory;
use App\FcdrrCommodity;
use App\Service\FcdrrSetting;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class FcdrrCommodities extends Controller
{
    public function __construct()
    {
        // $this->middleware('guest:admin', ['except' => ['signOut']]);
        // $this->middleware('auth:admin', ['except' => ['signOut', 'adminLogin', 'doLogin']]);
    }

    public function getAllCommodities()
    {
        try {
            $commodities = FcdrrCommodity::all();
            return $commodities;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting data: ' . $ex->getMessage()], 500);
        }
    }

    public function getCommodityById(Request $request)
    {
        try {
            $commodity = FcdrrCommodity::find($request->id);
            return $commodity;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting data: ' . $ex->getMessage()], 500);
        }
    }

    public function getCommodityByName(Request $request)
    {
        try {
            $commodity = FcdrrCommodity::where('name', $request->name)->first();
            return $commodity;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Error getting data: ' . $ex->getMessage()], 500);
        }
    }

    public function createCommodity(Request $request)
    {
        try {
            FcdrrCommodity::updateOrCreate(
                [
                    'commodity_name' => $request->commodity_name,
                    'unit_of_issue' => $request->unit_of_issue ?? $request->unit,
                    'manufacturer' => $request->manufacturer,
                ]

            );
            return response()->json(['Message' => 'Saved successfully'], 200);
        } catch (Exception $ex) {
            Log::error($ex);
            return response()->json(['Message' => 'Could not save commodity: ' . $ex->getMessage()], 500);
        }
    }

    public function updateCommodity(Request $request)
    {
        try {
            FcdrrCommodity::where('id', $request->id)->update(
                [
                    'commodity_name' => $request->commodity_name,
                    'unit_of_issue' => $request->unit_of_issue ?? $request->unit,
                    'manufacturer' => $request->manufacturer,
                ]
            );
            return response()->json(['Message' => 'Updated successfully'], 200);
        } catch (Exception $ex) {
            Log::error($ex);
            return response()->json(['Message' => 'Could not update commodity: ' . $ex->getMessage()], 500);
        }
    }

    public function deleteCommodity(Request $request)
    {
        try {
            FcdrrCommodity::where('id', $request->id)->delete();
            return response()->json(['Message' => 'Deleted successfully'], 200);
        } catch (Exception $ex) {
            Log::error($ex);
            return response()->json(['Message' => 'Could not delete commodity: ' . $ex->getMessage()], 500);
        }
    }
}
