@component('mail::message', ['id' => $data['userID']])
@if ($data['suspended'] ?? false)
We were unable to collect payment for your <strong>{{ $data['plan'] }}</strong> plan after several attempts, so it has been paused and your account has been moved to the free plan.
<br>
<br>
No problem — you can pick up right where you left off. Just update your payment method and resubscribe to restore your {{ $data['plan'] }} features.

@component('mail::button', ['url' => config('app.url') . "/plans" ])
    Reactivate My Plan
@endcomponent
@else
We tried to process the payment for your <strong>{{ $data['plan'] }}</strong> plan but it didn't go through. PayPal will automatically try again, so there's nothing you need to do if it was a temporary issue.
<br>
<br>
To avoid any interruption to your {{ $data['plan'] }} features, please make sure your payment method is up to date.

@component('mail::button', ['url' => config('app.url') . "/edit-account" ])
    Update Payment Method
@endcomponent
@endif

<p class="sign_off">To Your Success!</p>
<p class="signature">The LinkPro Team</p>
@endcomponent
