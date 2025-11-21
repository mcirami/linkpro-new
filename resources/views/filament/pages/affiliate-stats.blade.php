@php
    use Illuminate\Support\Str;
@endphp

<x-filament-panels::page>
    <div class="space-y-6">
        <div class="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div class="flex flex-col gap-3 border-b border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 class="text-lg font-semibold leading-6 text-gray-900">Affiliate stats</h2>
                    <p class="text-sm text-gray-500">Switch between publisher and offer views and refine the date range.</p>
                </div>
                <x-filament::button color="gray" wire:click="clearFilters">
                    Clear filters
                </x-filament::button>
            </div>

            <div class="px-6 py-4">
                {{ $this->form }}
            </div>
        </div>

        <div class="rounded-xl border border-gray-200 bg-white shadow-sm">
            <div class="flex flex-col gap-2 border-b border-gray-200 px-6 py-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h2 class="text-lg font-semibold leading-6 text-gray-900">{{ $this->isOfferView() ? 'Offer stats' : 'Publisher stats' }}</h2>
                    <p class="text-sm text-gray-500">{{ $this->isOfferView() ? 'Performance summarized by offer.' : 'Performance summarized by affiliate.' }}</p>
                </div>
                <p class="text-sm text-gray-500">Showing {{ count($this->stats) }} {{ Str::of($this->isOfferView() ? 'offer' : 'affiliate')->plural(count($this->stats)) }}</p>
            </div>

            <div class="px-6 py-4">
                @if (empty($this->stats))
                    <div class="py-10 text-center text-sm text-gray-500">
                        No stats available for the selected filters.
                    </div>
                @else
                    <div class="overflow-x-auto">
                        <table class="min-w-full divide-y divide-gray-200 text-left text-sm">
                            <thead class="bg-gray-50">
                                <tr>
                                    <th scope="col" class="px-4 py-3 font-semibold text-gray-700">{{ $this->isOfferView() ? 'Offer name' : 'Affiliate' }}</th>
                                    <th scope="col" class="px-4 py-3 font-semibold text-gray-700">Raw clicks</th>
                                    <th scope="col" class="px-4 py-3 font-semibold text-gray-700">Unique clicks</th>
                                    <th scope="col" class="px-4 py-3 font-semibold text-gray-700">Conversions</th>
                                    <th scope="col" class="px-4 py-3 font-semibold text-gray-700">Payout</th>
                                </tr>
                            </thead>
                            <tbody class="divide-y divide-gray-200">
                                @foreach ($this->stats as $row)
                                    <tr>
                                        <td class="px-4 py-3 font-medium text-gray-900">{{ $row['name'] ?? 'N/A' }}</td>
                                        <td class="px-4 py-3 text-gray-700">{{ number_format((float) ($row['rawCount'] ?? 0)) }}</td>
                                        <td class="px-4 py-3 text-gray-700">{{ number_format((float) ($row['uniqueCount'] ?? 0)) }}</td>
                                        <td class="px-4 py-3 text-gray-700">{{ number_format((float) ($row['conversionCount'] ?? 0)) }}</td>
                                        <td class="px-4 py-3 text-gray-900">${{ number_format((float) ($row['payout'] ?? 0), 2) }}</td>
                                    </tr>
                                @endforeach
                            </tbody>
                            @if (! empty($this->totals))
                                <tfoot class="bg-gray-50">
                                    <tr>
                                        <th scope="row" class="px-4 py-3 text-left font-semibold text-gray-900">Totals</th>
                                        <td class="px-4 py-3 font-semibold text-gray-900">{{ number_format((float) ($this->totals['totalRaw'] ?? 0)) }}</td>
                                        <td class="px-4 py-3 font-semibold text-gray-900">{{ number_format((float) ($this->totals['totalUnique'] ?? 0)) }}</td>
                                        <td class="px-4 py-3 font-semibold text-gray-900">{{ number_format((float) ($this->totals['totalConversions'] ?? 0)) }}</td>
                                        <td class="px-4 py-3 font-semibold text-gray-900">${{ number_format((float) ($this->totals['totalPayout'] ?? 0), 2) }}</td>
                                    </tr>
                                </tfoot>
                            @endif
                        </table>
                    </div>
                @endif
            </div>
        </div>
    </div>
</x-filament-panels::page>
