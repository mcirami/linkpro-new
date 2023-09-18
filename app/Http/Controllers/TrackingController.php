<?php /** @noinspection MissingReturnTypeInspection */

namespace App\Http\Controllers;

use App\Models\Link;
use App\Models\Folder;
use App\Services\TrackingServices;
use Illuminate\Http\Request;
use Laracasts\Utilities\JavaScript\JavaScriptFacade as Javascript;

class TrackingController extends Controller
{

    /**
     * @param Link $link
     *
     * @return \Illuminate\Http\JsonResponse
     */
    public function storeLinkVisit(Link $link) {

        $link->linkVisits()->create([
            'page_id' => $link->page_id
        ]);

        return response()->json(['success' => true]);
    }

    public function storeFolderClick(Folder $folder) {

        $folder->folderClicks()->create([
            'page_id' => $folder->page_id
        ]);

        return response()->json(['message' => "Success!"]);
    }

}
