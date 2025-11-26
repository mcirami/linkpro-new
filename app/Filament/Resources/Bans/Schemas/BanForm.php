<?php

namespace App\Filament\Resources\Bans\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Schemas\Schema;

class BanForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('bannable_type'),
                TextInput::make('bannable_id')
                    ->numeric(),
                TextInput::make('created_by_type'),
                TextInput::make('created_by_id')
                    ->numeric(),
                Textarea::make('comment')
                    ->columnSpanFull(),
                TextInput::make('ip'),
                DateTimePicker::make('expired_at'),
                TextInput::make('metas'),
            ]);
    }
}
