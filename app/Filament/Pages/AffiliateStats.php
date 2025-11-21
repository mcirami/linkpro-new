<?php

namespace App\Filament\Pages;

use App\Services\AdminStatsServices;
use Carbon\Carbon;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Forms\Form;
use Filament\Forms\Get;
use Filament\Forms\Set;
use Filament\Notifications\Notification;
use Filament\Pages\Page;
use Filament\Support\Icons\Heroicon;

class AffiliateStats extends Page implements HasForms
{
    use InteractsWithForms;

    protected static ?string $navigationIcon = Heroicon::OutlinedChartBarSquare;

    protected static ?string $navigationLabel = 'Affiliate Stats';

    protected static ?string $slug = 'affiliate-stats';

    protected static string $view = 'filament.pages.affiliate-stats';

    protected static bool $shouldRegisterNavigation = true;

    protected AdminStatsServices $statsService;

    public ?array $data = [];

    public array $stats = [];

    public array $totals = [];

    public function mount(AdminStatsServices $adminStatsServices): void
    {
        $this->statsService = $adminStatsServices;

        $this->form->fill($this->getDefaultFormState());

        $this->refreshStats();
    }

    public static function canAccess(): bool
    {
        return auth()->check() && auth()->user()->hasRole('admin');
    }

    public function form(Form $form): Form
    {
        return $form
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
                    ->required(),
                Select::make('datePreset')
                    ->label('Date range')
                    ->options($this->getQuickRangeOptions())
                    ->native(false)
                    ->live()
                    ->afterStateUpdated(function (Set $set, $state) {
                        if ($state !== 'custom') {
                            $set('customStart', null);
                            $set('customEnd', null);
                        }

                        $this->refreshStats();
                    })
                    ->required(),
                DatePicker::make('customStart')
                    ->label('Start date')
                    ->native(false)
                    ->maxDate(now())
                    ->live()
                    ->afterStateUpdated(fn () => $this->refreshStats()),
                DatePicker::make('customEnd')
                    ->label('End date')
                    ->native(false)
                    ->minDate(fn (Get $get) => $get('customStart'))
                    ->maxDate(now())
                    ->live()
                    ->afterStateUpdated(fn () => $this->refreshStats()),
            ])
            ->columns([
                'md' => 4,
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

        $this->stats = $data['affiliateData'] ?? [];
        $this->totals = $data['totals'] ?? [];
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
            'dateValue' => (int) ($preset ?? 1),
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
}
