<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class UserPayout extends Model
{

    /**
     * The attributes that are not mass assignable.
     *
     * @var array
     */
    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
    ];

    public function User(): BelongsTo {
        return $this->belongsTo(User::class);
    }
}
