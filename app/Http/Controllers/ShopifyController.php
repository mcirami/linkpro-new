<?php

namespace App\Http\Controllers;

use App\Models\ShopifyStore;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Signifly\Shopify\Shopify;
use App\Http\Traits\ShopifyTrait;
use Exception;
use Inertia\Inertia;
use Illuminate\Support\Facades\Crypt;

class ShopifyController extends Controller
{

    use ShopifyTrait;

    /* public function auth(Request $request) {

        $domain = $request->query('domain');
        $scopes = config('services.shopify.scopes');
        $hostUrl = config('app.url');
        $config = $this->getShopifyConfig($domain, $hostUrl . '/auth/shopify/callback');

        return Socialite::driver('shopify')->setConfig($config)->setScopes([$scopes])->redirect();
    }

    /**
     * @return RedirectResponse
     *
     * @var ShopifyStore $shopifyStore
     */
   /* public function callback() {

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

                $productsArray[] = $productObject;
            }

            $dataObject = [
                'access_token' => $accessToken,
                'domain' => $domain,
                'products' => $productsArray
            ];
            Log::channel( 'webhooks' )->info( " --- object --- " . print_r($dataObject, true) );
            $shopifyStore = $this->createShopifyStore($dataObject);
            if($shopifyStore["success"]) {
                $this->postToShopify($domain);
                $pageId = "";
                if(isset($_COOKIE['lp_page_id'])) {
                    $pageId = $_COOKIE['lp_page_id'];
                }

                return redirect()->route('pages.edit', ['page' => $pageId, 'redirected' => "shopify", 'store' => $shopifyStore["store"]->id]);
            }

        } catch (Exception $e) {

            Log::channel( 'cloudwatch' )->info( "--timestamp--" .
                                                Carbon::now() .
                                                "-- kind --"
                                                . "Shopify Connection" .
                                                "-- Error Message -- " .
                                                $e->getMessage()
            );
            $pageId = "";
            if(isset($_COOKIE['lp_page_id'])) {
                $pageId = $_COOKIE['lp_page_id'];
            }

            return redirect()->route('pages.edit', ['page' => $pageId, 'redirected' => "shopify", "connection_error" => 'Something went wrong connecting to Shopify! Please try again.']);
        }
    } */

    /**
    * Store a newly created resource in storage.
    *
    * @param  Request  $request
    * @return InertiaResponse
    */

    public function showConnect(Request $request)
    {
        $storeDomain = str_replace('.myshopify.com', '', $request->get('domain'));
        return Inertia::render('ConnectShopify/ConnectShopify')->with(['domain' => $storeDomain]);
    }

    public function auth(Request $request) {

        $domain = $request->query('domain');
        $scopes = config('services.shopify.scopes');
        $hostUrl = config('app.url');
        $config = $this->getShopifyConfig($domain, $hostUrl . '/auth/shopify/callback');

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

                $productsArray[] = $productObject;
            }

            $dataObject = [
                'access_token' => Crypt::encryptString($accessToken),
                'domain' => $domain,
                'products' => $productsArray
            ];

            //Log::channel( 'webhooks' )->info( " --- object --- " . print_r($dataObject, true) );
            $storeName = str_replace('.myshopify.com', '', $domain);
            $shopifyStore = $this->createShopifyStore($dataObject);
            if($shopifyStore["success"]) {
                Log::channel( 'cloudwatch' )->debug( "--timestamp--" . Carbon::now() . "-- shopifyStore[success]-- " );

                $this->postToShopify($domain);

                return Inertia::location('https://admin.shopify.com/store/' . $storeName . '/apps/link-pro');
            }

        } catch (Exception $e) {
            Log::channel( 'cloudwatch' )->debug( "--timestamp--" . Carbon::now() . "-- Shopify error connecting store-- " . $e->getMessage() );
        }
    }

    public function getAllProducts($id) {

        $store = ShopifyStore::findOrFail($id);
        return response()->json([
            'products' => $store->products
        ]);
    }

    public function getStores() {
        $user = Auth::user();
        $stores = $user->ShopifyStores()->get();
        return response()->json([
            'stores' => $stores
        ]);
    }
}
