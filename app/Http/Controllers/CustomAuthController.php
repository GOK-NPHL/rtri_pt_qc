<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Hash;
use Session;
use App\User;
use Facade\FlareClient\View;
use Illuminate\Contracts\Session\Session as SessionSession;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Redirect;
use Illuminate\Support\Facades\Session as FacadesSession;

class CustomAuthController extends Controller

{

    public function index()
    {
        return view('home_page');
    }

    public function getParticipantLoginPage()
    {
        return view('auth.participant_login');
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
            'user_type' => 'required',
        ]);

        $credentials = $request->only('email', 'password', 'user_type');
        if ($request->user_type == "participant") {
            if (Auth::attempt($credentials)) {
                return redirect()->route('participant-home');
            } else {
                return Redirect::back()->withErrors(['Email or Password incorrect']);
            }
        } else if ($request->user_type == "admin") {
            if (Auth::attempt($credentials)) {
                return redirect()->route('admin-home');
            } else {
                return Redirect::back()->withErrors(['Email or Password incorrect']);
            }
        } else {
            FacadesSession::flush();
            Auth::logout();
        }


        return redirect()->route('login')->withSuccess('Login details are not valid');
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

        return Redirect()->route('index');
    }
}
