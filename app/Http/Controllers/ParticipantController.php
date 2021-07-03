<?php

namespace App\Http\Controllers;

use App\Laboratory;
use App\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
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

    public function createLabPersonel(Request $request)
    {
        try {
            $user = new User([
                'name' => $request->personel['first_name'],
                'second_name' => $request->personel['second_name'],
                'email' => $request->personel['email'],
                'phone_number' => $request->personel['phone_number'],
                'is_active' => $request->personel['is_active'],
                'password' => Hash::make($request->personel['password']),
                'has_qc_access' => $request->personel['has_qc_access'],
                'has_pt_access' => $request->personel['has_pt_access'],
            ]);
            $lab = Laboratory::find($request->personel['facility']);
            $lab->personel()->save($user);

            return response()->json(['Message' => 'Created successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not save lab personel: ' . $ex->getMessage()], 500);
        }
    }

    public function getLabPersonel(Request $request)
    {
        try {

            $users = User::select(
                'users.name',
                'users.email',
                'laboratories.lab_name',
                'users.has_qc_access',
                'users.phone_number',
                'users.has_pt_access',
                'users.is_active',
                'users.second_name'
            )->join('laboratories', 'laboratories.id', '=', 'users.laboratory_id')
                ->get();

            return $users;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch lab personel: ' . $ex->getMessage()], 500);
        }
    }
}
