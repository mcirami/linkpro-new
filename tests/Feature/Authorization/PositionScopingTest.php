<?php

use App\Models\CourseSection;
use App\Models\LandingPageSection;
use App\Models\Link;
use App\Models\User;
use App\Services\CourseService;
use App\Services\LandingPageService;
use App\Services\LinkService;

/**
 * The *-positions endpoints take a list of ids from the request body and have
 * no route-model binding to authorize. These tests prove the services only
 * reorder rows owned by the authenticated user and ignore foreign ids.
 */

test('link reordering ignores links the user does not own', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();

    $ownerLink = Link::factory()->create(['user_id' => $owner->id, 'position' => 9]);
    $foreignLink = Link::factory()->create(['user_id' => $other->id, 'position' => 9]);

    $this->actingAs($owner);

    // A crafted payload that interleaves the attacker's own link with a victim's.
    app(LinkService::class)->updateLinksPositions([
        'userLinks' => [
            ['id' => $ownerLink->id],   // index 0
            ['id' => $foreignLink->id], // index 1
        ],
    ]);

    expect($ownerLink->fresh()->position)->toBe(0)        // owner reordered
        ->and($foreignLink->fresh()->position)->toBe(9);  // victim untouched
});

test('course section reordering ignores sections the user does not own', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();

    $ownerSection = CourseSection::factory()->create(['user_id' => $owner->id, 'position' => 9]);
    $foreignSection = CourseSection::factory()->create(['user_id' => $other->id, 'position' => 9]);

    $this->actingAs($owner);

    app(CourseService::class)->updateAllSectionsPositions([
        'sections' => [
            ['id' => $ownerSection->id],
            ['id' => $foreignSection->id],
        ],
    ]);

    expect($ownerSection->fresh()->position)->toBe(0)
        ->and($foreignSection->fresh()->position)->toBe(9);
});

test('landing page section reordering ignores sections the user does not own', function () {
    $owner = User::factory()->create();
    $other = User::factory()->create();

    $ownerSection = LandingPageSection::factory()->create(['user_id' => $owner->id, 'position' => 9]);
    $foreignSection = LandingPageSection::factory()->create(['user_id' => $other->id, 'position' => 9]);

    $this->actingAs($owner);

    app(LandingPageService::class)->updateAllSectionsPositions([
        'sections' => [
            ['id' => $ownerSection->id],
            ['id' => $foreignSection->id],
        ],
    ]);

    expect($ownerSection->fresh()->position)->toBe(0)
        ->and($foreignSection->fresh()->position)->toBe(9);
});
