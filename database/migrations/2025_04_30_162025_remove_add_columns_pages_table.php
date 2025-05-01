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
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn('is_protected');
            $table->dropColumn('password');
            $table->dropColumn('custom');
            $table->string('main_img_type')->after('header_img')->default('header');
            $table->string('page_img')->after('header_img')->nullable();
            $table->boolean('profile_img_active')->after('profile_img')->default(true);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('pages', function (Blueprint $table) {
            $table->dropColumn('img_type');
            $table->dropColumn('page_img');
            $table->dropColumn('profile_img_active');
            $table->boolean('custom')->after('page_layout')->nullable();
            $table->string('password')->after('page_layout')->nullable();
            $table->boolean('is_protected')->after('page_layout')->nullable();
        });
    }
};
