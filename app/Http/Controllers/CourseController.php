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
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;
use App\Http\Traits\PermissionTrait;
use Symfony\Component\HttpFoundation\Response;

class CourseController extends Controller
{
    use PermissionTrait;

    public function show(User $user, Course $course) {

        $offer = $course->Offer()->first();

        if (!$offer->published) {
            return abort(404);
        }

        $hasCourseAccess = $this->checkCoursePermission($course);
        $sections        = $course->CourseSections()->orderBy('position')->get();

        return Inertia::render( 'SingleCourse/Course' )->with( [
            'course'            => $course,
            'creator'           => $user->username,
            'sections'          => $sections,
            'hasCourseAccess'   => $hasCourseAccess,
        ] );
    }

    public function showCourseLander(Request $request, User $user, Course $course, TrackingServices $trackingServices) {

        $offer = $course->Offer()->first();

        if (!$offer->published || !$offer->active) {
            return abort(404);
        }

        $responseData = $trackingServices->storeOfferClick( $offer, $request, $user );

        $hasCourseAccess = $this->checkCoursePermission($course);

        $sections        = $course->CourseSections()->orderBy('position')->get();

        return Inertia::render( 'SingleCourse/Course' )->with( [
            'course'            => $course,
            'creator'           => $user->username,
            'sections'          => $sections,
            'hasCourseAccess'   => $hasCourseAccess,
            'page'              => "lander",
            'affRef'            => $responseData['affRef'],
            'clickId'           => $responseData['clickId']
        ] );
    }

    /**
     * @param OfferService $offerService
     * @param LandingPageService $landingPageService
     *
     * @return \Inertia\Response
     */
    public function showCreatorCenter(OfferService $offerService, LandingPageService $landingPageService): \Inertia\Response {

        $user = Auth::user();

        $landingPageData = null;
        $landingPage = $user->LandingPages()->first();
        if ($landingPage) {
            $landingPageData = $landingPageService->getLPData($landingPage);
        }

        $offers = $offerService->getOffers($user);

        return Inertia::render('CreatorCenter/CreatorCenter')->with(['offers' => $offers, 'landingPage' => $landingPageData]);
    }

    public function edit(Course $course, CourseService $courseService) {
        $user = Auth::user();

        if ($course->user_id != $user["id"]) {
            return abort(404);
        }

        $courseData = $courseService->getCourseData($course);
        $offerData = $courseService->getCourseOfferData($course);
        $categories = Category::with('children')->whereNull('parent_id')->get();

        return Inertia::render('CourseCreator/CourseCreator')->with([
            'courseArray'    => $courseData,
            'offerArray'     => $offerData,
            'categories'    => $categories
        ]);

    }


    /**
     * @return RedirectResponse|Response
     */
    public function store(): Response|RedirectResponse {
        $user = Auth::user();

        $course = $user->Courses()->create();

        $user->Offers()->create([
            'course_id' => $course->id,
        ]);

        return Inertia::location('/creator-center/course/' . $course->id);
    }

    public function saveCourseData(Request $request, Course $course, CourseService $courseService) {
        $userID = Auth::id();

        if ($course->user_id != $userID) {
            return abort(404);
        }

        $key = $courseService->saveCourseData($course, $request);

        return response()->json(['message' => $key["key"] .  " Updated", 'slug' => $key["slug"]]);
    }

    /**
     * @param Request $request
     * @param Course $course
     * @param CourseService $courseService
     *
     * @return JsonResponse
     */
    public function saveImage(Request $request, Course $course, CourseService $courseService): JsonResponse {
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

    /**
     * @param CourseService $courseService
     *
     * @return mixed
     */
    public function showAllCourses(CourseService $courseService): mixed {

        $authUserID = Auth::id();

        $purchasedCourses = $courseService->getUserPurchasedCourses($authUserID);
        $unPurchasedCourses = $courseService->getUnpurchasedCourses($authUserID);

        return Inertia::render('AllCourses/Courses')->with([
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
