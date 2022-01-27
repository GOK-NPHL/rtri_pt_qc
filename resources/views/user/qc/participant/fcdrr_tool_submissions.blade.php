@extends('layouts.participant')

@section('content')
<div class="container-fluid">

    @if (Auth::user()->can('view_qc_component'))
    <div id="fcdrr_tool_submissions"></div>
    @endif

</div>
@endsection