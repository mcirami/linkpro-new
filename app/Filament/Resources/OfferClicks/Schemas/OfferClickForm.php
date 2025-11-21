<?php

namespace App\Filament\Resources\OfferClicks\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class OfferClickForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('ip_address')
                    ->required(),
                TextInput::make('referral_id')
                    ->numeric(),
                TextInput::make('offer_id')
                    ->required()
                    ->numeric(),
                Toggle::make('is_unique')
                    ->required(),
            ]);
    }
}
