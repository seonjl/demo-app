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
 * @interface OperationVwwgyu8hyxp200Response
 */
export interface OperationVwwgyu8hyxp200Response {
    /**
     * 
     * @type {string}
     * @memberof OperationVwwgyu8hyxp200Response
     */
    url?: string;
}

/**
 * Check if a given object implements the OperationVwwgyu8hyxp200Response interface.
 */
export function instanceOfOperationVwwgyu8hyxp200Response(value: object): value is OperationVwwgyu8hyxp200Response {
    return true;
}

export function OperationVwwgyu8hyxp200ResponseFromJSON(json: any): OperationVwwgyu8hyxp200Response {
    return OperationVwwgyu8hyxp200ResponseFromJSONTyped(json, false);
}

export function OperationVwwgyu8hyxp200ResponseFromJSONTyped(json: any, ignoreDiscriminator: boolean): OperationVwwgyu8hyxp200Response {
    if (json == null) {
        return json;
    }
    return {
        
        'url': json['url'] == null ? undefined : json['url'],
    };
}

export function OperationVwwgyu8hyxp200ResponseToJSON(value?: OperationVwwgyu8hyxp200Response | null): any {
    if (value == null) {
        return value;
    }
    return {
        
        'url': value['url'],
    };
}

