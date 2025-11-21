<?php

namespace App\Filament\Resources\OfferClicks;

use App\Filament\Resources\OfferClicks\Pages\CreateOfferClick;
use App\Filament\Resources\OfferClicks\Pages\EditOfferClick;
use App\Filament\Resources\OfferClicks\Pages\ListOfferClicks;
use App\Filament\Resources\OfferClicks\Pages\ViewOfferClick;
use App\Filament\Resources\OfferClicks\Schemas\OfferClickForm;
use App\Filament\Resources\OfferClicks\Schemas\OfferClickInfolist;
use App\Filament\Resources\OfferClicks\Tables\OfferClicksTable;
use App\Models\OfferClick;
use BackedEnum;
use Filament\Resources\Resource;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Filament\Tables\Table;

class OfferClickResource extends Resource
{
    protected static ?string $model = OfferClick::class;

    protected static string|BackedEnum|null $navigationIcon = Heroicon::OutlinedRectangleStack;

    protected static ?string $recordTitleAttribute = 'offer clicks';

    public static function form(Schema $schema): Schema
    {
        return OfferClickForm::configure($schema);
    }

    public static function infolist(Schema $schema): Schema
    {
        return OfferClickInfolist::configure($schema);
    }

    public static function table(Table $table): Table
    {
        return OfferClicksTable::configure($table);
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
            'index' => ListOfferClicks::route('/'),
            'create' => CreateOfferClick::route('/create'),
            'view' => ViewOfferClick::route('/{record}'),
            'edit' => EditOfferClick::route('/{record}/edit'),
        ];
    }
}
