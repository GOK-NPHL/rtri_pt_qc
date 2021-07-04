<?php

namespace App\Http\Controllers\PT;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class PTAdminController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {

        $this->middleware('auth:admin');
    }

    public function ptShipment()
    {
        return view('user.pt.shipment.pt_shipment');
    }
}


