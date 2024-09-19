<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Api\BaseController as BaseController;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response as InertiaResponse;
use Laravel\Socialite\Facades\Socialite;
use Signifly\Shopify\Shopify;
use App\Http\Traits\ShopifyTrait;
use Carbon\Carbon;
use Exception;
use Illuminate\Support\Facades\Log;
use App\Models\ShopifyStore;
 

class ShopifyController extends BaseController
{
    use ShopifyTrait;

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

    public function disconnect(Request $request){
        $domain = $request->get('domain');
        //Log::channel( 'webhooks' )->info( " --- request --- " . $domain );
        ShopifyStore::where('domain', $domain)->delete();

        Log::channel( 'cloudwatch' )->debug( "--timestamp--" . Carbon::now() . "-- Shopify disconnect store-- " . print_r($domain, true ) );

        return response()->json(["success" => true], 200);
    }
}
