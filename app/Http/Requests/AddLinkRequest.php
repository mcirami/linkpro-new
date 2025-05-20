<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class AddLinkRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize()
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array
     */
    public function rules()
    {
        return [
            'name'              => 'sometimes|nullable|max:255',
            'page_id'           => 'required|integer',
            'url'               => 'nullable|string',
            'email'             => 'nullable|email',
            'phone'             => 'nullable|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|max:20',
            'mailchimp_list_id' => 'sometimes|nullable|integer',
            'shopify_products'  => 'sometimes|nullable|json',
            'description'       => 'sometimes|nullable|string',
            'icon'              => 'sometimes|nullable|string',
            'bg_image'          => 'sometimes|nullable|string'
        ];
    }
}
