<?php

namespace App\Filament\Resources\Users\Tables;

use App\Models\User;
use Filament\Actions\Action;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class UsersTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('role_id')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('email')
                    ->label('Email address')
                    ->searchable(),
                TextColumn::make('mailchimp_server')
                    ->searchable(),
                TextColumn::make('avatar')
                    ->searchable(),
                TextColumn::make('email_verified_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('username')
                    ->searchable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('billing_id')
                    ->searchable(),
                IconColumn::make('email_subscription')
                    ->boolean(),
                TextColumn::make('pm_last_four')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('pm_type')
                    ->searchable(),
                TextColumn::make('pm_id')
                    ->searchable(),
                TextColumn::make('country_code')
                    ->searchable(),
                TextColumn::make('payout_info_id')
                    ->numeric()
                    ->sortable(),
            ])
            ->filters([
                //
            ])
            ->recordActions([
                Action::make('ban')
                      ->label(fn (User $record): string => $record->isBanned() ? 'Unban' : 'Ban')
                      ->icon(fn (User $record): string => $record->isBanned() ? 'heroicon-o-check-circle' : 'heroicon-o-no-symbol')
                      ->color(fn (User $record): string => $record->isBanned() ? 'success' : 'danger')
                      ->requiresConfirmation()
                      ->action(function (User $record): void {
                          if ($record->isBanned()) {
                              $record->unban();
                          } else {
                              $record->ban();
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
