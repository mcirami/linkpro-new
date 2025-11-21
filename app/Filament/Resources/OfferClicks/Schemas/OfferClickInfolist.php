<?php

namespace App\Filament\Resources\OfferClicks\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class OfferClickInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('id')
                    ->label('ID'),
                TextEntry::make('ip_address'),
                TextEntry::make('referral_id')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('offer_id')
                    ->numeric(),
                IconEntry::make('is_unique')
                    ->boolean(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
