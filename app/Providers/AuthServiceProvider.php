<?php

namespace App\Providers;

// use Illuminate\Support\Facades\Gate;
use App\Models\Course;
use App\Models\CourseSection;
use App\Models\Folder;
use App\Models\LandingPage;
use App\Models\LandingPageSection;
use App\Models\Link;
use App\Models\Offer;
use App\Models\Page;
use App\Policies\CoursePolicy;
use App\Policies\CourseSectionPolicy;
use App\Policies\FolderPolicy;
use App\Policies\LandingPagePolicy;
use App\Policies\LandingPageSectionPolicy;
use App\Policies\LinkPolicy;
use App\Policies\OfferPolicy;
use App\Policies\PagePolicy;
use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;

class AuthServiceProvider extends ServiceProvider
{
    /**
     * The model to policy mappings for the application.
     *
     * @var array<class-string, class-string>
     */
    protected $policies = [
        'App\Models\Model' => 'App\Policies\ModelPolicy',
        'App\Models\ShopifyStore' => 'App\Policies\ShopifyStorePolicy',
        Link::class => LinkPolicy::class,
        Folder::class => FolderPolicy::class,
        Page::class => PagePolicy::class,
        Course::class => CoursePolicy::class,
        CourseSection::class => CourseSectionPolicy::class,
        LandingPage::class => LandingPagePolicy::class,
        LandingPageSection::class => LandingPageSectionPolicy::class,
        Offer::class => OfferPolicy::class,
    ];

    /**
     * Register any authentication / authorization services.
     */
    public function boot(): void
    {
        $this->registerPolicies();
    }
}
