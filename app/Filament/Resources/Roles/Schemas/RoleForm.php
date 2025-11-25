<?php

namespace App\Filament\Resources\Roles\Schemas;

use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class RoleForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('name')
                    ->required(),
                TextInput::make('guard_name')
                    ->required(),
                Section::make('Permissions')
                       ->schema([
                           Select::make('permissions')
                                 ->label('Permissions')
                                 ->relationship('permissions', 'name')  // <- Spatie relation
                                 ->multiple()
                                 ->preload()
                                 ->searchable(),
                       ]),
            ]);
    }
}
