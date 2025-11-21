<?php

namespace App\Filament\Resources\Users\Schemas;

use Filament\Forms\Components\Select;
use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Components\Section;
use Filament\Schemas\Schema;

class UserInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                Section::make('')->Schema([
                    TextEntry::make('email')
                    ->label('Email address')]),
                Section::make('')->Schema([
                    TextEntry::make('mailchimp_server')
                    ->placeholder('-')]),
                Section::make('')->Schema([
                    TextEntry::make('avatar')
                    ->placeholder('-')]),
                Section::make('')->Schema([
                    TextEntry::make('email_verified_at')
                    ->dateTime()
                    ->placeholder('-')]),
                Section::make('')->Schema([
                    TextEntry::make('username')]),
                Section::make('')->Schema([
                    TextEntry::make('settings')
                    ->placeholder('-')
                    ->columnSpanFull()]),
                Section::make('')->Schema([
                    TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-')]),
                Section::make('')->Schema([TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-')]),
                Section::make('')->Schema([
                    TextEntry::make('billing_id')
                    ->placeholder('-')]),
                Section::make('')->Schema([IconEntry::make('email_subscription')
                    ->boolean()]),
                Section::make('')->Schema([TextEntry::make('pm_last_four')
                    ->numeric()
                    ->placeholder('-')]),
                Section::make('')->Schema([
                    TextEntry::make('pm_type')
                    ->placeholder('-')]),
                Section::make('')->Schema([
                    TextEntry::make('pm_id')
                    ->placeholder('-')]),
                Section::make('')->Schema([TextEntry::make('country_code')
                    ->placeholder('-')
                    ]),
                Section::make('')->Schema([
                    TextEntry::make('payout_info_id')
                             ->numeric()
                             ->placeholder('-'),
                ]),
                Section::make('')->schema([
                    TextEntry::make('roles.name')
                             ->label('Assigned Roles')
                             ->badge()
                             ->separator(', '),
                ]),
            ]);
    }
}
