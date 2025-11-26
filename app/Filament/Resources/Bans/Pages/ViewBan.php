<?php

namespace App\Filament\Resources\Bans\Pages;

use App\Filament\Resources\Bans\BanResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewBan extends ViewRecord
{
    protected static string $resource = BanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
