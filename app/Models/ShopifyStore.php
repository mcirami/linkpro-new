<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ShopifyStore extends Model
{
    use HasFactory;

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'shopify';

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'products' => 'array'
    ];

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'user_id',
        'access_token',
        'domain',
        'products'
    ];

    public function user() {
        return $this->belongsTo(User::class);
    }
}
