<?php

namespace App\Http\Controllers;

use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Inertia\Response;
use Stripe\Exception\ApiErrorException;
use App\Http\Traits\BillingTrait;
class PayoutController extends Controller
{
    use BillingTrait;
    /**
     * @return \Symfony\Component\HttpFoundation\Response
     */
    public function paymentOnboarding(): \Symfony\Component\HttpFoundation\Response {
        $stripe     = $this->createStripeGateway();
        $domain     = config('app.url');
        $user = Auth::user();
        $response = "";
        try {

            $account = $stripe->accounts->create([
                'email' => $user->email,
                'controller' => [
                    'stripe_dashboard' => [
                        'type' => 'express',
                    ],
                    'fees' => [
                        'payer' => 'application'
                    ],
                    'losses' => [
                        'payments' => 'application'
                    ],
                ],
            ]);
            $response = $stripe->accountLinks->create([
                'account' => $account->id,
                'refresh_url' => $domain . '/edit-account',
                'return_url' => $domain . '/stripe/onboarding/return?stripe_user=' . $account->id,
                'type' => 'account_onboarding',
            ]);

        } catch ( ApiErrorException $e ) {
            $this->saveErrors($e);
            http_response_code(500);
            echo json_encode(['error' => $e->getMessage()]);
        }

        return response()->json(['success' => true, 'url' => $response->url]);
    }

    /**
     * @throws ApiErrorException
     */
    public function onboardingReturn(Request $request): RedirectResponse {
        $user = $request->user();
        $accountId = $request->query('stripe_user');
        $stripe     = $this->createStripeGateway();
        $acct = $stripe->accounts->retrieve($accountId,  [
            'expand' => ['external_accounts'],
        ]);

        $last4   = null;
        $pmType  = null;   // 'bank' or 'card'
        $label   = null;   // bank name or card brand (nice to show)
        $currency = $acct->default_currency ?? 'usd';
        Log::channel( 'webhooks' )->info(
            " --- external_accounts --- " .
            print_r($acct->external_accounts, true) .
            " --- data --- " .
            print_r($acct->external_accounts?->data, true) .
            " --- accountId --- " . print_r($accountId, true)
        );
        if (!empty($acct->external_accounts) && !empty($acct->external_accounts->data)) {
            // Pick the one used for payouts.
            // Stripe marks the default for a currency on the external account.
            $ext = collect($acct->external_accounts->data)
                       ->first(fn($x) => ($x->default_for_currency ?? null) === $currency)
                   ?? $acct->external_accounts->data[0]; // fallback
            if ($ext->object === 'bank_account') {
                $pmType = 'bank';
                $last4  = $ext->last4;        // e.g. "4242"
                $label  = $ext->bank_name;    // e.g. "CHASE BANK"
            } elseif ($ext->object === 'card') {
                $pmType = 'card';
                $last4  = $ext->last4;        // e.g. "4242"
                $label  = $ext->brand;        // e.g. "Visa"
            }

            $payoutRecord = $user->UserPayout()->create([
                'pm_type' => $pmType,
                'pm_last_four' => $last4,
                'pm_brand' => $label,
                'account_id' => $accountId,
            ]);

            $user->update([
                'payout_info_id' => $payoutRecord->id
            ]);

            return redirect()->to('/onboarding-success');
        }

        // Not finished (user clicked back or skipped fields) → send them to edit page
        return redirect()
            ->to('/edit-account')
            ->with('status', 'Please finish onboarding to enable payouts.');

    }

    /**
     * @return Response
     */
    public function onboardingSuccess(): Response {
        return Inertia::render('Onboarding/Success');
    }

}
