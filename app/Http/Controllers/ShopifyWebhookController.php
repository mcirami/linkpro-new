<?php

namespace App\Http\Controllers;

use App\Models\ShopifyStore;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ShopifyWebhookController extends Controller
{
    public function shopifyWebhook(): void {
        $data = $this->getShopifyWebhookInstance();
    }

    private function getShopifyWebhookInstance(): array {
        $shared_secret = config('services.shopify.client_secret');
        $hmac_header = $_SERVER['HTTP_X_SHOPIFY_HMAC_SHA256'];
        $request_body = file_get_contents('php://input');
        $computed_hmac = base64_encode(hash_hmac('sha256', $request_body, $shared_secret, true));
        Log::channel( 'cloudwatch' )->info( "--timestamp--" .
                                            Carbon::now() .
                                            "--hmac_header-- " .
                                            $hmac_header .
                                            "--computed_hmac-- " .
                                            $computed_hmac .
                                            "--request body-- " .
                                            print_r($request_body, true ) );
        return [
            'hmac_header' => $hmac_header,
            'computed_hmac' => $computed_hmac,
        ];
    }

    public function addProduct(Request $request) {
        $requestData = $request->all();
        $data = json_decode($requestData['product']);
        $productId = $data->id;
        $price = $data->price;
        $domain = $data->storeDomain;
        $title = $data->title;
        $image = $data->image;
        $productUrl = $data->productUrl;

        $shopifyStore = ShopifyStore::where('domain', $domain)->first();
        if ($shopifyStore) {
            $storeProducts =  $shopifyStore->products;
            array_push($storeProducts, [
                "id"            => $productId,
                "price"         => $price,
                "title"         => $title,
                "image_url"     => $image,
                "product_url"   => $productUrl
            ]);
            $shopifyStore->update([
                'products' => $storeProducts
            ]);
        }
        Log::channel( 'cloudwatch' )->info( "--timestamp--" . Carbon::now() . "--Shopify ADD product webhook-- " . print_r($data, true ) );
        //Log::channel( 'webhooks' )->info('Product add webhook received: id: '. print_r($data ,true));
        return response()->json(['success' => true]);

    }

    public function updateProduct(Request $request) {
        $requestData = $request->all();
        $data = json_decode($requestData['product']);
        $productId = $data->id;
        $price = $data->price;
        $domain = $data->storeDomain;
        $title = $data->title;
        $image = $data->image;
        // Log the incoming webhook payload
        //Log::channel( 'webhooks' )->info('Product updated webhook received: ' . print_r($data, true) );
        Log::channel( 'cloudwatch' )->info( "--timestamp--" . Carbon::now() . "--Shopify UPDATE product webhook-- " . print_r($data, true ) );

        // Process the webhook data (e.g., update your database)
        $shopifyStore = ShopifyStore::where('domain', $domain)->first();
        if ($shopifyStore) {
            $storeProducts =  $shopifyStore->products;
            foreach($storeProducts as $index => $product ) {
                if ($product["id"] == $productId) {
                    $storeProducts[$index]["title"] = $title;
                    $storeProducts[$index]["price"] = $price;
                    $storeProducts[$index]["image_url"] = $image;
                }
            }

            $shopifyStore->update([
                'products' => $storeProducts
            ]);
        }

        return response()->json(['success' => true]);
    }

    public function deleteProduct(Request $request) {
        $requestData = $request->all();
        $data = json_decode($requestData['product']);
        $id = $data->id;
        $domain = $data->storeDomain;
        Log::channel( 'cloudwatch' )->info( "--timestamp--" . Carbon::now() . "--Shopify DELETE product webhook-- " . print_r($data, true ) );

        //Log::channel( 'webhooks' )->info('Product deleted webhook received: data: '. print_r($data, true));

        // Process the webhook data (e.g., update your database)
        $shopifyStore = ShopifyStore::where('domain', $domain)->first();
        if ($shopifyStore) {
            $storeProducts =  $shopifyStore->products;
            foreach($storeProducts as $index => $product ) {
                if ($product["id"] == $id) {
                    array_splice($storeProducts, $index, 1);
                }
            }

            $shopifyStore->update([
                'products' => $storeProducts
            ]);
        }

        return response()->json(['success' => true]);

    }
}
