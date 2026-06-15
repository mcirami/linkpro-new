<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class ChangeFolderIdStartingPoint extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        // The folder id offset is a MySQL-specific data concern. Skip on other
        // drivers (e.g. the sqlite database used by the test suite).
        if (Schema::getConnection()->getDriverName() !== 'mysql') {
            return;
        }

        Schema::table('folders', function (Blueprint $table) {
            $table->id()->from(1000)->change();

            \Illuminate\Support\Facades\DB::statement("ALTER TABLE folders AUTO_INCREMENT = 1000;");
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        if (Schema::getConnection()->getDriverName() !== 'mysql') {
            return;
        }

        Schema::table('folders', function (Blueprint $table) {
            $table->id()->change();
            \Illuminate\Support\Facades\DB::statement("ALTER TABLE folders AUTO_INCREMENT = 1;");
        });
    }
}
