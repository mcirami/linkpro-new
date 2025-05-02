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
            'name'              => 'max:255',
            'url'               => 'string',
            'email'             => 'email',
            'phone'             => 'string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|max:20',
            'mailchimp_list_id' => 'integer',
            'shopify_products'  => 'json',
            'description'       => 'string',
            'icon'              => 'string',
            'bg_image'          => 'string'
        ];
    }
}
