<?php

namespace App\Filament\Resources\Subscriptions\Tables;

use Carbon\Carbon;
use Filament\Actions\BulkActionGroup;
use Filament\Actions\DeleteBulkAction;
use Filament\Actions\EditAction;
use Filament\Actions\ViewAction;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Tables\Columns\IconColumn;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Filters\Filter;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class SubscriptionsTable
{
    public static function configure(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('user_id')
                    ->numeric()
                    ->sortable(),
                TextColumn::make('name')
                    ->searchable(),
                TextColumn::make('sub_id')
                    ->searchable(),
                TextColumn::make('status')
                    ->searchable(),
                TextColumn::make('trial_ends_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('ends_at')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                IconColumn::make('downgraded')
                    ->boolean(),
            ])
            ->filters([
                Filter::make('date_range')
                    ->label('Date range')
                    ->default([
                        'preset' => '1',
                    ])
                    ->form([
                        Select::make('preset')
                            ->label('Date range')
                            ->options(self::getQuickRangeOptions())
                            ->native(false)
                            ->live()
                            ->afterStateUpdated(function (callable $set, $state) {
                                if ($state !== 'custom') {
                                    $set('start', null);
                                    $set('end', null);
                                }
                            }),
                        DatePicker::make('start')
                            ->label('Start date')
                            ->native(false)
                            ->maxDate(now())
                            ->live()
                            ->afterStateUpdated(function ($state, callable $set) {
                                if ($state) {
                                    $set('preset', 'custom');
                                }
                            }),
                        DatePicker::make('end')
                            ->label('End date')
                            ->native(false)
                            ->minDate(fn (callable $get) => $get('start'))
                            ->maxDate(now())
                            ->live()
                            ->afterStateUpdated(function ($state, callable $set) {
                                if ($state) {
                                    $set('preset', 'custom');
                                }
                            }),
                    ])
                    ->query(function (Builder $query, array $data) {
                        [$start, $end] = self::resolveDateRange($data);

                        if (!$start || !$end) {
                            return $query;
                        }

                        return $query->whereBetween('subscriptions.created_at', [$start, $end]);
                    })
                    ->indicateUsing(function (array $data) {
                        [$start, $end] = self::resolveDateRange($data);

                        if (!$start || !$end) {
                            return null;
                        }

                        $preset = $data['preset'] ?? '1';
                        $labels = self::getQuickRangeOptions();

                        if ($preset !== 'custom' && isset($labels[$preset])) {
                            return $labels[$preset];
                        }

                        return sprintf(
                            '%s - %s',
                            $start->toFormattedDateString(),
                            $end->toFormattedDateString(),
                        );
                    }),
            ])
            ->recordActions([
                ViewAction::make(),
                EditAction::make(),
            ])
            ->toolbarActions([
                BulkActionGroup::make([
                    DeleteBulkAction::make(),
                ]),
            ]);
    }

    protected static function resolveDateRange(array $data): array
    {
        $preset = $data['preset'] ?? '1';

        if ($preset === 'custom') {
            $start = $data['start'] ?? null;
            $end = $data['end'] ?? null;

            if (!$start || !$end) {
                return [null, null];
            }

            $startDate = Carbon::parse($start)->startOfDay();
            $endDate = Carbon::parse($end)->endOfDay();

            if ($endDate->lessThan($startDate)) {
                return [null, null];
            }

            return [$startDate, $endDate];
        }

        return self::getPresetRange($preset);
    }

    protected static function getPresetRange(string $preset): array
    {
        switch ($preset) {
            case '2':
                $start = Carbon::now()->subDay()->startOfDay();
                $end = Carbon::now()->subDay()->endOfDay();
                break;
            case '3':
                $start = Carbon::now()->startOfWeek()->startOfDay();
                $end = Carbon::now()->endOfDay();
                break;
            case '4':
                $start = Carbon::now()->startOfMonth()->startOfDay();
                $end = Carbon::now()->endOfDay();
                break;
            case '5':
                $start = Carbon::now()->startOfYear()->startOfDay();
                $end = Carbon::now()->endOfDay();
                break;
            case '6':
                $start = Carbon::now()->startOfWeek()->subDays(7)->startOfDay();
                $end = Carbon::now()->startOfWeek()->subDay()->endOfDay();
                break;
            case '7':
                $start = Carbon::now()->startOfMonth()->subDay()->startOfMonth()->startOfDay();
                $end = Carbon::now()->startOfMonth()->subDay()->endOfMonth()->endOfDay();
                break;
            default:
                $start = Carbon::now()->startOfDay();
                $end = Carbon::now()->endOfDay();
                break;
        }

        return [$start, $end];
    }

    protected static function getQuickRangeOptions(): array
    {
        return [
            '1' => 'Today',
            '2' => 'Yesterday',
            '3' => 'Week to date',
            '4' => 'Month to date',
            '5' => 'Year to date',
            '6' => 'Last week',
            '7' => 'Last month',
            'custom' => 'Custom',
        ];
    }
}
