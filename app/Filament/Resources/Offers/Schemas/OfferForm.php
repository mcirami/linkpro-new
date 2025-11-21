<?php

namespace App\Filament\Resources\Offers\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class OfferForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('user_id')
                    ->required()
                    ->numeric(),
                TextInput::make('course_id')
                    ->required()
                    ->numeric(),
                TextInput::make('icon'),
                TextInput::make('price')
                    ->numeric()
                    ->prefix('$'),
                Toggle::make('public')
                    ->required(),
                Toggle::make('active')
                    ->required(),
                Toggle::make('published')
                    ->required(),
            ]);
    }
}
