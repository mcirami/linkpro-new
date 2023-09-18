<?php

namespace App\Http\Controllers;

use App\Models\ShopifyStore;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Laravel\Socialite\Facades\Socialite;
use Shopify\Rest\Admin2022_01\Shop;
use Signifly\Shopify\Shopify;
use SocialiteProviders\Manager\Config;

class ShopifyController extends Controller
{
    public function auth(Request $request) {

        $domain = $request->query('domain');
        $clientId = config('services.shopify.client_id');
        $clientSecret = config('services.shopify.client_secret');
        $redirectUrl = config('services.shopify.redirect');
        $scopes = config('services.shopify.scopes');
        $additionalProviderConfig = ['subdomain' => $domain];
        $config = new Config($clientId, $clientSecret, "/auth/shopify/callback", $additionalProviderConfig);

        return Socialite::driver('shopify')->setConfig($config)->setScopes([$scopes])->redirect();

        /*$install_url = "https://" . $domain . ".myshopify.com/admin/oauth/authorize?client_id=0c0c550ed3f1008d7e62c6b2aff0e206&scope=read_products,read_product_listings&redirect_uri=" . urlencode("https://0037-174-86-205-0.ngrok.io/auth/shopify/callback");
        return redirect($install_url);*/
    }

    public function callback() {

        try {
            $shopifyUser = Socialite::driver('shopify')->user();
            $accessToken = $shopifyUser->accessTokenResponseBody["access_token"];
            $domain = $shopifyUser->getNickname();

            $shopify = new Shopify(
                env('SHOPIFY_API_KEY'),
                $accessToken,
                $domain,
                env('SHOPIFY_API_VERSION')
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

            $shopifyStore = Auth::user()->shopifyStores()->create([
                'access_token' => $accessToken,
                'domain' => $domain,
                'products' => $productsArray
            ]);

            return redirect()->route('dashboard', ['redirected' => "shopify", 'store' => $shopifyStore->id]);

        } catch (\Throwable $th) {

            Log::channel( 'cloudwatch' )->info( "--timestamp--" .
                                                Carbon::now() .
                                                "-- kind --"
                                                . "Shopify Connection" .
                                                "-- Error Message -- " .
                                                $th->getMessage()
            );

            return redirect()->route('dashboard', ['redirected' => "shopify", "connection_error" => 'Something went wrong connecting to Shopify! Please try again.']);
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
        $stores = $user->shopifyStores()->get();
        return response()->json([
            'stores' => $stores
        ]);
    }
}
