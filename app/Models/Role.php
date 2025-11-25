<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Role extends Model
{

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'spatie_roles';

    public function users(): HasMany|Role {
        return $this->hasMany(User::class);
    }

    public function permissions(): BelongsToMany {
        return $this->belongsToMany(
            Permission::class,
            'role_has_permissions',   // pivot table
            'spatie_role_id',         // FK on pivot pointing to this model
            'spatie_permission_id'    // FK on pivot pointing to Permission
        );
    }
}
