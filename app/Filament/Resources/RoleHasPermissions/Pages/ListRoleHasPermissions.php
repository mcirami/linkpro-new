<?php

namespace App\Filament\Resources\RoleHasPermissions\Pages;

use App\Filament\Resources\RoleHasPermissions\RoleHasPermissionResource;
use Filament\Actions\CreateAction;
use Filament\Resources\Pages\ListRecords;

class ListRoleHasPermissions extends ListRecords
{
    protected static string $resource = RoleHasPermissionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            CreateAction::make(),
        ];
    }
}
