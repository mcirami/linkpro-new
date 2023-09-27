<?php

namespace App\Http\Controllers;

use App\Models\ShopifyStore;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Laravel\Socialite\Facades\Socialite;
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
    }


    /**
     * @return RedirectResponse
     *
     * @var ShopifyStore $shopifyStore
     */
    public function callback() {

        try {
            $shopifyUser = Socialite::driver('shopify')->user();
            $accessToken = $shopifyUser->accessTokenResponseBody["access_token"];
            $domain = $shopifyUser->getNickname();

            $shopify = new Shopify(
                //env('SHOPIFY_API_KEY'),
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

            $dataObject = [
                'access_token' => $accessToken,
                'domain' => $domain,
                'products' => $productsArray
            ];
            $shopifyStore = $this->createShopifyStore($dataObject);

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
        $stores = $user->ShopifyStores()->get();
        return response()->json([
            'stores' => $stores
        ]);
    }

    private function createShopifyStore($data) {

        $userId = Auth::id();
        $domain = $data['domain'];

        Validator::make($data,
            [
                'access_token'  => 'required|string|max:255|unique:shopify',
                'domain'        => [
                    'required', 'string', 'max:255',
                    Rule::unique('shopify', 'domain')->where('user_id', $userId)
                ],
                'products'      => 'required|json'
            ]
        );

        return Auth::user()->ShopifyStores()->create([
            'access_token' => $data['access_token'],
            'domain' => $domain,
            'products' => $data['products']
        ]);
    }
}
