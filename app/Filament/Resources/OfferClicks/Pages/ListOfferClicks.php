<?php

namespace App\Filament\Resources\OfferClicks\Pages;

use App\Filament\Resources\OfferClicks\OfferClickResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListOfferClicks extends ListRecords
{
    protected static string $resource = OfferClickResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
