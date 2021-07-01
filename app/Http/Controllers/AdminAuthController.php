<?php

namespace App\Http\Controllers;

use App\Admin;
use Illuminate\Http\Request;
use Auth;
use Exception;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;

class AdminAuthController extends Controller
{
    public function __construct()
    {
        // $this->middleware('guest:admin', ['except' => ['signOut']]);
        $this->middleware('auth:admin', ['except' => ['signOut']]);
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

    public function create(Request $request)
    {
        try {
            Admin::create([
                'name' => $request->user['name'],
                'email' => $request->user['email'],
                'phone_number' => $request->user['phone_number'],
                'is_admin' => 1,
                'password' => Hash::make($request->user['password'])
            ]);
            return response()->json(['Message' => 'Created successfully'], 200);
        } catch (Exception $ex) {

            return ['Error' => '500', 'Message' => 'Could not save user ' . $ex->getMessage()];
        }
    }

    public function signOut()
    {
        Auth::guard('admin')->logout();
        return redirect('index');
    }
}
