<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Course;
use App\Models\CourseSection;
use App\Models\User;
use App\Services\CourseService;
use App\Services\LandingPageService;
use App\Services\OfferService;
use App\Services\TrackingServices;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;
use App\Http\Traits\PermissionTrait;

class CourseController extends Controller
{
    use PermissionTrait;

    public function show(User $user, Course $course) {

        $offer = $course->Offer()->first();

        if (!$offer->published) {
            return abort(404);
        }

        $hasCourseAccess = $this->checkCoursePermission($course);
        $sections        = $course->CourseSections()->get();

        Javascript::put( [
            'course'            => $course,
            'sections'          => $sections,
            'creator'           => $user->username,
            'hasCourseAccess'   => $hasCourseAccess,
        ] );

        return view( 'courses.show' )->with( [ 'course' => $course ] );
    }

    public function showCourseLander(Request $request, User $user, Course $course, TrackingServices $trackingServices) {

        $offer = $course->Offer()->first();

        if (!$offer->published || !$offer->active) {
            return abort(404);
        }

        $responseData = $trackingServices->storeOfferClick( $offer, $request, $user );

        $hasCourseAccess = $this->checkCoursePermission($course);

        $sections        = $course->CourseSections()->get();

        Javascript::put( [
            'course'            => $course,
            'sections'          => $sections,
            'creator'           => $user->username,
            'hasCourseAccess'   => $hasCourseAccess,
            'affRef'            => $responseData['affRef'],
            'clickId'           => $responseData['clickId']
        ] );

        return view( 'courses.show' )->with( [ 'course' => $course ] );
    }

    public function showCreatorCenter(OfferService $offerService, LandingPageService $landingPageService) {

        $user = Auth::user();

        $landingPageData = null;
        $landingPage = $user->LandingPages()->first();
        if ($landingPage) {
            $landingPageData = $landingPageService->getLPData($landingPage);
        }

        $offers = $offerService->getOffers($user);

        Javascript::put([
            'offers'        => $offers,
            'landingPage'   => $landingPageData
        ]);
        return view('courses.creator');
    }

    public function edit(Course $course, CourseService $courseService) {
        $user = Auth::user();

        if ($course->user_id != $user["id"]) {
            return abort(404);
        }

        $courseData = $courseService->getCourseData($course);
        $offerData = $courseService->getCourseOfferData($course);
        $categories = Category::with('children')->whereNull('parent_id')->get();

        Javascript::put([
            'courseData'        => $courseData,
            'offerData'     => $offerData,
            'username'      => $user["username"],
            'categories'    => $categories
        ]);

        return view('courses.edit');

    }

    public function store() {
        $user = Auth::user();

        $course = $user->Courses()->create();

        $user->Offers()->create([
            'course_id' => $course->id,
        ]);

        return redirect('/creator-center/course/' . $course->id);

    }

    public function saveCourseData(Request $request, Course $course, CourseService $courseService) {
        $userID = Auth::id();

        if ($course->user_id != $userID) {
            return abort(404);
        }

        $key = $courseService->saveCourseData($course, $request);

        return response()->json(['message' => $key["key"] .  " Updated", 'slug' => $key["slug"]]);
    }

    public function saveImage(Request $request, Course $course, CourseService $courseService) {
        $userID = Auth::id();

        if ($course->user_id != $userID) {
            return abort(404);
        }
        $keys = collect($request->all())->keys();
        $imagePath = $courseService->saveCourseImage($userID, $request, $keys[0], $course);

        return response()->json(['message' => $keys[0] . ' Updated', 'imagePath' => $imagePath]);
    }

    public function addSection(Request $request, Course $course, CourseService $service) {
        $userID = Auth::id();

        if ($course->user_id != $userID) {
            return abort(404);
        }

        $section = $service->addCourseSection($course, $userID, $request);

        return response()->json(['section' => $section]);
    }

    public function updateSectionData(Request $request, CourseSection $courseSection, CourseService $service) {
        $userID = Auth::id();

        if ($courseSection->user_id != $userID) {
            return abort(404);
        }

        $key = $service->saveSectionData($courseSection, $request);

        return response()->json(['message' => $key .  " Updated"]);
    }

    /**
     * @param CourseSection $courseSection
     *
     * @return JsonResponse|never
     */
    public function deleteSection(Request $request, CourseSection $courseSection, CourseService $courseService) {
        $userID = Auth::id();

        if ($courseSection->user_id != $userID) {
            return abort(404);
        }
        $courseSection->delete();
        $courseService->updateAllSectionsPositions($request->all());

        return response()->json(['message' => "Section Deleted"]);
    }

    public function showAllCourses(CourseService $courseService) {

        $authUserID = Auth::user()->id;

        $purchasedCourses = $courseService->getUserPurchasedCourses($authUserID);
        $unPurchasedCourses = $courseService->getUnpurchasedCourses($authUserID);

        Javascript::put([]);

        return view('courses.all')->with([
            'purchasedCourses'      => $purchasedCourses,
            'unPurchasedCourses'    => $unPurchasedCourses,
        ]);
    }

    public function getCourseCategories() {

        $categories = Category::with('children')->whereNull('parent_id')->get();

        return response()->json(['categories' => $categories]);
    }

    public function updateSectionsPositions(Request $request, CourseService $courseService) {

        $courseService->updateAllSectionsPositions($request->all());

        return response()->json(['message' => "Sections Positions Updated"]);
    }
}
