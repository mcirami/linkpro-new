@extends('voyager::master')

@viteReactRefresh
@vite('resources/js/Admin/admin.jsx')
@section('page_title', __('voyager::generic.viewing') . "Affiliate Stats")

@section('content')
    <div class="page-content browse container-fluid">
        <!-- MY CUSTOM CODE -->
            <div id="admin_affiliate_stats"></div>
        <!-------END CUSTOM CODE--------->

    </div>

@endsection
