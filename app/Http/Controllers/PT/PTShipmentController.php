<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use App\Laboratory;
use App\PtSample;
use App\PtShipement;
use App\Readiness;
use App\ReadinessQuestion;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class PTShipmentController extends Controller
{

    public function getShipment(Request $request)
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
            return response()->json(['Message' => 'Could fetch shipment list: ' . $ex->getMessage()], 500);
        }
    }

    public function saveShipment(Request $request)
    {
        Log::info($request->shipement);
        try {

            $shipments = PtShipement::where('round_name', $request->shipement['round'])->get();
            if (count($shipments) > 0) {
                return response()->json(['Message' => 'Error during creating shipment. Round name already exist '], 500);
            }

            if (empty($request->shipement['readiness_id']) && count($request->shipement['selected'])==0 ) {
                return response()->json(['Message' => 'Please select checklist of participants for this shipment '], 500);
            }

            $participantsList = [];

            if (empty($request->shipement['readiness_id'] != true)) {
                $readiness = Readiness::find($request->shipement['readiness_id']);
                foreach ($readiness->laboratories as $lab) {
                    $participantsList[] = $lab->pivot->laboratory_id;
                }
            } else {
                $participantsList = $request->shipement['selected'];
            }
            // $table->unsignedBigInteger('readiness_id')->nullable();

            $shipment = PtShipement::create([
                'pass_mark' => $request->shipement['pass_mark'],
                'round_name' => $request->shipement['round'],
                'code' => $request->shipement['shipment_code'],
                'end_date' => $request->shipement['result_due_date'],
                'test_instructions' => $request->shipement['test_instructions'],
                'readiness_id' => (empty($request->shipement['readiness_id']) ? null : $request->shipement['readiness_id'])
            ]);

            //save participants
            $shipment->laboratories()->attach($participantsList);

            // Save questions
            foreach ($request->shipement['samples'] as $sample) {
                $ptSample = new PtSample();

                $ptSample->name = $sample['name'];
                $ptSample->reference_result = $sample['reference_result'];
                $ptSample->ptshipment()->associate($shipment);
                $ptSample->save();
            }

            // Save laboratiories
            // $readiness->laboratories()->attach($request->shipement['participants']);
            return response()->json(['Message' => 'Created successfully'], 200);
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could not save the checklist ' . $ex->getMessage()], 500);
        }
    }
}
