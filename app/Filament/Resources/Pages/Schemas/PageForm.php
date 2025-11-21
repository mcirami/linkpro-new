<?php

namespace App\Filament\Resources\Pages\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class PageForm
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
                TextInput::make('header_img'),
                TextInput::make('page_img'),
                TextInput::make('main_img_type')
                    ->required()
                    ->default('header'),
                TextInput::make('profile_img'),
                Toggle::make('profile_img_active')
                    ->required(),
                TextInput::make('title'),
                TextInput::make('bio'),
                TextInput::make('profile_layout')
                    ->required()
                    ->default('profile_one'),
                TextInput::make('page_layout')
                    ->required()
                    ->default('layout_one'),
                Toggle::make('default')
                    ->required(),
                Toggle::make('disabled')
                    ->required(),
            ]);
    }
}
