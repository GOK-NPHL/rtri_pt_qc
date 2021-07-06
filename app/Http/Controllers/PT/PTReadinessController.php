<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Laboratory;
use App\Readiness;
use App\ReadinessQuestion;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class PTReadinessController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('auth:admin');
    }

    public function saveReadiness(Request $request)
    {
        try {
            $user = Auth::user();
            $checklist = Readiness::where('name', $request->readiness['name'])->get();
            if (count($checklist) > 0) {
                return response()->json(['Message' => 'Error during creating Checklist. Checklist name already exist '], 500);
            }

            $readiness = Readiness::create([
                'name' => $request->readiness['name'],
                'start_date' => $request->readiness['start_date'],
                'end_date' => $request->readiness['end_date'],
                'admin_id' => $user->id
            ]);

            // Save questions
            foreach ($request->readiness['readiness_questions'] as $questionItem) {
                $readinessQuestion = new ReadinessQuestion();

                $readinessQuestion->question = $questionItem['question'];
                $readinessQuestion->answer_options = $questionItem['answer_options'];
                $readinessQuestion->answer_type = $questionItem['answer_type'];
                $readinessQuestion->qustion_position = $questionItem['qustion_position'];
                $readinessQuestion->qustion_type = $questionItem['qustion_type'];

                // $readiness->readinessQuestion()->associate($readinessQuestion);
                $readinessQuestion->readiness()->associate($readiness);
                $readinessQuestion->save();
            }

            // Save laboratiories
            $readiness->laboratories()->attach($request->readiness['participants']);
            return response()->json(['Message' => 'Created successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not save the checklist ' . $ex->getMessage()], 500);
        }
    }

    public function getReadiness(Request $request)
    {
        try {

            $readinesses = Readiness::select(
                "readinesses.name",
                "readinesses.updated_at as last_update",
                "admins.name as created_by",
                DB::raw('count(*) as participant_count')
            )->join('admins', 'admins.id', '=', 'readinesses.admin_id')
                ->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'readinesses.id')
                ->groupBy('laboratory_readiness.readiness_id')
                ->orderBy('last_update', 'DESC')
                ->get();

            return $readinesses;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch readiness list: ' . $ex->getMessage()], 500);
        }
    }
}
