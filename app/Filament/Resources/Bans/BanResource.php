<?php

namespace App\Filament\Resources\Bans;

use App\Filament\Resources\Bans\Pages\CreateBan;
use App\Filament\Resources\Bans\Pages\EditBan;
use App\Filament\Resources\Bans\Pages\ListBans;
use App\Filament\Resources\Bans\Pages\ViewBan;
use App\Filament\Resources\Bans\Schemas\BanForm;
use App\Filament\Resources\Bans\Schemas\BanInfolist;
use App\Filament\Resources\Bans\Tables\BansTable;
use App\Models\Ban;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class BanResource extends Resource
{
    protected static ?string $model = Ban::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedXCircle;

    protected static ?string $recordTitleAttribute = 'Banned Users';
    protected static ?int $navigationSort = 13;
    public static function form(Schema $schema): Schema
    {
        return BanForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return BanInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return BansTable::configure($table);
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
            'index' => ListBans::route('/'),
            'create' => CreateBan::route('/create'),
            'view' => ViewBan::route('/{record}'),
            'edit' => EditBan::route('/{record}/edit'),
        ];
    }
}
