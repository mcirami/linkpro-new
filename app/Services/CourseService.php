<?php

namespace App\Services;

use App\Models\Category;
use App\Models\Course;
use App\Models\CourseSection;
use App\Models\Link;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class CourseService {

    public function getCourses($user) {

        return $user->Offers()
                    ->where('published', '=', true)
                    ->leftJoin("courses", "offers.course_id", "=", "courses.id")
                    ->select('courses.id', 'courses.title', 'courses.slug')
                    ->get()->toArray();
    }

    public function getCourseData($course) {
        $courseData = $course->attributesToArray();
        $sections = $course->CourseSections()->orderBy('position', 'asc')->get()->toArray();
        $courseCategory = $course->categories()->orderBy('id', 'desc')->get();
        if(count($courseCategory) > 0) {
            $courseData["category"] = $courseCategory[0]["id"];
        }

        $sectionArray = [];
        if (!empty($sections)) {
            foreach ( $sections as $index => $section ) {
                $object = [
                    "name" => $section["type"] . "_" . $index + 1,
                ];
                $merged = array_merge( $section, $object );
                array_push( $sectionArray, $merged );
            }

            $courseData["sections"] = $sectionArray;
        } else {
            $courseData["sections"] = [];
        }

        return $courseData;
    }

    public function getCourseOfferData($course) {

        return $course->Offer()->first();
    }

    public function saveCourseData($course, $request) {
        $keys = collect($request->all())->keys();
        $slug = null;

        if($keys[0] == "category") {
            $this->saveCourseCategory($course, $request[$keys[0]]);
        } else {
            $course->update([
                $keys[0] => $request[$keys[0]]
            ]);
        }

        if ($keys[0] == "title") {
            $slug = Str::slug($request[$keys[0]], '-');
            $course->update([
                'slug' => $slug,
            ]);

            $this->updateCourseLinks($course, $request[$keys[0]], $slug);
        }

        return [
            "key" => $keys[0],
            "slug" => $slug
        ];
    }

    public function saveCourseImage($userID, $request, $key, $course) {
        $imgName = time() . '.' . $request->ext;
        $pathToFolder = 'courses/' . $userID . '/' . $course->id . '/' . $key . '/';
        $path = $pathToFolder . $imgName;

        $files = Storage::disk('s3')->allFiles($pathToFolder);
        Storage::disk('s3')->delete($files);

        Storage::disk('s3')->copy(
            $request->$key,
            str_replace($request->$key, $path, $request->$key)
        );

        $imagePath = Storage::disk('s3')->url($path);

        $course->update([$key => $imagePath]);

        return $imagePath;

    }

    public function addCourseSection($course, $userID, $request) {

        $sectionCount = $course->CourseSections()->count();
        if ($sectionCount > 0) {
            $position = $sectionCount;
        } else {
            $position = 0;
        }

        return $course->CourseSections()->create([
           'user_id'    => $userID,
           'type'       => $request->type,
           'position'   => $position,
           'lock_video' => $request->type === "video" ? true : null
        ])->fresh();
    }

    public function saveSectionData($section, $request) {
        $keys = collect($request->all())->keys();

        $section->update([
            $keys[0] => $request[$keys[0]]
        ]);

        return $keys[0];
    }

    public function getUnpurchasedCourses($authUserID) {
        return Course::whereDoesntHave('purchases',
            function (Builder $query)  use($authUserID) {
            $query->where('user_id', '=', $authUserID);
        })->whereHas('offer', function($query) {
            $query->where('active', true)->where('public', true)->where('published', true);
        })->leftJoin('users', 'users.id', '=', 'courses.user_id')
          ->select('courses.*', 'users.username')
          ->get();
    }

    public function getUserPurchasedCourses($userID) {
        return Course::whereHas('purchases', function (Builder $query) use($userID) {
            $query->where('user_id', 'like', $userID);
        })->leftJoin('users', 'users.id', '=', 'courses.user_id')
          ->select('courses.*', 'users.username')->get();
    }

    public function updateAllSectionsPositions($request) {

        foreach($request['sections'] as $index => $section) {
            $currentSection = CourseSection::findOrFail( $section["id"] );
            if ( $currentSection["position"] != $index ) {
                $currentSection["position"] = $index;
                $currentSection->save();
            }
        }
    }

    private function saveCourseCategory($course, $value) {

        $categoryArray = [$value];
        $category = Category::where('id', '=', $value)->pluck('parent_id');

        if($category[0]) {
            array_push($categoryArray,$category[0]);
        }

        $course->categories()->sync($categoryArray);
    }

    private function updateCourseLinks($course, $name, $slug) {

        $courseLinks = Link::where('course_id', $course->id)->get();

        if (count($courseLinks) > 0) {
            foreach($courseLinks as $link) {
                $courseUrl = explode('course-page', $link->url);
                $affId = explode('=', $courseUrl[1]);
                $newUrl = $courseUrl[0] . "course-page/" . $slug . '?a=' . $affId[1];

                $link->update([
                    'name'  => $name,
                    'url'   => $newUrl
                ]);
            }
        }
    }
}
