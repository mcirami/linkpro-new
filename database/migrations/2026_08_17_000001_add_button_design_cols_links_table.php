<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('links', function (Blueprint $table) {
            $table->string('button_design', 10)->default('color')->after('bg_image');
            $table->string('bg_color', 40)->nullable()->after('button_design');
            $table->string('text_color', 40)->nullable()->after('bg_color');
        });

        // bg_active was the old "use the background image" flag. Carry those
        // buttons over before it goes away; everything else falls back to the
        // 'color' default, and null colors keep the existing SCSS look.
        DB::table('links')
            ->whereNotNull('bg_image')
            ->where('bg_active', 1)
            ->update(['button_design' => 'image']);

        Schema::table('links', function (Blueprint $table) {
            $table->dropColumn('bg_active');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('links', function (Blueprint $table) {
            $table->boolean('bg_active')->default(false)->after('bg_image');
        });

        DB::table('links')
            ->where('button_design', 'image')
            ->update(['bg_active' => 1]);

        Schema::table('links', function (Blueprint $table) {
            $table->dropColumn(['button_design', 'bg_color', 'text_color']);
        });
    }
};
