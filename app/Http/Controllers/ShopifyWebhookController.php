<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class ShopifyWebhookController extends Controller
{
    public function shopifyCustomerRequest(Request $request): \Illuminate\Http\JsonResponse {
        $data = $this->getShopifyWebhookInstance();
        if(hash_equals($data['hmac_header'], $data['computed_hmac'])) {
            // HMAC validation passed
            return response()->json([], 200);

            // Process your webhook payload here
            //$data = json_decode($request_body, true);
            // Your processing code...

        } else {
            // HMAC validation failed
            return response()->json([], 401);
        }
    }

    public function shopifyCustomerErasure(Request $request): \Illuminate\Http\JsonResponse {
        $data = $this->getShopifyWebhookInstance();
        if(hash_equals($data['hmac_header'], $data['computed_hmac'])) {
            // HMAC validation passed
            return response()->json([], 200);

            // Process your webhook payload here
            //$data = json_decode($request_body, true);
            // Your processing code...

        } else {
            // HMAC validation failed
            return response()->json([], 401);
        }
    }

    public function shopifyShopErasure(Request $request): \Illuminate\Http\JsonResponse {
        $data = $this->getShopifyWebhookInstance();
        if(hash_equals($data['hmac_header'], $data['computed_hmac'])) {
            // HMAC validation passed
            return response()->json([], 200);

            // Process your webhook payload here
            //$data = json_decode($request_body, true);
            // Your processing code...

        } else {
            // HMAC validation failed
            return response()->json([], 401);
        }
    }

    private function getShopifyWebhookInstance(): array {
        $shared_secret = config('services.shopify.client_secret');
        $hmac_header = $_SERVER['HTTP_X_SHOPIFY_HMAC_SHA256'];
        $request_body = file_get_contents('php://input');
        $computed_hmac = base64_encode(hash_hmac('sha256', $request_body, $shared_secret, true));

        return [
            'hmac_header' => $hmac_header,
            'computed_hmac' => $computed_hmac,
        ];
    }
}
