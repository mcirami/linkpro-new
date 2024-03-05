<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\User;
//use Illuminate\Foundation\Auth\RegistersUsers;
use App\Notifications\WelcomeCourseNotification;
use App\Services\CourseRegisterService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Inertia\Response;

class CourseRegisterController extends Controller
{
    /*
    |--------------------------------------------------------------------------
    | Register Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles the registration of new users as well as their
    | validation and creation. By default this controller uses a trait to
    | provide this functionality without requiring any additional code.
    |
    */

    /**
     * @param User $user
     * @param Course $course
     *
     * @return Response
     *
     */
    public function show(Request $request, User $user, Course $course): Response {

        $clickInfo = $request->all();

        return Inertia::render( 'Register/CourseRegister' )->with( [ 'course' => $course, 'clickInfo' => $clickInfo, 'creator' => $user->username] );
    }


    /**
     * @param Request $request
     * @param CourseRegisterService $courseRegisterService
     *
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function store(Request $request, CourseRegisterService $courseRegisterService): \Symfony\Component\HttpFoundation\Response {

        $response = $courseRegisterService->verify($request);

        if ($response['success']) {
            $data = $request->all();
            $user = $courseRegisterService->create( $data );

            $user->assignRole( 'course.user' );
            Auth::login( $user );

            $course = Course::where( 'id', $data['course_id'] )->select( 'title', 'slug', 'logo', 'header_color',
                'header_text_color' )->first();

            $userData = [
                'username' => $user->username,
                'creator'  => $data['course_creator'],
                'course'   => $course
            ];

            $user->notify( new WelcomeCourseNotification( $userData ) );

            // /{user:username}/course/{course:slug}/checkout

            $checkoutUrl = config( 'app.url' ) . '/' . $user->username . '/course/' . $course->slug . '/checkout?a=' . $request->get( 'a' ) . '&cid=' . $request->get( 'cid' );

            return Inertia::location( $checkoutUrl );
            //return response()->json(['success' => true, 'user' => $user->id]);
        }

        return response()->json( [
            'success' => $response['success'],
            'errors'  => $response['errors']
        ] );
    }

}
