@extends('layouts.app')

@section('content')
<div class="container-fluid">

    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="login-box home-purple" style="max-width: 430px; margin: auto; 
            padding:15px;
            margin-top: 100px; 
            background-color: purple;
            color:white;">
                <div>

                    <h2 class="color:white;">Login - <span> Proficiency Testing</span></h2>
                </div>
                <form name="loginForm" id="login_form" class="form-vertical" method="POST" action="{{ route('part_login') }}">
                    @csrf
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
                        <input type="submit" class="btn col-md-12 btn-lg btn-primary" value="Sign in" />
                    </div>

                    <div>
                        <div class="form-check">
                            <input class="form-check-input" type="checkbox" name="remember" id="remember" {{ old('remember') ? 'checked' : '' }}>

                            <label class="form-check-label" for="remember">
                                {{ __('Remember Me') }}
                            </label>
                        </div>
                        <!-- <a href="/auth/reset-password" style="font-size:0.8em;color:white;">Forgot Password?</a> -->
                        <!--<a href="/contact-us" style="">Don't have a login ? Click here to contact us</a>-->
                        @if (Route::has('password.request'))
                        <a class="btn btn-link" href="{{ route('password.request') }}">
                            {{ __('Forgot Your Password?') }}
                        </a> 
                        @endif
                        |
                        <a class="btn btn-link" href="http://helpdesk.nphl.go.ke/">
                            RTRI HELP DESK
                        </a>
                    </div>

                </form>
            </div>

        </div>
    </div>
</div>
@endsection