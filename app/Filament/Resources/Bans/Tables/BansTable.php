<?php

namespace App\Filament\Resources\Bans\Tables;

use App\Models\Ban;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;
use Filament\Actions\Action;
class BansTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('bannable_type')
                    ->searchable(),
                TextColumn::make('bannable_id')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('created_by_type')
                    ->searchable(),
                TextColumn::make('created_by_id')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('ip')
                    ->searchable(),
                TextColumn::make('expired_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('deleted_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                Action::make('unban')
                      ->label('Unban')
                      ->requiresConfirmation()
                      ->color('success')
                      ->icon('heroicon-o-check-circle')
                      ->visible(fn (Ban $record): bool => method_exists($record, 'bannable') && filled($record->bannable))
                      ->action(function (Ban $record): void {
                          if (method_exists($record, 'bannable') && $record->bannable) {
                              $record->bannable->unban();
                          }
                      }),
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
