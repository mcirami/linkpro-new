<?php

namespace App\Models;

// use Illuminate\Contracts\Auth\MustVerifyEmail;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use Illuminate\Support\Facades\Session;
use Inertia\Inertia;
use Laravel\Sanctum\HasApiTokens;
use App\Models\Link as Link;
use App\Models\Page as Page;
use App\Models\Referral as Referral;
use Mchev\Banhammer\Models\Ban;
use Spatie\Permission\Traits\HasRoles;
use Spatie\Permission\Models\Permission;
use Mchev\Banhammer\Traits\Bannable;
use Filament\Models\Contracts\FilamentUser;
use Filament\Panel;
use Filament\Models\Contracts\HasName;

class User extends Authenticatable implements FilamentUser, HasName
{
    use HasApiTokens, HasFactory, Notifiable, HasRoles, Bannable;

    /**
     * The attributes that are not mass assignable.
     *
     * @var array
     */
    protected $guarded = [
        'id',
        'created_at',
        'updated_at',
        'email_verified_at'
    ];

    /**
     * The attributes that should be hidden for serialization.
     *
     * @var array<int, string>
     */
    protected $hidden = [
        'password',
        'remember_token',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
    ];

    public function getFilamentName(): string
    {
        // Make SURE this always returns a string
        // Adjust to whatever fields you actually have.
        if (! empty($this->username)) {
            return $this->username;
        }

        if (! empty($this->first_name) || ! empty($this->last_name)) {
            return trim($this->first_name . ' ' . $this->last_name);
        }

        // Fallback so it NEVER returns null:
        return (string) $this->email;
    }
    public function canAccessPanel(Panel $panel): bool
    {
        return $this->hasRole('admin');
    }

    /** Relationships **/

    public function pages(): HasMany|Builder|User {
        return $this->hasMany(Page::class);
    }

    public function links(): User|Builder|HasMany {
        return $this->hasMany(Link::class);
    }

    public function folders(): HasMany|Builder|User {
        return $this->hasMany(Folder::class);
    }

    public function linkVisits(): HasManyThrough|Builder|User {
        return $this->hasManyThrough(LinkVisit::class, Link::class);
    }

    public function pageVisits(): HasManyThrough|Builder|User {
        return $this->hasManyThrough(PageVisit::class, Page::class);
    }

    public function subscriptions(): HasOne|Builder|User {
        return $this->hasOne(Subscription::class);
    }

    public function referrals(): HasMany|Builder|User {
        return $this->hasMany(Referral::class);
    }

    public function ShopifyStores(): HasMany|Builder|User {
        return $this->hasMany(ShopifyStore::class);
    }

    public function LandingPages(): HasOne|Builder|User {
        return $this->hasOne(LandingPage::class);
    }

    public function LandingPageSections(): HasMany|Builder|User {
        return $this->hasMany(LandingPageSection::class);
    }

    public function Courses(): HasMany|Builder|User {
        return $this->hasMany(Course::class);
    }

    public function Offers(): HasMany|Builder|User {
        return $this->hasMany(Offer::class);
    }

    public function OfferClicks(): HasMany|Builder|User {
        return $this->hasMany(OfferClick::class, 'referral_id');
    }

    public function Purchases(): HasMany|Builder|User {
        return $this->hasMany(Purchase::class);
    }

    public function Affiliates(): HasOne|Builder|User {
        return $this->hasOne(Affiliate::class);
    }

    public function Banned() {
        return $this->hasMany(Ban::class);
    }

    public function UserIpAddress(): HasMany|Builder|User {
        return $this->hasMany(UserIpAddress::class);
    }

    public function UserPayout(): HasOne|Builder|User {
        return $this->hasOne(UserPayout::class);
    }

    /** Other Functions **/

    public function getRedirectRoute(): \Symfony\Component\HttpFoundation\Response|\Illuminate\Http\RedirectResponse {
        $loginURL = url()->previous();
        $roles = $this->getRoleNames();
        $previousURL = Session::get('url.intended');

        $courseID = $_GET['course'] ?? null;
        $course = null;
        if ($courseID) {
            $course = Course::findOrFail($courseID);
            $creator = User::where('id', '=', $course->user_id)->get()->pluck('username');
        }

        if ( $previousURL ) {
            return Inertia::location($previousURL);
        }

        if ($roles->contains('admin')) {

            if ($course) {
                return Inertia::location('/' . $creator[0] . '/course/' . $course->slug);
            } else if (str_contains($loginURL, "admin")) {
                return to_route( 'admin' );
            }

        } else if ($roles->contains("course.user") && $roles->contains('lp.user')) {

            if ($course) {
                return Inertia::location('/' . $creator[0] . '/course/' . $course->slug);
            }

        } else if ($roles->contains('lp.user')) {

            $userPages = $this->pages()->get();

            if ( $userPages->isEmpty() ) {
                return to_route( 'create.page' );
            }

        } else if ($roles->contains("course.user")) {

            if ($course) {
                return Inertia::location('/' . $creator[0] . '/course/' . $course->slug);
            } else {
                return to_route('all.courses');
            }
        }

        $pageID = $this->pages()->where('default', '=', 1)->pluck('id')->first();
        return Inertia::location('/dashboard/pages/' . $pageID);
        //return to_route( 'dashboard' );
    }
}
