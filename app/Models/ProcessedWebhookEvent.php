<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProcessedWebhookEvent extends Model
{
    protected $fillable = [
        'provider',
        'event_id',
        'type',
    ];

    /**
     * Atomically claim an event for processing. Returns true if this call
     * claimed it (caller should process), or false if it was already handled.
     *
     * The unique (provider, event_id) index makes this safe against
     * concurrent redeliveries of the same event.
     */
    public static function claim(string $provider, string $eventId, ?string $type = null): bool
    {
        return static::firstOrCreate(
            ['provider' => $provider, 'event_id' => $eventId],
            ['type' => $type],
        )->wasRecentlyCreated;
    }
}
