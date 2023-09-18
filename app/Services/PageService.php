<?php


namespace App\Services;
use App\Models\Page;
use App\Models\ShopifyStore;
use App\Notifications\WelcomeNotification;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;
use App\Http\Traits\UserTrait;
use App\Http\Traits\LinkTrait;
use function PHPUnit\Framework\isEmpty;

class PageService {

    use UserTrait, LinkTrait;

    private $user;

    /**
     * @param $user
     */
    public function __construct() {
        $this->user = Auth::user();

        return $this->user;
    }

    public function sortArray($a, $b) {

        return ($a["position"] > $b["position"] ? +1 : -1);
    }

    public function getUserLinks($page, $subscribed) {

        $allLinks = $this->getAllLinks($page);

        if($subscribed) {

            $folderLinks = $this->getFolderLinks($page);
            if(!empty($folderLinks)) {
                $allLinks = array_merge( $allLinks, $folderLinks);
                usort($allLinks, array($this, "sortArray" ));
            }
        }

        $objectArray = array_map(function($array){
            return (object)$array;
        }, $allLinks);

        return $objectArray;
    }

    /**
     * Create New Page
     *
     * @return $page
     */
    public function createNewPage($request) {

        $path = $request->session()->get('_previous');

        $name = preg_replace("/[\s_]/", "-", strtolower($request->name));

        $userPages = $this->getUserPages($this->user);

        $default = false;
        if( $userPages->isEmpty() ) {
            $default = true;
        }

        $page = $this->user->pages()->create([
            'name' => $name,
            'title' => null,
            'bio' => null,
            'is_protected' => false,
            'default' => $default,
        ]);

        if(str_contains($path["url"], 'create-page')) {
            $userData = ([
                'username' => $name,
                'link' => $name,
                'userID'  => $this->user->id,
            ]);

            $this->user->assignRole('lp.user');

            $this->user->notify(new WelcomeNotification($userData));
        }

        if ($default) {
            $this->user->username = $name;
            $this->user->save();
        }

        return $page;
    }

    /**
     * Create Update Page Name
     *
     * @return void
     */

    public function updatePageName($request, $page) {

        $page->update(['name' => $request['name']]);

        if ($page->default) {
            $this->user->update(['username' => $request['name']]);
        }
    }

    /**
     * Show Edit Page
     *
     * @return void
     */

    public function editPage($page) {

        $userPages = $this->getUserPages($this->user);

        $standardIcons = [];
        $iconNames = Storage::disk('s3')->allFiles("icons/");
        foreach($iconNames as $icon) {
            $path = Storage::disk('s3')->url($icon);
            array_push($standardIcons, $path);
        }

        $linksArray = $this->getAllLinks($page);

        $folderLinks = $this->getFolderLinks($page);
        if (!empty($folderLinks)) {
            $linksArray = array_merge($linksArray, $folderLinks);
            usort($linksArray, array($this, "sortArray" ));
        }

        $pageNames = Page::all()->pluck('name')->toArray();

        $userSubscription = $this->user->subscriptions()->first();

		$affStatus = DB::table('affiliates')->where('user_id', $this->user->id)->pluck('status');

        Javascript::put([
            'links'         => $linksArray,
            'icons'         => $standardIcons,
            'page'          => $page,
            'user_pages'    => $userPages,
            'allPageNames'  => $pageNames,
            'userSub'       => $userSubscription,
	        'affStatus'     => count($affStatus) > 0 ? $affStatus[0] : null
        ]);
    }

    /*
     *
     * Show Create Page Name at Register
     *
     */
    public function showCreatePage() {

        $pageNames = Page::all()->pluck('name')->toArray();

        Javascript::put([
            'pageNames' => $pageNames
        ]);
    }

    /**
     * Update Page Header Image
     *
     * @return
     */
    public function updateHeaderImage($request, $userID, $page) {

        $imgName = time() . '.' . $request->ext;
        $pathToFolder = 'page-images/' . $userID . '/' . $page->id . '/header-img/';
        $path = $pathToFolder . $imgName;

        $files = Storage::disk('s3')->allFiles($pathToFolder);
        Storage::disk('s3')->delete($files);

        Storage::disk('s3')->copy(
            $request->header_img,
            str_replace($request->header_img, $path, $request->header_img)
        );

        $amazonPath = Storage::disk('s3')->url($path);

        $page->update(['header_img' => $amazonPath]);

        return $amazonPath;
    }

    /**
     * Update Page Profile Image
     *
     * @return $newpath
     */
    public function updateProfileImage($request, $userID, $page) {

        $imgName = time() . '.' . $request->ext;
        $pathToFolder = 'page-images/' . $userID . '/' . $page->id . '/profile-img/';
        $path = $pathToFolder . $imgName;

        $files = Storage::disk('s3')->allFiles($pathToFolder);
        Storage::disk('s3')->delete($files);

        Storage::disk('s3')->copy(
            $request->profile_img,
            str_replace($request->profile_img, $path, $request->profile_img)
        );

        $amazonPath = Storage::disk('s3')->url($path);

        $page->update(['profile_img' => $amazonPath]);

        return $amazonPath;

    }

    /**
     * Update Page Title
     *
     * @return void
     */
    public function updatePageTitle($request, $page) {

        $page->update(['title' => $request['title']]);

    }

    /**
     * Update Page Bio
     *
     * @return void
     */
    public function updatePageBio($request, $page) {

        $page->update(['bio' => $request['bio']]);

    }

    public function updateLayout($request, $page) {

        $page->update(['profile_layout' => $request['profileLayout']]);
    }

    /**
     * Authorize Page
     *
     */
    public function authorizePage($request, $page) {

        $request->validate([
            'pin' => 'required',
        ]);

        $enteredPin = $request->pin;
        $pagePin = $page->password;

        if ($enteredPin === $pagePin) {
            $request->session()->put('authorized', true);
            return redirect()->back();
        }

    }
}
