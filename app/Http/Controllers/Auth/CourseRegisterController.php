<?php

namespace App\Http\Controllers\Auth;

use App\Http\Controllers\Controller;
use App\Models\Course;
use App\Models\User;
//use Illuminate\Foundation\Auth\RegistersUsers;
use App\Notifications\WelcomeCourseNotification;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Session;
use Illuminate\Support\Facades\Validator;

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

    //use RegistersUsers;

    /**
     * Where to redirect users after registration.
     *
     * @var string
     */
    //protected $redirectTo = RouteServiceProvider::HOME;

    /**
     * Create a new controller instance.
     *
     * @return void
     */
    /*public function __construct()
    {
        $this->middleware('guest');
    }*/


    /**
     * @param Request $request
     *
     * @return JsonResponse
     */
    public function customRegistration(Request $request)
    {

        $validator = Validator::make($request->all(),[
            'username' => ['required', 'string', 'max:255', 'unique:users'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
        ],
            [
                'username.required'     => 'Please provide your username',
                'username.unique'       => 'Sorry, username is already taken',
                'email.required'        => 'Please provide a valid Email address',
                'email.unique'          => 'Sorry, Email is already registered',
                'password.required'     => 'Password is required',
                'password.min'          => 'Password Length Should Be More Than 8 Characters'
            ]
        );

        if($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ]);
        }

        $data = $request->all();
        $user = $this->create($data);
        $user->assignRole('course.user');

        Auth::login($user);

        $permissions = $user->getPermissionsViaRoles()->pluck('name');
        Session::put('permissions', $permissions);

        $course = Course::where('id', $data['course_id'])->select('title', 'slug', 'logo', 'header_color', 'header_text_color')->first();

        $userData = [
            'username'  => $user->username,
            'creator'   => $data['course_creator'],
            'course'    => $course
        ];

        $user->notify(new WelcomeCourseNotification($userData));

        return response()->json(['success' => true, 'user' => $user->id]);
    }

    /**
     * Create a new user instance after a valid registration.
     *
     * @param  array  $data
     * @return \App\Models\User
     */
    protected function create(array $data)
    {
        //$cookie = Cookie::get('lp_page_referral');
        $user = User::create([
            'username' => $data['username'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
        ]);

        /*if($cookie) {
            Referral::create([
                'user_id' => $cookie,
                'referral_id' => $user->id
            ]);
        }*/

        return $user;
    }

    /**
     * The user has been registered.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  mixed  $user
     * @return mixed
     */
   /* protected function registered(Request $request, $user)
    {
        return redirect()->route('/courses');
    }*/
}
