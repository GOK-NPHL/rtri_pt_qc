<?php

namespace App\Http\Controllers\QC;

use App\Http\Controllers\Controller;
use App\User;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;

class QCParticipantController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function participantHome()
    {
        if (Gate::allows('view_qc_component')) {
            return view('user.qc.participant.dashboard');
        } else if (Gate::allows('view_pt_component')) {
            return view('user.pt.participant.dashboard');
        } else {
            return view('user.general.dashboard');
        }
    }
    public function participantPTHome()
    {
        if (Gate::allows('view_pt_component')) {
            return view('user.pt.participant.dashboard');
        } else if (Gate::allows('view_qc_component')) {
            return view('user.qc.participant.dashboard');
        } else {
            return view('user.general.dashboard');
        }
    }


    public function getParticipantDemographics(Request $request)
    {
        try {
            $user = Auth::user();
            $usersDemo = User::select(
                'users.id',
                'users.name',
                'users.second_name',
                'laboratories.lab_name',
                'laboratories.phone_number',
                'laboratories.mfl_code',
                'laboratories.email',

            )->join('laboratories', 'laboratories.id', '=', 'users.laboratory_id')
                ->where('users.id', '=', $user->id)
                ->get();
            return $usersDemo;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch users: ' . $ex->getMessage()], 500);
        }
    }
}
