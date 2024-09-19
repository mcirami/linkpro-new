<?

namespace App\Http\Traits;

use App\Models\User;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Database\Query\Builder;
use SocialiteProviders\Manager\Config;
use Illuminate\Support\Facades\Log;
use GuzzleHttp\Client;
use Illuminate\Support\Facades\App;

trait ShopifyTrait {

    public function createShopifyStore($data) {

        $userId = Auth::id();
        $domain = $data['domain'];
        $user = User::find($userId);

        $validator = Validator::make($data,
            [
                'access_token'  => 'required|string|' . Rule::unique('shopify')->where(fn (Builder $query) => $query->where('user_id', $userId)),
                'domain'        => [
                    'required', 'string', 'max:255',
                    Rule::unique('shopify', 'domain')->where('user_id', $userId)
                ],
                'products'      => 'required'
            ]
        );

        if($validator->fails()) {
            //Log::channel( 'webhooks' )->info( " --- posted to shopify --- " . print_r($validator->errors(), true) );
            if($validator->errors()->has('domain')) {

                if ($validator->errors()->get('domain')[0] == "The domain has already been taken." ) {
                    //Log::channel( 'webhooks' )->info( " --- get domain error? --- " . print_r($validator->errors()->get('domain')[0], true) );
                    $user->ShopifyStores()->where('domain', $domain)->update([
                        'access_token'  => $data['access_token'],
                        'products'      => $data['products']
                    ]);
                    return ['success' => true];
                }
            } else {
                throw new \Exception("Error Processing Request", 1);
            }
        }
        Log::channel( 'cloudwatch' )->debug( "-- before shopifyStore create -- " );

        $shopifyStore =  $user->ShopifyStores()->create([
            'access_token'  => $data['access_token'],
            'domain'        => $domain,
            'products'      => $data['products']
        ]);

        Log::channel( 'cloudwatch' )->debug( "-- shopifyStore create -- " . print_r($shopifyStore, true) );

        return ['success' => true, 'store' => $shopifyStore];
    }

    public function getShopifyConfig($domain, $callbackUrl) {
        $clientId = config('services.shopify.client_id');
        $clientSecret = config('services.shopify.client_secret');
        $additionalProviderConfig = ['subdomain' => $domain];
        return new Config($clientId, $clientSecret, $callbackUrl, $additionalProviderConfig);
    }

    public function postToShopify($domain) {
        $userId = Auth::id();
        $user = User::find($userId);
        $personalAccessToken = $user->createToken('shopify');

        $urlHost = App::environment() == 'production' ? 'https://linkpro.gadget.app' : 'https://linkpro--development.gadget.app';
        $client = new Client();
        $res = $client->request('POST', $urlHost . '/save-connected-store', [
                'form_params' => [
                    'storeDomain'   => $domain,
                    'token'         => $personalAccessToken->plainTextToken
                ]
            ]);
        Log::channel( 'cloudwatch' )->debug("-- postToShopifyFunc-- " . print_r($res, true ) );

        //Log::channel( 'webhooks' )->info( " --- posted to shopify --- " . print_r($res, true) );
    }
}

?>
