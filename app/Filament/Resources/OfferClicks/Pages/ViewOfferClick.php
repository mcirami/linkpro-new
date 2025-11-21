<?php

namespace App\Filament\Resources\OfferClicks\Pages;

use App\Filament\Resources\OfferClicks\OfferClickResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewOfferClick extends ViewRecord
{
    protected static string $resource = OfferClickResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
