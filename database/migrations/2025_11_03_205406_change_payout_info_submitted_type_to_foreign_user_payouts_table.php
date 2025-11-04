<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('payout_info_submitted');
            $table->foreignId('payout_info_id')->nullable()->constrained('user_payouts')->nullOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            // Revert back to the boolean column
            $table->dropConstrainedForeignId('payout_info_id');
            $table->boolean('payout_info_submitted')->default(false);
        });
    }
};
