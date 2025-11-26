<?php

namespace App\Filament\Resources\Bans\Schemas;

use App\Models\Ban;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class BanInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('bannable_type')
                    ->placeholder('-'),
                TextEntry::make('bannable_id')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('created_by_type')
                    ->placeholder('-'),
                TextEntry::make('created_by_id')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('comment')
                    ->placeholder('-')
                    ->columnSpanFull(),
                TextEntry::make('ip')
                    ->placeholder('-'),
                TextEntry::make('expired_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('deleted_at')
                    ->dateTime()
                    ->visible(fn (Ban $record): bool => $record->trashed()),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
            ]);
    }
}
