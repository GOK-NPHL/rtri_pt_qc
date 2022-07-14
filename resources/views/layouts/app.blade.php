<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1">

    <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    <link rel="shortcut icon" href="{{ asset('images/favicon/favicon.ico') }}">
    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">
    <link href="https://fonts.googleapis.com/css?family=Nunito" rel="stylesheet">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <style>
        #app{
            min-height: 94vh;
        }
    </style>
</head>

<body style="background-image: url('{{asset('images/pt.png')}}');
            background-repeat: no-repeat;
            background-size: cover; overflow-x: hidden; overflow-y: scroll;">
    <div id="app">

        <main class="py-4">
            @yield('content')
        </main>
    </div>

    <footer class="text-center" id="footerz" style="background-color: black; position: relative; bottom: 0; width: 100%;">

        <div class="row d-flex justify-content-center">
            <!--Grid column-->
            <div class="col-sm-12">

                <ul class="d-flex justify-content-center" style="overflow-x: auto;">
                    <li><a href="#home">Home |</a></li>
                    <li><a href="#news">About Us |</a></li>
                    <li><a href="#contact">Resources |</a></li>
                    <li><a href="#about">FAQ |</a></li>
                    <li><a href="{{ route('admin-login') }}">Admin Login |</a></li>
                    <li><a href="#about">NPHL Help Desk |</a></li>
                    <li><a href="#about">2020 © National Public Health Laboratory</a></li>
                </ul>
            </div>
            <!--Grid column-->
        </div>

    </footer>
</body>

</html>