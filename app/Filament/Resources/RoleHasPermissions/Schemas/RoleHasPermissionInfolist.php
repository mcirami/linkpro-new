<?php

namespace App\Filament\Resources\RoleHasPermissions\Schemas;

use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class RoleHasPermissionInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('spatie_permission_id')
                    ->numeric(),
                TextEntry::make('spatie_role_id')
                    ->numeric(),
            ]);
    }
}
