<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * A course can be bought without an affiliate click (direct/non-affiliate
     * purchase), in which case there is no offer_click_id. Allow it to be null
     * instead of failing the insert on the NOT NULL constraint.
     */
    public function up(): void
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->dropForeign(['offer_click_id']);
            $table->uuid('offer_click_id')->nullable()->change();
            // Keep the purchase if its offer click is ever deleted.
            $table->foreign('offer_click_id')->references('id')->on('offer_clicks')->nullOnDelete();
        });
    }

    public function down(): void
    {
        Schema::table('purchases', function (Blueprint $table) {
            $table->dropForeign(['offer_click_id']);
            $table->uuid('offer_click_id')->nullable(false)->change();
            $table->foreign('offer_click_id')->references('id')->on('offer_clicks');
        });
    }
};
