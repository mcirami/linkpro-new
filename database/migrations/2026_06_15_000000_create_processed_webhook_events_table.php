<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Tracks gateway webhook event ids that have already been handled, so a
     * redelivered event (Stripe/PayPal retry on any non-2xx or timeout) is
     * not processed twice.
     */
    public function up(): void
    {
        Schema::create('processed_webhook_events', function (Blueprint $table) {
            $table->id();
            $table->string('provider')->default('stripe'); // stripe | paypal
            $table->string('event_id');
            $table->string('type')->nullable();
            $table->timestamps();

            $table->unique(['provider', 'event_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('processed_webhook_events');
    }
};
