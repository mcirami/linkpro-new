<?php

namespace App\Filament\Resources\Bans\Pages;

use App\Filament\Resources\Bans\BanResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListBans extends ListRecords
{
    protected static string $resource = BanResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
