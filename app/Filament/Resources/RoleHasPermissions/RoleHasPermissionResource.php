<?php

namespace App\Filament\Resources\RoleHasPermissions;

use App\Filament\Resources\RoleHasPermissions\Pages\CreateRoleHasPermission;
use App\Filament\Resources\RoleHasPermissions\Pages\EditRoleHasPermission;
use App\Filament\Resources\RoleHasPermissions\Pages\ListRoleHasPermissions;
use App\Filament\Resources\RoleHasPermissions\Pages\ViewRoleHasPermission;
use App\Filament\Resources\RoleHasPermissions\Schemas\RoleHasPermissionForm;
use App\Filament\Resources\RoleHasPermissions\Schemas\RoleHasPermissionInfolist;
use App\Filament\Resources\RoleHasPermissions\Tables\RoleHasPermissionsTable;
use App\Models\RoleHasPermission;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class RoleHasPermissionResource extends Resource
{
    protected static ?string $model = RoleHasPermission::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'role has permissions';

    public static function form(Schema $schema): Schema
    {
        return RoleHasPermissionForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return RoleHasPermissionInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return RoleHasPermissionsTable::configure($table);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => ListRoleHasPermissions::route('/'),
            'create' => CreateRoleHasPermission::route('/create'),
            'view' => ViewRoleHasPermission::route('/{record}'),
            'edit' => EditRoleHasPermission::route('/{record}/edit'),
        ];
    }
}
