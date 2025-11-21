<?php

namespace App\Filament\Resources\Pages\Tables;

use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class PagesTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user_id')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('header_img')
                    ->searchable(),
                TextColumn::make('page_img')
                    ->searchable(),
                TextColumn::make('main_img_type')
                    ->searchable(),
                TextColumn::make('profile_img')
                    ->searchable(),
                IconColumn::make('profile_img_active')
                    ->boolean(),
                TextColumn::make('title')
                    ->searchable(),
                TextColumn::make('bio')
                    ->searchable(),
                TextColumn::make('profile_layout')
                    ->searchable(),
                TextColumn::make('page_layout')
                    ->searchable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                IconColumn::make('default')
                    ->boolean(),
                IconColumn::make('disabled')
                    ->boolean(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }
}
