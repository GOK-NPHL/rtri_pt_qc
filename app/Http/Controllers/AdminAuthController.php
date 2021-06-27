<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use Illuminate\Support\Facades\Redirect;

class AdminAuthController extends Controller
{
    public function __construct()
    {
        $this->middleware('guest:admin', ['except' => ['admin-logout']]);
    }

    public function adminLogin()
    {
        return view('auth.admin_login');
    }

    public function doLogin(Request $request)
    {
        $request->validate([
            'email' => 'required',
            'password' => 'required',

        ]);

        $credentials = $request->only('email', 'password');

        if (Auth::guard('admin')->attempt($credentials)) {
            return redirect()->route('admin-home');
        } else {
            return Redirect::back()->withErrors(['Email or Password incorrect']);
        }
        return redirect()->back()->withInput($request->only('email', 'remember'));
    }


    public function signOut()
    {
        Auth::guard('admin')->logout();
        return redirect('index');
    }
}
