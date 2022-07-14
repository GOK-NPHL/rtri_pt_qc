@extends('layouts.app')

@section('content')
<div class="container-fluid">

    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="login-box home-purple" style="max-width: 550px; margin: auto; 
            padding:15px;
            margin-top: 100px; 
            background-color: purple;
            color:white;">
                <div>

                    <h3 class="color:white;">Participant Login - <span> RTRI Quality Control</span></h3>
                </div>
                <form name="loginForm" id="login_form" class="form-vertical" method="POST" action="{{ route('participant-login') }}">
                    @csrf
                    @if($errors->any())
                    <hr/>
                    <div class="alert alert-danger" style="white-space: pre-line; overflow: auto">{{$errors->first()}}</div>
                    </hr/>
                    @endif
                    <!-- show success msg for successful signups -->
                    @if(session()->has('success'))
                    <hr/>
                    <div class="alert alert-success" style="white-space: pre-line; overflow: auto">{{session()->get('success')}}</div>
                    </hr/>
                    @endif
                    <input id="user_type" type="text" class="form-control" value="participant" name="user_type" hidden>
                    <div class="form-group">
                        <label for="email" class="uname" data-icon="u"> Email address </label>

                        <input id="email" name="email" class="isRequired form-control" title="Please enter your email address" type="text" placeholder="mymail@mail.com" />
                        @error('email')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                        @enderror
                    </div>
                    <div class="form-group">
                        <label for="password" class="youpasswd" data-icon="p"> Password </label>

                        <input id="password" name="password" class="isRequired form-control" title="Please enter your password" type="password" placeholder="eg. X8df!90EO" />
                        @error('password')
                        <span class="invalid-feedback" role="alert">
                            <strong>{{ $message }}</strong>
                        </span>
                        @enderror
                    </div>

                    <div class="box-footer">
                        <input type="submit" class="btn col-md-12 btn-lg btn-info" value="Sign in" />
                    </div>
                    <hr />
                    <div class="box-footer text-center">
                        <p>Don't have an account? <a href="{{route('participant-signup')}}">Sign up</a></p>
                    </div>

                    <div>
                        <div class="form-check" style="margin-top: 12px;">
                            <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>

                            <label class="form-check-label" for="remember">
                                {{ __('Remember Me') }}
                            </label>
                        </div>

                        <a style="display: inline-block;" class="btn btn-link" href="{{ route('participant-signup') }}">
                            {{ __('Don\'t have an account?') }}
                        </a>
                        | <a style="display: inline-block;" class="btn btn-link" href="{{ route('password.request') }}">
                            {{ __('Forgot Your Password?') }}
                        </a>
                        | <a style="display: inline-block;" class="btn btn-link" href="http://helpdesk.nphl.go.ke/index.php?a=add">
                            RTRI HELP DESK
                        </a>
                    </div>

                </form>
            </div>

        </div>
    </div>

    <style>
        #footer {
            position: absolute;
            bottom: 0;
            width: 100%;
            height: 60px;
            /* Height of the footer */
            /* background: #6cf; */
        }

        ul {
            list-style-type: none;
            margin: 0;
            padding: 0;
            overflow: hidden;
            /* background-color: #333333; */
        }

        li {
            float: left;
        }

        li a {
            display: block;
            color: white;
            text-align: center;
            padding: 16px;
            text-decoration: none;
        }

        li a:hover {
            background-color: #111111;
            color: white;
        }
    </style>

</div>
@endsection