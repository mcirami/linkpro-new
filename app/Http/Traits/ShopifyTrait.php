<?

namespace App\Http\Traits;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\Rule;
use Illuminate\Database\Query\Builder;
use SocialiteProviders\Manager\Config;

trait ShopifyTrait {

    public function createShopifyStore($data) {

        $userId = Auth::id();
        $domain = $data['domain'];

        $validator = Validator::make($data,
            [
                'access_token'  => 'required|string|' . Rule::unique('shopify')->where(fn (Builder $query) => $query->where('user_id', $userId)),
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

    public function getShopifyConfig($domain, $callbackUrl) {
        $clientId = config('services.shopify.client_id');
        $clientSecret = config('services.shopify.client_secret');
        $additionalProviderConfig = ['subdomain' => $domain];
        return new Config($clientId, $clientSecret, $callbackUrl, $additionalProviderConfig);
    }
}

?>
