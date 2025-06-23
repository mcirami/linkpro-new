<?php

namespace App\Http\Requests;

use Illuminate\Foundation\Http\FormRequest;

class LinkRequest extends FormRequest
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
        $isUpdate = $this->isMethod('put') || $this->isMethod('patch');

        return [
            'name'              => 'sometimes|nullable|max:255',
            'page_id'           => $isUpdate ? 'sometimes|integer' : 'required|integer',
            'url'               => 'sometimes|nullable|string',
            'email'             => 'sometimes|nullable|email',
            'phone'             => 'sometimes|nullable|string|regex:/^([0-9\s\-\+\(\)]*)$/|min:10|max:20',
            'mailchimp_list_id' => 'sometimes|nullable|string',
            'shopify_products'  => 'sometimes|nullable|json',
            'description'       => 'sometimes|nullable|string',
            'icon'              => 'sometimes|nullable|string',
            'bg_image'          => 'sometimes|nullable|string'
        ];
    }
}
