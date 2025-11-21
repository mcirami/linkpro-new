<?php

namespace App\Filament\Resources\Purchases\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class PurchaseForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('offer_click_id')
                    ->required(),
                TextInput::make('user_id')
                    ->required()
                    ->numeric(),
                TextInput::make('course_id')
                    ->required()
                    ->numeric(),
                TextInput::make('customer_id')
                    ->required(),
                TextInput::make('transaction_id')
                    ->required(),
                TextInput::make('purchase_amount')
                    ->required()
                    ->numeric(),
                TextInput::make('pm_last_four')
                    ->numeric(),
                TextInput::make('pm_type')
                    ->required(),
                TextInput::make('status')
                    ->required(),
            ]);
    }
}
