<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class UserForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('email')
                    ->label('Email address')
                    ->email()
                    ->required(),
                TextInput::make('mailchimp_server'),
                TextInput::make('mailchimp_lists'),
                TextInput::make('avatar')
                    ->default('users/default.png'),
                DateTimePicker::make('email_verified_at'),
                TextInput::make('username')
                    ->required(),
                TextInput::make('password')
                    ->password()
                    ->required(),
                Textarea::make('settings')
                    ->columnSpanFull(),
                TextInput::make('billing_id'),
                Toggle::make('email_subscription')
                    ->required(),
                TextInput::make('pm_last_four')
                    ->numeric(),
                TextInput::make('pm_type'),
                TextInput::make('pm_id'),
                TextInput::make('country_code'),
                TextInput::make('payout_info_id')
                    ->numeric(),
                Section::make('Roles & Permissions')
                       ->schema([
                           Select::make('roles')
                                 ->label('Roles')
                                 ->relationship('roles', 'name') // uses Spatie's roles() relation
                                 ->multiple()
                                 ->preload()
                                 ->searchable(),
                       ]),
            ]);
    }
}
