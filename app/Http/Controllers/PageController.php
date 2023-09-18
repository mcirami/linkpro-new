<?php

namespace App\Http\Controllers;

use App\Http\Requests\PageBioRequest;
use App\Http\Requests\PageNameRequest;
use App\Http\Requests\PagePassword;
use App\Http\Requests\PageTitleRequest;
use App\Models\Page;
use App\Models\User;
use App\Services\PageService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Http\Traits\UserTrait;
use Illuminate\Support\Facades\Cookie;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;

class PageController extends Controller
{

    use UserTrait;

    public function show(PageService $pageService, Page $page) {

        if ($page->disabled) {
            return abort(404);
        }

        $expire = 6 * 30 * 86400;
        Cookie::queue('lp_page_referral', $page->user_id, $expire);

        $page->pageVisits()->create();

        $user = User::findOrFail($page->user_id);
        $subscribed = $this->checkUserSubscription($user);

        $links = $pageService->getUserLinks($page, $subscribed);

        $value = session('authorized');

        if($page->custom) {
            return view('pages.custom.' . $page->name, [
                'page'  => $page,
                'authorized' => $value,
            ]);

        } else {
            return view('pages.show', [
                'links' => $links,
                'page'  => $page,
                'authorized' => $value,
                'subscribed' => $subscribed
            ]);
        }

    }

    public function showCreatePage(PageService $pageService) {

        $user = Auth::user();

        if( count($this->getUserPages($user)) > 0) {
            return redirect('/dashboard');
        }

        $pageService->showCreatePage();

        return view('pages.create');
    }

    public function store(PageNameRequest $request, PageService $pageService) {

        $page = $pageService->createNewPage($request);

        //$linkService->addLink($page);

        return response()->json(['message'=> 'New Link Added', 'page_id' => $page->id]);
    }

    public function updateName(PageNameRequest $request, PageService $pageService, Page $page) {

        if ($page->user_id != Auth::id()) {
            return abort(404);
        }

        $pageService->updatePageName($request, $page);

        return response()->json(['message' => 'Link Name Updated']);

    }

    public function edit(PageService $pageService, Page $page) {

        $user = Auth::user();

        if ($page->user_id != $user->id || $page->disabled) {
            return abort(404);
        }

        $pageService->editPage($page);

        return view('pages.edit');
    }

    public function updateHeaderImage(Request $request, Page $page, PageService $pageService) {

        $userID = Auth::id();

        if ($page->user_id != $userID) {
            return abort(404);
        }

        $imgPath = $pageService->updateHeaderImage($request, $userID, $page);

        return response()->json(['message' => 'Header Image Updated', 'imgPath' => $imgPath]);

    }

    public function updateProfileImage(Request $request, Page $page, PageService $pageService) {

        $userID = Auth::id();

        if ($page->user_id != $userID) {
            return abort(404);
        }

        $imgPath = $pageService->updateProfileImage($request, $userID, $page);

        return response()->json(['message' => 'Profile Image Updated', 'imgPath' => $imgPath]);

    }

    public function updateTitle(PageTitleRequest $request, Page $page, PageService $pageService) {


        if ($page->user_id != Auth::id()) {
            return abort(404);
        }

        $pageService->updatePageTitle($request, $page);

        return response()->json(['message' => 'Link Title Updated']);

    }

    public function updateBio(PageBioRequest $request, Page $page, PageService $pageService) {

        if ($page->user_id != Auth::id()) {
            return abort(404);
        }

        $pageService->updatePageBio($request, $page);

        return response()->json(['message' => 'Link Bio Updated']);

    }

    public function updateProfileLayout(Request $request, Page $page, PageService $pageService) {

        if ($page->user_id != Auth::id()) {
            return abort(404);
        }

        $pageService->updateLayout($request, $page);

        return response()->json(['message' => 'Layout Updated']);
    }

    public function pageAuth(Request $request, Page $page, PageService $pageService) {

        $pageService->authorizePage($request, $page);

        return redirect()->back()->withErrors(['unauthorized' => 'Incorrect Pin']);
    }

    public function redirect(Request $request) {
        $param = $request->redirected;
        $user = Auth::user();
        $page = $user->pages()->where('user_id', $user["id"])->where('default', true)->get();

        if ($param) {
            $url = '/dashboard/pages/' . $page[0]->id . "?redirected=" . $param;
        } else {
            $url = '/dashboard/pages/' . $page[0]->id;
        }

        return redirect($url);
    }

    public function showPreRegister() {

        Javascript::put([]);

        return view('pages.pre-register');
    }
}
