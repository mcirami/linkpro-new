<?php

namespace App\Policies;

use App\Models\ShopifyStore;
use Illuminate\Auth\Access\HandlesAuthorization;

class ShopifyStorePolicy
{
    use HandlesAuthorization;

    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine whether the user can delete the model.
     *
     * @param  \App\Models\ShopifyStore  $shopifyStore
     * @param  \App\Models\ShopifyStore  $model
     * @return \Illuminate\Auth\Access\Response|bool
     */
    public function delete(ShopifyStore $shopifyStore, ShopifyStore $model)
    {
        return true;
    }
}
