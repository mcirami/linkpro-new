<?php

namespace App\Filament\Resources\Subscriptions\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class SubscriptionForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('user_id')
                    ->required()
                    ->numeric(),
                TextInput::make('name')
                    ->required(),
                TextInput::make('sub_id'),
                TextInput::make('status'),
                DateTimePicker::make('trial_ends_at'),
                DateTimePicker::make('ends_at'),
                Toggle::make('downgraded')
                    ->required(),
            ]);
    }
}
