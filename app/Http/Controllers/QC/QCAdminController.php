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

        $this->middleware('auth:admin');
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

    public function editUser()
    {
        return view('user.qc.admin.edit_user');
    }

    public function addLab()
    {
        return view('user.qc.admin.add_lab');
    }

    public function editLab()
    {
        return view('user.qc.admin.edit_lab');
    }

    public function addPersonel()
    {
        return view('user.qc.admin.add_personel');
    }
    public function editPersonel()
    {
        return view('user.qc.admin.edit_personel');
    }

    public function listUser()
    {
        return view('user.qc.admin.list_user');
    }

    public function listLab()
    {
        return view('user.qc.admin.list_lab');
    }

    public function listPersonel()
    {
        return view('user.qc.admin.list_personel');
    }

    public function listFcdrrReports()
    {
        return view('report.list_fcdrr_report');
    }

    public function fcdrrReport()
    {
        return view('report.fcdrr_report');
    }

    public function fcdrrSettings()
    {
        return view('settings.fcdrr_settings');
    }
    
    public function fcdrrIndicators()
    {
        return view('report.fcdrr_indicators');
    }
}
