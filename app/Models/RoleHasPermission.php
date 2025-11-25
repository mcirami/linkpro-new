<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class RoleHasPermission extends Model
{

    /**
     * The attributes that should be hidden for arrays.
     */
    protected $hidden = ['created_at', 'updated_at'];

    protected $fillable = [
        'spatie_role_id',
        'spatie_permission_id'
    ];

    public function roles(): RoleHasPermission|HasMany {
        return $this->hasMany(Role::class);
    }

    public function permissions(): RoleHasPermission|HasMany {
        return $this->hasMany(Permission::class);
    }
}
