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
 * @interface OperationMn2us6r0s1f200Response
 */
export interface OperationMn2us6r0s1f200Response {
    /**
     * 
     * @type {string}
     * @memberof OperationMn2us6r0s1f200Response
     */
    url?: string;
}

/**
 * Check if a given object implements the OperationMn2us6r0s1f200Response interface.
 */
export function instanceOfOperationMn2us6r0s1f200Response(value: object): value is OperationMn2us6r0s1f200Response {
    return true;
}

export function OperationMn2us6r0s1f200ResponseFromJSON(json: any): OperationMn2us6r0s1f200Response {
    return OperationMn2us6r0s1f200ResponseFromJSONTyped(json, false);
}

export function OperationMn2us6r0s1f200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): OperationMn2us6r0s1f200Response {
    if (json == null) {
        return json;
    }
    return {
        
        'url': json['url'] == null ? undefined : json['url'],
    };
}

export function OperationMn2us6r0s1f200ResponseToJSON(value?: OperationMn2us6r0s1f200Response | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'url': value['url'],
    };
}

