<?php

namespace App\Filament\Resources\Bans\Pages;

use App\Filament\Resources\Bans\BanResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditBan extends EditRecord
{
    protected static string $resource = BanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
