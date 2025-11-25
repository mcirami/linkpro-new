<?php

namespace App\Filament\Pages;

use App\Services\AdminStatsServices;
use Carbon\Carbon;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Schemas\Components\Grid;
use Filament\Schemas\Schema;
use Filament\Support\Icons\Heroicon;
use Illuminate\Support\Str;

class AffiliateStats extends Page implements HasForms
{
    use InteractsWithForms;

    protected string $view = 'filament.pages.affiliate-stats';
    protected AdminStatsServices $statsService;

    protected static string|null|\BackedEnum $navigationIcon = Heroicon::OutlinedChartBarSquare;

    protected static ?string $navigationLabel = 'Affiliate Stats';
    protected static ?int $navigationSort = 1;

    protected static ?string $slug = 'affiliate-stats';

    protected static bool $shouldRegisterNavigation = true;



    public ?array $data = [];

    public array $stats = [];

    public array $totals = [];

    public function boot(AdminStatsServices $adminStatsServices): void
    {
        $this->statsService = $adminStatsServices;
    }
    public function mount(): void
    {

        $this->form->fill($this->getDefaultFormState());

        $this->refreshStats();
    }

    public static function canAccess(): bool
    {
        return auth()->check() && auth()->user()->hasRole('admin');
    }

    public function form(Schema $schema): Schema {
        return $schema
            ->components([
                Grid::make()
                    ->columns([
                        'default' => 1,
                        'md' => 4,
                        'lg' => 4
                    ])
                    ->schema([
                        Select::make('filterBy')
                            ->label('Stats by')
                            ->options([
                                'publisher' => 'Publisher',
                                'offer' => 'Offer',
                            ])
                            ->native(false)
                            ->live()
                            ->afterStateUpdated(fn () => $this->refreshStats())
                            ->required()
                            ->columnSpan(1),
                        Select::make('datePreset')
                            ->label('Date range')
                            ->options($this->getQuickRangeOptions())
                            ->native(false)
                            ->live()
                            ->afterStateUpdated(function (callable $set, $state) {
                                if ($state !== 'custom') {
                                    $set('customStart', null);
                                    $set('customEnd', null);

                                    $this->refreshStats();
                                    return;
                                }

                                $this->stats = [];
                                $this->totals = [];
                            })
                            ->required()->columnSpan(1),
                        DatePicker::make('customStart')
                            ->label('Start date')
                            ->native(false)
                            ->maxDate(now())
                            ->live()
                            ->afterStateUpdated(function ($state, callable $set, callable $get) {
                                if ($state) {
                                    $set('datePreset', 'custom');
                                }

                                if ($get('customEnd')) {
                                    $this->refreshStats();
                                }
                            })->columnSpan(1),
                        DatePicker::make('customEnd')
                            ->label('End date')
                            ->native(false)
                            ->minDate(fn (callable $get) => $get('customStart'))
                            ->maxDate(now())
                            ->live()
                            ->afterStateUpdated(function ($state, callable $set, callable $get) {
                                if ($state) {
                                    $set('datePreset', 'custom');
                                }

                                if ($state && $get('customStart')) {
                                    $this->refreshStats();
                                }
                            })->columnSpan(1),
                    ]),
                TextInput::make('search')
                         ->label('Search')
                         ->placeholder('Search by name')
                         ->live(debounce: 500)
                         ->afterStateUpdated(fn () => $this->refreshStats()),
            ])
            ->statePath('data');
    }

    public function clearFilters(): void
    {
        $this->form->fill($this->getDefaultFormState());

        $this->refreshStats();
    }

    public function isOfferView(): bool
    {
        return ($this->data['filterBy'] ?? 'publisher') === 'offer';
    }

    protected function refreshStats(): void
    {
        $payload = $this->buildDatePayload();

        if ($payload === null) {
            $this->stats = [];
            $this->totals = [];

            return;
        }

        $data = $this->isOfferView()
            ? $this->statsService->getAllOfferStats($payload)
            : $this->statsService->getAllPublisherStats($payload);

        $stats = $data['affiliateData'] ?? [];
        $totals = $data['totals'] ?? [];

        $search = Str::of($this->data['search'] ?? '')->trim();

        if ($search->isNotEmpty()) {
            $stats = array_values(array_filter($stats, function ($row) use ($search) {
                return Str::of($row['name'] ?? '')->lower()->contains($search->lower());
            }));

            $totals = $this->calculateTotalsFromStats($stats);
        }

        $this->stats = $stats;
        $this->totals = $totals;
    }

    protected function buildDatePayload(): ?array
    {
        $preset = $this->getDatePreset();

        if ($preset === 'custom') {
            $start = $this->data['customStart'] ?? null;
            $end = $this->data['customEnd'] ?? null;

            if (! $start || ! $end) {
                return null;
            }

            $startDate = Carbon::parse($start)->startOfDay();
            $endDate = Carbon::parse($end)->endOfDay();

            if ($endDate->lessThan($startDate)) {
                Notification::make()
                    ->title('End date must be after the start date.')
                    ->warning()
                    ->send();

                return null;
            }

            return [
                'startDate' => $startDate->timestamp,
                'endDate' => $endDate->timestamp,
            ];
        }

        return [
            'dateValue' => (int) ($preset),
        ];
    }

    protected function getDatePreset(): string
    {
        return (string) ($this->data['datePreset'] ?? '1');
    }

    protected function getDefaultFormState(): array
    {
        return [
            'filterBy' => 'publisher',
            'datePreset' => '1',
            'customStart' => null,
            'customEnd' => null,
            'search' => '',
        ];
    }

    protected function getQuickRangeOptions(): array
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

    protected function calculateTotalsFromStats(array $stats): array
    {
        $totals = [
            'totalRaw' => 0,
            'totalUnique' => 0,
            'totalConversions' => 0,
            'totalPayout' => 0.0,
        ];

        foreach ($stats as $row) {
            $totals['totalRaw'] += (float) ($row['rawCount'] ?? 0);
            $totals['totalUnique'] += (float) ($row['uniqueCount'] ?? 0);
            $totals['totalConversions'] += (float) ($row['conversionCount'] ?? 0);
            $totals['totalPayout'] += (float) ($row['payout'] ?? 0);
        }

        return $totals;
    }
}
