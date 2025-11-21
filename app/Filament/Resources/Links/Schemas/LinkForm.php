<?php

namespace App\Filament\Resources\Links\Schemas;

use Filament\Forms\Components\FileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Schemas\Schema;

class LinkForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('user_id')
                    ->required()
                    ->numeric(),
                TextInput::make('page_id')
                    ->required()
                    ->numeric(),
                TextInput::make('folder_id'),
                TextInput::make('name'),
                TextInput::make('url')
                    ->url(),
                TextInput::make('icon'),
                Toggle::make('icon_active')
                    ->required(),
                FileUpload::make('bg_image')
                    ->image(),
                Toggle::make('bg_active')
                    ->required(),
                TextInput::make('description'),
                TextInput::make('position')
                    ->required()
                    ->numeric(),
                Toggle::make('active_status')
                    ->required(),
                TextInput::make('email')
                    ->label('Email address')
                    ->email(),
                TextInput::make('phone')
                    ->tel(),
                TextInput::make('mailchimp_list_id'),
                TextInput::make('shopify_id')
                    ->numeric(),
                TextInput::make('shopify_products'),
                TextInput::make('course_id')
                    ->numeric(),
                TextInput::make('type'),
            ]);
    }
}
