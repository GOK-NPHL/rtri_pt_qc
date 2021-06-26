<?php

namespace App\Http\Controllers\QC;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class QCAdminController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('admin');
    }


    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function adminHome()
    {
        return view('user.qc.admin.dashboard');
    }

    public function addUser()
    {
        return view('user.qc.admin.add_user');
    }

    public function addLab()
    {
        return view('user.qc.admin.add_lab');
    }

    public function addPersonel()
    {
        return view('user.qc.admin.add_personel');
    }
}
