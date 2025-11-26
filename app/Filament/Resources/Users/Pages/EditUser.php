<?php

namespace App\Filament\Resources\Users\Pages;

use App\Filament\Resources\Users\UserResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;
use Filament\Actions\Action;
use App\Models\User;
class EditUser extends EditRecord
{
    protected static string $resource = UserResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Action::make('ban')
                  ->label(fn (User $record): string => $record->isBanned() ? 'Unban' : 'Ban')
                  ->requiresConfirmation()
                  ->color(fn (User $record): string => $record->isBanned() ? 'success' : 'danger')
                  ->icon(fn (User $record): string => $record->isBanned() ? 'heroicon-o-check-circle' : 'heroicon-o-no-symbol')
                  ->action(function (User $record): void {
                      if ($record->isBanned()) {
                          $record->unban();
                      } else {
                          $record->ban();
                      }
                  }),
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
