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
 * @interface OperationZfn9mp4cefl200Response
 */
export interface OperationZfn9mp4cefl200Response {
    /**
     * 
     * @type {string}
     * @memberof OperationZfn9mp4cefl200Response
     */
    url?: string;
}

/**
 * Check if a given object implements the OperationZfn9mp4cefl200Response interface.
 */
export function instanceOfOperationZfn9mp4cefl200Response(value: object): value is OperationZfn9mp4cefl200Response {
    return true;
}

export function OperationZfn9mp4cefl200ResponseFromJSON(json: any): OperationZfn9mp4cefl200Response {
    return OperationZfn9mp4cefl200ResponseFromJSONTyped(json, false);
}

export function OperationZfn9mp4cefl200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): OperationZfn9mp4cefl200Response {
    if (json == null) {
        return json;
    }
    return {
        
        'url': json['url'] == null ? undefined : json['url'],
    };
}

export function OperationZfn9mp4cefl200ResponseToJSON(value?: OperationZfn9mp4cefl200Response | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'url': value['url'],
    };
}

