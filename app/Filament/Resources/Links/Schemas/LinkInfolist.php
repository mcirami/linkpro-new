<?php

namespace App\Filament\Resources\Links\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\ImageEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class LinkInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('user_id')
                    ->numeric(),
                TextEntry::make('page_id')
                    ->numeric(),
                TextEntry::make('folder_id')
                    ->placeholder('-'),
                TextEntry::make('name')
                    ->placeholder('-'),
                TextEntry::make('url')
                    ->placeholder('-'),
                TextEntry::make('icon')
                    ->placeholder('-'),
                IconEntry::make('icon_active')
                    ->boolean(),
                ImageEntry::make('bg_image')
                    ->placeholder('-'),
                IconEntry::make('bg_active')
                    ->boolean(),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('position')
                    ->numeric(),
                IconEntry::make('active_status')
                    ->boolean(),
                TextEntry::make('email')
                    ->label('Email address')
                    ->placeholder('-'),
                TextEntry::make('phone')
                    ->placeholder('-'),
                TextEntry::make('mailchimp_list_id')
                    ->placeholder('-'),
                TextEntry::make('shopify_id')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('course_id')
                    ->numeric()
                    ->placeholder('-'),
                TextEntry::make('type')
                    ->placeholder('-'),
            ]);
    }
}
