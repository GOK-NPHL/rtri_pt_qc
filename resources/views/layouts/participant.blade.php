<!doctype html>
<html lang="{{ str_replace('_', '-', app()->getLocale()) }}">

<?php

use Illuminate\Support\Facades\Gate;
use Illuminate\Routing\Router;
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

<body class="hold-transition sidebar-mini layout-fixed">
    <!-- Page Wrapper -->
    <div id="app" class="wrapper">

        <!-- Navbar -->
        <nav style="background-color: #3c8dbc;" class="main-header navbar navbar-expand navbar-white navbar-light">
            <!-- Left navbar links -->
            <ul class="navbar-nav">
                <li class="nav-item">
                    <a class="nav-link" style="color: white;" data-widget="pushmenu" href="#" role="button"><i class="fas fa-bars"></i></a>
                </li>
            </ul>
            <!-- Right navbar links -->
            <ul class="navbar-nav ml-auto">
                <!-- Notifications Dropdown Menu -->
                <li class="nav-item dropdown">
                    <a class="nav-link text-white" data-toggle="dropdown" href="#">
                        <i class="fa fa-user"></i> {{ Auth::user()->name }} &#9662;
                    </a>
                    <div class="dropdown-menu dropdown-menu-lg dropdown-menu-left">
                        <span class="dropdown-item dropdown-header">
                            <span>{{ Auth::user()->name }} {{ Auth::user()->second_name ?? Auth::user()->second_name }}</span>
                            (<span>{{ Auth::user()->email }}</span>)
                        </span>
                        <div class="dropdown-divider"></div>
                        <a href="{{ route('participant-qc-demographics') }}" class="dropdown-item nav-link">
                            <i class="fas fa-edit mr-2"></i> Edit profile
                        </a>
                        <div class="dropdown-divider"></div>
                        <a  href="{{ route('logout') }}" class="dropdown-item nav-link">
                            <i class="fa fa-door-open mr-2"></i> Log out
                        </a>
                        <div class="dropdown-divider"></div>
                    </div>
                </li>
            </ul>
        </nav>
        <!-- /.navbar -->

        <!-- Main Sidebar Container -->
        <aside class="main-sidebar sidebar-dark-primary elevation-4">
            <!-- Brand Logo -->
            <a href="{{ route('participant-home') }}" style="padding: 2.4px; background-color: #3c8dbc;" class="brand-link">
                <img style="max-width: 20%" src="{{URL('/images/coat.png')}}" alt="">
                <span class="brand-text" style="font-weight: 300; 
                                                font-size: 20px;
                                                line-height: 50px;
                                                text-align: center;
                                                font-family: Helvetica Neue,Helvetica,Arial,sans-serif;
                                                font-weight: 300">
                    RTRI QC
                </span>
            </a>

            <!-- Sidebar -->
            <div class="sidebar">
                <!-- Sidebar user panel (optional) -->

                <!-- Sidebar Menu -->
                <nav class="mt-2">
                    <ul class="nav nav-pills nav-sidebar flex-column" data-widget="treeview" role="menu" data-accordion="false">
                        <!-- Add icons to the links using the .nav-icon class
               with font-awesome or any other icon font library -->

                        <?php if (Gate::allows('view_qc_component')) { ?>
                            <li class="nav-item has-treeview menu-open mb-2">
                                <a href="{{ route('participant-home') }}" class="nav-link {{ Route::is('participant-home') ? 'active' : '' }}">
                                    <i class="nav-icon fas fa-balance-scale"></i>
                                    <p>
                                        RTRI QC
                                    </p>
                                </a>
                            </li>
                        <?php } ?>

                        <?php if (Gate::allows('view_qc_component')) { ?>
                            <li class="nav-item has-treeview menu-open mb-2">
                                <a href="{{ route('fcdrr-dashboard') }}" class="nav-link {{ Route::is('fcdrr-dashboard') ? 'active' : '' }}">
                                    <i class="nav-icon fas fa-boxes"></i>
                                    <p>
                                        FCDRR Dashboard
                                    </p>
                                </a>
                            </li>
                            <li class="nav-item has-treeview menu-open mb-2">
                                <a href="{{ route('fcdrr-submissions') }}" class="nav-link {{ Route::is('fcdrr-submissions') ? 'active' : '' }}">
                                    <i class="nav-icon fas fa-boxes"></i>
                                    <p>
                                        FCDRR Submissions
                                    </p>
                                </a>
                            </li>
                        <?php } ?>

                        <!-- <?php
                        if (Gate::allows('view_pt_component')) { ?>
                            <li class="nav-item has-treeview menu-open mb-2">
                                <a href="{{ route('participant-pt-home') }}" class="nav-link">
                                    <i class="nav-icon fas fa-book"></i>
                                    <p>
                                        RTRI PT
                                    </p>
                                </a>
                            </li>
                        <?php } ?> -->

                        <!-- system actions -->
                        <!-- <li class="nav-item has-treeview">
                            <a href="#" class="nav-link">
                                <i class="nav-icon fas fa-copy"></i>
                                <p>
                                    Reports
                                    <i class="fas fa-angle-left right"></i>
                                </p>
                            </a>
                            <ul class="nav nav-treeview">
                                <li class="nav-item">
                                    <a href="pages/layout/top-nav.html" class="nav-link">
                                        <i class="far fa-circle nav-icon"></i>
                                        <p>QC reports</p>
                                    </a>
                                </li>
                            </ul>
                        </li> -->
                        <!-- end system actions -->


                        <!-- Account features-->
                        <!--<li class="nav-item has-treeview">
                            <a href="#" class="nav-link">
                                <i class="fas fa-user"></i>
                                <p>
                                    My Account
                                    <i class="fas fa-angle-left right"></i>
                                </p>
                            </a>
                            <ul class="nav nav-treeview">
                                <li class="nav-item">
                                    <a href="{{ route('participant-qc-demographics') }}" class="nav-link {{ Route::is('participant-qc-demographics') ? 'active' : '' }}">
                                        <i class="far fa-circle nav-icon"></i>
                                        <p>{{ Auth::user()->name }} {{ Auth::user()->second_name ?? Auth::user()->second_name }}</p>
                                    </a>
                                </li>
                            </ul>
                        </li>-->
                        <!-- end account features -->

                        <li class="nav-item">
                            <a href="{{route('logout')}}" class="nav-link">
                                <i class="fas fa-sign-out-alt"></i>
                                <p>
                                    Logout

                                </p>
                            </a>
                        </li>
                    </ul>
                </nav>
                <!-- /.sidebar-menu -->
            </div>
            <!-- /.sidebar -->
        </aside>

        <!-- Content Wrapper. Contains page content -->
        <div style="background-color: white;" class="content-wrapper">
            <!-- Content Header (Page header) -->
            <div class="content-header">
                <div class="container-fluid">

                    <!-- Begin Page Content -->
                    <div class="container-fluid">
                        @yield('content')
                    </div>

                </div><!-- /.container-fluid -->
            </div>
            <!-- /.content-header -->

            <!-- Main content -->

            <!-- /.content -->
        </div>
        <!-- /.content-wrapper -->
        <footer class="main-footer bg-white">
            <strong>Copyright &copy; 2014- <script>
                    document.write(new Date().getFullYear());
                </script> <a href="https://nphl.go.ke/">NPHL KNEQAS - RTRI QC</a>.</strong>
            All rights reserved. | <a href="http://helpdesk.nphl.go.ke/">RTRI QC HELP DESK</a>
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