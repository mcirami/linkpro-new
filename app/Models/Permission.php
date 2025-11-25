<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Permission extends Model
{

    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'spatie_permissions';

    public function roles(): BelongsToMany {
        return $this->belongsToMany(
            Role::class,
            'role_has_permissions',   // same pivot table
            'spatie_permission_id',   // FK on pivot pointing to this model
            'spatie_role_id'          // FK on pivot pointing to Role
        );
    }
}
