<?php

use App\Models\Course;
use App\Models\CourseSection;
use App\Models\Folder;
use App\Models\LandingPage;
use App\Models\LandingPageSection;
use App\Models\Link;
use App\Models\Offer;
use App\Models\Page;
use App\Models\User;
use App\Policies\CoursePolicy;
use App\Policies\CourseSectionPolicy;
use App\Policies\FolderPolicy;
use App\Policies\LandingPagePolicy;
use App\Policies\LandingPageSectionPolicy;
use App\Policies\LinkPolicy;
use App\Policies\OfferPolicy;
use App\Policies\PagePolicy;
use Tests\TestCase;

// Boot the app (for the models) but no database is needed for policy logic.
uses(TestCase::class);

/**
 * @param  class-string  $policyClass
 * @param  class-string  $modelClass
 * @param  int|null  $deniedStatus  Expected HTTP status when denied (null = 403 default, 404 = hidden).
 */
dataset('ownership_policies', [
    'Link (403)' => [LinkPolicy::class, Link::class, null],
    'Folder (403)' => [FolderPolicy::class, Folder::class, null],
    'Page (404)' => [PagePolicy::class, Page::class, 404],
    'Course (404)' => [CoursePolicy::class, Course::class, 404],
    'CourseSection (404)' => [CourseSectionPolicy::class, CourseSection::class, 404],
    'LandingPage (404)' => [LandingPagePolicy::class, LandingPage::class, 404],
    'LandingPageSection (404)' => [LandingPageSectionPolicy::class, LandingPageSection::class, 404],
    'Offer (404)' => [OfferPolicy::class, Offer::class, 404],
]);

test('the owner may manage the resource', function ($policyClass, $modelClass) {
    $owner = tap(new User, fn ($u) => $u->id = 1);
    $model = tap(new $modelClass, fn ($m) => $m->user_id = 1);

    expect((new $policyClass)->manage($owner, $model)->allowed())->toBeTrue();
})->with('ownership_policies');

test('a non-owner is denied with the expected status', function ($policyClass, $modelClass, $deniedStatus) {
    $other = tap(new User, fn ($u) => $u->id = 2);
    $model = tap(new $modelClass, fn ($m) => $m->user_id = 1);

    $response = (new $policyClass)->manage($other, $model);

    expect($response->denied())->toBeTrue()
        ->and($response->status())->toBe($deniedStatus);
})->with('ownership_policies');
