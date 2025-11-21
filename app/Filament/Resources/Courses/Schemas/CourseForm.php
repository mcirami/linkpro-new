<?php

namespace App\Filament\Resources\Courses\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class CourseForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('user_id')
                    ->required()
                    ->numeric(),
                TextInput::make('landing_page_id')
                    ->numeric(),
                TextInput::make('title'),
                TextInput::make('slug'),
                TextInput::make('logo'),
                TextInput::make('header_color')
                    ->required()
                    ->default('rgba(255,255,255,1)'),
                TextInput::make('header_text_color')
                    ->required()
                    ->default('rgba(0,0,0,1)'),
                TextInput::make('header_font_size')
                    ->required()
                    ->numeric()
                    ->default(1.6),
                TextInput::make('intro_video'),
                TextInput::make('intro_text'),
                TextInput::make('intro_background_color'),
                TextInput::make('intro_text_color'),
            ]);
    }
}
