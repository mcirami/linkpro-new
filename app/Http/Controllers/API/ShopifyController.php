<?php

namespace App\Http\Controllers\api;

use App\Http\Controllers\API\BaseController as BaseController;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Http\Response;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Laravel\Socialite\Facades\Socialite;
use Signifly\Shopify\Shopify;
use App\Http\Traits\ShopifyTrait;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;
use App\Models\ShopifyStore;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Crypt;

class ShopifyController extends BaseController
{
    use ShopifyTrait;

    public function __construct() {
        // apply auth middleware to store
        // $this->middleware('auth')->only(['store']);
        // redirect the user to the login page
        // http://linkpro-new.test/login?isShopify=true&callback=<CallBackUrl>
        // redirection
    }

     /**
    * Display a listing of the resource.
    *
    * @return Response
    */
    public function index(): JsonResponse | Response
    {

        /* $products = ShopifyStore::all(); */
        return $this->sendResponse("got stuff", 'Stores retrieved successfully.');
    }

/**
    * Store a newly created resource in storage.
    *
    * @param  Request  $request
    * @return InertiaResponse
    */

    public function showConnect(Request $request): InertiaResponse
    {
        $storeDomain = str_replace('.myshopify.com', '', $request->get('domain'));
        return Inertia::render('ConnectShopify/ConnectShopify')->with(['domain' => $storeDomain]);
    }

    public function auth(Request $request) {

        $domain = $request->query('domain');
        $scopes = config('services.shopify.scopes');
        $hostUrl = config('app.url');
        $config = $this->getShopifyConfig($domain, $hostUrl . '/api/auth/shopify/callback');

        return Socialite::driver('shopify')->setConfig($config)->setScopes([$scopes])->redirect();
    }

    public function apiCallback() {

        try {
            $shopifyUser = Socialite::driver('shopify')->user();
            $accessToken = $shopifyUser->accessTokenResponseBody["access_token"];
            $domain = $shopifyUser->getNickname();

            $shopify = new Shopify(
                $accessToken,
                $domain,
                config('services.shopify.api_version')
            );

            $products = $shopify->getProducts()->toArray();

            $productsArray = [];
            foreach($products as $product) {
                $productObject = [
                    "id"            => $product["id"],
                    "product_url"   => 'https://' . $domain . '/products/' . $product["handle"],
                    "title"         => $product["title"],
                    "price"         => $product["variants"][0]["price"],
                    "image_url"     => $product["image"] ? $product["image"]["src"] : null
                ];

                array_push($productsArray, $productObject);
            }

            $dataObject = [
                'access_token' => Crypt::encryptString($accessToken),
                'domain' => $domain,
                'products' => $productsArray
            ];

            //Log::channel( 'webhooks' )->info( " --- object --- " . print_r($dataObject) );
            $shopifyStore = $this->createShopifyStore($dataObject);
            $storeName = str_replace('.myshopify.com', '', $domain);
            $personalAccessToken = Auth::user()->createToken('shopify');
            return Inertia::location('https://admin.shopify.com/store/' . $storeName . '/apps/link-pro?connected=true&token=' . $personalAccessToken->plainTextToken);

        } catch (Exception $e) {
            return redirect()->route('api.show.connect', ['errors' => $e]);
            /* Log::channel( 'cloudwatch' )->info( "--timestamp--" .
                                                Carbon::now() .
                                                "-- kind --"
                                                . "Shopify Connection" .
                                                "-- Error Message -- " .
                                                print_r($e->getMessage())
            ); */
            Log::channel( 'webhooks' )->info( " --- error --- " . print_r($e) );
        }
    }

    public function disconnect(Request $request){
        $domain = $request->get('domain');
        Log::channel( 'webhooks' )->info( " --- request --- " . $domain );
        ShopifyStore::where('domain', $domain)->delete();
        //\Log::info('Received webhook:', $domain);
        return response()->json(["success" => true], 200);
    }
}
