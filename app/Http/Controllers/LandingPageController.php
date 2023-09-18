<?php

namespace App\Http\Controllers;

use App\Models\LandingPage;
use App\Models\LandingPageSection;
use App\Models\User;
use App\Services\CourseService;
use App\Services\LandingPageService;
use Illuminate\Contracts\Foundation\Application;
use Illuminate\Contracts\View\Factory;
use Illuminate\Contracts\View\View;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Routing\Redirector;
use Illuminate\Support\Facades\Auth;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;

class LandingPageController extends Controller
{
    /**
     * @param User $user
     * @param LandingPage $landingPage
     *
     * @return Application|Factory|View|never
     */
    public function show(User $user, LandingPage $landingPage) {

        /*if (!$landingPage->published) {
            return abort(404);
        }*/

        $sections = $landingPage->LandingPageSections()
                                ->leftJoin('users', 'landing_page_sections.user_id', '=', 'users.id')
                                ->leftJoin('courses', 'landing_page_sections.button_course_id', '=', 'courses.id')
                                ->select('landing_page_sections.*', 'users.username', 'courses.slug')
                                ->orderBy('position')
                                ->get();

        Javascript::put([
            'livePage' => $landingPage,
            'liveSections' => $sections,
        ]);

        return view('landing-page.show');
    }

    /**
     * @return Application|RedirectResponse|Redirector
     */
    public function store() {
        $user = Auth::user();

        if ($user->LandingPages()->exists()) {
            return redirect()->route('creator.center');
        } else {
            $landingPage = $user->LandingPages()->create([]);
        }

        return redirect('/creator-center/landing-page/' . $landingPage->id);
    }

    /**
     * @param LandingPage $landingPage
     *
     * @return Application|Factory|View|never
     */
    public function edit(LandingPage $landingPage, LandingPageService $service, CourseService $courseService) {

        $user = Auth::user();

        if ($landingPage->user_id != $user["id"]) {
            return abort(404);
        }

        $landingPageData = $service->getLPData($landingPage);
        $courses = $courseService->getCourses($user);

        Javascript::put([
            'landingPage' => $landingPageData,
            'courses' => $courses,
            'username' => $user["username"]
        ]);

        return view('landing-page.edit');
    }

    /**
     * @param Request $request
     * @param LandingPage $landingPage
     * @param LandingPageService $service
     *
     * @return JsonResponse|never
     */
    public function saveImage(Request $request, LandingPage $landingPage, LandingPageService $service) {

        $userID = Auth::id();

        if ($landingPage->user_id != $userID) {
            return abort(404);
        }
        $keys = collect($request->all())->keys();

        $imagePath = $service->savePageImage($userID, $request, $keys[0], $landingPage);

        return response()->json(['message' => $keys[0] . ' Updated', 'imagePath' => $imagePath]);
    }

    /**
     * @param Request $request
     * @param LandingPage $landingPage
     * @param LandingPageService $service
     *
     * @return JsonResponse|never
     */
    public function saveLandingPageData(Request $request, LandingPage $landingPage, LandingPageService $service) {

        $userID = Auth::id();

        if ($landingPage->user_id != $userID) {
            return abort(404);
        }

        $key = $service->savePageData($landingPage, $request);

        return response()->json(['message' => $key["key"] .  " Updated", 'slug' => $key["slug"]]);
    }

    /**
     * @param Request $request
     * @param LandingPage $landingPage
     * @param LandingPageService $service
     *
     * @return JsonResponse|never
     */
    public function addSection(Request $request, LandingPage $landingPage, LandingPageService $service) {
        $userID = Auth::id();

        if ($landingPage->user_id != $userID) {
            return abort(404);
        }

        $section = $service->addLPSection($landingPage, $userID, $request);

        return response()->json(['section' => $section]);
    }

    /**
     * @param Request $request
     * @param LandingPageSection $landingPageSection
     * @param LandingPageService $service
     *
     * @return JsonResponse|never
     */
    public function updateSectionData(Request $request, LandingPageSection $landingPageSection, LandingPageService $service) {
        $userID = Auth::id();

        if ($landingPageSection->user_id != $userID) {
            return abort(404);
        }

        $key = $service->saveLPSection($landingPageSection, $request);

        return response()->json(['message' => $key .  " Updated"]);

    }

    /**
     * @param Request $request
     * @param LandingPageSection $landingPageSection
     * @param LandingPageService $service
     *
     * @return JsonResponse|never
     */
    public function updateSectionImage(Request $request, LandingPageSection $landingPageSection, LandingPageService $service) {
        $userID = Auth::id();

        if ($landingPageSection->user_id != $userID) {
            return abort(404);
        }

        $keys = collect($request->all())->keys();

        $imagePath = $service->saveSectionImage($userID, $request, $keys[0], $landingPageSection);

        return response()->json(['message' => $keys[0] . ' Updated', 'imagePath' => $imagePath]);

    }

    /**
     * @param LandingPageSection $landingPageSection
     *
     * @return JsonResponse|never
     */
    public function deleteSection(Request $request, LandingPageSection $landingPageSection, LandingPageService $landingPageService) {
        $userID = Auth::id();

        if ($landingPageSection->user_id != $userID) {
            return abort(404);
        }

        $landingPageSection->delete();
        $landingPageService->updateAllSectionsPositions($request->all());

        return response()->json(['message' => "Section Deleted"]);
    }

    /**
     * @param LandingPage $landingPage
     * @param LandingPageService $landingPageService
     *
     * @return JsonResponse|never
     */
    public function publishLandingPage(LandingPage $landingPage, LandingPageService $landingPageService) {
        $userID = Auth::id();

        if ($landingPage->user_id != $userID) {
            return abort(404);
        }

        $success = $landingPageService->publishPage($landingPage);

        if ($success) {
            $returnData = array(
                'success' => true,
                'message' => 'Page Published'
            );

            return response()->json($returnData);
        } else {
            $returnData = array(
                'success' => false,
                'message' => 'Page must have a Title/Slug set before publishing',
                'code' => 400
            );
            return response()->json($returnData, 400);
        }

    }
    /**
     * @param LandingPage $landingPage
     * @param LandingPageService $landingPageService
     *
     * @return JsonResponse|never
     */
    public function activateLandingPage(LandingPage $landingPage, LandingPageService $landingPageService) {
        $userID = Auth::id();

        if ($landingPage->user_id != $userID) {
            return abort(404);
        }

        $landingPageService->activatePage($landingPage);

        $returnData = array(
            'success' => true,
            'message' => 'Page Activated'
        );

        return response()->json($returnData);

    }

    public function updateSectionsPositions(Request $request, LandingPageService $landingPageService) {

        $landingPageService->updateAllSectionsPositions($request->all());

        return response()->json(['message' => "Sections Positions Updated"]);
    }
}
