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

    public function getShipments(Request $request)
    {

        try {

            $readinessesWithLabId = PtShipement::select(
                "pt_shipements.id",
                "pt_shipements.round_name",
                "pt_shipements.code as shipment_code",
                "pt_shipements.updated_at as last_update",
                "pt_shipements.pass_mark",
                DB::raw('count(*) as participant_count')
            )->join('laboratory_readiness', 'laboratory_readiness.readiness_id', '=', 'pt_shipements.readiness_id')
                ->groupBy(
                    "pt_shipements.id",
                    'pt_shipements.round_name',
                    'pt_shipements.readiness_id',
                    "pt_shipements.updated_at",
                    "pt_shipements.pass_mark",
                    "pt_shipements.code",
                );

            $readinessesWithNullLabId = PtShipement::select(
                "pt_shipements.id",
                "pt_shipements.round_name",
                "pt_shipements.code as shipment_code",
                "pt_shipements.updated_at as last_update",
                "pt_shipements.pass_mark",
                DB::raw('count(*) as participant_count')
            )->join('laboratory_pt_shipement', 'laboratory_pt_shipement.pt_shipement_id', '=', 'pt_shipements.id')
                ->groupBy('laboratory_pt_shipement.pt_shipement_id');


            $finalQuery = $readinessesWithLabId->union($readinessesWithNullLabId)->orderBy('last_update', 'desc')->get();

            return $finalQuery;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch readiness list: ' . $ex->getMessage()], 500);
        }
    }

    public function getShipmentById(Request $request)

    {

        try {
            $labIds = [];
            $shipment = PtShipement::find($request->id);

            //get participants
            if (empty($shipment->readiness_id)) {

                $labs = PtShipement::select(
                    "laboratory_pt_shipement.laboratory_id"
                )->join('laboratory_pt_shipement', 'laboratory_pt_shipement.pt_shipement_id', '=', 'pt_shipements.id')
                    ->where('id', $request->id)
                    ->get();
                $labIds = [];
                foreach ($labs as $lab) {
                    $labIds[] = $lab->laboratory_id;
                }
            }

            //get samples
            $ptSamples = PtSample::select(
                "pt_samples.id",
                "name",
                "reference_result"
            )->join('pt_shipements', 'pt_shipements.id', '=', 'pt_samples.ptshipment_id')
                ->where('pt_shipements.id', $request->id)
                ->get();

            $payload = [];
            $payload['shipment'] = $shipment;
            $payload['labs'] = $labIds;
            $payload['samples'] = $ptSamples;

            return $payload;
        } catch (Exception $ex) {
            return response()->json(['Message' => 'Could fetch shipment: ' . $ex->getMessage()], 500);
        }
    }


    public function saveShipment(Request $request)
    {
        try {

            $shipments = PtShipement::where('round_name', $request->shipement['round'])->get();
            if (count($shipments) > 0) {
                return response()->json(['Message' => 'Error during creating shipment. Round name already exist '], 500);
            }

            if (empty($request->shipement['readiness_id']) && count($request->shipement['selected']) == 0) {
                return response()->json(['Message' => 'Please select checklist of participants for this shipment '], 500);
            }

            $participantsList = [];

            if (empty($request->shipement['readiness_id'] == true)) {

                $participantsList = $request->shipement['selected'];
            }
            // if (empty($request->shipement['readiness_id'] != true)) {
            //     $readiness = Readiness::find($request->shipement['readiness_id']);
            //     foreach ($readiness->laboratories as $lab) {
            //         $participantsList[] = $lab->pivot->laboratory_id;
            //     }
            // } else {
            //     $participantsList = $request->shipement['selected'];
            // }
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


    public function updateShipment(Request $request)
    {

        try {
            // Log::info("======================================");
            // Log::info($request->shipement);
            $shipments = PtShipement::find($request->shipement['id']);

            if (empty($request->shipement['readiness_id']) && count($request->shipement['selected']) == 0) {
                return response()->json(['Message' => 'Please select checklist of participants for this shipment '], 500);
            }

            $participantsList = [];

            if (empty($request->shipement['readiness_id'] == true)) {

                $participantsList = $request->shipement['selected'];
            }

            $shipments->pass_mark = $request->shipement['pass_mark'];
            $shipments->round_name = $request->shipement['round'];
            $shipments->code = $request->shipement['shipment_code'];
            $shipments->end_date = $request->shipement['result_due_date'];
            $shipments->test_instructions = $request->shipement['test_instructions'];
            $shipments->readiness_id = (empty($request->shipement['readiness_id']) ? null : $request->shipement['readiness_id']);

            $shipments->save();

            // save participants
            Log::info("rwa=========");
            Log:info( $request->shipement['selected']);
            $shipments->laboratories()->sync($participantsList);

            // Save samples
            $existingSampls = PtSample::select("id")->where('ptshipment_id', $request->shipement['id'])
                ->pluck('id')->toArray();
            //          $
            $updatedIds = [];
            foreach ($request->shipement['samples'] as $sample) {
                try {

                    $ptSample = null;
                    try {
                        $ptSample =  PtSample::find($sample['id']);
                    } catch (Exception $ex) {
                        $ptSample = new PtSample();
                    }

                    $ptSample->name = $sample['name'];
                    $ptSample->reference_result = $sample['reference_result'];
                    $ptSample->ptshipment()->associate($shipments);
                    $ptSample->save();
                } catch (Exception $ex) {
                }
            }
            //delete samples not in the new list
            for ($x = 0; $x < count($existingSampls); $x++) {
                if (!in_array($existingSampls[$x], $updatedIds)) {
                    //PtSample::find($sample['id'])->delete();
                }
            }

            return response()->json(['Message' => 'Updated successfully'], 200);
        } catch (Exception $ex) {
            Log::error($ex);
            return response()->json(['Message' => 'Could not save the checklist ' . $ex->getMessage()], 500);
        }
    }

    public function getUserSamples()
    {
        $user = Auth::user();

        try {

            $labs = PtShipement::select(
                "pt_shipements.id",
                "pt_shipements.round_name",
                "pt_shipements.code",
                "pt_shipements.start_date",
                "pt_shipements.end_date",
                "pt_shipements.test_instructions",
                "pt_samples.id as sample_id",
                "pt_samples.name as sample_name"
            )->join('laboratory_pt_shipement', 'laboratory_pt_shipement.pt_shipement_id', '=', 'pt_shipements.id')
                ->join('pt_samples', 'pt_samples.ptshipment_id', '=', 'pt_shipements.id')
                ->join('laboratories', 'laboratory_pt_shipement.laboratory_id', '=', 'laboratories.id')
                ->join('users', 'users.laboratory_id', '=', 'laboratories.id')
                ->where('users.id', $user->id)
                ->get();

            $payload = [];

            foreach ($labs as $lab) {
                Log::info($lab);

                if (array_key_exists($lab->id, $payload)) {
                    $payload[$lab->id]['samples'][] = ['sample_name' => $lab->sample_name, 'sample_id' => $lab->sample_id];
                } else {
                    $payload[$lab->id] = [];
                    $payload[$lab->id]['samples'] = [];
                    $payload[$lab->id]['samples'][] = ['sample_name' => $lab->sample_name, 'sample_id' => $lab->sample_id];

                    $payload[$lab->id]['test_instructions'] = $lab->test_instructions;
                    $payload[$lab->id]['id'] = $lab->id;
                    $payload[$lab->id]['start_date'] = $lab->start_date;
                    $payload[$lab->id]['code'] = $lab->code;
                    $payload[$lab->id]['end_date'] = $lab->end_date;
                    $payload[$lab->id]['round_name'] = $lab->round_name;
                }
            }

            return $payload;
        } catch (Exception $ex) {
            Log::error($ex);
            return response()->json(['Message' => 'Could fetch samples: ' . $ex->getMessage()], 500);
        }
    }
}
