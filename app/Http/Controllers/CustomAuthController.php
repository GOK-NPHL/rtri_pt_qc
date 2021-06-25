<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Hash;
use Session;
use App\User;
use Illuminate\Support\Facades\Log;

class CustomAuthController extends Controller

{

    public function index()
    {
        return view('home_page');
    }

    public function getParticipantLoginPage()
    {
        return view('auth.login');
    }

    public function adminLogin()
    {
        return view('auth.admin_login');
    }

    public function customLogin(Request $request)
    {
        Log::info("atempt called 12 " . $request->user_type);
        $request->validate([
            'email' => 'required',
            'password' => 'required',
            'user_type' => 'required',
        ]);

        $credentials = $request->only('email', 'password');
        Log::info("u type " . $request->user_type);
        if ($request->user_type == "participant") {
            if (Auth::attempt($credentials)) {

                return Redirect()->route('dashboard')
                    ->withSuccess('Signed in');
            }
        } else if ($request->user_type == "admin") {
            Log::info($request->user_type);
            if (Auth::attempt($credentials)) {

                return Redirect()->route('dashboard')
                    ->withSuccess('Signed in');
            }
        } else {
            Session::flush();
            Auth::logout();
            return Redirect()->route('participant_login_page');
        }


        return redirect()->route('participant_login_page')->withSuccess('Login details are not valid');
    }



    public function registration()
    {
        return view('auth.registration');
    }


    public function customRegistration(Request $request)
    {
        $request->validate([
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ]);

        $data = $request->all();
        $check = $this->create($data);

        return redirect("home")->withSuccess('You have signed-in');
    }


    public function create(array $data)
    {
        return User::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password'])
        ]);
    }

    public function signOut()
    {
        Session::flush();
        Auth::logout();

        return Redirect()->route('participant_login_page');
    }
}
