<?php

namespace App\Filament\Resources\Bans\Pages;

use App\Filament\Resources\Bans\BanResource;
use App\Models\Ban;
use Filament\Actions\Action;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditBan extends EditRecord
{
    protected static string $resource = BanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('ban')
                  ->label('Re-Ban')
                  ->requiresConfirmation()
                  ->icon('heroicon-o-no-symbol')
                  ->color('danger')
                  ->visible(fn (Ban $record): bool => method_exists($record, 'bannable') && $record->bannable && ! $record->bannable->isBanned())
                  ->action(fn (Ban $record): mixed => $record->bannable?->ban()),
            Action::make('unban')
                  ->label('Unban')
                  ->requiresConfirmation()
                  ->icon('heroicon-o-check-circle')
                  ->color('success')
                  ->visible(fn (Ban $record): bool => method_exists($record, 'bannable') && $record->bannable && $record->bannable->isBanned())
                  ->action(fn (Ban $record): mixed => $record->bannable?->unban()),
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
