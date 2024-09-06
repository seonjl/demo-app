/* tslint:disable */
/* eslint-disable */
/**
 * API Documentation
 * No description provided (generated by Openapi Generator https://github.com/openapitools/openapi-generator)
 *
 * The version of the OpenAPI document: 1.0.0
 * 
 *
 * NOTE: This class is auto generated by OpenAPI Generator (https://openapi-generator.tech).
 * https://openapi-generator.tech
 * Do not edit the class manually.
 */

import { mapValues } from '../runtime';
/**
 * 
 * @export
 * @interface UploadFile200Response
 */
export interface UploadFile200Response {
    /**
     * 
     * @type {string}
     * @memberof UploadFile200Response
     */
    url: string;
}

/**
 * Check if a given object implements the UploadFile200Response interface.
 */
export function instanceOfUploadFile200Response(value: object): value is UploadFile200Response {
    if (!('url' in value) || value['url'] === undefined) return false;
    return true;
}

export function UploadFile200ResponseFromJSON(json: any): UploadFile200Response {
    return UploadFile200ResponseFromJSONTyped(json, false);
}

export function UploadFile200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): UploadFile200Response {
    if (json == null) {
        return json;
    }
    return {
        
        'url': json['url'],
    };
}

export function UploadFile200ResponseToJSON(value?: UploadFile200Response | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'url': value['url'],
    };
}

