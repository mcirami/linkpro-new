<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Subscription extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'name',
        'braintree_id',
        'braintree_status',
        'trial_ends_at',
        'ends_at',
        'downgraded',
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
