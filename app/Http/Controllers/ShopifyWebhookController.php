<?php

namespace App\Http\Controllers;

use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ShopifyWebhookController extends Controller
{
    public function shopifyCustomerRequest(): void {
        $data = $this->getShopifyWebhookInstance();
        if(hash_equals($data['hmac_header'], $data['computed_hmac'])) {
            // HMAC validation passed
            http_response_code(200);
            echo 'Webhook validated successfully.';

            // Process your webhook payload here
            //$data = json_decode($request_body, true);
            // Your processing code...

        } else {
            // HMAC validation failed
            http_response_code(401);
            echo 'HMAC validation failed.';
        }
    }

    public function shopifyCustomerErasure(): void {
        $data = $this->getShopifyWebhookInstance();
        if(hash_equals($data['hmac_header'], $data['computed_hmac'])) {
            // HMAC validation passed
            http_response_code(200);
            echo 'Webhook validated successfully.';

            // Process your webhook payload here
            //$data = json_decode($request_body, true);
            // Your processing code...

        } else {
            // HMAC validation failed
            http_response_code(401);
            echo 'HMAC validation failed.';
        }
    }

    public function shopifyShopErasure(): void {
        $data = $this->getShopifyWebhookInstance();
        if (hash_equals($data['hmac_header'], $data['computed_hmac'])) {
            // HMAC validation passed
            http_response_code(200);
            echo 'Webhook validated successfully.';

            // Process your webhook payload here
            //$data = json_decode($request_body, true);
            // Your processing code...

        } else {
            // HMAC validation failed
            http_response_code(401);
            echo 'HMAC validation failed.';
        }
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
}
