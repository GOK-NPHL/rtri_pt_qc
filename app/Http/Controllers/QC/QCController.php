<?php

namespace App\Http\Controllers\QC;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;


class QCController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        // $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function participant()
    {
        return view('user.participant.qc.dashboard');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function admin()
    {
        return view('user.qc.admin.dashboard');
    }

}
