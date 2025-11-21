<?php

namespace App\Filament\Resources\Pages\Schemas;

use Filament\Infolists\Components\IconEntry;
use Filament\Infolists\Components\TextEntry;
use Filament\Schemas\Schema;

class PageInfolist
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextEntry::make('user_id')
                    ->numeric(),
                TextEntry::make('name'),
                TextEntry::make('header_img')
                    ->placeholder('-'),
                TextEntry::make('page_img')
                    ->placeholder('-'),
                TextEntry::make('main_img_type'),
                TextEntry::make('profile_img')
                    ->placeholder('-'),
                IconEntry::make('profile_img_active')
                    ->boolean(),
                TextEntry::make('title')
                    ->placeholder('-'),
                TextEntry::make('bio')
                    ->placeholder('-'),
                TextEntry::make('profile_layout'),
                TextEntry::make('page_layout'),
                TextEntry::make('created_at')
                    ->dateTime()
                    ->placeholder('-'),
                TextEntry::make('updated_at')
                    ->dateTime()
                    ->placeholder('-'),
                IconEntry::make('default')
                    ->boolean(),
                IconEntry::make('disabled')
                    ->boolean(),
            ]);
    }
}
