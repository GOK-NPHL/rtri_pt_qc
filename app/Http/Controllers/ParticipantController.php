<?php

namespace App\Http\Controllers;

use App\Laboratory;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ParticipantController extends Controller
{
    public function getParticipants(Request $request)
    {
        try {
            return Laboratory::all();
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch participants: ' . $ex->getMessage()], 500);
        }
    }


    public function createParticipant(Request $request)
    {
        Log::info($request->lab);
        try {
            Laboratory::create([
                'institute_name' => $request->lab['institute_name'],
                'email' => $request->lab['email'],
                'phone_number' => $request->lab['phone_number'],
                'is_active' => $request->lab['is_active'],
                'mfl_code' => $request->lab['mfl_code'],
                'facility_level' => $request->lab['facility_level'],
                'county' => $request->lab['county'],
                'lab_name' => $request->lab['lab_name'],
            ]);
            return response()->json(['Message' => 'Created successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not save participant: ' . $ex->getMessage()], 500);
        }
    }
}
