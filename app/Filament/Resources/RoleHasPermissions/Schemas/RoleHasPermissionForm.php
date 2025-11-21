<?php

namespace App\Filament\Resources\RoleHasPermissions\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class RoleHasPermissionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('spatie_permission_id')
                    ->required()
                    ->numeric(),
                TextInput::make('spatie_role_id')
                    ->required()
                    ->numeric(),
            ]);
    }
}
