<?php

namespace App\Filament\Resources\OfferClicks\Pages;

use App\Filament\Resources\OfferClicks\OfferClickResource;
use Filament\Actions\DeleteAction;
use Filament\Actions\ViewAction;
use Filament\Resources\Pages\EditRecord;

class EditOfferClick extends EditRecord
{
    protected static string $resource = OfferClickResource::class;

    protected function getHeaderActions(): array
    {
        return [
            ViewAction::make(),
            DeleteAction::make(),
        ];
    }
}
