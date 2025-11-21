<?php

namespace App\Filament\Resources\RoleHasPermissions\Pages;

use App\Filament\Resources\RoleHasPermissions\RoleHasPermissionResource;
use Filament\Actions\EditAction;
use Filament\Resources\Pages\ViewRecord;

class ViewRoleHasPermission extends ViewRecord
{
    protected static string $resource = RoleHasPermissionResource::class;

    protected function getHeaderActions(): array
    {
        return [
            EditAction::make(),
        ];
    }
}
