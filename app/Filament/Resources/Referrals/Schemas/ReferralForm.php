<?php

namespace App\Filament\Resources\Referrals\Schemas;

use Filament\Forms\Components\TextInput;
use Filament\Schemas\Schema;

class ReferralForm
{
    public static function configure(Schema $schema): Schema
    {
        return $schema
            ->components([
                TextInput::make('user_id')
                    ->required()
                    ->numeric(),
                TextInput::make('referral_id')
                    ->required()
                    ->numeric(),
                TextInput::make('subscription_id')
                    ->numeric(),
                TextInput::make('plan_id'),
            ]);
    }
}
