<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<?php

use Illuminate\Support\Facades\Gate;
?>

<head>

    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="MoH Rapid Test Continous Quality Improvement ODK data Analytics Platform.">
    <meta name="author" content="NPHL ICT" <!-- CSRF Token -->
    <meta name="csrf-token" content="{{ csrf_token() }}">

    <title>{{ config('app.name', 'Laravel') }}</title>

    <!-- Scripts -->
    <script src="{{ asset('js/app.js') }}" defer></script>

    <link rel="shortcut icon" href="{{ asset('images/favicon/favicon.ico') }}">
    <!-- Fonts -->
    <link rel="dns-prefetch" href="//fonts.gstatic.com">

    <!-- Styles -->
    <link href="{{ asset('css/app.css') }}" rel="stylesheet">
    <link href="{{ asset('css/adminlte.min.css') }}" rel="stylesheet">
    <!-- <link href="{{ asset('css/dataTables.bootstrap4.min.css') }}" rel="stylesheet"> -->
    <link href="{{ asset('css/jquery.dataTables.min.css') }}" rel="stylesheet">

    <!-- overlayScrollbars -->
    <link href="{{ asset('css/OverlayScrollbars.min.css') }}" rel="stylesheet">
    <!-- Google Font: Source Sans Pro -->
    <link href="https://fonts.googleapis.com/css?family=Source+Sans+Pro:300,400,400i,700" rel="stylesheet">

</head>

<body>
    <style>
        .nav-link {
            color: white !important;
        }

        .nav-link-custom {
            color: #495057 !important;
        }

        .nav-link:hover,
        .bg-light>a:hover {
            color: #1900ff !important;
            ;
        }

        .bg-light,
        .bg-light>a {
            color: white !important;
        }
    </style>
    <!-- Page Wrapper -->
    <div id="admin_page" class="wrapper">

        <!-- Navbar -->
        <div style="background-color: #2c3e50;" class="container-fluid">
            <div class="container">
                <nav style="background-color: #2c3e50 !important;" class="navbar navbar-expand-md navbar-light bg-light">
                    <a class="navbar-brand" href="{{route('admin-home')}}">KNEQAS RTRI QC</a>
                    <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                        <span class="navbar-toggler-icon"></span>
                    </button>

                    <div class="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul class="navbar-nav mr-auto flex-fill">
                            <li class="nav-item active">
                                <a class="nav-link" href="{{route('admin-home')}}">Dashboard <span class="sr-only">(current)</span></a>
                            </li>

                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Configure
                                </a>
                                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href="{{route('list-admin-user')}}">QC Managers</a>
                                    <div class="dropdown-divider"></div>
                                    <a class="dropdown-item" href="{{route('list-lab')}}">QC Laboratories</a>
                                    <div class="dropdown-divider"></div>
                                    <a class="dropdown-item" href="{{route('list-personel')}}">QC Lab Personel</a>
                                    <div class="dropdown-divider"></div>
                                    <a class="dropdown-item" href="{{route('fcdrr-settings')}}">Fcdrr Settings</a>
                                </div>
                            </li>

                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Reports
                                </a>
                                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href="{{route('fcdrr-report')}}">FCDRR Submissions</a>
                                    <div class="dropdown-divider"></div>
                                    <a class="dropdown-item" href="{{route('fcdrr-indicators')}}">FCDRR Indicators</a>
                                    <!-- <div class="dropdown-divider"></div>
                                    <a class="dropdown-item" href="{{route('list-personel')}}">QC Lab Personel</a> -->

                                    <!--    <a class="dropdown-item" href="#">Something else here</a> -->
                                </div>
                            </li>

                        </ul>

                        <ul class="navbar-nav ml-auto">
                            <li class="nav-item dropdown">
                                <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                    Account
                                </a>
                                <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                    <a class="dropdown-item" href="{{route('edit-admin-user',['userId'=>'bad6b8cf97131fceab'])}}">Profile</a>
                                    <a class="dropdown-item" href="{{route('admin-logout')}}">Logout</a>
                                </div>
                            </li>
                        </ul>
                    </div>
                </nav>
            </div>
        </div>
        <!-- /.navbar -->


        <!-- Content Wrapper. Contains page content -->
        <div style="background-color: white;" class="">
            <!-- Content Header (Page header) -->
            <div class="content-header">
                <div class="container">

                    <!-- Begin Page Content -->
                    <div class="container-fluid">
                        @yield('content')
                    </div>

                </div><!-- /.container-fluid -->
            </div>

            <!-- /.content -->
        </div>
        <!-- /.content-wrapper -->
        <style>
            .m-footer {
                position: fixed;
                left: 0;
                bottom: 0;
                width: 100%;
                text-align: center;
            }
        </style>
        <footer class="m-footer pl-3 pr-3 bg-white">
            <strong>Copyright &copy; 2014- <script>
                    document.write(new Date().getFullYear());
                </script> <a href="https://nphl.go.ke/">NPHL KNEQAS - QC</a>.</strong>
            All rights reserved. | <a href="http://helpdesk.nphl.go.ke/">Recency QC HELP DESK</a>
            <div class="float-right d-none d-sm-inline-block">
                <b>Version</b> 1.0.0
            </div>
        </footer>

        <!-- Control Sidebar -->
        <aside class="control-sidebar control-sidebar-dark">
            <!-- Control sidebar content goes here -->
        </aside>
        <!-- /.control-sidebar -->

        <!-- Custom scripts for all pages-->
        <script src="{{ asset('js/adminlte.js') }}" defer></script>
    </div>
</body>

</html>