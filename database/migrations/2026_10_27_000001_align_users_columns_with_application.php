<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * The users table had drifted from its migrations. The live table carries a
 * unique "username" that the application reads and writes throughout, and no
 * "name" at all, while 2014_10_12_000000_create_users_table still creates a
 * NOT NULL "name" and never creates "username".
 *
 * A schema built from these migrations therefore could not run the application:
 * registration failed on the NOT NULL "name" that nothing populates, and the
 * login and password-reset flows query a "username" column that did not exist.
 *
 * Both changes are conditional, so this is a no-op against a database already
 * in the expected shape -- which is the case for every environment that was
 * migrated by hand.
 */
return new class extends Migration
{
    public function up(): void
    {
        if (! Schema::hasColumn('users', 'username')) {
            Schema::table('users', function (Blueprint $table) {
                $table->string('username')->unique()->after('email');
            });
        }

        if (Schema::hasColumn('users', 'name')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropColumn('name');
            });
        }
    }

    public function down(): void
    {
        if (! Schema::hasColumn('users', 'name')) {
            Schema::table('users', function (Blueprint $table) {
                // Nullable on the way back: the column cannot be restored as
                // NOT NULL without a default once the table holds rows.
                $table->string('name')->nullable();
            });
        }

        if (Schema::hasColumn('users', 'username')) {
            Schema::table('users', function (Blueprint $table) {
                $table->dropUnique(['username']);
                $table->dropColumn('username');
            });
        }
    }
};
